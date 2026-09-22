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
          {paper.authors.map((author, index) => {
            const isLabLeader = author.includes('Vu') || author.includes('Minh') || author.includes('Hoang') || author.includes('Luat') || author.includes('Quy') || author.includes('Khanh');
            return (
              <span key={index} className="inline-flex items-center">
                <span className={isLabLeader ? 'font-semibold text-slate-900' : 'text-slate-600'}>
                  {author}
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
