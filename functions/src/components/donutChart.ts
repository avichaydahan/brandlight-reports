export interface CategoryData {
  category: string;
  percentage: number;
  domains: string;
  color: string;
}

export interface DonutChartProps {
  data: CategoryData[];
}

export function DonutChart({ data }: DonutChartProps): string {
  // Validate that data is provided
  if (!data || data.length === 0) {
    throw new Error(
      'DonutChart: data is required and must contain at least one category'
    );
  }

  const chartData = data;

  // Calculate total domains
  const totalDomains = chartData.reduce(
    (sum, item) => sum + parseInt(item.domains),
    0
  );

  // Calculate coverage percentage - categories should add up to ~100%
  // This represents the percentage of domains that are categorized
  const totalPercentage = Math.min(
    100,
    Math.round(chartData.reduce((sum, item) => sum + item.percentage, 0))
  );

  // Generate dynamic SVG paths for donut chart with rounded corners and gaps
  const generateDonutPaths = () => {
    let currentAngle = -90; // Start at top (12 o'clock)
    const radius = 76; // Distance from center to middle of stroke
    const centerX = 84;
    const centerY = 84;
    const gapDegrees = 16; // Small gap between segments for visual separation
    const totalGaps = chartData.length * gapDegrees; // Total degrees used for gaps
    const availableForSegments = 360 - totalGaps; // Remaining degrees for actual segments

    return chartData
      .map((item) => {
        // Calculate this segment's angle from available space (not full 360)
        const segmentAngle = (item.percentage / 100) * availableForSegments;
        const startAngle = currentAngle;
        const endAngle = startAngle + segmentAngle;

        // Convert angles to radians
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        // Calculate start and end points
        const x1 = centerX + radius * Math.cos(startRad);
        const y1 = centerY + radius * Math.sin(startRad);
        const x2 = centerX + radius * Math.cos(endRad);
        const y2 = centerY + radius * Math.sin(endRad);

        currentAngle = endAngle + gapDegrees; // Move to next segment's start (including gap)

        // Determine if we need the large arc flag
        const largeArcFlag = segmentAngle > 180 ? 1 : 0;

        return `<path d="M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}" stroke="${item.color}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>`;
      })
      .join('\n        ');
  };

  return `
<div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; position: relative; gap: 24px;">
  <p style="align-self: stretch; flex-grow: 0; flex-shrink: 0; width: 100%; font-size: 16px; font-weight: 600; text-align: left; color: #333643;">
    Influence % by domain type
  </p>
  <div style="display: flex; justify-content: space-between; align-items: center; align-self: stretch; flex-grow: 0; flex-shrink: 0; position: relative;">
    <div style="flex-grow: 0; flex-shrink: 0; width: 242px; height: 242px; position: relative;">
      <svg width="232" height="232" viewBox="0 0 168 168" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 232px; height: 232px; position: absolute; left: 12px; top: 12px;" preserveAspectRatio="none">
        ${generateDonutPaths()}
      </svg>
      <div style="position: absolute; left: 50%; top: 50%; transform: translate(-42%, -50%); display: flex; flex-direction: column; gap: 0;">
        <div style="font-size: 52px; font-weight: 600; text-align: center; color: #0c1233;">
          ${totalPercentage}%
        </div>
        <div style="font-size: 15px; text-align: center; color: #666976; margin-top: -8px;">
          ${totalDomains.toLocaleString()} domains
        </div>
      </div>
    </div>
    <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; flex-grow: 0; flex-shrink: 0; width: 258px; gap: 6px;">
      ${chartData
        .map(
          (item) => `
      <div style="display: flex; justify-content: flex-start; align-items: center; align-self: stretch; flex-grow: 0; flex-shrink: 0; height: 24px; position: relative; gap: 6px; padding-left: 8px; padding-right: 8px; border-radius: 9999px;">
        <div style="flex-grow: 0; flex-shrink: 0; width: 12px; height: 12px; position: relative; overflow: hidden; border-radius: 100px; background: ${
          item.color
        };">
          <div style="width: 15px; height: ${
            item.category === 'Other' ? '16px' : '7px'
          }; position: absolute; left: -1px; top: -1px; background: ${
            item.color
          };"></div>
        </div>
        <div style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 1; position: relative; gap: 4px;">
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 16px; text-align: left; color: #333643;">
            ${item.category}
          </p>
        </div>
        <div style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; position: relative; gap: 6px;">
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 18px; font-weight: 600; text-align: right; color: #333643;">
            ${item.percentage}%
          </p>
          <svg width="3" height="4" viewBox="0 0 3 4" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-grow: 0; flex-shrink: 0;" preserveAspectRatio="none">
            <circle cx="1.92737" cy="2" r="1.07263" fill="#666976"></circle>
          </svg>
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 16px; text-align: right; color: #333643;">
            ${item.domains}
          </p>
        </div>
      </div>
      `
        )
        .join('')}
    </div>
  </div>
</div>
  `;
}
