import { PartnershipReportData } from '../data.js';

export const mockPartnershipData: PartnershipReportData = {
  timeperiod: 'Last 30 days',
  engines: ['Google', 'Bing', 'Claude'],
  category: 'Technology & SaaS',
  summary: {
    totalDomainsAnalyzed: 1250,
    topOpportunity: 'MediaWatch',
    mostInfluentialDomain: 'techcrunch.com',
  },
  influenceByDomainType: {
    'News & Media': {
      percentage: 35,
      domains: 438,
    },
    Business: {
      percentage: 28,
      domains: 350,
    },
    Technology: {
      percentage: 22,
      domains: 275,
    },
    'Social Media': {
      percentage: 10,
      domains: 125,
    },
    Other: {
      percentage: 5,
      domains: 62,
    },
  },
  domains: Array.from({ length: 50 }, (_, i) => ({
    name: `domain${i + 1}.com`,
    influenceScore: Math.floor(Math.random() * 100) + 1,
    citationFrequency: Math.floor(Math.random() * 50) + 1,
    change: Math.floor(Math.random() * 40) - 20,
    estMonthlyVisits: `${Math.floor(Math.random() * 1000) + 100}k`,
    citationsToVisits: Math.floor(Math.random() * 10) + 1,
    sourcesMentioningBrand: Math.floor(Math.random() * 20) + 1,
    domainType: ['News & Media', 'Business', 'Technology', 'Social Media'][
      Math.floor(Math.random() * 4)
    ],
    categories: ['Tech', 'News', 'Business', 'Social'][
      Math.floor(Math.random() * 4)
    ],
  })),
};
