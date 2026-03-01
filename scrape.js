const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  let grandTotal = 0;

  const seeds = [82,83,84,85,86,87,88,89,90,91];
  
  for (const seed of seeds) {
    await page.goto(`https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`);
    await page.waitForSelector('table');
    await page.waitForTimeout(3000);  // Extra wait for JS load
    
    // Get ALL text from table cells, extract numbers recursively
    const cellTexts = await page.$$eval('table td, table th', cells => 
      cells.map(cell => cell.textContent || '').filter(text => text.trim())
    );
    
    // Extract all numbers from texts (handles spans, decimals)
    const numbers = [];
    const numRegex = /[-+]?\d*\.?\d+/g;
    for (const text of cellTexts) {
      const matches = text.match(numRegex);
      if (matches) numbers.push(...matches.map(n => parseFloat(n)));
    }
    
    const seedSum = numbers.reduce((a, b) => a + b, 0);
    grandTotal += seedSum;
    console.log(`Seed ${seed} numbers count: ${numbers.length}, sum: ${seedSum.toFixed(2)}`);
  }
  
  console.log(`GRAND TOTAL: ${grandTotal.toFixed(2)}`);
  await browser.close();
})();
