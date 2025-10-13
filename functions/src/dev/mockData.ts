import { PartnershipReportData } from '../data.js';

/**
 * Production-ready mock data for Partnership Report
 * This simulates real API response data and should match the structure
 * that will come from your API endpoints in production.
 */
export const mockPartnershipData: PartnershipReportData = {
  timeperiod: 'Jul 30, 2025 - Aug 30, 2025',
  engines: ['Google', 'Bing', 'Claude', 'Perplexity'],
  category: 'Technology & SaaS',
  summary: {
    totalDomainsAnalyzed: 16569,
    topOpportunity: 'marketwatch.com',
    mostInfluentialDomain: 'bloomberg.com',
  },
  influenceByDomainType: {
    'News & Media': {
      percentage: 35,
      domains: 5799,
    },
    Business: {
      percentage: 28,
      domains: 4639,
    },
    Technology: {
      percentage: 22,
      domains: 3645,
    },
    'Social Media': {
      percentage: 10,
      domains: 1657,
    },
    Education: {
      percentage: 3,
      domains: 497,
    },
    Other: {
      percentage: 2,
      domains: 332,
    },
  },
  domains: [
    {
      name: 'bloomberg.com',
      influenceScore: 81,
      citationFrequency: 3.8,
      change: 2.4,
      estMonthlyVisits: '45.2M',
      citationsToVisits: 42,
      sourcesMentioningBrand: 156,
      domainType: 'News & Media, Finance',
      categories: ['Finance', 'News', 'Business'],
    },
    {
      name: 'nbc.com',
      influenceScore: 79,
      citationFrequency: 3.5,
      change: 1.8,
      estMonthlyVisits: '38.7M',
      citationsToVisits: 38,
      sourcesMentioningBrand: 142,
      domainType: 'News & Media',
      categories: ['News', 'Entertainment', 'Media'],
    },
    {
      name: 'hp.com',
      influenceScore: 65,
      citationFrequency: 2.9,
      change: -0.5,
      estMonthlyVisits: '28.4M',
      citationsToVisits: 28,
      sourcesMentioningBrand: 98,
      domainType: 'Technology, Business',
      categories: ['Technology', 'Hardware', 'Enterprise'],
    },
    {
      name: 'marketwatch.com',
      influenceScore: 50,
      citationFrequency: 3.1,
      change: 1.2,
      estMonthlyVisits: '12.4M',
      citationsToVisits: 35,
      sourcesMentioningBrand: 56,
      domainType: 'News & Media, Finance',
      categories: ['Finance', 'News', 'Market Analysis'],
    },
    {
      name: 'medium.com',
      influenceScore: 48,
      citationFrequency: 2.7,
      change: 3.1,
      estMonthlyVisits: '180M',
      citationsToVisits: 8,
      sourcesMentioningBrand: 89,
      domainType: 'Social Media, Technology',
      categories: ['Content', 'Publishing', 'Technology'],
    },
    {
      name: 'dotdash.com',
      influenceScore: 45,
      citationFrequency: 2.4,
      change: 0.9,
      estMonthlyVisits: '95.3M',
      citationsToVisits: 12,
      sourcesMentioningBrand: 67,
      domainType: 'News & Media',
      categories: ['Lifestyle', 'Content', 'Media'],
    },
    {
      name: 'wsj.com',
      influenceScore: 78,
      citationFrequency: 3.6,
      change: 1.5,
      estMonthlyVisits: '42.1M',
      citationsToVisits: 40,
      sourcesMentioningBrand: 148,
      domainType: 'News & Media, Finance',
      categories: ['Finance', 'News', 'Business'],
    },
    {
      name: 'marketingweek.com',
      influenceScore: 44,
      citationFrequency: 2.2,
      change: 2.1,
      estMonthlyVisits: '8.9M',
      citationsToVisits: 32,
      sourcesMentioningBrand: 52,
      domainType: 'Business, Technology',
      categories: ['Marketing', 'Business', 'Technology'],
    },
    {
      name: 'cnn.com',
      influenceScore: 76,
      citationFrequency: 3.4,
      change: 0.8,
      estMonthlyVisits: '156M',
      citationsToVisits: 25,
      sourcesMentioningBrand: 178,
      domainType: 'News & Media',
      categories: ['News', 'Politics', 'Global'],
    },
    {
      name: 'bbc.co.uk',
      influenceScore: 74,
      citationFrequency: 3.3,
      change: 1.1,
      estMonthlyVisits: '203M',
      citationsToVisits: 22,
      sourcesMentioningBrand: 165,
      domainType: 'News & Media',
      categories: ['News', 'Global', 'Media'],
    },
    // Generate additional realistic domains
    ...generateAdditionalDomains(40),
  ],
};

