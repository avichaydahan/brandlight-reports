export function DomainList({ totalCount, data }) {
    // Validate that required data is provided
    if (!data || data.length === 0) {
        throw new Error('DomainList: data is required and must contain at least one domain');
    }
    if (typeof totalCount !== 'number' || totalCount < 0) {
        throw new Error('DomainList: totalCount is required and must be a positive number');
    }
    const renderDomainItem = (domain) => {
        // Extract favicon URL from domain using Google's favicon service
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain.name}&sz=64`;
        return `
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; width: 100%; gap: 4px; padding: 12px; border-radius: 12px; background: #fff; border: 1px solid #ebecf1; page-break-inside: avoid; margin-bottom: 8px; padding-top: 24px; box-sizing: border-box;">
      <div style="display: flex; justify-content: flex-start; align-items: center; width: 100%; position: relative; gap: 12px;">
        <div style="flex-shrink: 0; width: 24px; height: 24px; position: relative; border-radius: 16px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; overflow: hidden;">
          <img 
            src="${faviconUrl}" 
            alt="${domain.name} favicon" 
            style="width: 16px; height: 16px; object-fit: contain;"
            onerror="this.style.display='none'; this.parentElement.style.background='#d8deff';"
          />
        </div>
        <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; flex-grow: 1;">
          <p style="font-size: 12px; font-weight: 600; text-align: left; color: #0c1233; margin: 0;">
            ${domain.name}
          </p>
        </div>
      </div>
      <!-- First row of metrics -->
      <div style="display: flex; justify-content: flex-start; align-items: center; width: 100%; position: relative; gap: 4px; flex-wrap: wrap;">
        <div style="display: flex; justify-content: flex-start; align-items: center; position: relative; gap: 2px;">
          <p style="font-size: 12px; text-align: left; color: #666976; margin: 0;">
            Influence score:
          </p>
          <p style="font-size: 12px; font-weight: 700; text-align: left; color: #333643; margin: 0;">
            ${domain.influenceScore}%
          </p>
        </div>
        <svg width="1" height="12" viewBox="0 0 1 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;" preserveAspectRatio="none">
          <line x1="0.5" y1="0.75" x2="0.5" y2="11.25" stroke="#EBECF1"></line>
        </svg>
        <div style="display: flex; justify-content: flex-start; align-items: center; position: relative; gap: 2px;">
          <p style="font-size: 12px; text-align: left; color: #666976; margin: 0;">
            Citation frequency:
          </p>
          <p style="font-size: 12px; font-weight: 700; text-align: left; color: #333643; margin: 0;">
            ${domain.citationFrequency}
          </p>
        </div>
        <svg width="1" height="12" viewBox="0 0 1 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;" preserveAspectRatio="none">
          <line x1="0.5" y1="0.75" x2="0.5" y2="11.25" stroke="#EBECF1"></line>
        </svg>
        <div style="display: flex; justify-content: flex-start; align-items: center; position: relative; gap: 2px;">
          <p style="font-size: 12px; text-align: left; color: #666976; margin: 0;">
            Change:
          </p>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0; width: 12px; height: 12px;" preserveAspectRatio="none">
            <path d="M6 9.5V2.5M6 2.5L2.5 6M6 2.5L9.5 6" stroke="#00A36D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <p style="font-size: 12px; font-weight: 700; text-align: left; color: #00a36d; margin: 0;">
            ${domain.change}%
          </p>
        </div>
        <svg width="1" height="12" viewBox="0 0 1 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;" preserveAspectRatio="none">
          <line x1="0.5" y1="0.75" x2="0.5" y2="11.25" stroke="#EBECF1"></line>
        </svg>
        <div style="display: flex; justify-content: flex-start; align-items: center; position: relative; gap: 2px;">
          <p style="font-size: 12px; text-align: left; color: #666976; margin: 0;">
            Est. monthly visits:
          </p>
          <p style="font-size: 12px; font-weight: 700; text-align: left; color: #333643; margin: 0;">
            ${domain.monthlyVisits}
          </p>
        </div>
      </div>
      <!-- Second row of metrics -->
      <div style="display: flex; justify-content: flex-start; align-items: center; width: 100%; position: relative; gap: 4px; flex-wrap: wrap;">
        <div style="display: flex; justify-content: flex-start; align-items: center; position: relative; gap: 2px;">
          <p style="font-size: 12px; text-align: left; color: #666976; margin: 0;">
            Citations to visits %:
          </p>
          <p style="font-size: 12px; font-weight: 700; text-align: left; color: #333643; margin: 0;">
            ${domain.citationsToVisits}%
          </p>
        </div>
        <svg width="1" height="12" viewBox="0 0 1 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;" preserveAspectRatio="none">
          <line x1="0.5" y1="0.75" x2="0.5" y2="11.25" stroke="#EBECF1"></line>
        </svg>
        <div style="display: flex; justify-content: flex-start; align-items: center; position: relative; gap: 2px;">
          <p style="font-size: 12px; text-align: left; color: #666976; margin: 0;">
            Sources mentioning my brand:
          </p>
          <p style="font-size: 12px; font-weight: 700; text-align: left; color: #333643; margin: 0;">
            ${domain.brandMentions}
          </p>
        </div>
        <svg width="1" height="12" viewBox="0 0 1 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;" preserveAspectRatio="none">
          <line x1="0.5" y1="0.75" x2="0.5" y2="11.25" stroke="#EBECF1"></line>
        </svg>
        <div style="display: flex; justify-content: flex-start; align-items: center; position: relative; gap: 2px;">
          <p style="font-size: 12px; text-align: left; color: #666976; margin: 0;">
            Sources mentioning competitors:
          </p>
          <p style="font-size: 12px; font-weight: 700; text-align: left; color: #333643; margin: 0;">
            ${domain.competitorMentions}
          </p>
        </div>
      </div>
      <!-- Third row for domain type -->
      <div style="display: flex; justify-content: flex-start; align-items: center; width: 100%; position: relative; gap: 2px;">
        <p style="font-size: 12px; text-align: left; color: #666976; margin: 0;">
          Domain type:
        </p>
        <p style="font-size: 12px; font-weight: 700; text-align: left; color: #333643; margin: 0;">
          ${domain.domainType}
        </p>
      </div>
      <!-- Fourth row for categories -->
      <div style="display: flex; justify-content: flex-start; align-items: center; width: 100%; position: relative; gap: 2px;">
        <p style="font-size: 12px; text-align: left; color: #666976; margin: 0;">
          Categories:
        </p>
        <p style="font-size: 12px; font-weight: 700; text-align: left; color: #333643; margin: 0;">
          ${domain.categories}
        </p>
      </div>
    </div>
  `;
    };
    // Render all domains without splitting into pages - Puppeteer handles page breaks automatically
    return `
    <div style="display: flex; width: 100%; flex-direction: column; justify-content: flex-start; align-items: flex-start; position: relative; gap: 8px;">
      <p style="width: 100%; font-size: 14px; font-weight: 600; text-align: left; color: #333643; margin: 0;">
        All domains (${totalCount.toLocaleString()})
      </p>
      ${data.map(renderDomainItem).join('')}
    </div>
  `;
}
