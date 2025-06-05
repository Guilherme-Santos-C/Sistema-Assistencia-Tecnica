const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const imprimir_pdf = async (nome, cpf, equipamento, marca, data, numero) => {
  const navegador = await puppeteer.launch();
  const pagina = await navegador.newPage();

  // Caminho do HTML e imagem
  const htmlPath = path.join(__dirname, '../pdf_templates/RecebimentoEquipamentoPdf.html');
  const imagemPath = path.join(__dirname, '../pdf_templates/logo.svg');

  // Lê o HTML e a imagem
  let html = fs.readFileSync(htmlPath, 'utf-8');
  const imagemBase64 = fs.readFileSync(imagemPath, 'base64');

  // Substitui o dados
  html = html.replace(':nome', nome);
  html = html.replace(':cpf', cpf);
  html = html.replace(':equipamento', equipamento);
  html = html.replace(':marca', marca);
  html = html.replace(':data', data);
  html = html.replace(':numero', numero);
  html = html.replace('{{IMAGEM_BASE64}}', imagemBase64);

  // Define o conteúdo da página
  await pagina.setContent(html, { waitUntil: 'networkidle0' });

  // Gera o PDF
  let pdfBuffer = await pagina.pdf({
    path: 'certificado.pdf',
    format: 'A4',
    printBackground: true,
  });
  pdfBuffer = Buffer.from(pdfBuffer)
  await navegador.close();
  return pdfBuffer
}

module.exports = imprimir_pdf