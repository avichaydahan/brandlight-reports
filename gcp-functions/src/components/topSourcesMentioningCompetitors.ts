/**
 * Top Sources Mentioning Competitors Table component
 * Displays ranked URLs with # of mentions, sentiment, percentage change, and competitors logos
 */

export interface CompetitorSource {
  rank: number;
  url: string;
  mentions: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  percentageChange: number;
  competitors: string[]; // Array of competitor domain names (max 4)
}

export interface TopSourcesMentioningCompetitorsData {
  title: string;
  sources: CompetitorSource[];
}

/**
 * Get sentiment icon SVG
 */
function getSentimentIcon(
  sentiment: 'positive' | 'neutral' | 'negative'
): string {
  const icons = {
    positive: `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-grow: 0; flex-shrink: 0; width: 16px; height: 16px;">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2337 0H2.76436C1.23969 0 -0.000976562 1.24067 -0.000976562 2.76533V11.1427C-0.000976562 12.436 0.892357 13.5247 2.09502 13.8233V15.3333C2.09502 15.5647 2.21436 15.7787 2.41102 15.9007C2.51769 15.9667 2.63902 16 2.76169 16C2.86302 16 2.96502 15.9767 3.05902 15.93L7.10902 13.9047H13.235C14.7597 13.9047 15.999 12.6647 15.999 11.1407V2.76533C15.999 1.24067 14.759 0 13.2337 0" fill="#06D6A0"></path>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0968 8.63739C10.0968 9.45005 9.13681 10.1367 8.00014 10.1367C6.86347 10.1367 5.90347 9.45005 5.90347 8.63739C5.90347 8.36739 5.68414 8.14805 5.41414 8.14805C5.14414 8.14805 4.9248 8.36739 4.9248 8.63739C4.9248 10.0174 6.30414 11.1394 8.00014 11.1394C9.69614 11.1394 11.0748 10.0174 11.0748 8.63739C11.0775 8.36405 10.8595 8.14005 10.5861 8.13672C10.3128 8.14005 10.0941 8.36405 10.0968 8.63739" fill="#002400"></path>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 6.58691C11.0527 6.58691 11.5 6.13958 11.5 5.58691C11.5 5.03491 11.0527 4.58691 10.5 4.58691C9.94733 4.58691 9.5 5.03491 9.5 5.58691C9.5 6.13958 9.94733 6.58691 10.5 6.58691" fill="#002400"></path>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 6.58691C6.05267 6.58691 6.5 6.13958 6.5 5.58691C6.5 5.03491 6.05267 4.58691 5.5 4.58691C4.94733 4.58691 4.5 5.03491 4.5 5.58691C4.5 6.13958 4.94733 6.58691 5.5 6.58691" fill="#002400"></path>
      </svg>
    `,
    neutral: `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-grow: 0; flex-shrink: 0; width: 16px; height: 16px;">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2337 0H2.76436C1.23969 0 -0.000976562 1.24067 -0.000976562 2.76533V11.1427C-0.000976562 12.436 0.892357 13.5247 2.09502 13.8233V15.3333C2.09502 15.5647 2.21436 15.7787 2.41102 15.9007C2.51769 15.9667 2.63902 16 2.76169 16C2.86302 16 2.96502 15.9767 3.05902 15.93L7.10902 13.9047H13.235C14.7597 13.9047 15.999 12.6647 15.999 11.1407V2.76533C15.999 1.24067 14.759 0 13.2337 0" fill="#D6D9E3"></path>
        <path d="M11 9.14697C11.276 9.14697 11.5 9.37031 11.5 9.64697C11.5 9.92295 11.276 10.147 11 10.147H5C4.72401 10.147 4.50002 9.92295 4.5 9.64697C4.5 9.37031 4.724 9.14697 5 9.14697H11Z" fill="#1A1D2A"></path>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 4.5874C6.05267 4.5874 6.5 5.0354 6.5 5.5874C6.5 6.14007 6.05267 6.5874 5.5 6.5874C4.94733 6.5874 4.5 6.14007 4.5 5.5874C4.5 5.0354 4.94733 4.5874 5.5 4.5874Z" fill="#1A1D2A"></path>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 4.5874C11.0527 4.5874 11.5 5.0354 11.5 5.5874C11.5 6.14005 11.0527 6.5874 10.5 6.5874C9.94735 6.5874 9.50002 6.14005 9.5 5.5874C9.5 5.0354 9.94733 4.5874 10.5 4.5874Z" fill="#1A1D2A"></path>
      </svg>
    `,
    negative: `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-grow: 0; flex-shrink: 0; width: 16px; height: 16px;">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2337 0H2.76436C1.23969 0 -0.000976562 1.24067 -0.000976562 2.76533V11.1427C-0.000976562 12.436 0.892357 13.5247 2.09502 13.8233V15.3333C2.09502 15.5647 2.21436 15.7787 2.41102 15.9007C2.51769 15.9667 2.63902 16 2.76169 16C2.86302 16 2.96502 15.9767 3.05902 15.93L7.10902 13.9047H13.235C14.7597 13.9047 15.999 12.6647 15.999 11.1407V2.76533C15.999 1.24067 14.759 0 13.2337 0" fill="#FF6B6B"></path>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0968 7.36261C10.0968 6.54995 9.13681 5.86328 8.00014 5.86328C6.86347 5.86328 5.90347 6.54995 5.90347 7.36261C5.90347 7.63261 5.68414 7.85195 5.41414 7.85195C5.14414 7.85195 4.9248 7.63261 4.9248 7.36261C4.9248 5.98261 6.30414 4.86061 8.00014 4.86061C9.69614 4.86061 11.0748 5.98261 11.0748 7.36261C11.0775 7.63595 10.8595 7.85995 10.5861 7.86328C10.3128 7.85995 10.0941 7.63595 10.0968 7.36261" fill="#400000"></path>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 9.41309C11.0527 9.41309 11.5 9.86042 11.5 10.4131C11.5 10.9651 11.0527 11.4131 10.5 11.4131C9.94733 11.4131 9.5 10.9651 9.5 10.4131C9.5 9.86042 9.94733 9.41309 10.5 9.41309" fill="#400000"></path>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 9.41309C6.05267 9.41309 6.5 9.86042 6.5 10.4131C6.5 10.9651 6.05267 11.4131 5.5 11.4131C4.94733 11.4131 4.5 10.9651 4.5 10.4131C4.5 9.86042 4.94733 9.41309 5.5 9.41309" fill="#400000"></path>
      </svg>
    `,
  };

  return icons[sentiment];
}

