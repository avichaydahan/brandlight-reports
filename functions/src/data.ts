export interface DomainScore {
  label: string;
  score: number;
}

export interface PartnershipDomainData {
  name: string;
  influenceScore: number;
  citationFrequency: number;
  change?: number;
  estMonthlyVisits?: string;
  citationsToVisits?: number;
  sourcesMentioningBrand?: number;
  domainType?: string;
  categories?: string | string[];
}

export interface DomainTypeInfluence {
  percentage: number;
  domains: number;
}

export interface PartnershipSummary {
  totalDomainsAnalyzed: number;
  topOpportunity: string;
  mostInfluentialDomain: string;
}

export interface PartnershipReportData {
  timeperiod: string;
  engines: string[];
  category: string;
  summary: PartnershipSummary;
  influenceByDomainType: Record<string, DomainTypeInfluence>;
  domains: PartnershipDomainData[];
}

// create N dummy items for each report type
export function buildDemoItems(
  total: number,
  reportType: string
): DomainScore[] {
  let names: string[];
  switch (reportType) {
    case 'A':
      names = [
        'Mercedes',
        'BMW',
        'Audi',
        'Lexus',
        'Volvo',
        'Jaguar',
        'Porsche',
        'Tesla',
        'Toyota',
        'Honda',
        'Mazda',
      ];
      break;
    case 'B':
      names = [
        'Bloomberg',
        'CNBC',
        'Financial Times',
        'NYTimes',
        'MarketWatch',
        'The Verge',
        'WSJ',
        'CNN',
        'Forbes',
        'Reuters',
        'TechCrunch',
      ];
      break;
    case 'C':
      names = [
        'Apple',
        'Google',
        'Microsoft',
        'Amazon',
        'Meta',
        'Netflix',
        'Adobe',
        'Intel',
        'AMD',
        'Nvidia',
        'Samsung',
      ];
      break;
    case 'D':
      names = [
        'Red',
        'Blue',
        'Green',
        'Yellow',
        'Purple',
        'Orange',
        'Pink',
        'Brown',
        'Gray',
        'Black',
        'White',
      ];
      break;
    default:
      names = ['Demo', 'Sample', 'Test', 'Example', 'Mock'];
  }
  const arr: DomainScore[] = [];
  for (let i = 0; i < total; i++) {
    arr.push({
      label: names[i % names.length] + ' #' + (i + 1),
      score: 35 + ((i * 7) % 65),
    });
  }
  return arr;
}

// Fake paginated API: returns chunks of size `pageSize`
export async function fetchPaginatedDemo(
  totalItems: number,
  pageSize: number,
  page: number,
  reportType: string
): Promise<{ items: DomainScore[]; hasMore: boolean }> {
  const all = buildDemoItems(totalItems, reportType);
  const start = page * pageSize;
  const end = Math.min(start + pageSize, totalItems);
  await new Promise((r) => setTimeout(r, 150)); // simulate latency
  return { items: all.slice(start, end), hasMore: end < totalItems };
}

