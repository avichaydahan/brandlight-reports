/**
 * Recommended Actions component
 * Displays AI-powered actionable recommendations with sparkle icon
 */

export interface RecommendedAction {
  title: string;
  description: string;
}

export interface RecommendedActionsData {
  actions: RecommendedAction[];
}

export function generateRecommendedActions(
  data: RecommendedActionsData
): string {
  return `
<div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; width: 100%; flex-grow: 0; flex-shrink: 0; gap: 24px;">
  <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; gap: 8px; padding: 1px 0px;">
    <div style="display: flex; justify-content: flex-start; align-items: center; align-self: stretch; flex-grow: 0; flex-shrink: 0; height: 24px; position: relative; gap: 8px;">
      <div style="display: flex; justify-content: flex-start; align-items: flex-start; flex-grow: 0; flex-shrink: 0; width: 24px; height: 24px; position: relative;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="align-self: stretch; flex-grow: 1; position: relative;" preserveAspectRatio="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M10.3641 18.1989C10.222 18.5115 9.77796 18.5115 9.63585 18.1989L7.5 13.5L2.80112 11.3641C2.48848 11.222 2.48848 10.778 2.80112 10.6359L7.5 8.5L9.63585 3.80112C9.77796 3.48848 10.222 3.48848 10.3641 3.80112L12.5 8.5L17.1989 10.6359C17.5115 10.778 17.5115 11.222 17.1989 11.3641L12.5 13.5L10.3641 18.1989ZM18.2731 20.3992C18.1665 20.6336 17.8335 20.6336 17.7269 20.3992L16.75 18.25L14.6008 17.2731C14.3664 17.1665 14.3664 16.8335 14.6008 16.7269L16.75 15.75L17.7269 13.6008C17.8335 13.3664 18.1665 13.3664 18.2731 13.6008L19.25 15.75L21.3992 16.7269C21.6336 16.8335 21.6336 17.1665 21.3992 17.2731L19.25 18.25L18.2731 20.3992Z" fill="url(#paint0_linear_actions)"></path>
          <defs>
            <linearGradient id="paint0_linear_actions" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
              <stop stop-color="#415FF6"></stop>
              <stop offset="1" stop-color="#8599FF"></stop>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <p style="flex-grow: 0; flex-shrink: 0; font-size: 14px; text-align: left;">
        <span style="flex-grow: 0; flex-shrink: 0; font-size: 14px; font-weight: 700; text-align: left; color: #0c1233;">Recommended actions </span>
        <span style="flex-grow: 0; flex-shrink: 0; font-size: 14px; text-align: left; color: #666976;">(${
          data.actions.length
        })</span>
      </p>
    </div>
    ${data.actions
      .map(
        (action) => `
    <div style="display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; border-radius: 8px; background: #fff; border: 1px solid #ebecf1;">
      <div style="display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end; align-self: stretch; flex-grow: 0; flex-shrink: 0; gap: 8px; padding: 16px;">
        <div style="display: flex; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; gap: 12px;">
          <div style="display: flex; justify-content: center; align-items: center; flex-grow: 0; flex-shrink: 0; width: 20px; height: 20px; position: relative; gap: 10px;">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-grow: 0; flex-shrink: 0; width: 12px; height: 12px; position: relative;" preserveAspectRatio="none">
              <circle cx="6" cy="6" r="5" fill="#3A5AFE"></circle>
            </svg>
          </div>
          <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; flex-grow: 1; position: relative; gap: 10px;">
            <p style="align-self: stretch; flex-grow: 0; flex-shrink: 0; width: 100%; font-size: 14px; font-weight: 700; text-align: left; color: #0c1233;">
              ${action.title}
            </p>
            <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; gap: 12px;">
              <div style="display: flex; justify-content: flex-start; align-items: center; align-self: stretch; flex-grow: 0; flex-shrink: 0; position: relative; gap: 8px;">
                <p style="flex-grow: 1; width: 100%; font-size: 12px; text-align: left; color: #0c1233;">
                  ${action.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
      )
      .join('')}
  </div>
</div>
  `;
}
