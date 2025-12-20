import { PartnershipReportData } from '../data.js';
import { SingleDomainReportData } from '../templates/templateSingleDomain.js';

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

/**
 * Mock data for Single Domain Report
 * This represents a detailed influence report for a single domain (Bloomberg.com example)
 */
export const mockSingleDomainData: SingleDomainReportData = {
  // Cover page data
  coverData: {
    title: 'Domain Influence Report',
    subtitle: 'Bloomberg.com',
    timeperiod: 'Jul 30, 2025 - Aug 30, 2025',
  },

  // Header data
  domainName: 'Bloomberg.com',
  domainLogo: 'https://www.google.com/s2/favicons?domain=bloomberg.com&sz=128',
  timePeriod: 'Jul 30, 2025 - Aug 30, 2025',

  // Summary cards (4 boxes)
  summaryCards: [
    {
      label: 'Total mentions',
      value: '12,847',
    },
    {
      label: 'Influence score',
      value: '81',
    },
    {
      label: 'Avg. sentiment',
      value: 'Positive',
    },
    {
      label: 'Citation frequency',
      value: '3.8k',
    },
  ],

  // Bar chart data - AI engines mentions
  barChartData: [
    {
      name: 'ChatGPT',
      value: 42,
      icon: 'openai.com',
    },
    {
      name: 'Claude',
      value: 38,
      icon: 'anthropic.com',
    },
    {
      name: 'Gemini',
      value: 35,
      icon: 'google.com',
    },
    {
      name: 'Perplexity',
      value: 32,
      icon: 'perplexity.ai',
    },
    {
      name: 'Bing AI',
      value: 28,
      icon: 'bing.com',
    },
    {
      name: 'Copilot',
      value: 25,
      icon: 'microsoft.com',
    },
    {
      name: 'Meta AI',
      value: 22,
      icon: 'meta.com',
    },
    {
      name: 'Grok',
      value: 18,
      icon: 'x.com',
    },
  ],

  // Top cited content table
  topCitedContent: {
    title: 'Top cited content',
    rows: [
      {
        rank: 1,
        url: '/news/business-banking-loans',
        mentions: 2808,
        brandMentioned: true,
        sentiment: 'positive',
        percentage: 1.2,
      },
      {
        rank: 2,
        url: '/business/payments/online',
        mentions: 2654,
        brandMentioned: true,
        sentiment: 'positive',
        percentage: 1.1,
      },
      {
        rank: 3,
        url: '/commercial-banking/startups',
        mentions: 2445,
        brandMentioned: true,
        sentiment: 'neutral',
        percentage: 1.0,
      },
      {
        rank: 4,
        url: '/asset-based-lending',
        mentions: 2198,
        brandMentioned: true,
        sentiment: 'positive',
        percentage: 0.9,
      },
      {
        rank: 5,
        url: '/-ai-content-mercedes',
        mentions: 1876,
        brandMentioned: true,
        sentiment: 'negative',
        percentage: 0.8,
      },
    ],
  },

  // Pie chart data - Competitors mentioned
  pieChartData: {
    title: 'Top competitors mentioned in AI engines',
    segments: [
      {
        label: 'Reuters',
        value: 42,
        color: '#304BD4',
      },
      {
        label: 'WSJ',
        value: 23,
        color: 'url(#gradient_blue)',
      },
      {
        label: 'CNBC',
        value: 18,
        color: 'url(#gradient_cyan)',
      },
      {
        label: 'Financial Times',
        value: 10,
        color: '#5B76FE',
      },
      {
        label: 'MarketWatch',
        value: 7,
        color: '#FF896F',
      },
    ],
  },

  // Top sources mentioning competitors
  competitorSources: {
    title: 'Top sources mentioning competitors',
    sources: [
      {
        rank: 1,
        url: 'nytimes.com/business/finance',
        mentions: 1847,
        sentiment: 'positive',
        percentageChange: 12.5,
        competitors: ['reuters.com', 'wsj.com', 'cnbc.com'],
      },
      {
        rank: 2,
        url: 'forbes.com/finance/markets',
        mentions: 1654,
        sentiment: 'positive',
        percentageChange: 8.3,
        competitors: ['reuters.com', 'ft.com'],
      },
      {
        rank: 3,
        url: 'economist.com/finance',
        mentions: 1432,
        sentiment: 'neutral',
        percentageChange: -3.2,
        competitors: ['wsj.com', 'ft.com', 'marketwatch.com', 'reuters.com'],
      },
      {
        rank: 4,
        url: 'cnbc.com/markets/stocks',
        mentions: 1298,
        sentiment: 'positive',
        percentageChange: 15.7,
        competitors: ['reuters.com', 'wsj.com'],
      },
      {
        rank: 5,
        url: 'reuters.com/business/finance',
        mentions: 1187,
        sentiment: 'neutral',
        percentageChange: -1.5,
        competitors: ['wsj.com', 'ft.com', 'cnbc.com'],
      },
    ],
  },

  // Partnership recommendations
  recommendations: {
    totalCount: 3,
    recommendations: [
      {
        domain: 'nytimes.com',
        priority: 'high' as const,
        title: 'Feature in NYT Business section',
        description:
          'The New York Times Business section reaches 8M readers monthly. A featured article will enhance credibility and position Bloomberg.com alongside industry leaders.',
      },
      {
        domain: 'forbes.com',
        priority: 'high' as const,
        title: 'Sponsor Forbes Finance newsletter',
        description:
          'Forbes Finance newsletter has 600K engaged subscribers. Sponsorship will establish thought leadership in financial markets.',
      },
      {
        domain: 'economist.com',
        priority: 'medium' as const,
        title: 'Contribute expert analysis to The Economist',
        description:
          'The Economist actively seeks industry expert perspectives. Contributing in-depth analysis will enhance authority among C-level executives and policymakers.',
      },
    ],
  },

  // Recommended actions
  recommendedActions: {
    actions: [
      {
        title: 'Increase content on sustainable finance',
        description:
          'AI engines frequently cite Bloomberg content about ESG and sustainable investing. Expanding coverage in this area will drive +18% more citations.',
      },
      {
        title: 'Optimize banking industry analysis pages',
        description:
          'Banking analysis content receives high engagement but low AI visibility. Adding structured data and key statistics will improve AI engine pickup by 25%.',
      },
      {
        title: 'Create more data-driven market reports',
        description:
          'AI engines prefer content with clear data points and statistics. Publishing weekly market data reports will increase citation frequency from 3.8k to 4.5k.',
      },
      {
        title: 'Develop fintech innovation hub',
        description:
          'Fintech is a rapidly growing topic with +42% YoY growth in AI citations. Creating a dedicated fintech section will capture emerging market opportunities.',
      },
    ],
  },

  // Sources section
  sources: {
    totalCount: 6,
    data: [
      {
        name: 'chatgpt.com',
        influenceScore: 92,
        citationFrequency: '4.2k',
        change: 15.3,
        monthlyVisits: '1.8B',
        citationsToVisits: 12,
        brandMentions: 2845,
        competitorMentions: 1234,
        domainType: 'AI Assistant',
        categories: 'AI, Technology, Chat',
      },
      {
        name: 'claude.ai',
        influenceScore: 88,
        citationFrequency: '3.9k',
        change: 22.1,
        monthlyVisits: '450M',
        citationsToVisits: 38,
        brandMentions: 2456,
        competitorMentions: 987,
        domainType: 'AI Assistant',
        categories: 'AI, Technology, Chat',
      },
      {
        name: 'gemini.google.com',
        influenceScore: 85,
        citationFrequency: '3.7k',
        change: 8.7,
        monthlyVisits: '2.2B',
        citationsToVisits: 8,
        brandMentions: 2198,
        competitorMentions: 1456,
        domainType: 'AI Assistant',
        categories: 'AI, Technology, Search',
      },
      {
        name: 'perplexity.ai',
        influenceScore: 79,
        citationFrequency: '3.2k',
        change: 18.5,
        monthlyVisits: '95M',
        citationsToVisits: 45,
        brandMentions: 1987,
        competitorMentions: 654,
        domainType: 'AI Search',
        categories: 'AI, Search, Research',
      },
      {
        name: 'bing.com/chat',
        influenceScore: 76,
        citationFrequency: '2.9k',
        change: 5.2,
        monthlyVisits: '1.1B',
        citationsToVisits: 15,
        brandMentions: 1654,
        competitorMentions: 987,
        domainType: 'AI Search',
        categories: 'AI, Search, Microsoft',
      },
      {
        name: 'copilot.microsoft.com',
        influenceScore: 72,
        citationFrequency: '2.6k',
        change: 12.9,
        monthlyVisits: '320M',
        citationsToVisits: 32,
        brandMentions: 1432,
        competitorMentions: 765,
        domainType: 'AI Assistant',
        categories: 'AI, Productivity, Microsoft',
      },
    ],
  },
};