// Generate partnership domains mock data
export function generatePartnershipDomainsData(): PartnershipReportData {
  const domains: PartnershipDomainData[] = [
    {
      name: 'marketwatch.com',
      influenceScore: 35,
      citationFrequency: 3.1,
      change: 1.2,
      estMonthlyVisits: '12.4M',
      citationsToVisits: 35,
      sourcesMentioningBrand: 56,
      domainType: 'News, Finance',
      categories: ['Finance', 'News', 'Market Analysis'],
    },
    {
      name: 'bloomberg.com',
      influenceScore: 35,
      citationFrequency: 3.1,
      change: 1.2,
      estMonthlyVisits: '12.4M',
      citationsToVisits: 35,
      sourcesMentioningBrand: 56,
      domainType: 'News, Finance',
      categories: ['Finance', 'News', 'Business'],
    },
    {
      name: 'cnbc.com',
      influenceScore: 35,
      citationFrequency: 3.1,
      change: 1.2,
      estMonthlyVisits: '12.4M',
      citationsToVisits: 35,
      sourcesMentioningBrand: 56,
      domainType: 'News, Finance',
      categories: ['Finance', 'News', 'Business'],
    },
    {
      name: 'reuters.com',
      influenceScore: 35,
      citationFrequency: 3.1,
      change: 1.2,
      estMonthlyVisits: '12.4M',
      citationsToVisits: 35,
      sourcesMentioningBrand: 56,
      domainType: 'News, Finance',
      categories: ['News', 'Finance', 'Global'],
    },
    {
      name: 'wsj.com',
      influenceScore: 35,
      citationFrequency: 3.1,
      change: 1.2,
      estMonthlyVisits: '12.4M',
      citationsToVisits: 35,
      sourcesMentioningBrand: 56,
      domainType: 'News, Finance',
      categories: ['Finance', 'News', 'Business'],
    },
  ];

  // Generate more domains to reach 16,569 total
  const domainNames = [
    'yahoo.com',
    'google.com',
    'microsoft.com',
    'apple.com',
    'amazon.com',
    'facebook.com',
    'twitter.com',
    'linkedin.com',
    'instagram.com',
    'youtube.com',
    'netflix.com',
    'spotify.com',
    'reddit.com',
    'pinterest.com',
    'tiktok.com',
    'medium.com',
    'wordpress.com',
    'github.com',
    'stackoverflow.com',
    'quora.com',
  ];

  for (let i = 5; i < 100; i++) {
    const baseName = domainNames[i % domainNames.length];
    const domain =
      i > domainNames.length ? `${baseName.split('.')[0]}${i}.com` : baseName;

    domains.push({
      name: domain,
      influenceScore: 35 + Math.floor(Math.random() * 46), // 35-80
      citationFrequency: 2.1 + Math.random() * 2, // 2.1-4.1
      change: -2 + Math.random() * 4, // -2 to +2
      estMonthlyVisits: `${(Math.random() * 20 + 1).toFixed(1)}M`,
      citationsToVisits: Math.floor(Math.random() * 60 + 20), // 20-80
      sourcesMentioningBrand: Math.floor(Math.random() * 80 + 20), // 20-100
      domainType: 'News, Finance',
      categories: ['Finance', 'News', 'Technology'],
    });
  }

  return {
    timeperiod: 'Jul 30, 2025 - Aug 30, 2025',
    engines: ['All'],
    category: 'All',
    summary: {
      totalDomainsAnalyzed: 16569,
      topOpportunity: 'marketwatch.com',
      mostInfluentialDomain: 'Bloomberg.com',
    },
    influenceByDomainType: {
      'Category name': { percentage: 35, domains: 1200 },
      'Category name 2': { percentage: 21, domains: 1200 },
      'Category name 3': { percentage: 12, domains: 1200 },
      'Category name 4': { percentage: 25, domains: 1200 },
      'Category name 5': { percentage: 25, domains: 1200 },
      Other: { percentage: 25, domains: 1200 },
    },
    domains: domains,
  };
}

// Export function for generating mock data
export function generateMockData(
  reportType: 'A' | 'B' | 'C' | 'D' | 'Content' | 'Partnership'
): any {
  if (reportType === 'Partnership') {
    return generatePartnershipDomainsData();
  }

  const items = buildDemoItems(50, reportType);

  if (reportType === 'Content') {
    return {
      timeperiod: 'Jul 30, 2025 - Aug 30, 2025',
      engines: 'All',
      category: 'All',
      summary: {
        totalSourcesUsed: 71,
        totalSourcesChange: 2,
        totalImpressions: '2.3M',
        totalImpressionsChange: 1200,
        newContentSources: 12,
        newContentSourcesChange: -6,
        citedSources: 180,
        synthesizedSources: 360,
        crawledSources: 72,
        ignoredByAI: 588,
        comparisonCitations: 15.7,
        directQuotes: 36.8,
        paragraphMentions: 47.5,
      },
      charts: [
        {
          type: 'donut',
          title: 'How AI engines use your content',
          data: [
            {
              label: 'Cited sources',
              value: 180,
              percentage: 15,
              color: '#3b82f6',
            },
            {
              label: 'Synthesized sources',
              value: 360,
              percentage: 30,
              color: '#10b981',
            },
            {
              label: 'Crawled sources',
              value: 72,
              percentage: 6,
              color: '#f59e0b',
            },
            {
              label: 'Ignored by AI',
              value: 588,
              percentage: 49,
              color: '#e5e7eb',
            },
          ],
        },
        {
          type: 'donut',
          title: 'Where & how your brand appears in AI',
          data: [
            { label: 'Comparison citations', value: 15.7, color: '#3b82f6' },
            { label: 'Direct quotes', value: 36.8, color: '#10b981' },
            { label: 'Paragraph mentions', value: 47.5, color: '#06b6d4' },
          ],
        },
      ],
    };
  }

  return {
    summary: {
      totalItems: items.length,
      averageScore:
        items.reduce((sum, item) => sum + item.score, 0) / items.length,
      topPerformers: items.sort((a, b) => b.score - a.score).slice(0, 5),
    },
    data: items,
    charts: [
      {
        type: 'bar',
        data: items
          .slice(0, 10)
          .map((item) => ({ label: item.label, value: item.score })),
        options: { title: `Top 10 ${reportType} Report Items` },
      },
      {
        type: 'pie',
        data: [
          {
            label: 'High Score (>70)',
            value: items.filter((item) => item.score > 70).length,
          },
          {
            label: 'Medium Score (40-70)',
            value: items.filter((item) => item.score >= 40 && item.score <= 70)
              .length,
          },
          {
            label: 'Low Score (<40)',
            value: items.filter((item) => item.score < 40).length,
          },
        ],
        options: { title: 'Score Distribution' },
      },
    ],
  };
}
