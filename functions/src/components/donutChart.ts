export interface CategoryData {
  category: string;
  percentage: number;
  domains: string;
  color: string;
}

export interface DonutChartProps {
  data?: CategoryData[];
}

export function DonutChart({ data }: DonutChartProps): string {
  // Default sample data matching the design
  const defaultData: CategoryData[] = [
    {
      category: 'Category name',
      percentage: 35,
      domains: '1.2k domains',
      color: '#3A5AFE',
    },
    {
      category: 'Category name',
      percentage: 21,
      domains: '1.2k domains',
      color: '#7FE1D8',
    },
    {
      category: 'Category name',
      percentage: 12,
      domains: '1.2k domains',
      color: '#9D84FE',
    },
    {
      category: 'Category name',
      percentage: 25,
      domains: '1.2k domains',
      color: '#FF896F',
    },
    {
      category: 'Category name',
      percentage: 25,
      domains: '1.2k domains',
      color: '#F8BC3C',
    },
    {
      category: 'Other',
      percentage: 25,
      domains: '1.2k domains',
      color: '#EBECF1',
    },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  return `
<div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; position: relative; gap: 24px;">
  <p style="align-self: stretch; flex-grow: 0; flex-shrink: 0; width: 100%; font-size: 16px; font-weight: 600; text-align: left; color: #333643;">
    Influence % by domain type
  </p>
  <div style="display: flex; justify-content: space-between; align-items: center; align-self: stretch; flex-grow: 0; flex-shrink: 0; position: relative;">
    <div style="flex-grow: 0; flex-shrink: 0; width: 242px; height: 242px; position: relative;">
      <svg width="232" height="232" viewBox="0 0 168 168" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 232px; height: 232px; position: absolute; left: 12px; top: 12px;" preserveAspectRatio="none">
        <path d="M84 8C95.9936 8 107.817 10.8385 118.503 16.2835C129.19 21.7285 138.436 29.6253 145.485 39.3283" stroke="#3A5AFE" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M153.984 54.3649C158.346 64.6666 160.38 75.8044 159.941 86.9831C159.502 98.1617 156.601 109.106 151.444 119.033C146.287 128.961 139.002 137.628 130.108 144.415C121.215 151.203 110.933 155.943 99.9966 158.298" stroke="#7FE1D8" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M79.6831 159.877C73.318 159.515 67.0238 158.354 60.9488 156.42" stroke="#9D84FE" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M42.5739 147.717C37.2289 144.242 32.3423 140.109 28.0294 135.414" stroke="#FF896F" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M17.1542 47.8366C22.1536 38.5956 29.0147 30.4917 37.3044 24.0364C45.594 17.5812 55.1321 12.9148 65.3163 10.3321" stroke="#EBECF1" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M16.8308 119.559C8.04892 102.971 5.71604 83.7195 10.2815 65.5138" stroke="#FFD166" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      <div style="position: absolute; left: 50%; top: 50%; transform: translate(-42%, -50%); display: flex; flex-direction: column; gap: 0;">
        <div style="font-size: 52px; font-weight: 600; text-align: center; color: #0c1233;">
          96%
        </div>
        <div style="font-size: 15px; text-align: center; color: #666976; margin-top: -8px;">
          16,569 domains
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
            item.category === 'Other' ? '14px' : '7px'
          }; position: absolute; left: -1px; top: -1px; background: ${
            item.color
          };"></div>
        </div>
        <div style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 1; position: relative; gap: 4px;">
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 14px; text-align: left; color: #333643;">
            ${item.category}
          </p>
        </div>
        <div style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; position: relative; gap: 6px;">
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 16px; font-weight: 600; text-align: right; color: #333643;">
            ${item.percentage}%
          </p>
          <svg width="3" height="4" viewBox="0 0 3 4" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-grow: 0; flex-shrink: 0;" preserveAspectRatio="none">
            <circle cx="1.92737" cy="2" r="1.07263" fill="#666976"></circle>
          </svg>
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 14px; text-align: right; color: #333643;">
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
