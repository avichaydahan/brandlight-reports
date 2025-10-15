export interface Recommendation {
  title: string;
  description: string;
}

export interface TopRecommendationsProps {
  recommendations: Recommendation[];
}

export function TopRecommendations({
  recommendations,
}: TopRecommendationsProps): string {
  // Validate that data is provided
  if (!recommendations || recommendations.length === 0) {
    throw new Error(
      'TopRecommendations: recommendations array is required and must contain at least one recommendation'
    );
  }

  // Take only top 3 recommendations
  const topThree = recommendations.slice(0, 3);

  return `
<div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; position: relative; gap: 12px;">
  <p style="align-self: stretch; flex-grow: 0; flex-shrink: 0; font-size: 16px; font-weight: 600; text-align: left; color: #333643;">
    Top partnership recommendations
  </p>
  ${topThree
    .map(
      (rec) => `
  <div style="display: flex; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; gap: 12px; padding: 12px; border-radius: 10px; background: #fafafb; page-break-inside: avoid;">
    <p style="flex-grow: 0; flex-shrink: 0; width: 18.13px; height: 20px; font-size: 16px; font-weight: 700; text-align: center; color: #000;">
      🔥
    </p>
    <div style="display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end; flex-grow: 1; gap: 16px;">
      <div style="display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end; align-self: stretch; flex-grow: 0; flex-shrink: 0; gap: 8px;">
        <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; position: relative;">
          <p style="align-self: stretch; flex-grow: 0; flex-shrink: 0; font-size: 12px; text-align: left; color: #0c1233;">
            <span style="font-size: 12px; font-weight: 700; text-align: left; color: #0c1233;">${rec.title}</span>
          </p>
          <p style="align-self: stretch; flex-grow: 0; flex-shrink: 0; font-size: 12px; text-align: left; color: #0c1233;">
            ${rec.description}
          </p>
        </div>
      </div>
    </div>
  </div>
  `
    )
    .join('')}
</div>
  `;
}
