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

export function SummaryCards(p0: {
  cards: (
    | {
        label: string;
        value: string;
        isHighlight?: undefined;
        icon?: undefined;
      }
    | { label: string; value: string; isHighlight: boolean; icon: string }
  )[];
}): string {
  return `
    <div
      style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; gap: 8px;"
    >
      <div
        style="display: flex; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; position: relative; gap: 8px;"
      >
        <p
          style="flex-grow: 1; width: 554px; font-size: 16px; font-weight: 600; text-align: left; color: #333643;"
        >
          Summary
        </p>
      </div>
      <div
        style="display: flex; justify-content: flex-start; align-items: center; align-self: stretch; flex-grow: 0; flex-shrink: 0; gap: 8px;"
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
        style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; flex-grow: 1; overflow: hidden; gap: 4px; padding: 12px; border-radius: 8px; background: #fff; border-width: 1px; border-color: #ebecf1; border-style: solid;"
      >
        <div
          style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; position: relative; gap: 4px;"
        >
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; text-align: left; color: #0c1233;">
            ${config.label}
          </p>
        </div>
        <div
          style="display: flex; justify-content: flex-start; align-items: flex-end; align-self: stretch; flex-grow: 0; flex-shrink: 0; gap: 10px;"
        >
          <div
            style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; flex-grow: 1; gap: 2px;"
          >
            <div
              style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; position: relative; gap: 4px;"
            >
              <p
                style="align-self: stretch; flex-grow: 0; flex-shrink: 0; width: 152px; font-size: 24px; font-weight: 600; text-align: left; color: #0c1233;"
              >
                ${config.value}
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    return `
      <div
        style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; flex-grow: 0; flex-shrink: 0; width: 181px; overflow: hidden; gap: 4px; padding: 12px; border-radius: 8px; background: #fff; border-width: 1px; border-color: #ebecf1; border-style: solid;"
      >
        <div
          style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; position: relative; gap: 4px;"
        >
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; text-align: left; color: #0c1233;">
            ${config.label}
          </p>
        </div>
        <div
          style="display: flex; justify-content: flex-start; align-items: center; align-self: stretch; flex-grow: 0; flex-shrink: 0; height: 32px; position: relative; gap: 8px; background: #fff;"
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
            style="flex-grow: 1; width: 125px; font-size: 14px; font-weight: 500; text-align: left; color: #0c1233;"
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
