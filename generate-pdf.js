import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

(async () => {
  console.log('Launching browser compiler...');
  const browser = await chromium.launch({ 
    headless: true
  });
  const page = await browser.newPage();
  
  // Load local HTML file
  const filePath = path.resolve('public/resume.html');
  console.log(`Loading: file://${filePath}`);
  await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' });
  
  // Compile to PDF
  console.log('Generating PDF...');
  const pdfBuffer = await page.pdf({
    format: 'Letter',
    margin: {
      top: '0.4in',
      bottom: '0.4in',
      left: '0.4in',
      right: '0.4in'
    },
    printBackground: true
  });
  
  fs.writeFileSync('Raunak_Sharma_Resume.pdf', pdfBuffer);
  fs.writeFileSync('public/assets/images/Raunak_Resume.pdf', pdfBuffer);
  
  if (fs.existsSync('dist/assets/images')) {
    fs.writeFileSync('dist/assets/images/Raunak_Resume.pdf', pdfBuffer);
  }
  
  await browser.close();
  console.log('PDF Generated Successfully as: Raunak_Sharma_Resume.pdf & public/assets/images/Raunak_Resume.pdf');
})();
