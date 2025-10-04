export interface RunningHeaderProps {
  title: string;
  pageInfo?: string;
  timeperiod?: string;
  engines?: string;
  category?: string;
}

export function RunningHeader({
  title,
  pageInfo,
  timeperiod,
  engines,
  category,
}: RunningHeaderProps): string {
  return `
    <div class="running-header" style="z-index: 998;">
      <div class="header-top">
        <h1 class="page-title">${title}</h1>
        ${pageInfo ? `<div class="page-info">${pageInfo}</div>` : ''}
      </div>
      
      ${
        timeperiod || engines || category
          ? `
        <div class="header-meta">
          ${
            timeperiod
              ? `<div class="meta-item">Time period: <span>${timeperiod}</span></div>`
              : ''
          }
          ${
            engines
              ? `<div class="meta-item">Engines: <span>${engines}</span></div>`
              : ''
          }
          ${
            category
              ? `<div class="meta-item">Category: <span>${category}</span></div>`
              : ''
          }
        </div>
      `
          : ''
      }
    </div>
  `;
}
