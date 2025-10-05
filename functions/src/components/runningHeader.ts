export interface RunningHeaderProps {
  title: string;
  pageInfo?: string;
  timeperiod?: string;
  engines?: string;
  category?: string;
}

export function RunningHeader({
  title,
  pageInfo = 'Page 1 of 3',
  timeperiod,
  engines = 'All',
  category = 'All',
}: RunningHeaderProps): string {
  return `
    <div class="running-header" style="z-index: 998;">
      <div
        style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; flex-grow: 0; flex-shrink: 0; gap: 8px;"
      >
        <div
          style="display: flex; justify-content: flex-start; align-items: flex-start; flex-grow: 0; flex-shrink: 0; width: 100%; height: 20px; position: relative; gap: 8px;"
        >
          <p
            style="flex-grow: 1; width: 270px; font-size: 16px; font-weight: 700; text-align: left; color: #333643;"
          >
            ${title}
          </p>
          <p style="flex-grow: 1; width: 270px; font-size: 12px; text-align: right; color: #333643;">
            ${pageInfo}
          </p>
        </div>
        <div
          style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; flex-grow: 0; flex-shrink: 0; width: 548px; gap: 8px;"
        >
          <div
            style="display: flex; justify-content: flex-start; align-items: flex-start; align-self: stretch; flex-grow: 0; flex-shrink: 0; gap: 10px;"
          >
            <div
              style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 1; height: 40px; overflow: hidden; gap: 6px; padding-top: 8px; padding-bottom: 8px; background: #fff;"
            >
              ${
                timeperiod
                  ? `
              <div
                style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; overflow: hidden; padding-left: 4px; padding-right: 4px; padding-top: 2px; padding-bottom: 2px; border-radius: 100px; background: #f5f5f8;"
              >
                <div
                  style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; flex-grow: 0; flex-shrink: 0; position: relative; padding-left: 6px; padding-right: 6px;"
                >
                  <p
                    style="flex-grow: 0; flex-shrink: 0; font-size: 13px; text-align: left; color: rgba(0,0,0,0.87);"
                  >
                    Time period: ${timeperiod}
                  </p>
                </div>
              </div>
              `
                  : ''
              }
              <div
                style="display: flex; justify-content: flex-start; align-items: center; flex-grow: 0; flex-shrink: 0; overflow: hidden; padding-left: 4px; padding-right: 4px; padding-top: 2px; padding-bottom: 2px; border-radius: 100px; background: #f5f5f8;"
              >
                <div
                  style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; flex-grow: 0; flex-shrink: 0; position: relative; padding-left: 6px; padding-right: 6px;"
                >
                  <p
                    style="flex-grow: 0; flex-shrink: 0; font-size: 13px; text-align: left; color: rgba(0,0,0,0.87);"
                  >
                    Engines: ${engines}
                  </p>
                </div>
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
                    Category: ${category}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
