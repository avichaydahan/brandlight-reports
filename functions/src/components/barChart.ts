export interface DomainData {
  name: string;
  value: number;
  icon: string;
}

export interface BarChartProps {
  data: DomainData[];
}

const CHART_HEIGHT = 200;
const BAR_MAX_HEIGHT = 180;

export function BarChart({ data }: BarChartProps): string {
  if (!data?.length) {
    throw new Error('BarChart: data is required and must contain at least one domain');
  }

  const maxValue = Math.max(...data.map((item) => item.value));

  const renderGridLines = () => 
    Array(6).fill(0).map((_, i) => 
      `<div style="height: 1px; width: 100%; background: ${i === 5 ? '#EBECF1' : '#F0F1F5'};"></div>`
    ).join('');

  const renderBar = (item: DomainData) => {
    const barHeight = Math.round((item.value / maxValue) * BAR_MAX_HEIGHT);
    return `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
        <span style="font-size: 12px; color: #666976;">${item.value}%</span>
        <div style="width: 24px; height: ${barHeight}px; background: #5B76FE; border-radius: 2px 2px 0 0;"></div>
      </div>
    `;
  };

  const renderIcon = (item: DomainData) => `
    <div style="width: 24px; height: 24px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; overflow: hidden;">
      <img src="https://www.google.com/s2/favicons?domain=${item.icon}&sz=64" alt="${item.name}" style="width: 16px; height: 16px; object-fit: contain;"/>
    </div>
  `;

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
      <p style="font-size: 16px; font-weight: 600; color: #333643; margin: 0;">
        Domains by influence score
      </p>
      
      <div style="position: relative; height: ${CHART_HEIGHT + 32}px;">
        <!-- Grid lines -->
        <div style="position: absolute; top: 0; left: 0; right: 0; height: ${CHART_HEIGHT}px; display: flex; flex-direction: column; justify-content: space-between;">
          ${renderGridLines()}
        </div>
        
        <!-- Bars -->
        <div style="position: relative; height: ${CHART_HEIGHT}px; display: flex; justify-content: space-around; align-items: flex-end;">
          ${data.map(renderBar).join('')}
        </div>
        
        <!-- Icons -->
        <div style="display: flex; justify-content: space-around; align-items: center; margin-top: 8px;">
          ${data.map(renderIcon).join('')}
        </div>
      </div>
    </div>
  `;
}
