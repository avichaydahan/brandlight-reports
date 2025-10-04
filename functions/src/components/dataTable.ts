export interface DataTableProps {
  title: string;
  totalCount: number;
  columns: Array<{
    key: string;
    label: string;
    width?: string;
  }>;
  data: Array<Record<string, any>>;
  maxRows?: number;
}

export function DataTable({
  title,
  totalCount,
  columns,
  data,
  maxRows = 20,
}: DataTableProps): string {
  const displayData = data.slice(0, maxRows);

  return `
    <div class="table-section">
      <h2 class="section-title">${title} (${totalCount.toLocaleString()})</h2>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              ${columns
                .map(
                  (col) => `
                <th ${col.width ? `style="width: ${col.width};"` : ''}>${
                    col.label
                  }</th>
              `
                )
                .join('')}
            </tr>
          </thead>
          <tbody>
            ${displayData
              .map(
                (row) => `
              <tr>
                ${columns
                  .map((col) => {
                    const value = row[col.key];
                    let cellClass = '';
                    let displayValue = value;

                    // Special formatting based on column key
                    if (col.key === 'name') {
                      cellClass = 'domain-name';
                    } else if (col.key === 'influenceScore') {
                      cellClass = 'influence-score';
                      displayValue = `${value}%`;
                    } else if (col.key === 'change') {
                      cellClass =
                        value >= 0 ? 'change-positive' : 'change-negative';
                      displayValue = `${value >= 0 ? '+' : ''}${value.toFixed(
                        1
                      )}%`;
                    } else if (col.key === 'citationFrequency') {
                      displayValue = `${value.toFixed(1)}k`;
                    } else if (col.key === 'citationsToVisits') {
                      displayValue = `${value}%`;
                    } else if (
                      col.key === 'categories' &&
                      Array.isArray(value)
                    ) {
                      displayValue = value.join(', ');
                    }

                    return `<td class="${cellClass}">${displayValue}</td>`;
                  })
                  .join('')}
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
