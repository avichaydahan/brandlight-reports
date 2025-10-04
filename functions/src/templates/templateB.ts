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
      font-family: 'Georgia', serif;
      color: #22223b;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    .cover { 
      background: linear-gradient(135deg, #f2e9e4 0%, #c9ada7 100%);
      color: #22223b; 
      padding: 80px 40px; 
      text-align: center;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .title { 
      font-size: 48px; 
      font-weight: 700; 
      margin-bottom: 20px;
    }
    .subtitle { 
      font-size: 24px; 
      margin-bottom: 40px;
    }
    .section { 
      margin: 60px 40px; 
      padding: 30px;
    }
    .page { page-break-after: always; }
    .data-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    .card {
      background: #f8f4f0;
      border: 1px solid #c9ada7;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
    }
    .card-title {
      font-weight: 600;
      color: #6f4e37;
      margin-bottom: 10px;
    }
    .card-value {
      font-size: 24px;
      font-weight: 700;
      color: #8b4513;
    }
    .chart-placeholder {
      background: #f8f4f0;
      border: 2px dashed #c9ada7;
      border-radius: 8px;
      padding: 40px;
      text-align: center;
      margin: 20px 0;
      color: #6f4e37;
    }
  </style>
</head>
<body>
  <div class="cover page">
    <div class="title">${data.title}</div>
    <div class="subtitle">${
      data.subtitle || 'Business Intelligence Report'
    }</div>
    <div>Report Type: B - Business Analytics</div>
  </div>

  <div class="section page">
    <h1>Business Metrics</h1>
    <div class="data-grid">
      ${((data.data as any)?.data || [])
        .slice(0, 12)
        .map(
          (item: any) => `
        <div class="card">
          <div class="card-title">${item.label}</div>
          <div class="card-value">${item.score}%</div>
        </div>
      `
        )
        .join('')}
    </div>
  </div>

  <div class="section">
    <h1>Analytics Dashboard</h1>
    <div class="chart-placeholder">{{CHART_1}}</div>
    <div class="chart-placeholder">{{CHART_2}}</div>
  </div>
</body>
</html>
  `;
}
