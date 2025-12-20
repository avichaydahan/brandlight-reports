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

export interface PartnershipRecommendation {
  title: string;
  description: string;
}

export interface DetailedRecommendation {
  domain: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
}

export interface PartnershipReportData {
  timeperiod: string;
  engines: string[];
  category: string;
  summary: PartnershipSummary;
  influenceByDomainType: Record<string, DomainTypeInfluence>;
  domains: PartnershipDomainData[];
  topRecommendations?: PartnershipRecommendation[];
  allRecommendations?: DetailedRecommendation[];
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
