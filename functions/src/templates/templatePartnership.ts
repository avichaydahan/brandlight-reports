import { PartnershipReportData } from '../data.js';
import {
  Cover,
  RunningHeader,
  Footer,
  SummaryCards,
  DonutChart,
  BarChart,
  DataTable,
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

  // Sort domains by influence score for the bar chart
  const topDomains = domains
    .sort((a, b) => b.influenceScore - a.influenceScore)
    .slice(0, 10);

  // Prepare data for components
  const summaryCardsData = [
    {
      label: 'Total domains analyzed',
      value: summary.totalDomainsAnalyzed.toLocaleString(),
    },
    {
      label: 'Top opportunity',
      value: summary.topOpportunity,
      isHighlight: true,
      icon: 'MW',
    },
    {
      label: 'Most influential domain',
      value: summary.mostInfluentialDomain,
      isHighlight: true,
      icon: 'B',
    },
  ];

  const donutChartData = Object.entries(influenceByDomainType).map(
    ([category, data], index) => ({
      category,
      percentage: data.percentage,
      domains: data.domains,
      color: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#6b7280'][
        index % 6
      ],
    })
  );

  const barChartData = topDomains.map((domain) => ({
    name: domain.name.split('.')[0],
    value: domain.influenceScore,
  }));

  const tableColumns = [
    { key: 'name', label: 'Domain name', width: '15%' },
    { key: 'influenceScore', label: 'Influence score', width: '10%' },
    { key: 'citationFrequency', label: 'Citation frequency', width: '12%' },
    { key: 'change', label: 'Change', width: '8%' },
    { key: 'estMonthlyVisits', label: 'Est. monthly visits', width: '12%' },
    { key: 'citationsToVisits', label: 'Citations to visits %', width: '12%' },
    {
      key: 'sourcesMentioningBrand',
      label: 'Sources mentioning my brand',
      width: '15%',
    },
    { key: 'domainType', label: 'Domain type', width: '10%' },
    { key: 'categories', label: 'Categories', width: '15%' },
  ];

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
  
  <!-- Footer for all pages -->
  ${Footer()}
  
  <div class="content-page">
    <!-- Header for content pages only -->
    ${RunningHeader({
      title: 'Partnership domains report',
      timeperiod,
      engines,
      category,
    })}
    ${SummaryCards({ cards: summaryCardsData })}
    
    <div class="charts-section">
      ${BarChart({
        title: 'Domains by influence score',
        data: barChartData,
      })}
      
      ${DonutChart({
        title: 'Influence % by domain type',
        centerValue: '96%',
        centerSubtext:
          '${summary.totalDomainsAnalyzed.toLocaleString()} domains',
        data: donutChartData,
      })}
    </div>
    
    ${DataTable({
      title: 'All domains',
      totalCount: domains.length,
      columns: tableColumns,
      data: domains,
      maxRows: 20,
    })}
  </div>
</body>
</html>`;
}
