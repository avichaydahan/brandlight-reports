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
      font-family: 'Roboto', sans-serif;
      color: #1a202c;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    .cover { 
      background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
      color: #fff; 
      padding: 80px 40px; 
      text-align: center;
      min-height: 100vh;
    }
    .title { font-size: 48px; font-weight: 800; margin-bottom: 20px; }
    .section { margin: 60px 40px; padding: 30px; }
    .page { page-break-after: always; }
    .chart-placeholder {
      background: #f7fafc;
      border: 2px dashed #cbd5e0;
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
    <div>Report Type: C - Technical Analysis</div>
  </div>
  <div class="section page">
    <h1>Technical Overview</h1>
    <p>This report contains technical analysis and metrics.</p>
    <div class="chart-placeholder">{{CHART_1}}</div>
  </div>
</body>
</html>
  `;
}
