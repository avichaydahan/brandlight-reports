const priorityConfig = {
    high: { color: '#EF476F', label: 'High priority' },
    medium: { color: '#FFD166', label: 'Medium priority' },
    low: { color: '#06D6A0', label: 'Low priority' },
};
export function AllRecommendations({ recommendations, totalCount }) {
    if (!recommendations?.length) {
        throw new Error('AllRecommendations: recommendations array is required and must contain at least one recommendation');
    }
    const renderPriorityBadge = (priority) => {
        const { color, label } = priorityConfig[priority];
        return `
      <div style="display: flex; align-items: center; gap: 4px; padding: 2px 6px; border-radius: 6px; background: #fff; border: 1px solid #ebecf1;">
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="4" cy="4" r="3" fill="${color}"/>
        </svg>
        <span style="font-size: 8px; font-weight: 500; color: ${color};">${label}</span>
      </div>
    `;
    };
    const renderRecommendation = (rec) => `
    <div style="display: flex; flex-direction: column; gap: 8px; padding: 12px; border-radius: 12px; background: #fff; border: 1px solid #ebecf1; page-break-inside: avoid;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 4px;">
          <div style="width: 20px; height: 20px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; overflow: hidden;">
            <img src="https://www.google.com/s2/favicons?domain=${rec.domain}&sz=64" alt="${rec.domain}" style="width: 16px; height: 16px; object-fit: contain;"/>
          </div>
          <span style="font-size: 10px; font-weight: 600; color: #0c1233;">${rec.domain}</span>
        </div>
        ${renderPriorityBadge(rec.priority)}
      </div>
      <div>
        <p style="font-size: 12px; font-weight: 700; color: #0c1233; margin: 0 0 2px 0;">${rec.title}</p>
        <p style="font-size: 12px; color: #666976; margin: 0;">${rec.description}</p>
      </div>
    </div>
  `;
    return `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <p style="font-size: 16px; font-weight: 600; color: #333643; margin: 0;">
        All recommendations (${totalCount})
      </p>
      ${recommendations.map(renderRecommendation).join('')}
    </div>
  `;
}
