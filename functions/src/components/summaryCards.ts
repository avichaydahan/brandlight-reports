export interface SummaryCardProps {
  label: string;
  value: string | number;
  domain?: string;
  favicon?: string;
}

export interface SummaryCardsProps {
  cards: SummaryCardProps[];
}

export function SummaryCards({ cards }: SummaryCardsProps): string {
  return `
    <div
      style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; gap: 12px; width: 100%;"
    >
      <div
        style="display: flex; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0;"
      >
        <h2
          style="flex-grow: 1; width: 100%; font-size: 24px; font-weight: 600; text-align: left; color: #333643; margin: 0; padding: 0;"
        >
          Summary
        </h2>
      </div>
      <div
        style="display: flex; justify-content: space-between; align-items: center; align-self: stretch; flex-grow: 0; flex-shrink: 0; gap: 16px;"
      >
        ${cards.map((card) => SummaryCard(card)).join('')}
      </div>
    </div>
  `;
}

export function SummaryCard(card: SummaryCardProps): string {
  // If it's a simple value card (no domain)
  if (!card.domain) {
    return `
      <div
        style="display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start; flex: 1; height: 84px; overflow: hidden; padding: 12px; border-radius: 8px; background: #fff; border-width: 1px; border-color: #ebecf1; border-style: solid;"
      >
        <div
          style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; height: 16px;"
        >
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; text-align: left; color: #0c1233; margin: 0; line-height: 16px;">
            ${card.label}
          </p>
        </div>
        <div
          style="display: flex; justify-content: flex-start; align-items: flex-end; align-self: stretch; flex-grow: 1;"
        >
          <p
            style="align-self: stretch; flex-grow: 0; flex-shrink: 0; font-size: 24px; font-weight: 600; text-align: left; color: #0c1233; margin: 0; display: flex; align-items: flex-end;"
          >
            ${card.value}
          </p>
        </div>
      </div>
    `;
  }

  // If it's a domain card with favicon/icon
  // Extract favicon URL from domain using Google's favicon service
  const faviconUrl = card.domain
    ? `https://www.google.com/s2/favicons?domain=${card.domain}&sz=64`
    : '';

  return `
    <div
      style="display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start; flex: 1; height: 84px; overflow: hidden; padding: 12px; border-radius: 8px; background: #fff; border-width: 1px; border-color: #ebecf1; border-style: solid;"
    >
      <div
        style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; height: 16px;"
      >
        <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; text-align: left; color: #0c1233; margin: 0; line-height: 16px;">
          ${card.label}
        </p>
      </div>
      <div
        style="display: flex; justify-content: flex-start; align-items: center; align-self: stretch; flex-grow: 1; gap: 8px;"
      >
        <div
          style="flex-grow: 0; flex-shrink: 0; width: 24px; height: 24px; position: relative; overflow: hidden; border-radius: 4px; background: #f0f0f0; display: flex; align-items: center; justify-content: center;"
        >
          <img 
            src="${faviconUrl}" 
            alt="${card.domain} favicon" 
            style="width: 16px; height: 16px; object-fit: contain;"
            onerror="this.style.display='none'; this.parentElement.innerHTML='${
              card.domain?.charAt(0).toUpperCase() || ''
            }';"
          />
        </div>
        <p
          style="flex-grow: 1; font-size: 14px; font-weight: 500; text-align: left; color: #0c1233; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;"
        >
          ${card.domain}
        </p>
      </div>
    </div>
  `;
}
