import { chromium } from 'playwright';
import path from 'path';

(async () => {
  console.log('Launching browser compiler...');
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: 'C:\\Users\\Sahil\\AppData\\Local\\ms-playwright\\chromium_headless_shell-1223\\chrome-headless-shell-win64\\chrome-headless-shell.exe'
  });
  const page = await browser.newPage();
  
  // Load local HTML file
  const filePath = path.resolve('resume.html');
  console.log(`Loading: file://${filePath}`);
  await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' });
  
  // Compile to PDF
  console.log('Generating PDF...');
  await page.pdf({
    path: 'Raunak_Sharma_Resume.pdf',
    format: 'Letter',
    margin: {
      top: '0.4in',
      bottom: '0.4in',
      left: '0.4in',
      right: '0.4in'
    },
    printBackground: true
  });
  
  await browser.close();
  console.log('PDF Generated Successfully as: Raunak_Sharma_Resume.pdf');
})();
