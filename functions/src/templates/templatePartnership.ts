import { PartnershipReportData } from '../data.js';
import {
  Cover,
  RunningHeader,
  Footer,
  SummaryCards,
  DonutChart,
  BarChart,
  DomainList,
  TopRecommendations,
  AllRecommendations,
  getBaseStyles,
} from '../components/index.js';

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
      // favicon will be auto-generated from domain in component
    },
    {
      label: 'Most influential domain',
      value: summary.mostInfluentialDomain || 'N/A',
      domain: summary.mostInfluentialDomain,
      // favicon will be auto-generated from domain in component
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
    icon: domain.name, // Pass full domain name for favicon extraction
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
  ${getBaseStyles()}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
</head>
<body>
  ${Cover({
    title: 'Partnership domains report',
    timeperiod: timeperiod,
    dateIssued: dateIssued,
  })}

  <!-- Header for all pages -->
  ${RunningHeader({
    title: 'Partnership domains report',
    timeperiod,
    engines,
    category,
  })}
  
  <!-- Footer for all pages -->
  ${Footer()}
  
  <div class="content-page">
    ${SummaryCards({ cards: summaryCardsData })}
    <div class="charts-section">
      ${BarChart({
        data: barChartData,
      })}
      
      ${DonutChart({
        data: donutChartData,
      })}
    </div>
  </div>

  <!-- Domains section starts on third page -->
  <div class="content-page">
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
  </div>

  <!-- Recommendations section starts on new page -->
  ${
    topRecommendations && topRecommendations.length > 0
      ? `
  <div class="content-page">
    <div style="display: flex; flex-direction: column; gap: 32px;">
      ${TopRecommendations({
        recommendations: topRecommendations,
      })}
      
      ${
        allRecommendations && allRecommendations.length > 0
          ? AllRecommendations({
              recommendations: allRecommendations,
              totalCount: allRecommendations.length,
            })
          : ''
      }
    </div>
  </div>
  `
      : ''
  }
</body>
</html>`;
}
