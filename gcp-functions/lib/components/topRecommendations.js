export function TopRecommendations({ recommendations }) {
    if (!recommendations?.length) {
        throw new Error('TopRecommendations: recommendations array is required and must contain at least one recommendation');
    }
    const topThree = recommendations.slice(0, 3);
    const renderRecommendation = (rec) => `
    <div style="display: flex; align-items: flex-start; gap: 12px; padding: 12px; border-radius: 10px; background: #fafafb; page-break-inside: avoid;">
      <span style="font-size: 16px;">🔥</span>
      <div style="flex: 1;">
        <p style="font-size: 12px; font-weight: 700; color: #0c1233; margin: 0 0 4px 0;">${rec.title}</p>
        <p style="font-size: 12px; color: #0c1233; margin: 0;">${rec.description}</p>
      </div>
    </div>
  `;
    return `
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <p style="font-size: 16px; font-weight: 600; color: #333643; margin: 0;">
        Top partnership recommendations
      </p>
      ${topThree.map(renderRecommendation).join('')}
    </div>
  `;
}
