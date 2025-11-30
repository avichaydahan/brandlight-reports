/**
 * Test Partnership Template - Clean implementation for Puppeteer header/footer
 * Uses Puppeteer's built-in header/footer and margins
 * Content automatically breaks to new pages when needed
 * NO RunningHeader, Footer, or manual page-break handling
 */

import { PartnershipReportData } from '../data.js';
import {
  Cover,
  SummaryCards,
  DonutChart,
  BarChart,
  DomainList,
  TopRecommendations,
  AllRecommendations,
} from '../components/index.js';

function getCleanStyles(): string {
  return `
    <style>
      
      body {
        font-family: 'DM Sans', sans-serif;
      }
      
      /* Section Styles */
      .section-title {
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 30px;
        color: #1a1a1a;
      }
      
      /* Summary Cards */
      .summary-cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 30px;
        margin-bottom: 40px;
      }
      
      .summary-card {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 24px;
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
      .charts-section {
        display: flex;
        flex-direction: column;
        gap: 40px;
        margin-top: 40px;
        margin-bottom: 40px;
      }
      
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
      
      /* Donut Chart */
      .donut-chart {
        position: relative;
        width: 200px;
        height: 200px;
        margin: 0 auto 20px;
      }
      
      .donut-chart svg {
        width: 100%;
        height: 100%;
      }
      
      .chart-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
      }
      
      .chart-center-value {
        font-size: 32px;
        font-weight: 700;
        color: #1a1a1a;
      }
      
      .chart-center-subtext {
        font-size: 14px;
        color: #666;
      }
      
      .chart-legend {
        display: flex;
        flex-direction: column;
        gap: 8px;
        text-align: left;
        margin-top: 20px;
      }
      
      .legend-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
      }
      
      .legend-label {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .legend-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
      
      .legend-value {
        font-weight: 600;
        color: #666;
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
      .table-section {
        margin-top: 40px;
      }
      
      .table-container {
        overflow-x: auto;
      }
      
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
        body { 
        }
        
        .cover-page {
          page-break-after: always;
        }
        
        .chart-container, 
        .summary-card {
          page-break-inside: avoid;
        }
      }
      
    </style>
  `;
}

export function generateTemplate(data: PartnershipReportData): string {
  const {
    timeperiod,
    engines,
    category,
    summary,
    influenceByDomainType,
    domains,
    topRecommendations,
    allRecommendations,
  } = data;

  // Sort domains by influence score for the bar chart
  const sortedDomains = [...domains].sort(
    (a, b) => b.influenceScore - a.influenceScore
  );
  const topDomains = sortedDomains.slice(0, 10);

  // Prepare data for components - use summary values directly for consistency
  const summaryCardsData = [
    {
      label: 'Total domains analyzed',
      value: summary.totalDomainsAnalyzed.toLocaleString(),
    },
    {
      label: 'Top opportunity',
      value: summary.topOpportunity || 'N/A',
      domain: summary.topOpportunity,
    },
    {
      label: 'Most influential domain',
      value: summary.mostInfluentialDomain || 'N/A',
      domain: summary.mostInfluentialDomain,
    },
  ];

  const donutChartData = Object.entries(influenceByDomainType).map(
    ([category, data], index) => ({
      category,
      percentage: data.percentage,
      domains: data.domains.toString(),
      color: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#6b7280'][
        index % 6
      ],
    })
  );

  const barChartData = topDomains.map((domain) => ({
    name: domain.name.split('.')[0],
    value: domain.influenceScore,
    icon: domain.name,
  }));

  // Format the current date for "Date issued"
  const currentDate = new Date();
  const dateIssued = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Partnership domains report</title>
  ${getCleanStyles()}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
</head>
<body">  
  ${SummaryCards({ cards: summaryCardsData })}
  <div class="charts-section">
    ${BarChart({
      data: barChartData,
    })}
    
    ${DonutChart({
      data: donutChartData,
    })}
  </div>

  ${DomainList({
    totalCount: domains.length,
    data: domains.map((domain) => ({
      name: domain.name,
      influenceScore: domain.influenceScore,
      citationFrequency: `${domain.citationFrequency.toFixed(1)}k`,
      change: domain.change || 0,
      monthlyVisits: domain.estMonthlyVisits || '0',
      citationsToVisits: domain.citationsToVisits || 0,
      brandMentions: domain.sourcesMentioningBrand || 0,
      competitorMentions: 0,
      domainType: domain.domainType || 'Unknown',
      categories: Array.isArray(domain.categories)
        ? domain.categories.join(', ')
        : domain.categories || 'Unknown',
    })),
  })}

  <!-- Recommendations section - no manual page breaks -->
  ${
    topRecommendations && topRecommendations.length > 0
      ? `
    ${TopRecommendations({
      recommendations: topRecommendations,
    })}
    ${
      allRecommendations && allRecommendations.length > 0
        ? `
    <div style="margin-top: 32px;">
      ${AllRecommendations({
        recommendations: allRecommendations,
        totalCount: allRecommendations.length,
      })}
    </div>
    `
        : ''
    }
  `
      : allRecommendations && allRecommendations.length > 0
      ? `
    ${AllRecommendations({
      recommendations: allRecommendations,
      totalCount: allRecommendations.length,
    })}
  `
      : ''
  }
</body>
</html>`;
}
