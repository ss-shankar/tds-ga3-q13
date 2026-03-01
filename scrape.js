const { chromium } = require('playwright');

async function scrapeSums() {
  const browser = await chromium.launch({ headless: true });
  let grandTotal = 0;
  
  const urls = [
    'https://sanand0.github.io/tdsdata/js_table/?seed=82',
    'https://sanand0.github.io/tdsdata/js_table/?seed=83',
    'https://sanand0.github.io/tdsdata/js_table/?seed=84',
    'https://sanand0.github.io/tdsdata/js_table/?seed=85',
    'https://sanand0.github.io/tdsdata/js_table/?seed=86',
    'https://sanand0.github.io/tdsdata/js_table/?seed=87',
    'https://sanand0.github.io/tdsdata/js_table/?seed=88',
    'https://sanand0.github.io/tdsdata/js_table/?seed=89',
    'https://sanand0.github.io/tdsdata/js_table/?seed=90',
    'https://sanand0.github.io/tdsdata/js_table/?seed=91'
  ];

  for (const url of urls) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' }); // Wait for dynamic tables to load
    
    // Find all table cells and extract numbers
    const numbers = await page.$$eval('table td, table th', elements => 
      elements.flatMap(el => {
        const text = el.textContent.trim();
        const num = parseFloat(text);
        return isNaN(num) ? [] : [num];
      })
    );
    
    const pageSum = numbers.reduce((a, b) => a + b, 0);
    grandTotal += pageSum;
    
    console.log(`Sum for ${url}: ${pageSum.toFixed(2)}`);
    await page.close();
  }
  
  await browser.close();
  console.log(`GRAND TOTAL SUM OF ALL TABLES: ${grandTotal.toFixed(2)}`);
  return grandTotal;
}

scrapeSums();
