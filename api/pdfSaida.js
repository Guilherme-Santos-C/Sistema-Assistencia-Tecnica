const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const imprimir_pdf = async (req, res) => {
  const navegador = await puppeteer.launch();
  const pagina = await navegador.newPage();
  // Caminho do HTML e imagem
  const htmlPath = path.join(__dirname, `${req.body.status == "Pronto" ? "./pdf_templates/ProtocoloDeSaida.html" : "./pdf_templates/ProtocoloDeSaida2.html"}`);
  const imagemPath = path.join(__dirname, './pdf_templates/logo.svg');

  // Lê o HTML e a imagem
  let html = fs.readFileSync(htmlPath, 'utf-8');
  const imagemBase64 = fs.readFileSync(imagemPath, 'base64');

  const Data = new Date();
  const mes = (Data.getMonth() + 1).toString().padStart(2, '0');
  const dia = Data.getDate().toString().padStart(2, '0');
  const ano = Data.getFullYear();
  const data = `${dia}/${mes}/${ano}`;

  // Substitui o dados
  html = html.replace(':nome', req.body.nome_usuario);
  html = html.replace(':cpf', req.body.cpf_usuario);
  html = html.replace(':equipamento', req.body.nome_equipamento);
  html = html.replace(':marca', req.body.marca_equipamento);
  html = html.replace(':data', data);
  html = html.replace(':numero', req.body.numero);
  html = html.replace(':nomeCliente', req.body.nome_cliente);
  html = html.replace(':cpfCliente', req.body.cpf_cliente);
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
  const pdfBase64 = pdfBuffer.toString("base64")
  await navegador.close();
  res.status(200).json({ pdf: pdfBase64 })
}

module.exports = imprimir_pdf