/**
 * Single Domain Template
 * Displays influence report for a single domain with metrics, charts, and top cited content
 */
import { Cover } from '../components/cover.js';
import { generateHeaderSingleDomain, } from '../components/headerSingleDomain.js';
import { SummaryCards, } from '../components/summaryCards.js';
import { BarChart } from '../components/barChart.js';
import { generatePieChart } from '../components/pieChart.js';
import { generateTopCitedContentTable, } from '../components/topCitedContentTable.js';
import { generateTopSourcesMentioningCompetitors, } from '../components/topSourcesMentioningCompetitors.js';
import { AllRecommendations, } from '../components/allRecommendations.js';
import { generateRecommendedActions, } from '../components/recommendedActions.js';
import { DomainList } from '../components/dataTable.js';
import { Footer } from '../components/footer.js';
import { getBaseStyles } from '../components/styles.js';
export function generateSingleDomainTemplate(data) {
    const headerData = {
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
