import React from 'react';
import { Icon } from '../components/Icon';
import { SocialPost } from '../types';
import { getSocialPosts } from '../repositories';

export const LabLifePage: React.FC = () => {
  const posts = getSocialPosts();

  return (
    <div className="section-shell py-10 sm:py-14 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/80 bg-sky-50 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-sky-800 mb-4">
          <Icon name="photo_camera" className="h-3.5 w-3.5 text-sky-600" />
          <span>Lab Culture &amp; Fanpage Activity</span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-slate-950">
          Lab Life &amp; Community
        </h1>
        <p className="mt-4 font-editorial text-lg text-slate-600 leading-relaxed max-w-3xl">
          Follow our daily research life, international seminar celebrations, lab gathering moments,
          and public outreach directly synchronized from our Facebook Fanpage (@slscm.lab).
        </p>
      </div>

      {/* Fanpage Action Banner */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 via-cyan-50 to-white p-6 shadow-xs">
        <div>
          <h3 className="font-editorial text-lg font-bold text-slate-900">
            Join the Discussion on Facebook
          </h3>
          <p className="font-editorial text-xs text-slate-600 mt-1">
            Follow official announcements, workshop registrations, and student recruitment calls.
          </p>
        </div>
        <a
          href="https://www.facebook.com/slscm.lab"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 font-editorial text-xs font-bold text-white shadow-sm hover:bg-sky-950 transition"
        >
          <span>Visit @slscm.lab</span>
          <Icon name="open_in_new" className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Posts Feed */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {posts.map((post, idx) => (
          <article
            key={idx}
            className="soft-card p-6 bg-white/95 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-lg bg-sky-100 text-sky-900 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase">
                  {post.type.replace('_', ' ')}
                </span>
                <span className="font-mono text-xs text-slate-400">SLSCM Social Feed</span>
              </div>

              <h3 className="font-editorial text-xl font-bold text-slate-950 leading-snug">
                {post.title}
              </h3>

              {post.paper_title && (
                <p className="mt-2 font-editorial text-xs font-semibold italic text-sky-800">
                  Paper: {post.paper_title}
                </p>
              )}

              {post.abstract && (
                <p className="mt-3 font-editorial text-xs sm:text-sm leading-relaxed text-slate-700">
                  {post.abstract}
                </p>
              )}

              {post.authors && (
                <div className="mt-3 text-xs text-slate-500 font-editorial">
                  <span className="font-semibold text-slate-700">Authors: </span>
                  {post.authors.join(', ')}
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              {post.journal && (
                <span className="font-editorial text-xs font-semibold text-slate-500">
                  {post.journal}
                </span>
              )}

              {post.link && (
                <a
                  href={post.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-sky-700 hover:text-sky-900 ml-auto"
                >
                  <span>{post.action_label || 'View Post'}</span>
                  <Icon name="open_in_new" className="h-3 w-3" />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
