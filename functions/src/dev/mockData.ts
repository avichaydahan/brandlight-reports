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
  topRecommendations: [
    {
      title: 'Pitch Bloomberg.com for banking coverage',
      description:
        "Securing placement in Bloomberg's high-traffic finance list will boost AI visibility and position your brand alongside market leaders.",
    },
    {
      title: 'Partner with TechCrunch for startup spotlight',
      description:
        "TechCrunch's extensive startup coverage reaches 12M monthly readers. A featured article will increase brand awareness in the tech ecosystem.",
    },
    {
      title: 'Sponsor Forbes fintech newsletter',
      description:
        "Forbes' fintech newsletter reaches 500K subscribers weekly. Sponsorship will position your brand as a thought leader in financial innovation.",
    },
  ],
  allRecommendations: [
    {
      domain: 'bloomberg.com',
      priority: 'high' as const,
      title: 'Place fintech feature on Bloomberg.com',
      description:
        "Bloomberg's finance and fintech coverage reaches 9M readers monthly. A sponsored feature here will increase brand authority and AI-driven mentions.",
    },
    {
      domain: 'techcrunch.com',
      priority: 'high' as const,
      title: 'Secure startup spotlight on TechCrunch',
      description:
        'TechCrunch features innovative startups daily. A spotlight article will boost visibility among investors and tech enthusiasts.',
    },
    {
      domain: 'forbes.com',
      priority: 'high' as const,
      title: 'Sponsor Forbes fintech newsletter',
      description:
        'The Forbes fintech newsletter has a highly engaged audience. Weekly sponsorship will establish thought leadership.',
    },
    {
      domain: 'wsj.com',
      priority: 'medium' as const,
      title: 'Contribute expert opinion to WSJ',
      description:
        'Wall Street Journal actively seeks industry expert opinions. Contributing articles will enhance credibility and reach C-level executives.',
    },
    {
      domain: 'reuters.com',
      priority: 'medium' as const,
      title: 'Feature in Reuters business technology section',
      description:
        'Reuters business technology section reaches global audiences. Feature coverage will expand international brand recognition.',
    },
    {
      domain: 'theverge.com',
      priority: 'medium' as const,
      title: 'Product review on The Verge',
      description:
        'The Verge specializes in tech product reviews with 20M monthly readers. A detailed review will drive product awareness.',
    },
    {
      domain: 'wired.com',
      priority: 'low' as const,
      title: 'Feature in Wired innovation series',
      description:
        'Wired covers cutting-edge innovation stories. A feature in their series will position your brand as an innovator.',
    },
    {
      domain: 'cnn.com',
      priority: 'low' as const,
      title: 'Business segment on CNN',
      description:
        'CNN Business reaches mass audiences. A TV segment will provide mainstream visibility and credibility.',
    },
    {
      domain: 'businessinsider.com',
      priority: 'low' as const,
      title: 'Startup profile on Business Insider',
      description:
        'Business Insider profiles successful startups regularly. A feature article will attract potential customers and investors.',
    },
  ],
};

/**
 * Helper function to generate additional realistic domain data
 * This simulates what your API would return for pagination or large datasets
 * Uses only real domains without numerical suffixes
 */
