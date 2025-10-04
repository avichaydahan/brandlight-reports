export interface DonutChartProps {
  title: string;
  centerValue: string;
  centerSubtext: string;
  data: Array<{
    category: string;
    percentage: number;
    domains: number;
    color: string;
  }>;
}

export function DonutChart({
  title,
  centerValue,
  centerSubtext,
  data,
}: DonutChartProps): string {
  // Calculate SVG paths for donut segments
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercentage = 0;
  const segments = data
    .map((item) => {
      const strokeDasharray = `${
        (item.percentage / 100) * circumference
      } ${circumference}`;
      const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
      cumulativePercentage += item.percentage;

      return `
      <circle 
        cx="100" 
        cy="100" 
        r="${radius}" 
        fill="none" 
        stroke="${item.color}" 
        stroke-width="40" 
        stroke-dasharray="${strokeDasharray}" 
        stroke-dashoffset="${strokeDashoffset}" 
        transform="rotate(-90 100 100)"
      />
    `;
    })
    .join('');

  return `
    <div class="chart-container">
      <h3 class="chart-title">${title}</h3>
      <div class="donut-chart">
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="${radius}" fill="none" stroke="#e5e7eb" stroke-width="40"/>
          ${segments}
        </svg>
        <div class="chart-center">
          <div class="chart-center-value">${centerValue}</div>
          <div class="chart-center-subtext">${centerSubtext}</div>
        </div>
      </div>
      <div class="chart-legend">
        ${data
          .map(
            (item) => `
          <div class="legend-item">
            <div class="legend-label">
              <div class="legend-dot" style="background: ${item.color};"></div>
              ${item.category}
            </div>
            <div class="legend-value">${
              item.percentage
            }% • ${item.domains.toLocaleString()} domains</div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;
}
