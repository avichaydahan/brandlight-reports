export interface SummaryCardProps {
  label: string;
  value: string | number;
  isHighlight?: boolean;
  icon?: string;
}

export interface SummaryCardsProps {
  cards: SummaryCardProps[];
}

export function SummaryCards({ cards }: SummaryCardsProps): string {
  return `
    <div class="summary-section">
      <h2 class="section-title">Summary</h2>
      <div class="summary-cards">
        ${cards.map((card) => SummaryCard(card)).join('')}
      </div>
    </div>
  `;
}

export function SummaryCard({
  label,
  value,
  isHighlight = false,
  icon,
}: SummaryCardProps): string {
  return `
    <div class="summary-card">
      <div class="summary-card-content">
        ${icon ? `<div class="summary-card-icon">${icon}</div>` : ''}
        <div class="summary-card-label">${label}</div>
        <div class="summary-card-value ${
          isHighlight ? 'highlight' : ''
        }">${value}</div>
      </div>
    </div>
  `;
}
