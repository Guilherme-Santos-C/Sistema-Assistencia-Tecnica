const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const imprimir_pdf = async (req, res) => {
  const navegador = await puppeteer.launch();
  const pagina = await navegador.newPage();
  const Data = new Date();
  let todas_os;
  // Caminho do HTML e imagem
  let htmlPath;
  if(req.body.tipo == "Semestral") {
      htmlPath = path.join(__dirname, `"./pdf_templates/relatorioSemestral.html"`);
  }else if (req.body.tipo == "Trimestral"){
      htmlPath = path.join(__dirname, `"./pdf_templates/relatorioTrimestral.html"`);
      let os_api__json = await fetch("http://localhost:3030/api/clientes", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${req.body.token}` // token tem que ser enviado pelo front
        }
    })
    todas_os = os_api__json.json()
  }else if(req.body.tipo == "Personalizado"){

  }
  const imagemPath = path.join(__dirname, './pdf_templates/logo.svg');

  // Lê o HTML e a imagem
  let html = fs.readFileSync(htmlPath, 'utf-8');
  const imagemBase64 = fs.readFileSync(imagemPath, 'base64');

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