/**
 * Helper function to generate additional realistic domain data
 * This simulates what your API would return for pagination or large datasets
 */
function generateAdditionalDomains(count: number) {
  const domainBases = [
    {
      name: 'techcrunch',
      type: 'Technology, News',
      categories: ['Technology', 'Startups', 'News'],
    },
    {
      name: 'forbes',
      type: 'Business, Finance',
      categories: ['Business', 'Finance', 'Leadership'],
    },
    {
      name: 'reuters',
      type: 'News & Media',
      categories: ['News', 'Global', 'Finance'],
    },
    {
      name: 'theverge',
      type: 'Technology',
      categories: ['Technology', 'Consumer Electronics', 'Reviews'],
    },
    {
      name: 'engadget',
      type: 'Technology',
      categories: ['Technology', 'Gadgets', 'Reviews'],
    },
    {
      name: 'wired',
      type: 'Technology, News',
      categories: ['Technology', 'Culture', 'Science'],
    },
    {
      name: 'arstechnica',
      type: 'Technology',
      categories: ['Technology', 'Science', 'Policy'],
    },
    {
      name: 'mashable',
      type: 'Social Media, Technology',
      categories: ['Technology', 'Social Media', 'Entertainment'],
    },
    {
      name: 'techradar',
      type: 'Technology',
      categories: ['Technology', 'Reviews', 'How-to'],
    },
    {
      name: 'cnet',
      type: 'Technology',
      categories: ['Technology', 'Reviews', 'News'],
    },
    {
      name: 'zdnet',
      type: 'Technology, Business',
      categories: ['Technology', 'Enterprise', 'Business'],
    },
    {
      name: 'venturebeat',
      type: 'Technology, Business',
      categories: ['Technology', 'AI', 'Gaming'],
    },
    {
      name: 'businessinsider',
      type: 'Business, Finance',
      categories: ['Business', 'Finance', 'Technology'],
    },
    {
      name: 'fortune',
      type: 'Business, Finance',
      categories: ['Business', 'Fortune 500', 'Leadership'],
    },
    {
      name: 'entrepreneur',
      type: 'Business',
      categories: ['Business', 'Startups', 'Leadership'],
    },
    {
      name: 'inc',
      type: 'Business',
      categories: ['Business', 'Startups', 'Growth'],
    },
    {
      name: 'fastcompany',
      type: 'Business, Technology',
      categories: ['Business', 'Innovation', 'Design'],
    },
    {
      name: 'hbr',
      type: 'Business, Education',
      categories: ['Business', 'Leadership', 'Management'],
    },
    {
      name: 'economist',
      type: 'News & Media, Finance',
      categories: ['Economics', 'Politics', 'Business'],
    },
    {
      name: 'nytimes',
      type: 'News & Media',
      categories: ['News', 'Politics', 'Culture'],
    },
  ];

  return Array.from({ length: count }, (_, i) => {
    const baseIndex = i % domainBases.length;
    const base = domainBases[baseIndex];
    const influenceScore = Math.max(
      15,
      Math.min(95, 50 + (Math.random() - 0.5) * 60)
    );
    const citationFreq = Math.max(
      0.5,
      Math.min(5.0, 2.0 + (Math.random() - 0.5) * 3)
    );
    const changePercent = (Math.random() - 0.5) * 6; // -3% to +3%
    const monthlyVisits = Math.max(1, Math.min(500, 10 + Math.random() * 100));

    return {
      name: `${base.name}${
        i > domainBases.length ? i - domainBases.length + 1 : ''
      }.com`,
      influenceScore: Math.round(influenceScore),
      citationFrequency: Number(citationFreq.toFixed(1)),
      change: Number(changePercent.toFixed(1)),
      estMonthlyVisits:
        monthlyVisits > 1
          ? `${monthlyVisits.toFixed(1)}M`
          : `${(monthlyVisits * 1000).toFixed(0)}k`,
      citationsToVisits: Math.round(
        Math.max(5, Math.min(50, (citationFreq / monthlyVisits) * 1000))
      ),
      sourcesMentioningBrand: Math.round(
        Math.max(10, Math.min(200, influenceScore * 1.5))
      ),
      domainType: base.type,
      categories: base.categories,
    };
  });
}
