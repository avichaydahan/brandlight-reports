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
  <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; gap: 8px; padding: 12px; border-radius: 12px; background: #fff; border: 1px solid #ebecf1;">
    <div style="display: flex; justify-content: flex-start; align-items: center; align-self: stretch; flex-grow: 0; flex-shrink: 0; gap: 8px;">
      <div style="display: flex; justify-content: flex-start; align-items: flex-start; flex-grow: 1; position: relative; gap: 4px;">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-grow: 0; flex-shrink: 0; width: 20px; height: 20px; position: relative;" preserveAspectRatio="xMidYMid meet">
          <path d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z" fill="white"></path>
          <path d="M18.75 9.08417H13.4189L18.0357 6.41833L17.1201 4.83167L12.5028 7.4975L15.1678 2.88042L13.5816 1.96458L10.9161 6.5805V1.25H9.08389V6.58108L6.41836 1.96458L4.83164 2.88042L7.49658 7.49633L2.88046 4.83167L1.96435 6.41833L6.58106 9.08417H1.25V10.9164H6.58047L1.96435 13.5823L2.87987 15.1689L7.49717 12.5031L4.83164 17.1202L6.41778 18.036L9.08389 13.4195V18.75H10.9161V13.3052L13.6306 18.0068L15.1182 17.1482L12.4031 12.4453L17.119 15.1683L18.0351 13.5817L13.4189 10.9158H18.7494V9.08417H18.75V9.08417ZM10 12.4908C9.67293 12.4909 9.34906 12.4265 9.04687 12.3013C8.74468 12.1761 8.4701 11.9926 8.2388 11.7613C8.0075 11.53 7.82402 11.2554 7.69882 10.9531C7.57362 10.6509 7.50916 10.3269 7.50912 9.99971C7.50908 9.67253 7.57347 9.34855 7.69859 9.04626C7.82372 8.74397 8.00715 8.4693 8.23839 8.23793C8.46964 8.00655 8.74418 7.823 9.04633 7.69776C9.34849 7.57252 9.67235 7.50804 9.99942 7.508C10.66 7.50792 11.2935 7.77034 11.7606 8.23751C12.2277 8.70469 12.4902 9.33836 12.4903 9.99912C12.4904 10.6599 12.228 11.2936 11.761 11.7609C11.294 12.2282 10.6605 12.4908 10 12.4908V12.4908Z" fill="#625DF5"></path>
        </svg>
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
