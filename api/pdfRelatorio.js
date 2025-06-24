const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const moment = require("moment-timezone");
const OsModel = require("./models/Os");
const ClienteModel = require("./models/Cliente");

const imprimir_pdf_relatorio = async (req, res) => {
  const navegador = await puppeteer.launch();
  const pagina = await navegador.newPage();

  const htmlPath = path.join(__dirname, "./pdf_templates/relatorio.html");
  const imagemPath = path.join(__dirname, './pdf_templates/logo.svg');

  let html = fs.readFileSync(htmlPath, 'utf-8');
  const imagemBase64 = fs.readFileSync(imagemPath, 'base64');

  const { dataInicial, dataFinal } = req.body;

  if (!dataInicial || !dataFinal) {
    return res.status(400).json({ erro: "Forneça dataInicial e dataFinal no formato ISO." });
  }

  const inicio = new Date(dataInicial);
  const fim = new Date(dataFinal);

  console.log(inicio)
  console.log(fim)


  // Data formatada para melhor vizu
  const mes_inicio = (inicio.getMonth() + 1).toString().padStart(2, '0');
  const dia_inicio = inicio.getDate().toString().padStart(2, '0');
  const ano_inicio = inicio.getFullYear();
  const data_inicio = `${dia_inicio}/${mes_inicio}/${ano_inicio}`;
  
  // Data formatada para melhor vizu
  const mes_final = (fim.getMonth() + 1).toString().padStart(2, '0');
  const dia_final = fim.getDate().toString().padStart(2, '0');
  const ano_final = fim.getFullYear();
  const data_final = `${dia_final}/${mes_final}/${ano_final}`;

  // Buscar OSs no período
  const oss = await OsModel.find({
    createdAt: { $gte: inicio, $lte: fim }
  }).populate("cliente");

  // Extrair clientes únicos
  const clientesAtendidosSet = new Set();
  oss.forEach(os => {
    if (os.cliente && os.cliente._id) {
      clientesAtendidosSet.add(os.cliente._id.toString());
    }
  });

  const clientesAtendidosIds = Array.from(clientesAtendidosSet);
  const clientes = await ClienteModel.find({ _id: { $in: clientesAtendidosIds } });

  let clientes_novos = 0;
  let clientes_antigos = 0;

  clientes.forEach(cliente => {
    const criado = new Date(cliente.createdAt);
    if (criado >= inicio && criado <= fim) {
      clientes_novos++;
    } else {
      clientes_antigos++;
    }
  });

  let receita = 0;
  let equipamentos_consertados = 0;
  let equipamentos_nao_consertados = 0;
  let equipamentos_em_conserto = 0;

  oss.forEach((os) => {
    if (os.status === "Entregue") {
      equipamentos_nao_consertados++;
    } else if (os.status === "Consertado e entregue") {
      equipamentos_consertados++;
      receita += os.orcamento || 0;
    } else {
      equipamentos_em_conserto++;
    }
  });

  const oss_consertadas = oss.filter((os) => os.status === "Consertado e entregue");
  const oss_nao_consertadas = oss.filter((os) => os.status === "Entregue");

  let duracaoTotalMs = 0;
  oss_consertadas.forEach(os => {
    const dataInicio = moment(os.createdAt).tz("America/Sao_Paulo");
    const dataFim = moment(os.updatedAt).tz("America/Sao_Paulo");
    duracaoTotalMs += dataFim.diff(dataInicio);
  });

  const mediaMs = oss_consertadas.length > 0 ? duracaoTotalMs / oss_consertadas.length : 0;
  const duracaoMedia = moment.duration(mediaMs);
  const dias = Math.floor(duracaoMedia.asDays());
  const horas = duracaoMedia.hours();
  const minutos = duracaoMedia.minutes();

  const cliente_novos_porcentagem = clientesAtendidosSet.size
    ? (clientes_novos * 100 / clientesAtendidosSet.size)
    : 0;

  const cliente_antigos_porcentagem = clientesAtendidosSet.size
    ? (clientes_antigos * 100 / clientesAtendidosSet.size)
    : 0;

  const oss_consertadas_porcentagem = oss.length
    ? (equipamentos_consertados * 100 / oss.length)
    : 0;
  const oss_nao_consertadas_porcentagem = oss.length
    ? (equipamentos_nao_consertados * 100 / oss.length)
    : 0;
  const oss_em_conserto_porcentagem = oss.length
    ? (equipamentos_em_conserto * 100 / oss.length)
    : 0;



  const resultado = await OsModel.aggregate([
    {
      $match: {
        createdAt: { $gte: inicio, $lte: fim }
      }
    },
    {
      $lookup: {
        from: "clientes",
        localField: "cliente",
        foreignField: "_id",
        as: "cliente"
      }
    },
    {
      $unwind: "$cliente"
    },
    {
      $addFields: {
        mes: { $dateToString: { format: "%Y-%m", date: "$createdAt", timezone: "America/Sao_Paulo" } }
      }
    },
    {
      $group: {
        _id: "$mes",
        ordensCadastradas: { $sum: 1 },
        receita: {
          $sum: {
            $cond: [{ $eq: ["$status", "Consertado e entregue"] }, { $ifNull: ["$orcamento", 0] }, 0]
          }
        },
        clientesUnicos: { $addToSet: "$cliente._id" }
      }
    },
    {
      $project: {
        mes: "$_id",
        ordensCadastradas: 1,
        receita: 1,
        clientesAtendidos: { $size: "$clientesUnicos" },
        _id: 0
      }
    },
    {
      $sort: { mes: 1 }
    }
  ]);

  html = html.replace('{{IMAGEM_BASE64}}', imagemBase64);
  html = html.replace(':tipo_relatorio', req.body.tipo);
  html = html.replace(':data_inicio', data_inicio);
  html = html.replace(':data_final', data_final);
  html = html.replace(':totalClientes', clientesAtendidosSet.size);
  html = html.replace(':clientesNovos', clientes_novos);
  html = html.replace(':clientesAntigos', clientes_antigos);
  html = html.replace(':clientesNovosPorcentagem', cliente_novos_porcentagem.toFixed(2) + "%");
  html = html.replace(':clientesAntigosPorcentagem', clientes_antigos.toFixed(2) + "%");
  html = html.replace(':totalServicos', oss.length);
  html = html.replace(':totalConsertados', oss_consertadas.length);
  html = html.replace(':totalConsertadosPorcentagem', oss_consertadas_porcentagem.toFixed(2) + "%");
  html = html.replace(':totalNaoConsertados', oss_nao_consertadas.length);
  html = html.replace(':totalEmConserto', equipamentos_em_conserto);
  html = html.replace(':totalEmConsertoPorcentagem', oss_em_conserto_porcentagem.toFixed(2) + "%");
  html = html.replace(':totalNaoConsertadosPorcentagem', oss_nao_consertadas_porcentagem.toFixed(2) + "%");
  html = html.replace(':tempoMedioConserto', `${dias} dias, ${horas} Hrs e ${minutos} Min`);
  html = html.replace(':receitaTotal', "R$ " + receita);

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
};

module.exports = imprimir_pdf_relatorio;
