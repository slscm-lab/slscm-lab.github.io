import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { PaperCard } from '../components/PaperCard';
import { ResearchAreaIcon } from '../components/ResearchAreaIcon';
import { useResearchPillars, useTopicPublications } from '../context/DataContext';
import { PageRoute, ResearchPillarId } from '../types';
import researchKeywords from '../data/research_keywords.json';

interface ResearchTopicsPageProps {
  onNavigate: (route: PageRoute) => void;
}

const areas: {
  id: ResearchPillarId;
  topics: string[];
}[] = [
  {
    id: 'supply_chain_optimization',
    topics: [
      'vehicle-routing', 'drone-logistics', 'electric-vehicles', 'arc-routing',
      'time-dependent-routing', 'school-transportation', 'facility-location',
      'scheduling', 'inventory-routing', 'orienteering', 'tourism-routing',
      'service-network-design', 'road-maintenance', 'pickup-and-delivery',
      'customer-choice', 'supply-chain-networks',
    ],
  },
  {
    id: 'ai_supply_chain_intelligence',
    topics: ['machine-learning', 'forecasting'],
  },
  {
    id: 'decision_analytics',
    topics: [
      'energy-systems', 'security-games', 'graph-optimization',
      'healthcare-analytics', 'packing', 'uav-path-planning', 'data-resources',
    ],
  },
];

const topicIntroductions: Record<string, string> = {
  'vehicle-routing': 'Planning efficient routes for vehicles serving customers, facilities, and communities under real operational constraints.',
  'drone-logistics': 'Coordinating drones with ground transport and infrastructure for flexible, energy-aware delivery.',
  'electric-vehicles': 'Designing routes and charging decisions for electric fleets with limited energy and service windows.',
  'arc-routing': 'Optimizing routes that must serve roads or network links, such as maintenance and collection tasks.',
  'time-dependent-routing': 'Planning travel when journey times and costs change throughout the day.',
  'school-transportation': 'Improving student transport plans while accounting for service quality and disruptions.',
  'facility-location': 'Choosing where to place facilities and services to improve access and operational performance.',
  'scheduling': 'Allocating jobs, machines, and resources when timing and conflict constraints matter.',
  'inventory-routing': 'Combining delivery routes with inventory replenishment decisions.',
  'orienteering': 'Selecting valuable stops and routes when time, distance, or resources are limited.',
  'tourism-routing': 'Designing visitor itineraries and tourism services with practical travel constraints.',
  'service-network-design': 'Designing transport and service networks with capacity and resource requirements.',
  'road-maintenance': 'Planning road network maintenance services under uncertain demand, travel, and service times.',
  'pickup-and-delivery': 'Coordinating collection and delivery requests across flexible vehicle routes.',
  'customer-choice': 'Modeling how customer preferences influence facility and service decisions.',
  'supply-chain-networks': 'Designing connected logistics systems and managing their resources.',
  'machine-learning': 'Applying and improving learning methods for prediction and decision-making.',
  'forecasting': 'Using data to anticipate changing demand, prices, and operational conditions.',
  'energy-systems': 'Studying energy use and demand response through analytics and operational decisions.',
  'security-games': 'Modeling strategic decisions when defenders face different adversarial behaviors.',
  'graph-optimization': 'Solving decision problems on large networks and graphs.',
  'healthcare-analytics': 'Applying data and optimization methods to healthcare decisions.',
  'packing': 'Finding effective arrangements for constrained packing problems.',
  'uav-path-planning': 'Planning safe and efficient paths for unmanned aerial vehicles.',
  'data-resources': 'Sharing datasets that help researchers test and compare methods.',
};

