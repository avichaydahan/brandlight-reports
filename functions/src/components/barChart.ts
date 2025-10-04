export interface BarChartProps {
  title: string;
  data: Array<{
    name: string;
    value: number;
    icon?: string;
    color?: string;
  }>;
}

export function BarChart({ title, data }: BarChartProps): string {
  const maxValue = Math.max(...data.map((item) => item.value));
  const colors = [
    '#1a1a2e',
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#f59e0b',
    '#10b981',
    '#ef4444',
    '#06b6d4',
    '#84cc16',
    '#f97316',
  ];
  const icons = ['B', 'M', 'W', 'R', 'Y', 'G', 'N', 'C', 'F', 'T'];

  return `
    <div class="chart-container">
      <h3 class="chart-title">${title}</h3>
      <div class="bar-chart">
        ${data
          .map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            const color = item.color || colors[index % colors.length];
            const icon = item.icon || icons[index % icons.length];

            return `
            <div class="bar-item">
              <div class="bar-icon" style="background: ${color};">
                ${icon}
              </div>
              <div class="bar-label">${item.name}</div>
              <div class="bar-visual">
                <div class="bar-fill" style="width: ${percentage}%; background: ${color};"></div>
              </div>
              <div class="bar-percentage">${item.value}%</div>
            </div>
          `;
          })
          .join('')}
      </div>
    </div>
  `;
}
