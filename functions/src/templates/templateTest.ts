/**
 * Test Template - Clean implementation from scratch
 * Uses Puppeteer's default header/footer and margins
 * Content automatically breaks to new pages when needed
 */

export function generateTemplate(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #333;
      background: white;
    }
    
    .container {
      padding: 20px;
    }
    
    h1 {
      font-size: 24px;
      margin-bottom: 20px;
      color: #1a1a1a;
    }
    
    h2 {
      font-size: 18px;
      margin-top: 30px;
      margin-bottom: 15px;
      color: #333;
    }
    
    p {
      margin-bottom: 12px;
    }
    
    .card {
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }
    
    .card-title {
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    
    th, td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: left;
    }
    
    th {
      background: #f0f0f0;
      font-weight: bold;
    }
    
    tr:nth-child(even) {
      background: #fafafa;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Test Report - Clean Template</h1>
    
    <p>This is a test report to verify that margins, headers, footers, and page breaks work correctly.</p>
    
    <h2>Summary Cards</h2>
    
    <div class="card">
      <div class="card-title">Card 1</div>
      <p>This is the first card with some content.</p>
    </div>
    
    <div class="card">
      <div class="card-title">Card 2</div>
      <p>This is the second card with some content.</p>
    </div>
    
    <div class="card">
      <div class="card-title">Card 3</div>
      <p>This is the third card with some content.</p>
    </div>
    
    <h2>Data Table</h2>
    
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Value</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${generateTableRows(50)}
      </tbody>
    </table>
    
    <h2>Additional Content</h2>
    
    <p>This section contains additional content to test page breaks.</p>
    
    ${generateParagraphs(20)}
    
    <h2>Final Section</h2>
    
    <p>This is the final section of the report.</p>
    
    <div class="card">
      <div class="card-title">Conclusion</div>
      <p>The test report has been generated successfully. All content should flow naturally across pages with proper margins, headers, and footers.</p>
    </div>
  </div>
</body>
</html>`;
}

function generateTableRows(count: number): string {
  let rows = '';
  for (let i = 1; i <= count; i++) {
    rows += `
      <tr>
        <td>${i}</td>
        <td>Item ${i}</td>
        <td>${Math.floor(Math.random() * 1000)}</td>
        <td>${i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Pending' : 'Completed'}</td>
      </tr>
    `;
  }
  return rows;
}

function generateParagraphs(count: number): string {
  let paragraphs = '';
  for (let i = 1; i <= count; i++) {
    paragraphs += `
      <p>Paragraph ${i}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
    `;
  }
  return paragraphs;
}
