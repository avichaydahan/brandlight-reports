import { ReportData } from '../types/index.js';

export function generateHTML(data: ReportData): string {
  return `
<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${data.title}</title>
  <style>
    body { 
      font-family: 'Arial', sans-serif;
      color: #374151;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    .cover { 
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #fff; 
      padding: 80px 40px; 
      text-align: center;
      min-height: 100vh;
    }
    .title { font-size: 48px; font-weight: 800; margin-bottom: 20px; }
    .section { margin: 60px 40px; padding: 30px; }
    .page { page-break-after: always; }
    .chart-placeholder {
      background: #f0fdf4;
      border: 2px dashed #bbf7d0;
      border-radius: 8px;
      padding: 40px;
      text-align: center;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="cover page">
    <div class="title">${data.title}</div>
    <div>Report Type: D - Executive Summary</div>
  </div>
  <div class="section page">
    <h1>Executive Summary</h1>
    <p>This report provides an executive overview of key metrics and insights.</p>
    <div class="chart-placeholder">{{CHART_1}}</div>
  </div>
</body>
</html>
  `;
}
