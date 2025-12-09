/**
 * Single Domain Template
 * Displays influence report for a single domain with metrics, charts, and top cited content
 */

import { Cover, type CoverProps } from '../components/cover.js';
import {
  generateHeaderSingleDomain,
  type HeaderSingleDomainData,
} from '../components/headerSingleDomain.js';
import {
  SummaryCards,
  type SummaryCardProps,
} from '../components/summaryCards.js';
import { BarChart } from '../components/barChart.js';
import { generatePieChart, type PieChartData } from '../components/pieChart.js';
import {
  generateTopCitedContentTable,
  type TopCitedContentTableData,
} from '../components/topCitedContentTable.js';
import {
  generateTopSourcesMentioningCompetitors,
  type TopSourcesMentioningCompetitorsData,
} from '../components/topSourcesMentioningCompetitors.js';
import {
  AllRecommendations,
  type AllRecommendationsProps,
} from '../components/allRecommendations.js';
import {
  generateRecommendedActions,
  type RecommendedActionsData,
} from '../components/recommendedActions.js';
import { DomainList, type DomainListProps } from '../components/dataTable.js';
import { Footer } from '../components/footer.js';
import { getBaseStyles } from '../components/styles.js';

export interface SingleDomainReportData {
  // Cover data
  coverData: CoverProps;

  // Header data
  domainName: string;
  domainLogo: string;
  timePeriod: string;

  // Summary cards (4 boxes)
  summaryCards: SummaryCardProps[];

  // Bar chart data
  barChartData: {
    name: string;
    value: number;
    icon: string;
  }[];

  // Pie chart data
  pieChartData: PieChartData;

  // Top cited content table (must be before pie chart)
  topCitedContent: TopCitedContentTableData;

  // Top sources mentioning competitors (after pie chart)
  competitorSources: TopSourcesMentioningCompetitorsData;

  // Recommendations
  recommendations: AllRecommendationsProps;

  // Recommended actions
  recommendedActions: RecommendedActionsData;

  // Sources list
  sources: DomainListProps;
}

export function generateSingleDomainTemplate(
  data: SingleDomainReportData
): string {
  const headerData: HeaderSingleDomainData = {
    domainName: data.domainName,
    domainLogo: data.domainLogo,
    timePeriod: data.timePeriod,
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.domainName} - Influence Report</title>
  ${getBaseStyles()}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'DM Sans', sans-serif;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }
    
    .cover-page {
      page-break-after: always;
    }
    
    .header-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin-bottom: 24px;
    }
    
    .content-page {
      width: 100%;
      margin: 0 auto;
      padding: 24px;
      box-sizing: border-box;
    }
    
    .section {
      margin-bottom: 32px;
    }
    
    .charts-section {
      display: flex;
      flex-direction: column;
      gap: 32px;
      margin-top: 32px;
    }
  </style>
</head>
<body>
  <!-- Cover Page -->
  <div class="cover-page">
    ${Cover(data.coverData)}
  </div>
  
  <!-- Header for single domain -->
  <div class="header-container">
    ${generateHeaderSingleDomain(headerData)}
  </div>
  
  <!-- Footer for all pages -->
  ${Footer()}
  
  <div class="content-page">
    <!-- Summary Cards Section (4 boxes) -->
    <div class="section" style="width: 100%;">
      ${SummaryCards({ cards: data.summaryCards })}
    </div>
    
    <!-- Bar Chart -->
    <div class="section" style="width: 100%;">
      ${BarChart({ data: data.barChartData })}
    </div>
    
    <!-- Top Cited Content Table (with page-break-inside: avoid already in component) -->
    <div class="section" style="width: 100%;">
      ${generateTopCitedContentTable(data.topCitedContent)}
    </div>
    
    <!-- Pie Chart -->
    <div class="section" style="width: 100%;">
      ${generatePieChart(data.pieChartData)}
    </div>
    
    <!-- Top Sources Mentioning Competitors Table -->
    <div class="section" style="width: 100%;">
      ${generateTopSourcesMentioningCompetitors(data.competitorSources)}
    </div>
    
    <!-- Partnership Recommendations -->
    <div class="section" style="width: 100%;">
      ${AllRecommendations(data.recommendations)}
    </div>
    
    <!-- Recommended Actions -->
    <div class="section" style="width: 100%;">
      ${generateRecommendedActions(data.recommendedActions)}
    </div>
    
    <!-- Sources -->
    <div class="section" style="width: 100%;">
      ${DomainList(data.sources)}
    </div>
  </div>
</body>
</html>`;
}

// Export alias for PDFService compatibility
export const generateTemplate = generateSingleDomainTemplate;
