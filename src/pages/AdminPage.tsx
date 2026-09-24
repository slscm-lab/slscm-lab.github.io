import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Icon } from '../components/Icon';
import { fetchDoiMetadata, DoiMetadata } from '../services/doiService';
import { useDataContext } from '../context/DataContext';
import researchKeywords from '../data/research_keywords.json';

type AdminTab = 'publications' | 'events' | 'people' | 'status';

export const AdminPage: React.FC = () => {
  const { publications, events, people, refreshAll, isLive } = useDataContext();

  // Auth State
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('publications');

  // Publication Form State
  const [doiInput, setDoiInput] = useState('');
  const [fetchingDoi, setFetchingDoi] = useState(false);
  const [doiError, setDoiError] = useState<string | null>(null);
  const [savingPub, setSavingPub] = useState(false);
  const [pubSuccess, setPubSuccess] = useState<string | null>(null);

  const [pubForm, setPubForm] = useState<Partial<DoiMetadata>>({
    id: '',
    title: '',
    authors: [],
    venue: '',
    year: new Date().getFullYear(),
    type: 'Journal',
    doi: '',
    link: '',
    abstract: '',
    bibtex: '',
    keywords: [],
    primary_pillar_id: 'supply_chain_optimization',
  });
  const [authorsInput, setAuthorsInput] = useState('');

  // Event Form State
  const [eventSaving, setEventSaving] = useState(false);
  const [eventSuccess, setEventSuccess] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState({
    id: '',
    title: '',
    title_vi: '',
    event_date: new Date().toISOString().split('T')[0],
    category: 'Scientific Breakthrough',
    badge: 'Q1 Journal',
    summary: '',
    summary_vi: '',
    content_en: '',
    content_vi: '',
    link: '',
    link_label: 'View Announcement',
    tagsInput: 'Operations Research, Optimization',
    featured: false,
  });

  // Check auth on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(error.message);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Automated DOI Fetch
  const handleFetchDoi = async () => {
    if (!doiInput.trim()) return;
    setFetchingDoi(true);
    setDoiError(null);
    setPubSuccess(null);

    try {
      const meta = await fetchDoiMetadata(doiInput);
      setPubForm(meta);
      setAuthorsInput(meta.authors.join(', '));
      setPubSuccess(`Successfully extracted: "${meta.title.slice(0, 50)}..."`);
    } catch (err: any) {
      setDoiError(err.message || 'Failed to fetch DOI metadata.');
    } finally {
      setFetchingDoi(false);
    }
  };

  // Save Publication to Supabase
  const handleSavePublication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubForm.title || !pubForm.id) return;
    setSavingPub(true);
    setPubSuccess(null);

    try {
      const authorsList = authorsInput
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);

      // 1. Insert into publications table
      const { error: pubErr } = await supabase.from('publications').upsert({
        id: pubForm.id,
        title: pubForm.title,
        year: Number(pubForm.year),
        venue: pubForm.venue,
        type: pubForm.type || 'Journal',
        doi: pubForm.doi || null,
        link: pubForm.link || null,
        abstract: pubForm.abstract || null,
        abstract_source: pubForm.abstract_source || null,
        bibtex: pubForm.bibtex || null,
        research_pillar: pubForm.research_pillar || 'operational_optimization',
        primary_pillar_id: pubForm.primary_pillar_id || 'supply_chain_optimization',
        keywords: pubForm.keywords || [],
        is_featured: false,
        status: 'published',
      });

      if (pubErr) throw pubErr;

      // 2. Insert into publication_authors
      if (authorsList.length > 0) {
        await supabase.from('publication_authors').delete().eq('publication_id', pubForm.id);
        const authorRows = authorsList.map((author_name, idx) => ({
          publication_id: pubForm.id!,
          author_name,
          author_order: idx,
          is_highlighted: false,
        }));
        const { error: authErr } = await supabase.from('publication_authors').insert(authorRows);
        if (authErr) console.warn('Authors insert error:', authErr);
      }

      setPubSuccess(`Publication "${pubForm.title}" saved successfully to database!`);
      await refreshAll();

      // Reset form
      setDoiInput('');
      setAuthorsInput('');
      setPubForm({
        id: '',
        title: '',
        authors: [],
        venue: '',
        year: new Date().getFullYear(),
        type: 'Journal',
        doi: '',
        link: '',
        abstract: '',
        bibtex: '',
        keywords: [],
        primary_pillar_id: 'supply_chain_optimization',
      });
    } catch (err: any) {
      setDoiError(err.message || 'Failed to save publication.');
    } finally {
      setSavingPub(false);
    }
  };

  // Delete Publication
  const handleDeletePublication = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const { error } = await supabase.from('publications').delete().eq('id', id);
      if (error) throw error;
      await refreshAll();
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  // Save Event to Supabase
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.id) return;
    setEventSaving(true);
    setEventSuccess(null);

    try {
      const tagsList = eventForm.tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      // 1. Insert into events
      const { error: evErr } = await supabase.from('events').upsert({
        id: eventForm.id,
        title: eventForm.title,
        title_vi: eventForm.title_vi || null,
        event_date: eventForm.event_date,
        category: eventForm.category,
        badge: eventForm.badge || null,
        summary: eventForm.summary,
        summary_vi: eventForm.summary_vi || null,
        content_en: eventForm.content_en || null,
        content_vi: eventForm.content_vi || null,
        link: eventForm.link || null,
        link_label: eventForm.link_label || null,
        featured: eventForm.featured,
      });

      if (evErr) throw evErr;

      // 2. Insert into event_tags
      if (tagsList.length > 0) {
        await supabase.from('event_tags').delete().eq('event_id', eventForm.id);
        const tagRows = tagsList.map((tag) => ({
          event_id: eventForm.id,
          tag,
        }));
        await supabase.from('event_tags').insert(tagRows);
      }

      setEventSuccess(`Event brief "${eventForm.title}" saved successfully!`);
      await refreshAll();

      // Reset
      setEventForm({
        id: '',
        title: '',
        title_vi: '',
        event_date: new Date().toISOString().split('T')[0],
        category: 'Scientific Breakthrough',
        badge: 'Q1 Journal',
        summary: '',
        summary_vi: '',
        content_en: '',
        content_vi: '',
        link: '',
        link_label: 'View Announcement',
        tagsInput: 'Operations Research, Optimization',
        featured: false,
      });
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setEventSaving(false);
    }
  };

  // Delete Event
  const handleDeleteEvent = async (id: string, title: string) => {
    if (!window.confirm(`Delete brief "${title}"?`)) return;
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      await refreshAll();
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  if (authLoading) {
    return (
      <div className="section-shell py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />
        <p className="mt-3 font-mono text-xs text-slate-500">Checking credentials...</p>
      </div>
    );
  }

  // Not Logged In View
  if (!session) {
    return (
      <div className="section-shell py-16 sm:py-24 animate-in fade-in duration-300">
        <div className="mx-auto max-w-md rounded-3xl border border-slate-200/90 bg-white/95 p-8 shadow-lift backdrop-blur-md">
          <div className="text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-cyan-300 shadow-md">
              <Icon name="lock" className="h-6 w-6" />
            </div>
            <h1 className="mt-4 font-editorial text-2xl font-bold text-slate-950">
              SLSCM Lab Admin Portal
            </h1>
            <p className="mt-1 font-editorial text-xs text-slate-500">
              Authenticate via Supabase to manage publications, news briefs, and lab data.
            </p>
          </div>

          {authError && (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-3 font-editorial text-xs text-rose-800">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block font-mono text-[11px] font-bold text-slate-700 uppercase">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="minhvd@neu.edu.vn"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-editorial text-sm text-slate-900 placeholder:text-slate-400 focus-ring"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-bold text-slate-700 uppercase">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-editorial text-sm text-slate-900 placeholder:text-slate-400 focus-ring"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-slate-900 py-3 font-editorial text-sm font-bold text-white shadow-lift hover:bg-sky-950 transition"
            >
              Sign In to Management Console
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center font-editorial text-[11px] text-slate-500">
            Protected by PostgreSQL Row Level Security (RLS).
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="section-shell py-10 sm:py-14 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>{isLive ? 'Supabase Connected' : 'Offline Mode'}</span>
            </span>
            <span className="font-mono text-xs text-slate-500">
              Logged in as <strong className="text-slate-800">{session.user?.email}</strong>
            </span>
          </div>
          <h1 className="mt-2 font-editorial text-3xl font-bold tracking-tight text-slate-950">
            Lab Management &amp; Ingestion Console
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-editorial text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <Icon name="logout" className="h-4 w-4 text-slate-500" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('publications')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 font-editorial text-xs font-semibold transition ${
            activeTab === 'publications'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Icon name="menu_book" className="h-4 w-4" />
          <span>Publications ({publications.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 font-editorial text-xs font-semibold transition ${
            activeTab === 'events'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Icon name="newspaper" className="h-4 w-4" />
          <span>Events &amp; Briefs ({events.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('people')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 font-editorial text-xs font-semibold transition ${
            activeTab === 'people'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Icon name="groups" className="h-4 w-4" />
          <span>Members Roster</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('status')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 font-editorial text-xs font-semibold transition ${
            activeTab === 'status'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Icon name="database" className="h-4 w-4" />
          <span>Database Telemetry</span>
        </button>
      </div>

      {/* TAB 1: Publications & DOI Autofill */}
      {activeTab === 'publications' && (
        <div className="mt-8 space-y-10">
          {/* Automated DOI Harvesting Section */}
          <div className="rounded-3xl border border-sky-200/90 bg-gradient-to-br from-sky-50/50 via-white to-sky-50/30 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-sky-800 uppercase tracking-wider mb-2">
              <Icon name="bolt" className="h-4 w-4 text-sky-600" />
              <span>Automated DOI Metadata Ingestion (Crossref &amp; OpenAlex)</span>
            </div>
            <h2 className="font-editorial text-2xl font-bold text-slate-950">
              Harvest Academic Paper by DOI
            </h2>
            <p className="mt-1 font-editorial text-xs text-slate-600">
              Paste any publication DOI (e.g., <code className="font-mono text-sky-700">10.1287/ijoc.2025.1150</code>). The system automatically fetches author-written abstracts, venues, authors, and BibTeX citations adhering to our authentic harvesting protocol.
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={doiInput}
                  onChange={(e) => setDoiInput(e.target.value)}
                  placeholder="Paste DOI (e.g., 10.1016/j.trc.2026.105906 or https://doi.org/...)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-mono text-xs text-slate-900 placeholder:text-slate-400 focus-ring shadow-2xs"
                />
              </div>
              <button
                type="button"
                onClick={handleFetchDoi}
                disabled={fetchingDoi || !doiInput.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 py-2.5 font-editorial text-xs font-bold text-white shadow-xs hover:bg-sky-800 disabled:opacity-50 transition"
              >
                {fetchingDoi ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Harvesting DOI...</span>
                  </>
                ) : (
                  <>
                    <Icon name="download" className="h-4 w-4" />
                    <span>Auto-Harvest Paper</span>
                  </>
                )}
              </button>
            </div>

            {doiError && (
              <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 font-editorial text-xs text-rose-800">
                {doiError}
              </div>
            )}

            {pubSuccess && (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 font-editorial text-xs text-emerald-800">
                {pubSuccess}
              </div>
            )}

            {/* Publication Review Form */}
            {pubForm.title && (
              <form onSubmit={handleSavePublication} className="mt-6 border-t border-slate-200 pt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase">
                      Paper Title
                    </label>
                    <input
                      type="text"
                      required
                      value={pubForm.title}
                      onChange={(e) => setPubForm({ ...pubForm, title: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-editorial text-sm font-semibold text-slate-950 focus-ring"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase">
                      Authors (Comma-separated)
                    </label>
                    <input
                      type="text"
                      required
                      value={authorsInput}
                      onChange={(e) => setAuthorsInput(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-editorial text-xs text-slate-900 focus-ring"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase">
                      Venue / Journal Name
                    </label>
                    <input
                      type="text"
                      required
                      value={pubForm.venue}
                      onChange={(e) => setPubForm({ ...pubForm, venue: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-editorial text-xs text-slate-900 focus-ring"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase">
                      Year
                    </label>
                    <input
                      type="number"
                      required
                      value={pubForm.year}
                      onChange={(e) => setPubForm({ ...pubForm, year: Number(e.target.value) })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus-ring"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase">
                      Format / Type
                    </label>
                    <select
                      value={pubForm.type}
                      onChange={(e) => setPubForm({ ...pubForm, type: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-editorial text-xs text-slate-900 focus-ring"
                    >
                      <option value="Journal">Journal Article</option>
                      <option value="Conference">Conference Paper</option>
                      <option value="Book Chapter">Book Chapter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase">
                      Research Pillar
                    </label>
                    <select
                      value={pubForm.primary_pillar_id}
                      onChange={(e) => setPubForm({ ...pubForm, primary_pillar_id: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-editorial text-xs text-slate-900 focus-ring"
                    >
                      <option value="supply_chain_optimization">Supply Chain &amp; Logistics Optimization</option>
                      <option value="ai_supply_chain_intelligence">AI &amp; Data-Driven Supply Chain</option>
                      <option value="decision_analytics">Optimization &amp; Decision Analytics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase">
                      DOI URL
                    </label>
                    <input
                      type="text"
                      value={pubForm.link || ''}
                      onChange={(e) => setPubForm({ ...pubForm, link: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-700 focus-ring"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase">
                      Author-Written Abstract
                    </label>
                    <textarea
                      rows={4}
                      value={pubForm.abstract || ''}
                      onChange={(e) => setPubForm({ ...pubForm, abstract: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 font-editorial text-xs text-slate-800 leading-relaxed focus-ring"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase">
                      BibTeX Citation
                    </label>
                    <textarea
                      rows={4}
                      value={pubForm.bibtex || ''}
                      onChange={(e) => setPubForm({ ...pubForm, bibtex: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] text-slate-700 focus-ring"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingPub}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-2.5 font-editorial text-xs font-bold text-white shadow-lift hover:bg-sky-950 transition"
                >
                  <Icon name="check" className="h-4 w-4 text-emerald-400" />
                  <span>{savingPub ? 'Saving to Supabase...' : 'Save Publication to Database'}</span>
                </button>
              </form>
            )}
          </div>

          {/* List of Current Publications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-editorial text-xl font-bold text-slate-950">
                All Publications in Database ({publications.length})
              </h3>
            </div>

            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
              {publications.map((p) => (
                <div key={p.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50/60 transition">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500 mb-1">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-bold text-slate-700">{p.year}</span>
                      <span>•</span>
                      <span className="text-sky-700 font-semibold">{p.type}</span>
                      {p.doi && (
                        <>
                          <span>•</span>
                          <span className="truncate">DOI: {p.doi}</span>
                        </>
                      )}
                    </div>
                    <h4 className="font-editorial text-sm font-bold text-slate-950 leading-snug">
                      {p.title}
                    </h4>
                    <p className="mt-1 font-editorial text-xs text-slate-600 line-clamp-1">
                      {p.authors.join(', ')} — <em className="text-slate-500">{p.venue}</em>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDeletePublication(p.id, p.title)}
                      className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                      title="Delete publication"
                    >
                      <Icon name="delete" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Events & Briefs */}
      {activeTab === 'events' && (
        <div className="mt-8 space-y-10">
          <div className="rounded-3xl border border-emerald-200/90 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-editorial text-2xl font-bold text-slate-950">
              Create New Event or Research Brief
            </h2>
            <p className="mt-1 font-editorial text-xs text-slate-600">
              Broadcast seminars, paper acceptances, scholarships, and project launches.
            </p>

            {eventSuccess && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 font-editorial text-xs text-emerald-800">
                {eventSuccess}
              </div>
            )}

            <form onSubmit={handleSaveEvent} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase">
                    Unique ID (slug)
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.id}
                    onChange={(e) => setEventForm({ ...eventForm, id: e.target.value })}
                    placeholder="brief-workshop-2026"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus-ring"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase">
                    Event Date (YYYY-MM-DD)
                  </label>
                  <input
                    type="date"
                    required
                    value={eventForm.event_date}
                    onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus-ring"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase">
                    Title (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="Major Research Milestone: Accepted by INFORMS..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-editorial text-sm font-semibold text-slate-950 focus-ring"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase">
                    Category
                  </label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-editorial text-xs text-slate-900 focus-ring"
                  >
                    <option value="Workshops & Training">Workshops &amp; Training</option>
                    <option value="Scientific Breakthrough">Scientific Breakthrough</option>
                    <option value="Student Honor & Placement">Student Honor &amp; Placement</option>
                    <option value="Research Collaboration">Research Collaboration</option>
                    <option value="Knowledge Transfer">Knowledge Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase">
                    Badge Callout
                  </label>
                  <input
                    type="text"
                    value={eventForm.badge}
                    onChange={(e) => setEventForm({ ...eventForm, badge: e.target.value })}
                    placeholder="Q1 Journal / INFORMS / SMU Placement"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-editorial text-xs text-slate-900 focus-ring"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase">
                    Summary Text
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={eventForm.summary}
                    onChange={(e) => setEventForm({ ...eventForm, summary: e.target.value })}
                    placeholder="Concise 1-2 sentence overview for the cards..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 font-editorial text-xs text-slate-800 focus-ring"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase">
                    Full Content (Markdown format supported with headings &amp; bullets)
                  </label>
                  <textarea
                    rows={5}
                    value={eventForm.content_en}
                    onChange={(e) => setEventForm({ ...eventForm, content_en: e.target.value })}
                    placeholder="Full announcement body..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 font-editorial text-xs text-slate-800 focus-ring"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={eventForm.tagsInput}
                    onChange={(e) => setEventForm({ ...eventForm, tagsInput: e.target.value })}
                    placeholder="Operations Research, Drone, IJOC"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-editorial text-xs text-slate-900 focus-ring"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold text-slate-700 uppercase">
                    Link URL
                  </label>
                  <input
                    type="text"
                    value={eventForm.link}
                    onChange={(e) => setEventForm({ ...eventForm, link: e.target.value })}
                    placeholder="https://doi.org/... or https://facebook.com/..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-700 focus-ring"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={eventSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 font-editorial text-xs font-bold text-white shadow-lift hover:bg-emerald-800 transition"
              >
                <Icon name="add" className="h-4 w-4" />
                <span>{eventSaving ? 'Publishing Event...' : 'Publish Event Brief'}</span>
              </button>
            </form>
          </div>

          {/* List of Current Events */}
          <div>
            <h3 className="font-editorial text-xl font-bold text-slate-950 mb-4">
              Current Events &amp; News Briefs ({events.length})
            </h3>
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
              {events.map((ev) => (
                <div key={ev.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50/60 transition">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500 mb-1">
                      <span className="rounded bg-sky-100 px-1.5 py-0.5 font-bold text-sky-800">{ev.category}</span>
                      <span>•</span>
                      <span>{ev.date}</span>
                      {ev.badge && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-slate-700">{ev.badge}</span>
                        </>
                      )}
                    </div>
                    <h4 className="font-editorial text-sm font-bold text-slate-950 leading-snug">
                      {ev.title}
                    </h4>
                    <p className="mt-1 font-editorial text-xs text-slate-600 line-clamp-2">
                      {ev.summary}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(ev.id, ev.title)}
                    className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition shrink-0"
                    title="Delete brief"
                  >
                    <Icon name="delete" className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Members Roster */}
      {activeTab === 'people' && (
        <div className="mt-8 space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="font-editorial text-2xl font-bold text-slate-950">
              Lab Members &amp; Scholars Roster
            </h2>
            <p className="mt-1 font-editorial text-xs text-slate-600">
              Faculty ({people.leadership_and_faculty?.length || 0}), Tech Leads ({people.web_tech_lead?.length || 0}), Students ({people.graduate_and_undergraduate_student_researchers?.length || 0}), and Alumni ({people.alumni?.length || 0}).
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(people.leadership_and_faculty || []).map((m) => (
                <div key={m.id} className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    {m.avatar ? (
                      <img src={m.avatar} alt={m.name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-slate-200 grid place-items-center font-bold text-xs text-slate-700">
                        {m.name.slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-editorial text-sm font-bold text-slate-950">{m.name}</h4>
                      <p className="font-mono text-[10px] text-sky-700">{m.role_badge}</p>
                    </div>
                  </div>
                  <p className="mt-3 font-editorial text-xs text-slate-600 line-clamp-2">{m.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Database Telemetry */}
      {activeTab === 'status' && (
        <div className="mt-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs">
              <p className="font-mono text-3xl font-extrabold text-slate-950">{publications.length}</p>
              <p className="mt-1 font-editorial text-xs font-semibold text-slate-600">Total Publications</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs">
              <p className="font-mono text-3xl font-extrabold text-sky-700">{events.length}</p>
              <p className="mt-1 font-editorial text-xs font-semibold text-slate-600">Events &amp; Briefs</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs">
              <p className="font-mono text-3xl font-extrabold text-emerald-700">
                {(people.leadership_and_faculty?.length || 0) +
                  (people.graduate_and_undergraduate_student_researchers?.length || 0)}
              </p>
              <p className="mt-1 font-editorial text-xs font-semibold text-slate-600">Active Researchers</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs">
              <p className="font-mono text-3xl font-extrabold text-amber-700">
                {people.hall_of_fame?.length || 0}
              </p>
              <p className="mt-1 font-editorial text-xs font-semibold text-slate-600">Hall of Fame Placements</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 font-mono text-xs text-slate-600 space-y-2">
            <p><strong>Database Host:</strong> db.keqqvlbykciratrschme.supabase.co (AWS Seoul)</p>
            <p><strong>Engine:</strong> PostgreSQL 17.6</p>
            <p><strong>Security:</strong> Row Level Security (RLS) Active</p>
            <p><strong>Client API:</strong> PostgREST v12 + Supabase JS v2.117</p>
          </div>
        </div>
      )}
    </div>
  );
};
