/**
 * Header component for single domain report
 * Displays domain logo, name, report type, and time period
 */
export function generateHeaderSingleDomain(data) {
    return `
    <div
      style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; width: 100%; gap: 16px; padding-left: 24px; padding-right: 24px; padding-bottom: 16px; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 1px; border-left-width: 0px; border-color: #ebecf1; padding-top: 80px;"
    >
      <div
        style="display: flex; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; position: relative; gap: 8px;"
      >
        <div
          style="flex-grow: 0; flex-shrink: 0; width: 40px; height: 40px; position: relative; overflow: hidden; border-radius: 50px;"
        >
          <img
            src="${data.domainLogo}"
            style="width: 40px; height: 40px; position: absolute; left: -1px; top: -1px; object-fit: cover;"
          />
        </div>
        <div
          style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 1; position: relative;"
        >
          <div
            style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; position: relative; gap: 8px;"
          >
            <p
              style="flex-grow: 0; flex-shrink: 0; font-size: 16px; font-weight: 600; text-align: left; color: #0c1233;"
            >
              ${data.domainName}
            </p>
          </div>
          <p style="flex-grow: 0; flex-shrink: 0; font-size: 12px; text-align: left; color: #0c1233;">
            Influence report
          </p>
        </div>
        <div
          style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; overflow: hidden; padding-left: 4px; padding-right: 4px; padding-top: 2px; padding-bottom: 2px; border-radius: 100px; background: #f5f5f8;"
        >
          <div
            style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; flex-grow: 0; flex-shrink: 0; position: relative; padding-left: 6px; padding-right: 6px;"
          >
            <p
              style="flex-grow: 0; flex-shrink: 0; font-size: 13px; text-align: left; color: rgba(0,0,0,0.87);"
            >
              Time period: ${data.timePeriod}
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}
