export function getBaseStyles(): string {
  return `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'DM Sans', sans-serif;
        line-height: 1.6;
        color: #333;
        background: #fff;
        margin: 0 !important;
        padding: 0 !important;
        min-height: 100vh;
        overflow-x: hidden;
      }
      
      html {
        margin: 0 !important;
        padding: 0 !important;
        height: 100%;
      }
      
      /* Cover Page Styles */
      .cover-page {
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        color: white;
        display: flex;
        flex-direction: column;
        position: relative;
        page-break-after: always;
        margin: 0;
        padding: 0;
      }
      
      .cover-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 40px;
        font-size: 14px;
      }
      
      .brandlight-logo {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
      }
      
      .cover-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 0 40px;
        position: relative;
      }
      
      .cover-icons {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
      
      .cover-icon {
        position: absolute;
        width: 80px;
        height: 80px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
      }
      
      .cover-icon-top-left {
        top: 10%;
        left: 15%;
      }
      
      .cover-icon-top-right {
        top: 20%;
        right: 25%;
      }
      
      .cover-icon-bottom {
        bottom: 25%;
        right: 15%;
      }
      
      .cover-title {
        font-size: 48px;
        font-weight: 700;
        margin-bottom: 20px;
        z-index: 2;
        position: relative;
      }
      
      .cover-subtitle {
        font-size: 18px;
        margin-bottom: 40px;
        z-index: 2;
        position: relative;
      }
      
      .cover-timeperiod {
        font-size: 16px;
        opacity: 0.8;
        z-index: 2;
        position: relative;
      }
      
      .cover-footer {
        position: absolute;
        bottom: 80px;
        left: 0;
        z-index: 2;
      }
      
      .cover-date {
        font-size: 16px;
        opacity: 0.8;
      }
      
      .cover-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 40px;
        font-size: 14px;
      }
      
      /* Content Page Styles */
      .content-page {
        padding: 40px;
        min-height: 100vh;
      }
      
      .content-page.first-page {
        padding: 40px;
        min-height: 100vh;
      }
      
      .content-page.subsequent-page {
        padding: 40px;
        min-height: 100vh;
        page-break-before: always;
      }
      
      /* Recommendations page - remove padding when items break across pages */
      .content-page.recommendations-page {
        padding: 40px;
        min-height: 100vh;
        page-break-before: always;
      }
      
      .page-header {
        margin-bottom: 40px;
        padding-bottom: 20px;
        border-bottom: 1px solid #e5e5e5;
      }
      
      /* Hide header on first content page */
      .content-page.first-page .page-header {
        display: none;
      }
      
      /* Show header on subsequent pages */
      .content-page.subsequent-page .page-header {
        display: block;
      }
      
      .header-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      
      .page-title {
        font-size: 28px;
        font-weight: 700;
        color: #1a1a1a;
      }
      
      .page-info {
        color: #666;
        font-size: 14px;
      }
      
      .header-meta {
        display: flex;
        gap: 40px;
        font-size: 14px;
        color: #666;
      }
      
      .meta-item span {
        font-weight: 600;
      }
      
      /* Section Styles */
      .section-title {
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 30px;
        color: #1a1a1a;
      }
      
      /* Summary Cards */
      .summary-cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 30px;
        margin-bottom: 40px;
      }
      
      .summary-card {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 24px;
        text-align: center;
      }
      
      .summary-card-label {
        font-size: 14px;
        color: #666;
        margin-bottom: 8px;
      }
      
      .summary-card-value {
        font-size: 24px;
        font-weight: 700;
        color: #1a1a1a;
      }
      
      .summary-card-value.highlight {
        color: #3b82f6;
      }
      
      /* Chart Styles */
      .charts-section {
        display: flex;
        flex-direction: column;
        gap: 40px;
        margin-top: 40px;
        margin-bottom: 40px;
      }
      
      .chart-container {
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        padding: 24px;
      }
      
      .chart-title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 20px;
        color: #1a1a1a;
      }
      
      /* Donut Chart */
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
      
      .chart-center-value {
        font-size: 32px;
        font-weight: 700;
        color: #1a1a1a;
      }
      
      .chart-center-subtext {
        font-size: 14px;
        color: #666;
      }
      
      .chart-legend {
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
      
      /* Bar Chart */
      .bar-chart {
        width: 100%;
      }
      
      .bar-item {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        font-size: 12px;
      }
      
      .bar-icon {
        width: 24px;
        height: 24px;
        border-radius: 4px;
        margin-right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: white;
        font-weight: 600;
      }
      
      .bar-label {
        min-width: 100px;
        margin-right: 12px;
      }
      
      .bar-visual {
        flex: 1;
        height: 20px;
        background: #f1f5f9;
        border-radius: 10px;
        position: relative;
        margin-right: 8px;
      }
      
      .bar-fill {
        height: 100%;
        border-radius: 10px;
        transition: width 0.3s ease;
      }
      
      .bar-percentage {
        font-weight: 600;
        color: #1a1a1a;
        min-width: 30px;
      }
      
      /* Table Styles */
      .table-section {
        margin-top: 40px;
      }
      
      .table-container {
        overflow-x: auto;
      }
      
      .data-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
      }
      
      .data-table th {
        background: #f8f9fa;
        padding: 12px;
        text-align: left;
        font-weight: 600;
        color: #1a1a1a;
        border-bottom: 1px solid #e5e5e5;
      }
      
      .data-table td {
        padding: 12px;
        border-bottom: 1px solid #f1f5f9;
      }
      
      .data-table tbody tr:hover {
        background: #f8f9fa;
      }
      
      .domain-name {
        color: #3b82f6;
        font-weight: 600;
      }
      
      .influence-score {
        font-weight: 600;
        color: #1a1a1a;
      }
      
      .change-positive {
        color: #059669;
      }
      
      .change-negative {
        color: #dc2626;
      }
      
      /* Footer Styles */
      .page-footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #05041d;
        color: white;
        padding: 1px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        z-index: 1000;
      }
      
      .footer-logo {
        flex-grow: 0;
        flex-shrink: 0;
        width: 92.22px;
        height: 15px;
      }
      
      .footer-text {
        flex-grow: 0;
        flex-shrink: 0;
        font-size: 12px;
        text-align: left;
        color: #fff;
        margin: 0;
      }
      
      .footer-copyright {
        color: #fff;
      }
      
      /* Running Header for all pages except first */
      .running-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: white;
        padding: 24px 40px;
        z-index: 1000;
        display: none; /* Hidden by default */
      }
      
      .running-header .header-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      
      .running-header .page-title {
        font-size: 20px;
        font-weight: 700;
        color: #1a1a1a;
      }
      
      .running-header .page-info {
        color: #666;
        font-size: 12px;
      }
      
      .running-header .header-meta {
        display: flex;
        gap: 30px;
        font-size: 12px;
        color: #666;
      }
      
      .running-header .meta-item span {
        font-weight: 600;
      }
      
      /* Adjust content to account for running header and footer */
      .content-page {
        padding: 80px 40px 80px 40px; /* Top space for header, sides for content, bottom for footer */
        min-height: 100vh; /* Full viewport height */
      }
      
      /* Hide header by default */
      .running-header {
        display: none !important;
      }
      
      /* Show header only on content pages (not on cover page) */
      .content-page .running-header {
        display: block !important;
      }
      
      /* Running Footer for all pages */
      .running-footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #1a1a2e;
        color: white;
        padding: 15px 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        z-index: 1000;
      }

      .running-footer svg {
        height: 16px;
        width: auto;
      }

      .running-footer .footer-text {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
      }
      
      /* Print Styles */
      @media print {
        body { 
          margin: 0; 
          padding: 0; 
        }
        
        .cover-page {
          page-break-after: always;
        }
        
        .content-page {
          page-break-before: auto;
          padding-top: 100px; /* Space for header */
          padding-bottom: 80px; /* Space for footer */
          min-height: calc(100vh - 180px); /* Ensure content doesn't overlap */
        }
        
        /* Recommendations page - no top padding on continuation pages */
        .content-page.recommendations-page {
          padding-top: 100px;
        }
        
        .running-header {
          position: fixed;
          display: block;
        }
        
        .running-footer {
          position: fixed;
          display: flex;
        }
        
        /* Hide header on first page only */
        .cover-page + .running-header {
          display: none !important;
        }
        
        .chart-container, 
        .summary-card, 
        .table-section {
          page-break-inside: avoid;
        }
      }
      
      /* Page setup - no margins for full-width header/footer */
      @page {
        size: A4;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      /* Additional fixes for white space */
      .running-footer {
        margin: 0 !important;
        padding: 15px 40px !important;
        box-sizing: border-box;
      }
      
      /* Ensure no gaps */
      .cover-page, .content-page {
        margin: 0 !important;
        border: none !important;
        outline: none !important;
      }
    </style>
  `;
}
