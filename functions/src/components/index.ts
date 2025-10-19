// Export all components for easy importing
export { Cover, type CoverProps } from './cover.js';
export { Header, type HeaderProps } from './header.js';
export { RunningHeader, type RunningHeaderProps } from './runningHeader.js';
export { Footer } from './footer.js';
export {
  SummaryCards,
  SummaryCard,
  type SummaryCardsProps,
  type SummaryCardProps,
} from './summaryCards.js';
export { DonutChart, type DonutChartProps } from './donutChart.js';
export { BarChart, type BarChartProps } from './barChart.js';
export {
  DomainList,
  type DomainListProps,
  type DomainData,
} from './dataTable.js';
export { getBaseStyles } from './styles.js';
export { PageSection, type PageSectionProps } from './pageSection.js';
export {
  TopRecommendations,
  type TopRecommendationsProps,
  type Recommendation,
} from './topRecommendations.js';
export {
  AllRecommendations,
  type AllRecommendationsProps,
  type RecommendationItem,
} from './allRecommendations.js';
export {
  generateHeaderSingleDomain,
  type HeaderSingleDomainData,
} from './headerSingleDomain.js';
export { generatePieChart, type PieChartData } from './pieChart.js';
export {
  generateTopCitedContentTable,
  type TopCitedContentTableData,
  type TopCitedContentRow,
} from './topCitedContentTable.js';
export {
  generateTopSourcesMentioningCompetitors,
  type TopSourcesMentioningCompetitorsData,
  type CompetitorSource,
} from './topSourcesMentioningCompetitors.js';
export {
  generateRecommendedActions,
  type RecommendedActionsData,
  type RecommendedAction,
} from './recommendedActions.js';
