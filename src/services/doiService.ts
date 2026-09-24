import researchKeywords from '../data/research_keywords.json';

export interface DoiMetadata {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: string;
  doi: string;
  link: string;
  abstract: string | null;
  abstract_source: string | null;
  bibtex: string | null;
  keywords: string[];
  primary_pillar_id?: string;
  research_pillar?: string;
}

export function cleanDoi(raw: string): string {
  let doi = raw.trim();
  doi = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '');
  doi = doi.replace(/^doi:\s*/i, '');
  return doi.trim();
}

function cleanAbstract(raw: string): string {
  return raw
    .replace(/<jats:[^>]+>/gi, '')
    .replace(/<\/jats:[^>]+>/gi, '')
    .replace(/&lt;jats:[^&]+&gt;/gi, '')
    .replace(/&lt;\/jats:[^&]+&gt;/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function suggestKeywords(title: string, abstract: string): string[] {
  const text = `${title} ${abstract}`.toLowerCase();
  const matched: string[] = [];

  for (const kw of researchKeywords) {
    const labelLower = kw.label.toLowerCase();
    const idLower = kw.id.replace(/-/g, ' ');
    if (text.includes(labelLower) || text.includes(idLower)) {
      matched.push(kw.id);
    }
  }

  return Array.from(new Set(matched));
}

function generatePaperId(firstAuthor: string, year: number, title: string): string {
  const authorPart = firstAuthor
    .split(/\s+/)
    .pop()
    ?.toLowerCase()
    .replace(/[^a-z0-9]/g, '') || 'paper';
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => !['a', 'an', 'the', 'and', 'for', 'of', 'in', 'on', 'with', 'under'].includes(w))
    .slice(0, 3)
    .join('-');
  return `${authorPart}-${year}-${cleanTitle || 'research'}`;
}

export async function fetchDoiMetadata(rawInput: string): Promise<DoiMetadata> {
  const doi = cleanDoi(rawInput);
  if (!doi) {
    throw new Error('Please enter a valid DOI (e.g. 10.1287/ijoc.2025.1150)');
  }

  let title = '';
  let authors: string[] = [];
  let venue = '';
  let year = new Date().getFullYear();
  let type = 'Journal';
  let abstract: string | null = null;
  let abstract_source: string | null = null;
  let bibtex: string | null = null;

  // 1. Crossref API Query
  try {
    const crossrefRes = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
      headers: {
        'User-Agent': 'SLSCMBot/1.0 (mailto:minhvd@neu.edu.vn)',
      },
    });

    if (crossrefRes.ok) {
      const json = await crossrefRes.json();
      const msg = json.message;

      if (msg.title && msg.title.length > 0) {
        title = msg.title[0];
      }

      if (msg.author && Array.isArray(msg.author)) {
        authors = msg.author.map((a: { given?: string; family?: string; name?: string }) => {
          if (a.name) return a.name;
          return [a.given, a.family].filter(Boolean).join(' ');
        });
      }

      if (msg['container-title'] && msg['container-title'].length > 0) {
        venue = msg['container-title'][0];
      }

      const dateParts =
        msg['published-print']?.['date-parts']?.[0] ||
        msg['published-online']?.['date-parts']?.[0] ||
        msg.published?.['date-parts']?.[0] ||
        msg.created?.['date-parts']?.[0];
      if (dateParts && dateParts[0]) {
        year = Number(dateParts[0]);
      }

      if (msg.type === 'journal-article') type = 'Journal';
      else if (msg.type === 'proceedings-article') type = 'Conference';
      else if (msg.type === 'book-chapter') type = 'Book Chapter';

      if (msg.abstract) {
        abstract = cleanAbstract(msg.abstract);
        abstract_source = `https://doi.org/${doi}`;
      }
    }
  } catch (err) {
    console.warn('Crossref fetch error:', err);
  }

  // 2. OpenAlex API Query (Fallback / Enrichment)
  if (!abstract || !title || authors.length === 0) {
    try {
      const alexRes = await fetch(`https://api.openalex.org/works/https://doi.org/${encodeURIComponent(doi)}`);
      if (alexRes.ok) {
        const alexData = await alexRes.json();

        if (!title && alexData.title) {
          title = alexData.title;
        }

        if (authors.length === 0 && Array.isArray(alexData.authorships)) {
          authors = alexData.authorships.map(
            (auth: { author?: { display_name?: string } }) => auth.author?.display_name || ''
          ).filter(Boolean);
        }

        if (!venue && alexData.primary_location?.source?.display_name) {
          venue = alexData.primary_location.source.display_name;
        }

        if (!year && alexData.publication_year) {
          year = Number(alexData.publication_year);
        }

        if (!abstract && alexData.abstract_inverted_index) {
          const invIndex = alexData.abstract_inverted_index;
          const wordsWithPos: [number, string][] = [];
          for (const [word, positions] of Object.entries(invIndex)) {
            for (const pos of positions as number[]) {
              wordsWithPos.push([pos, word]);
            }
          }
          wordsWithPos.sort((a, b) => a[0] - b[0]);
          abstract = cleanAbstract(wordsWithPos.map((item) => item[1]).join(' '));
          abstract_source = `https://openalex.org/works/${alexData.id}`;
        }
      }
    } catch (err) {
      console.warn('OpenAlex fetch error:', err);
    }
  }

  // 3. Content Negotiation for BibTeX
  try {
    const bibtexRes = await fetch(`https://doi.org/${encodeURIComponent(doi)}`, {
      headers: {
        Accept: 'application/x-bibtex',
      },
    });
    if (bibtexRes.ok) {
      bibtex = (await bibtexRes.text()).trim();
    }
  } catch (err) {
    console.warn('BibTeX content negotiation error:', err);
  }

  // Fallback BibTeX if not returned directly
  if (!bibtex && title) {
    const id = generatePaperId(authors[0] || 'research', year, title);
    bibtex = `@article{${id},\n  title = {${title}},\n  author = {${authors.join(' and ')}},\n  journal = {${venue}},\n  year = {${year}},\n  doi = {${doi}}\n}`;
  }

  if (!title) {
    throw new Error(`Could not resolve metadata for DOI: ${doi}. Please verify the DOI.`);
  }

  const generatedId = generatePaperId(authors[0] || 'paper', year, title);
  const keywords = suggestKeywords(title, abstract || '');

  let primary_pillar_id = 'supply_chain_optimization';
  let research_pillar = 'operational_optimization';

  const textLower = `${title} ${abstract || ''}`.toLowerCase();
  if (textLower.includes('drone') || textLower.includes('vehicle') || textLower.includes('routing')) {
    primary_pillar_id = 'supply_chain_optimization';
    research_pillar = 'green_transportation';
  } else if (textLower.includes('machine learning') || textLower.includes('neural') || textLower.includes('ai')) {
    primary_pillar_id = 'ai_supply_chain_intelligence';
    research_pillar = 'ml_optimization';
  } else if (textLower.includes('energy') || textLower.includes('decision') || textLower.includes('water')) {
    primary_pillar_id = 'decision_analytics';
    research_pillar = 'operational_optimization';
  }

  return {
    id: generatedId,
    title,
    authors,
    venue: venue || 'Scientific Journal',
    year,
    type,
    doi,
    link: `https://doi.org/${doi}`,
    abstract,
    abstract_source: abstract_source || `https://doi.org/${doi}`,
    bibtex,
    keywords,
    primary_pillar_id,
    research_pillar,
  };
}