export const ResearchTopicsPage: React.FC<ResearchTopicsPageProps> = ({ onNavigate }) => {
  const publications = useTopicPublications();
  const pillars = useResearchPillars();
  const [selectedArea, setSelectedArea] = useState<ResearchPillarId>('supply_chain_optimization');
  const [selectedTopic, setSelectedTopic] = useState('vehicle-routing');

  const topicKeywords = researchKeywords.filter((keyword) => keyword.kind === 'topic');
  const papersForTopic = (topicId: string) => publications.filter((paper) => paper.keywords?.includes(topicId));
  const topicCount = (topicId: string) => papersForTopic(topicId).length;
  const activeTopics = topicKeywords.filter((keyword) => topicCount(keyword.id) > 0);
  const currentArea = areas.find((area) => area.id === selectedArea) ?? areas[0];
  const currentTopics = activeTopics
    .filter((keyword) => currentArea.topics.includes(keyword.id))
    .sort((a, b) => topicCount(b.id) - topicCount(a.id) || a.label.localeCompare(b.label));
  const currentTopic = currentTopics.find((keyword) => keyword.id === selectedTopic) ?? currentTopics[0];
  const relatedPapers = currentTopic ? papersForTopic(currentTopic.id) : [];

  const chooseArea = (areaId: ResearchPillarId) => {
    setSelectedArea(areaId);
    const area = areas.find((item) => item.id === areaId);
    const firstTopic = activeTopics
      .filter((keyword) => area?.topics.includes(keyword.id))
      .sort((a, b) => topicCount(b.id) - topicCount(a.id))[0];
    if (firstTopic) setSelectedTopic(firstTopic.id);
  };

  return (
    <div className="section-shell py-10 sm:py-14 animate-in fade-in duration-300">
      <div className="max-w-4xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-300/80 bg-sky-50 px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-sky-800">
          <Icon name="hub" className="h-3.5 w-3.5" />
          Explore our research
        </div>
        <h1 className="font-editorial text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          Research Topics
        </h1>
        <p className="mt-4 max-w-3xl font-editorial text-lg leading-relaxed text-slate-600">
          Explore the questions and methods shaping SLSCM Lab. Choose a research area, then a topic,
          to discover papers connected to it. A paper can appear under more than one topic.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 font-mono text-xs text-slate-600">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">3 research areas</span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">{activeTopics.length} topics with papers</span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">{publications.length} research papers</span>
        </div>
      </div>

      <section aria-labelledby="research-areas-title" className="mt-12">
        <div className="mb-5">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-sky-700">Our research agenda</p>
          <h2 id="research-areas-title" className="mt-1 font-editorial text-2xl font-bold text-slate-950 sm:text-3xl">
            Three connected research areas
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {areas.map((area) => {
            const pillar = pillars.find((item) => item.id === area.id);
            const areaTopics = activeTopics.filter((keyword) => area.topics.includes(keyword.id));
            const paperCount = publications.filter((paper) => paper.keywords?.some((keyword) => area.topics.includes(keyword))).length;
            const isSelected = selectedArea === area.id;
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => chooseArea(area.id)}
                aria-pressed={isSelected}
                className={`soft-card flex h-full flex-col p-6 text-left transition focus-ring ${
                  isSelected ? 'border-sky-400 bg-white shadow-lift ring-1 ring-sky-300' : 'bg-white/85 hover:border-sky-200 hover:bg-white'
                }`}
              >
                <span className="flex min-h-20 items-center gap-4">
                  <ResearchAreaIcon areaId={area.id} />
                  <span className="min-w-0 font-editorial text-lg font-bold leading-snug text-slate-950">{pillar?.title}</span>
                </span>
                <span className="mt-4 flex-1 font-editorial text-sm leading-relaxed text-slate-600">{pillar?.description}</span>
                <span className="mt-5 border-t border-slate-100 pt-4 font-mono text-[11px] font-semibold text-sky-700">
                  {areaTopics.length} topics · {paperCount} {paperCount === 1 ? 'paper' : 'papers'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="topics-title" className="mt-12">
        <div className="mb-5">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-sky-700">Find a focus</p>
          <h2 id="topics-title" className="mt-1 font-editorial text-2xl font-bold text-slate-950 sm:text-3xl">
            Topics in {pillars.find((pillar) => pillar.id === selectedArea)?.title}
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {currentTopics.map((topic) => {
            const isSelected = currentTopic?.id === topic.id;
            const count = topicCount(topic.id);
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => {
                  setSelectedTopic(topic.id);
                  document.getElementById('topic-papers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                aria-pressed={isSelected}
                className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-4 text-left transition focus-ring ${
                  isSelected
                    ? 'border-sky-400 bg-sky-50 text-sky-950 shadow-xs'
                    : 'border-slate-200 bg-white/85 text-slate-800 hover:border-sky-200 hover:bg-white'
                }`}
              >
                <span className="font-editorial text-sm font-semibold">{topic.label}</span>
                <span className="shrink-0 rounded-full bg-white px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-600">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {currentTopic && (
        <section id="topic-papers" aria-labelledby="topic-papers-title" className="mt-12 scroll-mt-28">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-sky-700">Selected topic</p>
              <h2 id="topic-papers-title" className="mt-1 font-editorial text-3xl font-bold text-slate-950">
                {currentTopic.label}
              </h2>
              <p className="mt-2 font-editorial text-base leading-relaxed text-slate-600">
                {topicIntroductions[currentTopic.id]}
              </p>
            </div>
            <span className="self-start rounded-full border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs font-semibold text-slate-600">
              {relatedPapers.length} {relatedPapers.length === 1 ? 'paper' : 'papers'}
            </span>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {relatedPapers.map((paper) => <PaperCard key={paper.id} paper={paper} />)}
          </div>
          <button
            type="button"
            onClick={() => onNavigate('publications')}
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 font-editorial text-sm font-bold text-sky-800 transition hover:bg-sky-100 focus-ring"
          >
            Browse the full publication archive
            <Icon name="arrow_forward" className="h-4 w-4" />
          </button>
        </section>
      )}
    </div>
  );
};
