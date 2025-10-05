export interface DomainData {
  name: string;
  influenceScore: number;
  citationFrequency: string;
  change: number;
  monthlyVisits: string;
  citationsToVisits: number;
  brandMentions: number;
  competitorMentions: number;
  domainType: string;
  categories: string;
}

export interface DomainListProps {
  totalCount?: number;
  data?: DomainData[];
}

export function DomainList({
  totalCount = 16569,
  data,
}: DomainListProps): string {
  // Default sample data matching the design
  const defaultData: DomainData[] = [
    {
      name: 'Domain name.com',
      influenceScore: 35,
      citationFrequency: '3.1k',
      change: 1.2,
      monthlyVisits: '12.4M',
      citationsToVisits: 35,
      brandMentions: 56,
      competitorMentions: 80,
      domainType: 'News, Finance',
      categories: 'Categorie name, Categorie name, Categorie name',
    },
    {
      name: 'Domain name.com',
      influenceScore: 35,
      citationFrequency: '3.1k',
      change: 1.2,
      monthlyVisits: '12.4M',
      citationsToVisits: 35,
      brandMentions: 56,
      competitorMentions: 80,
      domainType: 'News, Finance',
      categories: 'Categorie name, Categorie name, Categorie name',
    },
    {
      name: 'Domain name.com',
      influenceScore: 35,
      citationFrequency: '3.1k',
      change: 1.2,
      monthlyVisits: '12.4M',
      citationsToVisits: 35,
      brandMentions: 56,
      competitorMentions: 80,
      domainType: 'News, Finance',
      categories: 'Categorie name, Categorie name, Categorie name',
    },
    {
      name: 'Domain name.com',
      influenceScore: 35,
      citationFrequency: '3.1k',
      change: 1.2,
      monthlyVisits: '12.4M',
      citationsToVisits: 35,
      brandMentions: 56,
      competitorMentions: 80,
      domainType: 'News, Finance',
      categories: 'Categorie name, Categorie name, Categorie name',
    },
    {
      name: 'Domain name.com',
      influenceScore: 35,
      citationFrequency: '3.1k',
      change: 1.2,
      monthlyVisits: '12.4M',
      citationsToVisits: 35,
      brandMentions: 56,
      competitorMentions: 80,
      domainType: 'News, Finance',
      categories: 'Categorie name, Categorie name, Categorie name',
    },
  ];

  const domains = data && data.length > 0 ? data : defaultData;

  // Split domains into pages to avoid page breaks
  // Assuming approximately 6-8 domain items per page to avoid cutting
  const itemsPerPage = 6;
  const pages: DomainData[][] = [];

  for (let i = 0; i < domains.length; i += itemsPerPage) {
    pages.push(domains.slice(i, i + itemsPerPage));
  }

  const renderDomainItem = (domain: DomainData) => `
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; flex-grow: 0; flex-shrink: 0; width: 554px; overflow: hidden; gap: 4px; padding: 12px; border-radius: 12px; background: #fff; border: 1px solid #ebecf1; page-break-inside: avoid; margin-bottom: 8px;">
      <div style="display: flex; justify-content: flex-start; align-items: center; align-self: stretch; flex-grow: 0; flex-shrink: 0; position: relative; gap: 12px;">
        <div style="flex-grow: 0; flex-shrink: 0; width: 24px; height: 24px; position: relative; border-radius: 16px; background: #d8deff;"></div>
        <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; flex-grow: 1; position: relative;">
          <p style="align-self: stretch; flex-grow: 0; flex-shrink: 0; width: 494px; font-size: 12px; font-weight: 600; text-align: left; color: #0c1233;">
            ${domain.name}
          </p>
        </div>
      </div>
      <!-- First row of metrics -->
      <div style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; width: 530px; position: relative; gap: 4px; flex-wrap: nowrap; overflow: hidden;">
        <div style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; position: relative; gap: 2px;">
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; text-align: left; color: #666976;">
            Influence score:
          </p>
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; font-weight: 700; text-align: left; color: #333643;">
            ${domain.influenceScore}%
          </p>
        </div>
        <svg width="1" height="12" viewBox="0 0 1 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-grow: 0; flex-shrink: 0;" preserveAspectRatio="none">
          <line x1="0.5" y1="0.75" x2="0.5" y2="11.25" stroke="#EBECF1"></line>
        </svg>
        <div style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; position: relative; gap: 2px;">
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; text-align: left; color: #666976;">
            Citation frequency:
          </p>
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; font-weight: 700; text-align: left; color: #333643;">
            ${domain.citationFrequency}
          </p>
        </div>
        <svg width="1" height="12" viewBox="0 0 1 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-grow: 0; flex-shrink: 0;" preserveAspectRatio="none">
          <line x1="0.5" y1="0.75" x2="0.5" y2="11.25" stroke="#EBECF1"></line>
        </svg>
        <div style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; position: relative; gap: 2px;">
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; text-align: left; color: #666976;">
            Change:
          </p>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-grow: 0; flex-shrink: 0; width: 12px; height: 12px; position: relative;" preserveAspectRatio="none">
            <path d="M6 9.5V2.5M6 2.5L2.5 6M6 2.5L9.5 6" stroke="#00A36D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; font-weight: 700; text-align: left; color: #00a36d;">
            ${domain.change}%
          </p>
        </div>
        <svg width="1" height="12" viewBox="0 0 1 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-grow: 0; flex-shrink: 0;" preserveAspectRatio="none">
          <line x1="0.5" y1="0.75" x2="0.5" y2="11.25" stroke="#EBECF1"></line>
        </svg>
        <div style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; position: relative; gap: 2px;">
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; text-align: left; color: #666976;">
            Est. monthly visits:
          </p>
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; font-weight: 700; text-align: left; color: #333643;">
            ${domain.monthlyVisits}
          </p>
        </div>
      </div>
      <!-- Second row of metrics -->
      <div style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; width: 530px; position: relative; gap: 4px; flex-wrap: nowrap; overflow: hidden;">
        <div style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; position: relative; gap: 2px;">
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; text-align: left; color: #666976;">
            Citations to visits %:
          </p>
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; font-weight: 700; text-align: left; color: #333643;">
            ${domain.citationsToVisits}%
          </p>
        </div>
        <svg width="1" height="12" viewBox="0 0 1 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-grow: 0; flex-shrink: 0;" preserveAspectRatio="none">
          <line x1="0.5" y1="0.75" x2="0.5" y2="11.25" stroke="#EBECF1"></line>
        </svg>
        <div style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; position: relative; gap: 2px;">
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; text-align: left; color: #666976;">
            Sources mentioning my brand:
          </p>
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; font-weight: 700; text-align: left; color: #333643;">
            ${domain.brandMentions}
          </p>
        </div>
        <svg width="1" height="12" viewBox="0 0 1 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-grow: 0; flex-shrink: 0;" preserveAspectRatio="none">
          <line x1="0.5" y1="0.75" x2="0.5" y2="11.25" stroke="#EBECF1"></line>
        </svg>
        <div style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; position: relative; gap: 2px;">
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; text-align: left; color: #666976;">
            Sources mentioning competitors:
          </p>
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; font-weight: 700; text-align: left; color: #333643;">
            ${domain.competitorMentions}
          </p>
        </div>
        <svg width="1" height="12" viewBox="0 0 1 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-grow: 0; flex-shrink: 0;" preserveAspectRatio="none">
          <line x1="0.5" y1="0.75" x2="0.5" y2="11.25" stroke="#EBECF1"></line>
        </svg>
        <div style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; position: relative; gap: 2px;">
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; text-align: left; color: #666976;">
            Domain type:
          </p>
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; font-weight: 700; text-align: left; color: #333643;">
            ${domain.domainType}
          </p>
        </div>
      </div>
      <!-- Third row for categories -->
      <div style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; width: 530px; position: relative; gap: 2px;">
        <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; text-align: left; color: #666976;">
          Categories:
        </p>
        <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; font-weight: 700; text-align: left; color: #333643;">
          ${domain.categories}
        </p>
      </div>
    </div>
  `;

  return pages
    .map(
      (pageDomains, pageIndex) => `
    ${
      pageIndex === 99
        ? `
      <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; flex-grow: 0; flex-shrink: 0; position: relative; gap: 8px; margin-top: 40px;">
        <p style="flex-grow: 0; flex-shrink: 0; width: 100%; font-size: 14px; font-weight: 600; text-align: left; color: #333643;">
          All domains (${totalCount.toLocaleString()})
        </p>
        ${pageDomains.map(renderDomainItem).join('')}
      </div>
    `
        : `
      <div style="page-break-before: always; display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; flex-grow: 0; flex-shrink: 0; position: relative; gap: 8px; padding-top: 140px;">
        ${pageDomains.map(renderDomainItem).join('')}
      </div>
    `
    }
  `
    )
    .join('');
}