function generateAdditionalDomains(count: number) {
  const realDomains = [
    {
      name: 'techcrunch.com',
      type: 'Technology, News',
      categories: ['Technology', 'Startups', 'News'],
    },
    {
      name: 'forbes.com',
      type: 'Business, Finance',
      categories: ['Business', 'Finance', 'Leadership'],
    },
    {
      name: 'reuters.com',
      type: 'News & Media',
      categories: ['News', 'Global', 'Finance'],
    },
    {
      name: 'theverge.com',
      type: 'Technology',
      categories: ['Technology', 'Consumer Electronics', 'Reviews'],
    },
    {
      name: 'engadget.com',
      type: 'Technology',
      categories: ['Technology', 'Gadgets', 'Reviews'],
    },
    {
      name: 'wired.com',
      type: 'Technology, News',
      categories: ['Technology', 'Culture', 'Science'],
    },
    {
      name: 'arstechnica.com',
      type: 'Technology',
      categories: ['Technology', 'Science', 'Policy'],
    },
    {
      name: 'mashable.com',
      type: 'Social Media, Technology',
      categories: ['Technology', 'Social Media', 'Entertainment'],
    },
    {
      name: 'techradar.com',
      type: 'Technology',
      categories: ['Technology', 'Reviews', 'How-to'],
    },
    {
      name: 'cnet.com',
      type: 'Technology',
      categories: ['Technology', 'Reviews', 'News'],
    },
    {
      name: 'zdnet.com',
      type: 'Technology, Business',
      categories: ['Technology', 'Enterprise', 'Business'],
    },
    {
      name: 'venturebeat.com',
      type: 'Technology, Business',
      categories: ['Technology', 'AI', 'Gaming'],
    },
    {
      name: 'businessinsider.com',
      type: 'Business, Finance',
      categories: ['Business', 'Finance', 'Technology'],
    },
    {
      name: 'fortune.com',
      type: 'Business, Finance',
      categories: ['Business', 'Fortune 500', 'Leadership'],
    },
    {
      name: 'entrepreneur.com',
      type: 'Business',
      categories: ['Business', 'Startups', 'Leadership'],
    },
    {
      name: 'inc.com',
      type: 'Business',
      categories: ['Business', 'Startups', 'Growth'],
    },
    {
      name: 'fastcompany.com',
      type: 'Business, Technology',
      categories: ['Business', 'Innovation', 'Design'],
    },
    {
      name: 'hbr.org',
      type: 'Business, Education',
      categories: ['Business', 'Leadership', 'Management'],
    },
    {
      name: 'economist.com',
      type: 'News & Media, Finance',
      categories: ['Economics', 'Politics', 'Business'],
    },
    {
      name: 'nytimes.com',
      type: 'News & Media',
      categories: ['News', 'Politics', 'Culture'],
    },
    {
      name: 'washingtonpost.com',
      type: 'News & Media',
      categories: ['News', 'Politics', 'Investigative'],
    },
    {
      name: 'theguardian.com',
      type: 'News & Media',
      categories: ['News', 'Global', 'Opinion'],
    },
    {
      name: 'axios.com',
      type: 'News & Media',
      categories: ['News', 'Politics', 'Business'],
    },
    {
      name: 'politico.com',
      type: 'News & Media',
      categories: ['Politics', 'Policy', 'Government'],
    },
    {
      name: 'yahoo.com',
      type: 'News & Media, Technology',
      categories: ['News', 'Finance', 'Entertainment'],
    },
    {
      name: 'npr.org',
      type: 'News & Media',
      categories: ['News', 'Culture', 'Radio'],
    },
    {
      name: 'usatoday.com',
      type: 'News & Media',
      categories: ['News', 'Sports', 'Entertainment'],
    },
    {
      name: 'cnbc.com',
      type: 'News & Media, Finance',
      categories: ['Finance', 'Markets', 'Business'],
    },
    {
      name: 'foxnews.com',
      type: 'News & Media',
      categories: ['News', 'Politics', 'Opinion'],
    },
    {
      name: 'latimes.com',
      type: 'News & Media',
      categories: ['News', 'California', 'Culture'],
    },
    {
      name: 'time.com',
      type: 'News & Media',
      categories: ['News', 'Culture', 'Science'],
    },
    {
      name: 'newsweek.com',
      type: 'News & Media',
      categories: ['News', 'Politics', 'Culture'],
    },
    {
      name: 'theatlantic.com',
      type: 'News & Media',
      categories: ['News', 'Culture', 'Opinion'],
    },
    {
      name: 'vox.com',
      type: 'News & Media',
      categories: ['News', 'Explainers', 'Analysis'],
    },
    {
      name: 'buzzfeed.com',
      type: 'News & Media',
      categories: ['News', 'Entertainment', 'Quizzes'],
    },
    {
      name: 'vice.com',
      type: 'News & Media',
      categories: ['News', 'Culture', 'Documentary'],
    },
    {
      name: 'slate.com',
      type: 'News & Media',
      categories: ['News', 'Opinion', 'Culture'],
    },
    {
      name: 'huffpost.com',
      type: 'News & Media',
      categories: ['News', 'Politics', 'Lifestyle'],
    },
    {
      name: 'quartz.com',
      type: 'Business, News',
      categories: ['Business', 'Economics', 'Technology'],
    },
    {
      name: 'crunchbase.com',
      type: 'Business, Technology',
      categories: ['Startups', 'Funding', 'Business Intelligence'],
    },
  ];

  return Array.from({ length: count }, (_, i) => {
    const domain = realDomains[i % realDomains.length];
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
      name: domain.name,
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
      domainType: domain.type,
      categories: domain.categories,
    };
  });
}
