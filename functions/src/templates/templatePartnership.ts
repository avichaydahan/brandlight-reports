import { PartnershipReportData } from '../data.js';
import {
  Cover,
  RunningHeader,
  Footer,
  SummaryCards,
  DonutChart,
  BarChart,
  DomainList,
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
  } = data;

  // Sort domains by influence score
  const sortedDomains = [...domains].sort(
    (a, b) => b.influenceScore - a.influenceScore
  );

  // Get most influential domain (highest influence score)
  const mostInfluential = sortedDomains[0];

  // Get top opportunity (high citations but lower visits - best ROI potential)
  const topOpportunity =
    [...domains]
      .filter((d) => d.citationsToVisits && d.citationsToVisits > 0)
      .sort(
        (a, b) => (b.citationsToVisits || 0) - (a.citationsToVisits || 0)
      )[0] ||
    sortedDomains[1] ||
    sortedDomains[0];

  // Sort domains by influence score for the bar chart
  const topDomains = sortedDomains.slice(0, 10);

  // Prepare data for components
  const summaryCardsData = [
    {
      label: 'Total domains analyzed',
      value: summary.totalDomainsAnalyzed.toLocaleString(),
    },
    {
      label: 'Top opportunity',
      value: topOpportunity?.name || 'N/A',
      domain: topOpportunity?.name,
      favicon: topOpportunity?.name.charAt(0).toUpperCase(),
    },
    {
      label: 'Most influential domain',
      value: mostInfluential?.name || 'N/A',
      domain: mostInfluential?.name,
      favicon: mostInfluential?.name.charAt(0).toUpperCase(),
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
    icon: domain.name.charAt(0).toUpperCase(),
  }));

  // Format the current date for "Date issued"
  const currentDate = new Date();
  const dateIssued = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Calculate total pages dynamically
  const totalPages = 3; // Cover + Summary/Charts + Domains

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
      data: domains.slice(0, 20).map((domain) => ({
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
</body>
</html>`;
}
