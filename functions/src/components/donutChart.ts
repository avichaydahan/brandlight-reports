export interface CategoryData {
  category: string;
  percentage: number;
  domains: string;
  color: string;
}

export interface DonutChartProps {
  data: CategoryData[];
}

// Chart configuration
const CHART_CONFIG = {
  radius: 76,
  center: { x: 84, y: 84 },
  gapDegrees: 16,
  startAngle: -90, // 12 o'clock position
  strokeWidth: 16,
  size: 232,
  viewBox: 168,
};

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

function generateDonutPath(
  item: CategoryData,
  startAngle: number,
  segmentAngle: number
): string {
  const { radius, center } = CHART_CONFIG;
  const endAngle = startAngle + segmentAngle;

  const startRad = toRadians(startAngle);
  const endRad = toRadians(endAngle);

  const x1 = center.x + radius * Math.cos(startRad);
  const y1 = center.y + radius * Math.sin(startRad);
  const x2 = center.x + radius * Math.cos(endRad);
  const y2 = center.y + radius * Math.sin(endRad);

  const largeArcFlag = segmentAngle > 180 ? 1 : 0;

  return `<path d="M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}" stroke="${item.color}" stroke-width="${CHART_CONFIG.strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function renderLegendItem(item: CategoryData): string {
  const dotSeparator = `
    <svg width="3" height="4" viewBox="0 0 3 4" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="1.92737" cy="2" r="1.07263" fill="#666976"/>
    </svg>`;

  return `
    <div style="display: flex; align-items: center; height: 24px; gap: 6px; padding: 0 8px;">
      <div style="width: 12px; height: 12px; border-radius: 100px; background: ${item.color};"></div>
      <p style="flex: 1; font-size: 16px; color: #333643;">${item.category}</p>
      <div style="display: flex; align-items: center; gap: 6px;">
        <p style="font-size: 18px; font-weight: 600; color: #333643;">${item.percentage}%</p>
        ${dotSeparator}
        <p style="font-size: 16px; color: #333643;">${item.domains}</p>
      </div>
    </div>`;
}

export function DonutChart({ data }: DonutChartProps): string {
  if (!data || data.length === 0) {
    throw new Error('DonutChart: data is required and must contain at least one category');
  }

  const totalDomains = data.reduce((sum, item) => sum + parseInt(item.domains), 0);
  const totalPercentage = Math.min(
    100,
    Math.round(data.reduce((sum, item) => sum + item.percentage, 0))
  );

  // Generate donut paths with gaps between segments
  const generateDonutPaths = () => {
    const { gapDegrees, startAngle } = CHART_CONFIG;
    const totalGaps = data.length * gapDegrees;
    const availableForSegments = 360 - totalGaps;
    let currentAngle = startAngle;

    return data
      .map((item) => {
        const segmentAngle = (item.percentage / 100) * availableForSegments;
        const path = generateDonutPath(item, currentAngle, segmentAngle);
        currentAngle += segmentAngle + gapDegrees;
        return path;
      })
      .join('\n');
  };

  const { size, viewBox } = CHART_CONFIG;

  return `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <p style="font-size: 16px; font-weight: 600; color: #333643;">
        Influence % by domain type
      </p>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="width: 242px; height: 242px; position: relative;">
          <svg width="${size}" height="${size}" viewBox="0 0 ${viewBox} ${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: ${size}px; height: ${size}px; position: absolute; left: 12px; top: 12px;">
            ${generateDonutPaths()}
          </svg>
          <div style="position: absolute; left: 50%; top: 50%; transform: translate(-42%, -50%); display: flex; flex-direction: column;">
            <div style="font-size: 52px; font-weight: 600; text-align: center; color: #0c1233;">
              ${totalPercentage}%
            </div>
            <div style="font-size: 15px; text-align: center; color: #666976; margin-top: -8px;">
              ${totalDomains.toLocaleString()} domains
            </div>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; width: 258px; gap: 6px;">
          ${data.map(renderLegendItem).join('')}
        </div>
      </div>
    </div>`;
}