export function generateTopSourcesMentioningCompetitors(
  data: TopSourcesMentioningCompetitorsData
): string {
  const rows = data.sources
    .map((source) => {
      const changeColor = source.percentageChange >= 0 ? '#00bc86' : '#ff6b6b';
      const competitorLogos = source.competitors
        .slice(0, 4)
        .map((domain) => {
          const baseDomain = domain
            .replace(/^(https?:\/\/)?(www\.)?/, '')
            .split('/')[0];
          const faviconUrl = `https://www.google.com/s2/favicons?domain=${baseDomain}&sz=64`;
          return `<img src="${faviconUrl}" alt="${domain}" style="width: 24px; height: 24px; border-radius: 50%; margin-left: -6px; border: 1.5px solid white; background: #FAFAFB;" onerror="this.style.display='none'" />`;
        })
        .join('');

      return `
        <tr style="border-bottom: 1px solid #ebecf1;">
          <td style="padding: 8px 16px; font-size: 12px; font-weight: 600; text-align: center; color: #0c1233; border-right: 1px solid #ebecf1; white-space: nowrap;">${
            source.rank
          }</td>
          <td style="padding: 8px 16px; font-size: 12px; font-weight: 500; color: #0c1233; border-right: 1px solid #ebecf1; max-width: 210px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${
            source.url
          }</td>
          <td style="padding: 8px 16px; font-size: 12px; color: #333643; border-right: 1px solid #ebecf1; white-space: nowrap;">${source.mentions.toLocaleString()}</td>
          <td style="padding: 8px 16px; border-right: 1px solid #ebecf1; white-space: nowrap;">
            <div style="display: flex; align-items: center; gap: 8px;">
              ${getSentimentIcon(source.sentiment)}
              <span style="font-size: 12px; color: #333643;">${
                source.sentiment.charAt(0).toUpperCase() +
                source.sentiment.slice(1)
              }</span>
            </div>
          </td>
          <td style="padding: 8px 16px; border-right: 1px solid #ebecf1; white-space: nowrap;">
            <span style="font-size: 12px; font-weight: 500; color: ${changeColor};">${
        source.percentageChange > 0 ? '+' : ''
      }${source.percentageChange.toFixed(1)}%</span>
          </td>
          <td style="padding: 8px 16px; white-space: nowrap;">
            <div style="display: flex; align-items: center; padding-left: 6px;">
              ${competitorLogos}
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  return `
<div style="width: 100%; margin-bottom: 24px; page-break-inside: avoid;">
  <p style="font-size: 14px; font-weight: 600; color: #333643; margin-bottom: 8px;">
    ${data.title}
  </p>
  <table style="width: 100%; border-collapse: collapse; border-radius: 10px; border: 1px solid #ebecf1; background: #fff; overflow: hidden;">
    <thead>
      <tr style="background: #fff; border-bottom: 1px solid #ebecf1;">
        <th style="padding: 10px 16px; font-size: 12px; font-weight: 500; text-align: left; color: #666976; border-right: 1px solid #ebecf1; white-space: nowrap;">#</th>
        <th style="padding: 10px 16px; font-size: 12px; font-weight: 500; text-align: left; color: #666976; border-right: 1px solid #ebecf1; white-space: nowrap;">URL</th>
        <th style="padding: 10px 16px; font-size: 12px; font-weight: 500; text-align: left; color: #666976; border-right: 1px solid #ebecf1; white-space: nowrap;"># of mentions</th>
        <th style="padding: 10px 16px; font-size: 12px; font-weight: 500; text-align: left; color: #666976; border-right: 1px solid #ebecf1; white-space: nowrap;">Sentiment</th>
        <th style="padding: 10px 16px; font-size: 12px; font-weight: 500; text-align: left; color: #666976; border-right: 1px solid #ebecf1; white-space: nowrap;">
          % 
          <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle; margin-left: 4px;">
            <path d="M3.5 8L6 10.5L8.5 8M3.5 5L6 2.5L8.5 5" stroke="#B2B5C2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </th>
        <th style="padding: 10px 16px; font-size: 12px; font-weight: 500; text-align: left; color: #666976; white-space: nowrap;">
          Competitors 
          <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle; margin-left: 4px;">
            <path d="M3.5 8L6 10.5L8.5 8M3.5 5L6 2.5L8.5 5" stroke="#B2B5C2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</div>
  `;
}
