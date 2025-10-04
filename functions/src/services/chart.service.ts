import { ChartData } from '../types/index.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('ChartService');

export class ChartService {
  constructor(private width = 800, private height = 600) {}

  async generateChart(chartData: ChartData): Promise<Buffer> {
    try {
      logger.info(
        `Generating ${chartData.type} chart using HTML/Canvas approach`
      );

      // Generate SVG-based chart (can be converted to PNG by Puppeteer)
      const svgChart = this.generateSVGChart(chartData);

      // Convert SVG to Buffer (Puppeteer can handle SVG directly in HTML)
      const buffer = Buffer.from(svgChart, 'utf-8');

      logger.info('Chart generated successfully');
      return buffer;
    } catch (error) {
      logger.error('Failed to generate chart', error as Error);
      throw new Error(
        `Chart generation failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  private generateSVGChart(chartData: ChartData): string {
    const { width, height } = this;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Calculate chart-specific properties
    const maxValue = Math.max(...chartData.data.map((d) => d.value));
    const colors = this.generateColors(
      chartData.data.length,
      chartData.options?.colors
    );

    let chartElements = '';

    switch (chartData.type) {
      case 'bar':
        chartElements = this.generateBarChart(
          chartData.data,
          chartWidth,
          chartHeight,
          maxValue,
          colors
        );
        break;
      case 'pie':
        chartElements = this.generatePieChart(
          chartData.data,
          Math.min(chartWidth, chartHeight),
          colors
        );
        break;
      case 'line':
        chartElements = this.generateLineChart(
          chartData.data,
          chartWidth,
          chartHeight,
          maxValue,
          colors
        );
        break;
      default:
        chartElements = this.generateBarChart(
          chartData.data,
          chartWidth,
          chartHeight,
          maxValue,
          colors
        );
    }

    return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .chart-title { font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; }
            .chart-label { font-family: Arial, sans-serif; font-size: 12px; }
            .chart-axis { stroke: #333; stroke-width: 1; }
          </style>
        </defs>
        
        <!-- Title -->
        ${
          chartData.options?.title
            ? `<text x="${
                width / 2
              }" y="15" text-anchor="middle" class="chart-title">${
                chartData.options.title
              }</text>`
            : ''
        }
        
        <!-- Chart Area -->
        <g transform="translate(${margin.left}, ${margin.top})">
          ${chartElements}
          
          <!-- Axes for non-pie charts -->
          ${
            chartData.type !== 'pie'
              ? `
            <line x1="0" y1="${chartHeight}" x2="${chartWidth}" y2="${chartHeight}" class="chart-axis" />
            <line x1="0" y1="0" x2="0" y2="${chartHeight}" class="chart-axis" />
          `
              : ''
          }
        </g>
        
        <!-- Legend -->
        ${this.generateLegend(chartData.data, colors, width, height)}
      </svg>
    `;
  }

  private generateBarChart(
    data: any[],
    width: number,
    height: number,
    maxValue: number,
    colors: string[]
  ): string {
    const barWidth = (width / data.length) * 0.8;
    const spacing = (width / data.length) * 0.2;

    return data
      .map((item, index) => {
        const barHeight = (item.value / maxValue) * height;
        const x = index * (barWidth + spacing);
        const y = height - barHeight;

        return `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${
          colors[index]
        }" />
        <text x="${x + barWidth / 2}" y="${
          height + 15
        }" text-anchor="middle" class="chart-label">${item.label}</text>
        <text x="${x + barWidth / 2}" y="${
          y - 5
        }" text-anchor="middle" class="chart-label">${item.value}</text>
      `;
      })
      .join('');
  }

  private generatePieChart(
    data: any[],
    radius: number,
    colors: string[]
  ): string {
    const centerX = radius / 2;
    const centerY = radius / 2;
    const chartRadius = radius * 0.4;

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return data
      .map((item, index) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI;
        const startAngle = currentAngle;
        const endAngle = currentAngle + sliceAngle;

        const x1 = centerX + chartRadius * Math.cos(startAngle);
        const y1 = centerY + chartRadius * Math.sin(startAngle);
        const x2 = centerX + chartRadius * Math.cos(endAngle);
        const y2 = centerY + chartRadius * Math.sin(endAngle);

        const largeArc = sliceAngle > Math.PI ? 1 : 0;

        const pathData = [
          `M ${centerX} ${centerY}`,
          `L ${x1} ${y1}`,
          `A ${chartRadius} ${chartRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
          'Z',
        ].join(' ');

        currentAngle += sliceAngle;

        return `<path d="${pathData}" fill="${colors[index]}" stroke="#fff" stroke-width="2" />`;
      })
      .join('');
  }

  private generateLineChart(
    data: any[],
    width: number,
    height: number,
    maxValue: number,
    colors: string[]
  ): string {
    const pointSpacing = width / (data.length - 1);

    const points = data.map((item, index) => {
      const x = index * pointSpacing;
      const y = height - (item.value / maxValue) * height;
      return { x, y };
    });

    // Generate line path
    const pathData = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');

    // Generate elements
    return `
      <path d="${pathData}" fill="none" stroke="${
      colors[0]
    }" stroke-width="3" />
      ${points
        .map(
          (point, index) => `
        <circle cx="${point.x}" cy="${point.y}" r="4" fill="${colors[0]}" />
        <text x="${point.x}" y="${
            height + 15
          }" text-anchor="middle" class="chart-label">${
            data[index].label
          }</text>
      `
        )
        .join('')}
    `;
  }

  private generateLegend(
    data: any[],
    colors: string[],
    width: number,
    height: number
  ): string {
    const legendY = height - 20;
    const itemWidth = 100;

    return data
      .map((item, index) => {
        const x = 20 + index * itemWidth;
        return `
        <rect x="${x}" y="${legendY}" width="12" height="12" fill="${
          colors[index]
        }" />
        <text x="${x + 16}" y="${legendY + 10}" class="chart-label">${
          item.label
        }</text>
      `;
      })
      .join('');
  }

  private generateColors(
    count: number,
    customColors?: string[],
    alpha = 1
  ): string[] {
    if (customColors && customColors.length >= count) {
      return customColors.slice(0, count);
    }

    const defaultColors = [
      '#3B82F6', // Blue
      '#EF4444', // Red
      '#F59E0B', // Yellow
      '#10B981', // Green
      '#8B5CF6', // Purple
      '#F97316', // Orange
      '#06B6D4', // Cyan
      '#84CC16', // Lime
    ];

    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(defaultColors[i % defaultColors.length]);
    }
    return colors;
  }
}
