const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const files = [
  { html: 'safra-bruta-brutal.html', pdf: 'safra-bruta-brutal.pdf', title: 'Sàfra Bruta · Brutal' },
  { html: 'safra-bruta-completo.html', pdf: 'safra-bruta-completo.pdf', title: 'Sàfra Bruta · Completo' },
  { html: 'massa-madre.html', pdf: 'massa-madre.pdf', title: 'Massa Madre · Sistema de Avaliação' }
];

async function generatePDFs() {
  const browser = await puppeteer.launch({ headless: 'new' });

  for (const file of files) {
    try {
      const page = await browser.newPage();
      const filePath = path.join(__dirname, file.html);
      const fileUrl = `file://${filePath}`;

      console.log(`Gerando PDF: ${file.pdf}...`);

      await page.goto(fileUrl, { waitUntil: 'networkidle2' });
      await page.pdf({
        path: file.pdf,
        format: 'A4',
        margin: {
          top: '12mm',
          bottom: '12mm',
          left: '12mm',
          right: '12mm'
        },
        printBackground: true
      });

      console.log(`✓ ${file.pdf} criado com sucesso`);
      await page.close();
    } catch (error) {
      console.error(`✗ Erro ao gerar ${file.pdf}:`, error.message);
    }
  }

  await browser.close();
  console.log('\nTodos os PDFs foram gerados!');
}

generatePDFs();
