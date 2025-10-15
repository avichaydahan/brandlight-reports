export interface RecommendationItem {
  domain: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
}

export interface AllRecommendationsProps {
  recommendations: RecommendationItem[];
  totalCount: number;
}

export function AllRecommendations({
  recommendations,
  totalCount,
}: AllRecommendationsProps): string {
  // Validate that data is provided
  if (!recommendations || recommendations.length === 0) {
    throw new Error(
      'AllRecommendations: recommendations array is required and must contain at least one recommendation'
    );
  }

  // Priority colors and labels
  const priorityConfig = {
    high: { color: '#EF476F', label: 'High priority' },
    medium: { color: '#FFD166', label: 'Medium priority' },
    low: { color: '#06D6A0', label: 'Low priority' },
  };

  return `
<div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; position: relative; gap: 8px;">
  <p style="align-self: stretch; flex-grow: 0; flex-shrink: 0; font-size: 16px; font-weight: 600; text-align: left; color: #333643;">
    All recommendations (${totalCount})
  </p>
  ${recommendations
    .map((rec) => {
      const priorityInfo = priorityConfig[rec.priority];
      return `
  <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; gap: 8px; padding: 12px; border-radius: 12px; background: #fff; border: 1px solid #ebecf1; page-break-inside: avoid;">
    <div style="display: flex; justify-content: flex-start; align-items: center; align-self: stretch; flex-grow: 0; flex-shrink: 0; gap: 8px;">
      <div style="display: flex; justify-content: flex-start; align-items: flex-start; flex-grow: 1; position: relative; gap: 4px;">
        <div style="flex-grow: 0; flex-shrink: 0; width: 20px; height: 20px; position: relative; overflow: hidden; border-radius: 50px; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">
          <img 
            src="https://www.google.com/s2/favicons?domain=${rec.domain}&sz=64" 
            alt="${rec.domain}" 
            style="width: 16px; height: 16px; object-fit: contain; display: block;"
          />
        </div>
        <p style="flex-grow: 0; flex-shrink: 0; font-size: 10px; font-weight: 600; text-align: left; color: #0c1233;">
          ${rec.domain}
        </p>
      </div>
      <div style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; position: relative; gap: 4px; padding: 2px 6px; border-radius: 6px; background: #fff; border: 1px solid #ebecf1;">
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-grow: 0; flex-shrink: 0; width: 8px; height: 8px; position: relative;" preserveAspectRatio="xMidYMid meet">
          <path d="M7 5.73205C7.6188 4.66025 7.6188 3.33975 7 2.26795C6.3812 1.19615 5.2376 0.535898 4 0.535898C2.7624 0.535898 1.6188 1.19615 1 2.26795C0.381198 3.33975 0.381198 4.66025 1 5.73205C1.6188 6.80385 2.7624 7.4641 4 7.4641C5.2376 7.4641 6.3812 6.80385 7 5.73205Z" fill="${priorityInfo.color}"></path>
        </svg>
        <p style="flex-grow: 0; flex-shrink: 0; font-size: 8px; font-weight: 500; text-align: center; color: ${priorityInfo.color};">
          ${priorityInfo.label}
        </p>
      </div>
    </div>
    <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; position: relative; gap: 2px;">
      <p style="align-self: stretch; flex-grow: 0; flex-shrink: 0; font-size: 12px; font-weight: 700; text-align: left; color: #0c1233;">
        ${rec.title}
      </p>
      <p style="align-self: stretch; flex-grow: 0; flex-shrink: 0; font-size: 12px; text-align: left; color: #666976;">
        ${rec.description}
      </p>
    </div>
  </div>
  `;
    })
    .join('')}
</div>
  `;
}
