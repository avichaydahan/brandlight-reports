export function generateTemplate(data: any): string {
  const {
    summary = {},
    timeperiod = 'Jul 30, 2025 - Aug 30, 2025',
    engines = 'All',
    category = 'All',
  } = data;

  const {
    totalSourcesUsed = 71,
    totalSourcesChange = 2,
    totalImpressions = '2.3M',
    totalImpressionsChange = 1200,
    newContentSources = 12,
    newContentSourcesChange = -6,
    citedSources = 180,
    synthesizedSources = 360,
    crawledSources = 72,
    ignoredByAI = 588,
    comparisonCitations = 15.7,
    directQuotes = 36.8,
    paragraphMentions = 47.5,
  } = summary;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>My Content Report</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #fff;
          padding: 40px;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e5e5;
        }
        
        .title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
        }
        
        .page-info {
          color: #666;
          font-size: 14px;
        }
        
        .report-meta {
          display: flex;
          gap: 40px;
          margin-bottom: 40px;
          font-size: 14px;
          color: #666;
        }
        
        .report-meta span {
          font-weight: 600;
        }
        
        .section-title {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 30px;
          color: #1a1a1a;
        }
        
        .charts-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        
        .chart-container {
          text-align: center;
        }
        
        .chart-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1a1a1a;
        }
        
        .chart-subtitle {
          font-size: 12px;
          color: #666;
          margin-bottom: 20px;
        }
        
        .donut-chart {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 0 auto 20px;
        }
        
        .donut-chart svg {
          width: 100%;
          height: 100%;
        }
        
        .chart-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }
        
        .chart-center-label {
          font-size: 12px;
          color: #666;
        }
        
        .chart-center-value {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
        }
        
        .legend {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
          margin-top: 20px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
        }
        
        .legend-label {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        .legend-value {
          font-weight: 600;
          color: #666;
        }
        
        .metrics-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-bottom: 40px;
        }
        
        .metric-card {
          background: #f8f9fa;
          padding: 24px;
          border-radius: 8px;
          text-align: left;
        }
        
        .metric-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
        }
        
        .metric-value {
          font-size: 36px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 4px;
        }
        
        .metric-change {
          font-size: 14px;
          font-weight: 600;
        }
        
        .metric-change.positive {
          color: #059669;
        }
        
        .metric-change.negative {
          color: #dc2626;
        }
        
        .chart-section {
          margin-top: 40px;
        }
        
        .line-chart {
          width: 100%;
          height: 300px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-top: 20px;
          position: relative;
          padding: 20px;
        }
        
        .chart-legend {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          font-size: 14px;
        }
        
        .footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #1a1a2e;
          color: white;
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }
        
        .footer .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
        }
        
        .footer .logo::before {
          content: "✦";
          font-size: 16px;
        }
        
        @media print {
          body { margin: 0; padding: 20px; }
          .footer { position: static; margin-top: 40px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="title">My Content Report</h1>
        <div class="page-info">Page 1 of 3</div>
      </div>
      
      <div class="report-meta">
        <div>Time period: <span>${timeperiod}</span></div>
        <div>Engines: <span>${engines}</span></div>
        <div>Category: <span>${category}</span></div>
      </div>
      
      <h2 class="section-title">Summary</h2>
      
      <div class="charts-row">
        <div class="chart-container">
          <h3 class="chart-title">How AI engines use your content</h3>
          <p class="chart-subtitle">Breakdown of your content's role in AI responses</p>
          <div class="donut-chart">
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" stroke-width="40"/>
              <circle cx="100" cy="100" r="80" fill="none" stroke="#3b82f6" stroke-width="40" 
                      stroke-dasharray="150 251" stroke-dashoffset="0" transform="rotate(-90 100 100)"/>
              <circle cx="100" cy="100" r="80" fill="none" stroke="#10b981" stroke-width="40" 
                      stroke-dasharray="113 251" stroke-dashoffset="-150" transform="rotate(-90 100 100)"/>
              <circle cx="100" cy="100" r="80" fill="none" stroke="#f59e0b" stroke-width="40" 
                      stroke-dasharray="23 251" stroke-dashoffset="-263" transform="rotate(-90 100 100)"/>
            </svg>
            <div class="chart-center">
              <div class="chart-center-label">All sources</div>
              <div class="chart-center-value">1,200</div>
            </div>
          </div>
          <div class="legend">
            <div class="legend-item">
              <div class="legend-label">
                <div class="legend-dot" style="background: #3b82f6;"></div>
                Cited sources
              </div>
              <div class="legend-value">${citedSources} 15%</div>
            </div>
            <div class="legend-item">
              <div class="legend-label">
                <div class="legend-dot" style="background: #10b981;"></div>
                Synthesized sources
              </div>
              <div class="legend-value">${synthesizedSources} 30%</div>
            </div>
            <div class="legend-item">
              <div class="legend-label">
                <div class="legend-dot" style="background: #f59e0b;"></div>
                Crawled sources
              </div>
              <div class="legend-value">${crawledSources} 6%</div>
            </div>
            <div class="legend-item">
              <div class="legend-label">
                <div class="legend-dot" style="background: #e5e7eb;"></div>
                Ignored by AI
              </div>
              <div class="legend-value">${ignoredByAI} 49%</div>
            </div>
          </div>
        </div>
        
        <div class="chart-container">
          <h3 class="chart-title">Where & how your brand appears in AI</h3>
          <p class="chart-subtitle">Breakdown of AI mentions by answer format</p>
          <div class="donut-chart">
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#3b82f6" stroke-width="40" 
                      stroke-dasharray="59 251" stroke-dashoffset="0" transform="rotate(-90 100 100)"/>
              <circle cx="100" cy="100" r="80" fill="none" stroke="#10b981" stroke-width="40" 
                      stroke-dasharray="138 251" stroke-dashoffset="-59" transform="rotate(-90 100 100)"/>
              <circle cx="100" cy="100" r="80" fill="none" stroke="#06b6d4" stroke-width="40" 
                      stroke-dasharray="178 251" stroke-dashoffset="-197" transform="rotate(-90 100 100)"/>
            </svg>
          </div>
          <div class="legend">
            <div class="legend-item">
              <div class="legend-label">
                <div class="legend-dot" style="background: #3b82f6;"></div>
                Comparison citations
              </div>
              <div class="legend-value">${comparisonCitations}% +2%</div>
            </div>
            <div class="legend-item">
              <div class="legend-label">
                <div class="legend-dot" style="background: #10b981;"></div>
                Direct quotes
              </div>
              <div class="legend-value">${directQuotes}% +2%</div>
            </div>
            <div class="legend-item">
              <div class="legend-label">
                <div class="legend-dot" style="background: #06b6d4;"></div>
                Paragraph mentions
              </div>
              <div class="legend-value">${paragraphMentions}%</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="metrics-row">
        <div class="metric-card">
          <div class="metric-label">Total sources used by AI</div>
          <div class="metric-value">${totalSourcesUsed}%</div>
          <div class="metric-change positive">↑ ${totalSourcesChange}%</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Total est. impressions</div>
          <div class="metric-value">${totalImpressions}</div>
          <div class="metric-change positive">↑ ${totalImpressionsChange}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label"># of new content sources</div>
          <div class="metric-value">${newContentSources}</div>
          <div class="metric-change negative">↓ ${Math.abs(
            newContentSourcesChange
          )}</div>
        </div>
      </div>
      
      <div class="chart-section">
        <h3 class="chart-title">Total sources % used by AI</h3>
        <div class="chart-legend">
          <div class="legend-label">
            <div class="legend-dot" style="background: #f59e0b;"></div>
            Last 30 days
          </div>
          <div class="legend-label">
            <div class="legend-dot" style="background: #3b82f6;"></div>
            Previous period
          </div>
        </div>
        <div class="line-chart">
          <svg width="100%" height="100%" viewBox="0 0 800 260">
            <!-- Grid lines -->
            <g stroke="#e5e7eb" stroke-width="1">
              <line x1="60" y1="40" x2="740" y2="40"/>
              <line x1="60" y1="80" x2="740" y2="80"/>
              <line x1="60" y1="120" x2="740" y2="120"/>
              <line x1="60" y1="160" x2="740" y2="160"/>
              <line x1="60" y1="200" x2="740" y2="200"/>
            </g>
            
            <!-- Y-axis labels -->
            <g fill="#666" font-size="12" text-anchor="end">
              <text x="55" y="45">80%</text>
              <text x="55" y="85">60%</text>
              <text x="55" y="125">40%</text>
              <text x="55" y="165">20%</text>
            </g>
            
            <!-- X-axis labels -->
            <g fill="#666" font-size="12" text-anchor="middle">
              <text x="140" y="230">Apr 4</text>
              <text x="260" y="230">Apr 11</text>
              <text x="380" y="230">Apr 18</text>
              <text x="500" y="230">Apr 25</text>
              <text x="620" y="230">May 1</text>
            </g>
            
            <!-- Previous period line (blue) -->
            <polyline points="60,180 140,175 200,170 260,165 320,155 380,140 440,150 500,145 560,140 620,120 680,110 740,95" 
                      fill="none" stroke="#3b82f6" stroke-width="3"/>
            
            <!-- Last 30 days line (orange) -->
            <polyline points="60,120 140,115 200,115 260,110 320,105 380,100 440,105 500,110 560,105 620,100 680,95 740,85" 
                      fill="none" stroke="#f59e0b" stroke-width="3"/>
          </svg>
        </div>
      </div>
    </body>
    </html>
  `;
}
