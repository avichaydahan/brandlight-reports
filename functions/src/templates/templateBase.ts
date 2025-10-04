import { ReportData } from '../types/index.js';

export function generateHTML(data: ReportData): string {
  return `
<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${data.title}</title>
  <style>
    @page { size: A4; margin: 16mm 12mm; }
    body { font-family: Arial, Helvetica, sans-serif; color:#0f172a; }
    .header { font-size: 20px; font-weight: 700; margin-bottom: 6px; }
    .chip { display:inline-block; background:#eef2f7; padding:4px 8px; border-radius:999px; font-size:12px; margin-right:6px; }
    .kpi { font-size: 36px; font-weight: 800; }
    .section { page-break-inside: avoid; margin-bottom: 12px; }
    .page { page-break-after: always; }
    .page:last-child { page-break-after: auto; }
    .muted { color:#64748b; }
    .card { border:1px solid #e2e8f0; border-radius:10px; padding:12px; }
    .row { display:flex; gap:12px; }
    .col { flex:1; }
    .list { font-size: 12px; }
  </style>
</head>
<body>
  <div class="section">
    <div class="header">${data.title}</div>
    <span class="chip">Generated: ${new Date(data.date).toLocaleDateString()}</span>
    <span class="chip">Author: ${data.author || 'System'}</span>
    <span class="chip">Type: Base Template</span>
  </div>

  <div class="row section">
    <div class="card col">
      <div class="muted">Total Items</div>
      <div class="kpi">${(data.data as any)?.summary?.totalItems || 0}</div>
    </div>
    <div class="card col">
      <div class="muted">Average Score</div>
      <div class="kpi">${Math.round((data.data as any)?.summary?.averageScore || 0)}</div>
    </div>
  </div>

  <div class="section">
    <div class="header">Data Analysis</div>
    <div class="list">
      <ol>
        ${((data.data as any)?.data || []).slice(0, 20).map((item: any) => `
          <li>${item.label} — ${item.score}%</li>
        `).join('')}
      </ol>
    </div>
  </div>
</body>
</html>
  `;
}
