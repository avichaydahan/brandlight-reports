import { generatePartnershipDomainsData } from './data.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testPartnershipReport() {
  console.log('Testing Partnership domains report generation...');

  try {
    // Generate test data
    const partnershipData = generatePartnershipDomainsData();
    console.log('✓ Partnership data generated successfully');
    console.log(
      `  - Total domains: ${partnershipData.summary.totalDomainsAnalyzed}`
    );
    console.log(`  - Data domains count: ${partnershipData.domains.length}`);
    console.log(
      `  - Top opportunity: ${partnershipData.summary.topOpportunity}`
    );

    // Load template
    const templatePath = path.join(
      __dirname,
      'templates',
      'templatePartnership.js'
    );
    const template = await import(templatePath);
    console.log('✓ Template loaded successfully');

    // Generate HTML
    const html = template.generateTemplate(partnershipData);
    console.log('✓ HTML generated successfully');
    console.log(`  - HTML length: ${html.length} characters`);

    // Save HTML for inspection
    const outputPath = path.join(
      __dirname,
      '..',
      'test-partnership-report.html'
    );
    await fs.writeFile(outputPath, html);
    console.log(`✓ HTML saved to: ${outputPath}`);

    console.log('\n✅ Partnership report test completed successfully!');

    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

testPartnershipReport();
