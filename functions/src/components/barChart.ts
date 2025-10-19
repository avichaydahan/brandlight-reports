export interface DomainData {
  name: string;
  value: number;
  icon: string;
}

export interface BarChartProps {
  data: DomainData[];
}

export function BarChart({ data }: BarChartProps): string {
  // Validate that data is provided
  if (!data || data.length === 0) {
    throw new Error(
      'BarChart: data is required and must contain at least one domain'
    );
  }

  const chartData = data;
  const maxValue = Math.max(...chartData.map((item) => item.value));

  return `
<div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; width: 100%; flex-grow: 0; flex-shrink: 0; position: relative; gap: 24px;">
  <p style="align-self: stretch; flex-grow: 0; flex-shrink: 0; width: 100%; font-size: 16px; font-weight: 600; text-align: left; color: #333643;">
    Domains by influence score
  </p>
  <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; gap: 0;">
    <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: center; align-self: stretch; flex-grow: 0; flex-shrink: 0; position: relative;">
      
      <!-- Chart area with bars -->
      <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; position: relative; height: 232px;">
        <!-- Grid lines -->
        <div style="display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; height: 200px; position: absolute; top: 0; left: 0; right: 0;">
          <div style="height: 1px; width: 100%; background: #F0F1F5;"></div>
          <div style="height: 1px; width: 100%; background: #F0F1F5;"></div>
          <div style="height: 1px; width: 100%; background: #F0F1F5;"></div>
          <div style="height: 1px; width: 100%; background: #F0F1F5;"></div>
          <div style="height: 1px; width: 100%; background: #F0F1F5;"></div>
          <div style="height: 1px; width: 100%; background: #EBECF1;"></div>
        </div>
        
        <!-- Bars -->
        <div style="display: flex; justify-content: space-around; align-items: flex-end; align-self: stretch; height: 200px; position: relative;">
          ${chartData
            .map((item) => {
              const barHeight = Math.round((item.value / maxValue) * 180); // Adjusted max height

              return `
              <div style="display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 4px;">
                <p style="font-size: 12px; text-align: center; color: #666976; margin: 0; line-height: 1;">
                  ${item.value}%
                </p>
                <div style="display: flex; align-items: flex-end; justify-content: center; width: 24px;">
                  <div style="width: 24px; height: ${barHeight}px; background: #5B76FE; border-radius: 2px 2px 0 0;"></div>
                </div>
              </div>
          `;
            })
            .join('')}
        </div>
      </div>
      
      <!-- Icons at bottom -->
      <div style="display: flex; justify-content: space-around; align-items: center; align-self: stretch; flex-grow: 0; flex-shrink: 0; margin-top: 0px;">
        ${chartData
          .map((item) => {
            const domain = item.icon;

            // Use Google's favicon service with sz parameter for better quality
            // The sz=64 parameter requests a higher resolution favicon
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

            return `
        <div style="flex-grow: 0; flex-shrink: 0; width: 24px; height: 24px; position: relative; overflow: hidden; border-radius: 50px; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">
          <img 
            src="${faviconUrl}" 
            alt="${item.name} favicon" 
            style="width: 16px; height: 16px; object-fit: contain; display: block;"
          />
        </div>
        `;
          })
          .join('')}
      </div>
    </div>
  </div>
</div>
  `;
}
