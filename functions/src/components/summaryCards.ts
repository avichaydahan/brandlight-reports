export interface SummaryCardProps {
  label: string;
  value: string | number;
  isHighlight?: boolean;
  icon?: string;
  domain?: string;
  favicon?: string;
}

export interface SummaryCardsProps {
  cards: SummaryCardProps[];
}

export function SummaryCards(props: SummaryCardsProps): string {
  return `
    <div
      style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; gap: 16px;"
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
        ${generateSummaryCard({
          label: 'Total domains analyzed',
          value: '16,569',
          type: 'total',
        })}
        ${generateSummaryCard({
          label: 'Top opportunity',
          domain: 'marketwatch.com',
          favicon: 'image-57.png',
          type: 'opportunity',
        })}
        ${generateSummaryCard({
          label: 'Most influential domain',
          domain: 'Bloomberg.com',
          favicon: 'image-49.png',
          type: 'influential',
        })}
      </div>
    </div>
  `;
}

function generateSummaryCard(config: any): string {
  if (config.type === 'total') {
    return `
      <div
        style="display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start; flex: 1; height: 84px; overflow: hidden; padding: 12px; border-radius: 8px; background: #fff; border-width: 1px; border-color: #ebecf1; border-style: solid;"
      >
        <div
          style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; height: 16px;"
        >
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; text-align: left; color: #0c1233; margin: 0; line-height: 16px;">
            ${config.label}
          </p>
        </div>
        <div
          style="display: flex; justify-content: flex-start; align-items: flex-end; align-self: stretch; flex-grow: 1;"
        >
          <p
            style="align-self: stretch; flex-grow: 0; flex-shrink: 0; font-size: 24px; font-weight: 600; text-align: left; color: #0c1233; margin: 0; display: flex; align-items: flex-end;"
          >
            ${config.value}
          </p>
        </div>
      </div>
    `;
  } else {
    return `
      <div
        style="display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start; flex: 1; height: 84px; overflow: hidden; padding: 12px; border-radius: 8px; background: #fff; border-width: 1px; border-color: #ebecf1; border-style: solid;"
      >
        <div
          style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; height: 16px;"
        >
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; text-align: left; color: #0c1233; margin: 0; line-height: 16px;">
            ${config.label}
          </p>
        </div>
        <div
          style="display: flex; justify-content: flex-start; align-items: center; align-self: stretch; flex-grow: 1; gap: 8px;"
        >
          <div
            style="flex-grow: 0; flex-shrink: 0; width: 24px; height: 24px; position: relative; overflow: hidden; border-radius: ${
              config.type === 'opportunity' ? '20px' : '50px'
            };"
          >
            <div
              style="width: 24px; height: 24px; position: absolute; left: -1px; top: -1px; background: #f0f0f0; border-radius: ${
                config.type === 'opportunity' ? '20px' : '50px'
              };"
            ></div>
          </div>
          <p
            style="flex-grow: 1; font-size: 14px; font-weight: 500; text-align: left; color: #0c1233; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;"
          >
            ${config.domain}
          </p>
        </div>
      </div>
    `;
  }
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
