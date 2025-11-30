/**
 * Test Single Domain Template - Clean implementation for Puppeteer header/footer
 * Uses Puppeteer's built-in header/footer and margins
 * Content automatically breaks to new pages when needed
 * NO Cover, RunningHeader, Footer, or manual page-break handling
 */

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

export interface SingleDomainReportData {
  // Header data (used by Puppeteer header template)
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

  // Top cited content table
  topCitedContent: TopCitedContentTableData;

  // Top sources mentioning competitors
  competitorSources: TopSourcesMentioningCompetitorsData;

  // Recommendations
  recommendations: AllRecommendationsProps;

  // Recommended actions
  recommendedActions: RecommendedActionsData;

  // Sources list
  sources: DomainListProps;
}

function getCleanStyles(): string {
  return `
    <style>
      body {
        font-family: 'DM Sans', sans-serif;
        margin: 0;
        padding: 0;
        background: #ffffff;
      }
      
      .content-page {
        width: 100%;
        margin: 0 auto;
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
      
      /* Summary Cards */
      .summary-cards {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
        margin-bottom: 32px;
      }
      
      .summary-card {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
      }
      
      .summary-card-label {
        font-size: 14px;
        color: #666;
        margin-bottom: 8px;
      }
      
      .summary-card-value {
        font-size: 24px;
        font-weight: 700;
        color: #1a1a1a;
      }
      
      .summary-card-value.highlight {
        color: #3b82f6;
      }
      
      /* Chart Styles */
      .chart-container {
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        padding: 24px;
      }
      
      .chart-title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 20px;
        color: #1a1a1a;
      }
      
      /* Bar Chart */
      .bar-chart {
        width: 100%;
      }
      
      .bar-item {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        font-size: 12px;
      }
      
      .bar-icon {
        width: 24px;
        height: 24px;
        border-radius: 4px;
        margin-right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: white;
        font-weight: 600;
      }
      
      .bar-label {
        min-width: 100px;
        margin-right: 12px;
      }
      
      .bar-visual {
        flex: 1;
        height: 20px;
        background: #f1f5f9;
        border-radius: 10px;
        position: relative;
        margin-right: 8px;
      }
      
      .bar-fill {
        height: 100%;
        border-radius: 10px;
        transition: width 0.3s ease;
      }
      
      .bar-percentage {
        font-weight: 600;
        color: #1a1a1a;
        min-width: 30px;
      }
      
      /* Table Styles */
      .data-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
      }
      
      .data-table th {
        background: #f8f9fa;
        padding: 12px;
        text-align: left;
        font-weight: 600;
        color: #1a1a1a;
        border-bottom: 1px solid #e5e5e5;
      }
      
      .data-table td {
        padding: 12px;
        border-bottom: 1px solid #f1f5f9;
      }
      
      .data-table tbody tr:hover {
        background: #f8f9fa;
      }
      
      .domain-name {
        color: #3b82f6;
        font-weight: 600;
      }
      
      .influence-score {
        font-weight: 600;
        color: #1a1a1a;
      }
      
      .change-positive {
        color: #059669;
      }
      
      .change-negative {
        color: #dc2626;
      }
      
      /* Print Styles - let Puppeteer handle page breaks */
      @media print {
        .chart-container, 
        .summary-card {
          page-break-inside: avoid;
        }
      }
    </style>
  `;
}

export function generateTemplate(data: SingleDomainReportData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.domainName} - Influence Report</title>
  ${getCleanStyles()}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
</head>
<body>
  <div class="content-page">
    <!-- Summary Cards Section (4 boxes) -->
    <div class="section">
      ${SummaryCards({ cards: data.summaryCards })}
    </div>
    
    <!-- Bar Chart -->
    <div class="section">
      ${BarChart({ data: data.barChartData })}
    </div>
    
    <!-- Top Cited Content Table -->
    <div class="section" style="page-break-before: always;">
      ${generateTopCitedContentTable(data.topCitedContent)}
    </div>
    
    <!-- Pie Chart -->
    <div class="section">
      ${generatePieChart(data.pieChartData)}
    </div>
    
    <!-- Top Sources Mentioning Competitors Table -->
    <div class="section" style="page-break-before: always;">
      ${generateTopSourcesMentioningCompetitors(data.competitorSources)}
    </div>
    
    <!-- Recommendations -->
    <div class="section">
      ${AllRecommendations(data.recommendations)}
    </div>
    
    <!-- Recommended Actions -->
    <div class="section" style="page-break-before: always;">
      ${generateRecommendedActions(data.recommendedActions)}
    </div>
    
    <!-- Sources -->
    <div class="section" style="page-break-before: always;">
      ${DomainList(data.sources)}
    </div>
  </div>
</body>
</html>`;
}

// Export alias for PDFService compatibility
export const generateSingleDomainTemplate = generateTemplate;
