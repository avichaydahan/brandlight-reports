export interface SummaryCardProps {
  label: string;
  value: string | number;
  domain?: string;
  favicon?: string;
}

export interface SummaryCardsProps {
  cards: SummaryCardProps[];
}

const cardBaseStyle = `
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #ebecf1;
`.replace(/\s+/g, ' ').trim();

export function SummaryCards({ cards }: SummaryCardsProps): string {
  return `
    <div style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
      <h2 style="font-size: 24px; font-weight: 600; color: #333643; margin: 0;">
        Summary
      </h2>
      <div style="display: flex; gap: 16px;">
        ${cards.map(SummaryCard).join('')}
      </div>
    </div>
  `;
}

export function SummaryCard({ label, value, domain }: SummaryCardProps): string {
  const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : '';

  const renderValue = () => {
    if (!domain) {
      return `<span style="font-size: 24px; font-weight: 600; color: #0c1233;">${value}</span>`;
    }

    return `
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 24px; height: 24px; border-radius: 4px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; overflow: hidden;">
          <img src="${faviconUrl}" alt="${domain}" style="width: 16px; height: 16px; object-fit: contain;" onerror="this.style.display='none'; this.parentElement.innerHTML='${domain.charAt(0).toUpperCase()}';"/>
        </div>
        <span style="font-size: 14px; font-weight: 500; color: #0c1233; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${domain}</span>
      </div>
    `;
  };

  return `
    <div style="${cardBaseStyle}">
      <span style="font-size: 12px; color: #0c1233;">${label}</span>
      ${renderValue()}
    </div>
  `;
}
