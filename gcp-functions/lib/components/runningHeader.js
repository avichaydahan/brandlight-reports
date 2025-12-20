export function RunningHeader({ title, timeperiod, engines, category, }) {
    // Format engines array into a readable string
    const enginesText = engines ? engines.join(', ') : '';
    return `
    <div style="z-index: 999; position: fixed; top: 0; left: 0; width: 100%; padding: 24px 40px;">
      <div
        style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; flex-grow: 0; flex-shrink: 0; gap: 14px;"
      >
        <div
          style="display: flex; justify-content: flex-start; align-items: flex-start; flex-grow: 0; flex-shrink: 0; width: 100%; height: 20px; position: relative; gap: 8px;"
        >
          <p
            style="flex-grow: 1; width: 100%; font-size: 20px; font-weight: 700; text-align: left; color: #333643;"
          >
            ${title || ''}
          </p>
        </div>
        ${timeperiod || engines || category
        ? `
        <div
          style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; flex-grow: 0; flex-shrink: 0; width: 100%; gap: 8px;"
        >
          <div
            style="display: flex; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; gap: 10px;"
          >
            <div
              style="display: flex; flex-wrap: wrap; justify-content: flex-start; align-items: center; flex-grow: 1; gap: 6px; padding-top: 8px; padding-bottom: 8px; background: #fff;"
            >
              ${timeperiod
            ? `
              <div
                style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; overflow: hidden; padding-left: 4px; padding-right: 4px; padding-top: 2px; padding-bottom: 2px; border-radius: 100px; background: #f5f5f8;"
              >
                <div
                  style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; flex-grow: 0; flex-shrink: 0; position: relative; padding-left: 6px; padding-right: 6px;"
                >
                  <p
                    style="flex-grow: 0; flex-shrink: 0; font-size: 14px; text-align: left; color: rgba(0,0,0,0.87);"
                  >
                    Time period: ${timeperiod}
                  </p>
                </div>
              </div>
              `
            : ''}
              ${engines
            ? `
              <div
                style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; overflow: hidden; padding-left: 4px; padding-right: 4px; padding-top: 2px; padding-bottom: 2px; border-radius: 100px; background: #f5f5f8;"
              >
                <div
                  style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; flex-grow: 0; flex-shrink: 0; position: relative; padding-left: 6px; padding-right: 6px;"
                >
                  <p
                    style="flex-grow: 0; flex-shrink: 0; font-size: 14px; text-align: left; color: rgba(0,0,0,0.87);"
                  >
                    Engines: ${enginesText}
                  </p>
                </div>
              </div>
              `
            : ''}
              ${category
            ? `
              <div
                style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; overflow: hidden; padding-left: 4px; padding-right: 4px; padding-top: 2px; padding-bottom: 2px; border-radius: 100px; background: #f5f5f8;"
              >
                <div
                  style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; flex-grow: 0; flex-shrink: 0; position: relative; padding-left: 6px; padding-right: 6px;"
                >
                  <p
                    style="flex-grow: 0; flex-shrink: 0; font-size: 14px; text-align: left; color: rgba(0,0,0,0.87);"
                  >
                    Category: ${category}
                  </p>
                </div>
              </div>
              `
            : ''}
            </div>
          </div>
        </div>
        `
        : ''}
      </div>
    </div>
  `;
}
