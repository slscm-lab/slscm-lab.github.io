import { LabOverview, SiteMetrics } from '../types';
import overviewData from '../data/generated/overview.json';
import metricsData from '../data/generated/site_metrics.json';

const overview: LabOverview = overviewData as unknown as LabOverview;
const metrics: SiteMetrics = metricsData as unknown as SiteMetrics;

export function getLabOverview(): LabOverview {
  return overview;
}

export function getSiteMetrics(): SiteMetrics {
  return metrics;
}
