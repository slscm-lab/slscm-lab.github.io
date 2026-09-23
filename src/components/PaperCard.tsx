import React, { useState } from 'react';
import { ExternalLink, Copy, Check, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { RelatedPublication, Publication } from '../types';

interface PaperCardProps {
  paper: RelatedPublication | Publication;
  showBadge?: boolean;
}

export const PaperCard: React.FC<PaperCardProps> = ({ paper, showBadge = true }) => {
  const [copied, setCopied] = useState(false);
  const [showAbstract, setShowAbstract] = useState(false);

  const handleCopyBibtex = () => {
    if (!paper.bibtex) return;
    navigator.clipboard.writeText(paper.bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPillarBadge = (pillar?: string) => {
    switch (pillar) {
      case 'operational_optimization':
        return { label: 'Operational OR', color: 'border-sky-200 bg-sky-50 text-sky-800' };
      case 'ml_optimization':
        return { label: 'AI & Data Science', color: 'border-emerald-200 bg-emerald-50 text-emerald-800' };
      case 'green_transportation':
        return { label: 'Green Logistics & Drones', color: 'border-amber-200 bg-amber-50 text-amber-900' };
      default:
        return { label: 'Peer-Reviewed', color: 'border-slate-200 bg-slate-50 text-slate-700' };
    }
  };

  const badgeInfo = 'research_pillar' in paper ? getPillarBadge(paper.research_pillar) : null;

  // Helper to normalize names (strip accents, hyphens, and excess whitespace)
  const normalizeName = (str: string): string =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[-_.]/g, ' ')
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .trim();

  // Helper to control whether an author name is bold
  const formatAuthor = (rawAuthor: string) => {
    const trimmed = rawAuthor.trim();

    // 1. Explicit Markdown syntax in JSON: *Name* or **Name** -> ALWAYS bold
    if (/^\*+.+\*+$/.test(trimmed)) {
      return {
        name: trimmed.replace(/^\*+|\*+$/g, '').trim(),
        isBold: true,
      };
    }

    // 2. Explicit non-bold marker: ~Name -> NEVER bold
    if (trimmed.startsWith('~')) {
      return {
        name: trimmed.slice(1).trim(),
        isBold: false,
      };
    }

    // 3. Per-paper highlighted_authors array in JSON
    if (paper.highlighted_authors && Array.isArray(paper.highlighted_authors)) {
      const isExplicit = paper.highlighted_authors.some((h) =>
        trimmed.toLowerCase().includes(h.toLowerCase())
      );
      if (isExplicit) {
        return { name: trimmed, isBold: true };
      }
    }

    // 4. Default Lab Member Roster Matching
    const labRoster = [
      // Leadership & Faculty
      'Vu Duc Minh', 'Duc Minh Vu', 'Duc-Minh Vu', 'Vũ Đức Minh', 'Đức Minh Vũ',
      'Ha Minh Hoang', 'Minh Hoang Ha', 'Minh-Hoang Ha', 'Minh Hoàng Hà', 'Hà Minh Hoàng',
      'Ta Dinh Quy', 'Dinh Quy Ta', 'Quy Ta Dinh', 'Dinh-Quy Ta', 'Tạ Đình Quý', 'Quý Tạ Đình',
      'Dinh Nho Minh', 'Nho Minh Dinh', 'Đinh Nho Minh',
      'Pham Tuan Anh', 'Tuan Anh Pham', 'Phạm Tuấn Anh',

      // Researchers, Students & Alumni
      'Le Ba Luat', 'Ba Luat Le', 'Lê Bá Luật',
      'Le Huu Trung', 'Trung Le Huu', 'Lê Hữu Trung',
      'Tran Nam Khanh', 'Nam-Khanh Tran', 'Tran Ngoc Khanh', 'Trần Nam Khánh',
      'Tat Dat Tran', 'Tran Tat Dat', 'Tat Dat Nguyen', 'Nguyen Tat Dat', 'Trần Tất Đạt', 'Nguyễn Tất Đạt',
      'Hai Thu Nguyen', 'Nguyen Hai Thu', 'Nguyễn Hải Thư',
      'Dang Trung Cuong', 'Trung Cuong Dang', 'Đặng Trung Cường',
      'Thu Ha Ha', 'Ha Thu Ha', 'Hà Thu Hà',
      'Mai Thanh Loc', 'Thanh Loc Mai', 'Mai Thành Lộc',
      'Hoa Thi Thu Trang', 'Thu Trang Hoa Thi', 'Hoa Thị Thu Trang',
      'La Quang Chien', 'Quang Chien La', 'Lã Quang Chiến',
    ];

    const normAuthor = normalizeName(trimmed);
    const isMember = labRoster.some((m) => {
      const normMember = normalizeName(m);
      return (
        normAuthor === normMember ||
        normAuthor.startsWith(normMember + ' ') ||
        normAuthor.endsWith(' ' + normMember) ||
        ` ${normAuthor} `.includes(` ${normMember} `)
      );
    });

    return { name: trimmed, isBold: isMember };
  };

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-xs backdrop-blur-sm transition duration-200 hover:border-sky-300 hover:shadow-soft flex flex-col justify-between">
      <div>
        {/* Meta badges row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-slate-900 px-2.5 py-0.5 font-mono text-[11px] font-bold text-white shadow-xs">
              {paper.year}
            </span>
            {('badge' in paper && paper.badge) ? (
              <span className="rounded-lg border border-sky-200 bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-800">
                {paper.badge}
              </span>
            ) : (
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-700">
                {paper.type}
              </span>
            )}
            {badgeInfo && (
              <span className={`rounded-lg border px-2 py-0.5 font-mono text-[10px] font-semibold ${badgeInfo.color}`}>
                {badgeInfo.label}
              </span>
            )}
          </div>

          {paper.doi && (
            <span className="font-mono text-[11px] text-slate-400">
              DOI: {paper.doi}
            </span>
          )}
        </div>

        {/* Paper Title */}
        <h4 className="font-editorial text-base font-bold leading-snug text-slate-950 hover:text-sky-800 transition-colors">
          {paper.link ? (
            <a href={paper.link} target="_blank" rel="noreferrer" className="inline-flex items-baseline gap-1">
              <span>{paper.title}</span>
              <ExternalLink className="inline h-3.5 w-3.5 shrink-0 text-sky-600 self-center" />
            </a>
          ) : (
            paper.title
          )}
        </h4>

        {/* Venue */}
        <p className="mt-1.5 font-editorial text-xs font-semibold italic text-sky-800">
          {paper.venue}
        </p>

        {/* Authors */}
        <div className="mt-2.5 flex flex-wrap gap-1 text-xs text-slate-600">
          {paper.authors.map((rawAuthor, index) => {
            const { name, isBold } = formatAuthor(rawAuthor);
            return (
              <span key={index} className="inline-flex items-center">
                <span className={isBold ? 'font-bold text-slate-950' : 'text-slate-600'}>
                  {name}
                </span>
                {index < paper.authors.length - 1 && <span className="mr-1 text-slate-400">,</span>}
              </span>
            );
          })}
        </div>
      </div>

      {/* Accordion / Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {paper.abstract && (
            <button
              type="button"
              onClick={() => setShowAbstract(!showAbstract)}
              className="inline-flex items-center gap-1 font-editorial text-xs font-semibold text-slate-600 hover:text-sky-700 transition"
            >
              <FileText className="h-3.5 w-3.5 text-sky-600" />
              <span>{showAbstract ? 'Hide Abstract' : 'Read Abstract'}</span>
              {showAbstract ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {paper.bibtex && (
            <button
              type="button"
              onClick={handleCopyBibtex}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-mono text-[11px] font-medium transition ${
                copied
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 text-slate-500" />
                  <span>BibTeX</span>
                </>
              )}
            </button>
          )}

          {paper.link && (
            <a
              href={paper.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-sky-700 hover:bg-sky-100 transition"
            >
              <span>Paper</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>

      {/* Abstract drop-down */}
      {showAbstract && paper.abstract && (
        <div className="mt-3 rounded-xl bg-slate-50 p-3.5 font-editorial text-xs leading-relaxed text-slate-700 border border-slate-200/60 animate-in fade-in duration-200">
          <p className="font-mono text-[10px] uppercase font-bold text-slate-400 mb-1">Abstract</p>
          <p>{paper.abstract}</p>
        </div>
      )}
    </article>
  );
};
