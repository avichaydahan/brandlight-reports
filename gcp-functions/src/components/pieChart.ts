/**
 * Pie Chart component for displaying competitor distribution
 * Generates dynamic SVG pie chart with legend
 */

export interface PieChartData {
  title: string;
  segments: {
    label: string;
    value: number;
    color: string;
  }[];
}

/**
 * Convert percentage to SVG path for pie chart
 * @param percentage - Value between 0-100
 * @param startAngle - Starting angle in degrees
 * @returns SVG path data
 */
function createPieSlice(percentage: number, startAngle: number): string {
  const radius = 61;
  const centerX = 61;
  const centerY = 61;

  // Convert to radians
  const startRad = ((startAngle - 90) * Math.PI) / 180;
  const endRad = ((startAngle + percentage * 3.6 - 90) * Math.PI) / 180;

  // Calculate coordinates
  const x1 = centerX + radius * Math.cos(startRad);
  const y1 = centerY + radius * Math.sin(startRad);
  const x2 = centerX + radius * Math.cos(endRad);
  const y2 = centerY + radius * Math.sin(endRad);

  // Large arc flag (1 if > 180 degrees)
  const largeArc = percentage > 50 ? 1 : 0;

  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

/**
 * Generate gradient definitions for pie chart
 */
function generateGradients(): string {
  return `
    <defs>
      <linearGradient id="gradient_blue" x1="0" y1="0" x2="0" y2="122" gradientUnits="userSpaceOnUse">
        <stop stop-color="#71BFFF"></stop>
        <stop offset="1" stop-color="#52B1FF"></stop>
      </linearGradient>
      <linearGradient id="gradient_cyan" x1="0.220574" y1="0.441142" x2="0.220574" y2="122" gradientUnits="userSpaceOnUse">
        <stop stop-color="#6CE3E3"></stop>
        <stop offset="1" stop-color="#48DDDD"></stop>
      </linearGradient>
    </defs>
  `;
}

/**
 * Default color palette for pie chart segments
 */
const DEFAULT_COLORS = [
  '#304BD4',
  'url(#gradient_blue)',
  'url(#gradient_cyan)',
  '#5B76FE',
  '#FF896F',
  '#FEBBB2',
  '#B692F6',
  '#D6BBFB',
  '#E9D7FE',
];

/**
 * Legend color indicators (for non-gradient colors)
 */
const LEGEND_COLORS = [
  '#3A5AFE',
  'url(#paint0_linear_legend1)',
  'url(#paint0_linear_legend2)',
  '#5B76FE',
  '#FF896F',
  '#FEBBB2',
  '#B692F6',
  '#D6BBFB',
  '#E9D7FE',
];

export function generatePieChart(data: PieChartData): string {
  // Calculate total for percentages
  const total = data.segments.reduce((sum, seg) => sum + seg.value, 0);

  // Generate pie slices
  let currentAngle = 0;
  const slices = data.segments
    .map((segment, index) => {
      const percentage = (segment.value / total) * 100;
      const color =
        segment.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
      const path = createPieSlice(percentage, currentAngle);
      currentAngle += percentage * 3.6;

      return `<path d="${path}" fill="${color}"></path>`;
    })
    .join('\n');

  // Generate legend items
  const legendItems = data.segments
    .map((segment, index) => {
      const percentage = ((segment.value / total) * 100).toFixed(0);
      const legendColor =
        segment.color || LEGEND_COLORS[index % LEGEND_COLORS.length];

      // For gradient colors in legend, use solid approximation
      const circleColor = legendColor.includes('url(#gradient_blue)')
        ? 'url(#paint0_linear_legend1)'
        : legendColor.includes('url(#gradient_cyan)')
        ? 'url(#paint0_linear_legend2)'
        : legendColor;

      return `
      <div
        style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; position: relative; gap: 8px;"
      >
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style="flex-grow: 0; flex-shrink: 0;"
          preserveAspectRatio="none"
        >
          <circle cx="4" cy="4" r="4" fill="${circleColor}"></circle>
          ${
            circleColor === 'url(#paint0_linear_legend1)'
              ? `
          <defs>
            <linearGradient id="paint0_linear_legend1" x1="0" y1="0" x2="0" y2="8" gradientUnits="userSpaceOnUse">
              <stop stop-color="#71BFFF"></stop>
              <stop offset="1" stop-color="#52B1FF"></stop>
            </linearGradient>
          </defs>
          `
              : ''
          }
          ${
            circleColor === 'url(#paint0_linear_legend2)'
              ? `
          <defs>
            <linearGradient id="paint0_linear_legend2" x1="0.0144639" y1="0.0289274" x2="0.0144639" y2="8" gradientUnits="userSpaceOnUse">
              <stop stop-color="#6CE3E3"></stop>
              <stop offset="1" stop-color="#48DDDD"></stop>
            </linearGradient>
          </defs>
          `
              : ''
          }
        </svg>
        <p style="flex-grow: 0; flex-shrink: 0; font-size: 14px; text-align: left; color: #333643;">
          <span style="flex-grow: 0; flex-shrink: 0; font-size: 14px; text-align: left; color: #333643;">${
            segment.label
          } </span>
          <span style="flex-grow: 0; flex-shrink: 0; font-size: 14px; font-weight: 600; text-align: left; color: #333643;">${percentage}%</span>
        </p>
      </div>
    `;
    })
    .join('\n');

  return `
    <div
      style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; width: 100%; flex-grow: 0; flex-shrink: 0; position: relative; gap: 8px;"
    >
      <p
        style="flex-grow: 0; flex-shrink: 0; width: 100%; font-size: 14px; font-weight: 600; text-align: left; color: #333643;"
      >
        ${data.title}
      </p>
      <div
        style="display: flex; justify-content: center; align-items: center; flex-grow: 0; flex-shrink: 0; width: 100%; height: 122px; position: relative; gap: 16px;"
      >
        <svg
          width="122"
          height="122"
          viewBox="0 0 122 122"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style="flex-grow: 0; flex-shrink: 0; width: 122px; height: 122px; position: relative;"
          preserveAspectRatio="xMidYMid meet"
        >
          ${generateGradients()}
          ${slices}
        </svg>
        <div
          style="display: flex; justify-content: flex-start; align-items: flex-start; flex-grow: 1; gap: 12px;"
        >
          ${legendItems}
        </div>
      </div>
    </div>
  `;
}
