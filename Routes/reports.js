const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Route GET to obtain pre-inspection report
router.get('/pre-inspecao/:id', (req, res) => {
  const db = global.db;
  const inspectionId = req.params.id;
  console.log('Request received for inspection ID:', req.params.id);

  const query = `
    SELECT
      t.nome AS tipo_nome, t.descricao AS tipo_descricao, t.tipologia, t.area, t.altura, t.data_util, t.periodo,
      t.funcionamento, t.utilizacao, t.num_fachadas, t.num_coberturas, t.pre_esforco, t.km_inicio, t.km_fim,
      t.material_estrutural, t.extensao_tabuleiro, t.largura_tabuleiro, t.vias_circulacao, t.material_pavi,
      t.sistema_drenagem, t.num_pilares, t.geometria, t.material_revestimento,
      i.historico, i.createdOn AS inspecao_createdOn,
      p.distancia_objecto, p.osd, p.area_mapeamento, p.taxa_sobrepos, p.intervalo_foto, p.tipo_voo, p.linha_voo,
      p.createdOn AS plano_voo_createdOn,
      u.nome AS utilizador_nome, u.telefone, u.email, u.especialidade, u.createdOn AS utilizador_createdOn
    FROM
      tipo t
    INNER JOIN
      inspecao i ON t.id = i.id_tipo
    INNER JOIN
      plano_voo p ON i.id = p.id_inspecao
    INNER JOIN
      utilizador u ON i.id_utilizador = u.id
    WHERE
      i.id = ?
  `;
  
  db.query(query, [inspectionId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Inspection not found' });
    }

    const inspection = results[0];

    // Create a new PDF document
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `../reports/pre_inspection_${inspectionId}.pdf`);

    // Stream the PDF to a file
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Add content to the PDF
    doc.fontSize(16).text(`Detalhes da Inspeção ${inspection.tipo_nome}`, { align: 'center' });

    // Add utilizador details
    doc.moveDown().fontSize(14).text('Detalhes do Utilizador', { align: 'left', underline: true });
    doc.fontSize(12).text(`Nome: ${inspection.utilizador_nome}`, { align: 'left' });
    doc.text(`Telefone: ${inspection.telefone}`, { align: 'left' });
    doc.text(`E-mail: ${inspection.email}`, { align: 'left' });
    doc.text(`Especialidade: ${inspection.especialidade}`, { align: 'left' });

    // Add inspecao details
    doc.moveDown().fontSize(14).text('Detalhes da Inspeção:', { align: 'left', underline: true });
    doc.text(`Data de Criação: ${inspection.inspecao_createdOn}`, { align: 'left' });

    // Add tipo details
    doc.fontSize(14).text('Detalhes da Construção:', { align: 'left', underline: true });
    doc.fontSize(12).text(`Nome: ${inspection.tipo_nome}`, { align: 'left' });
    doc.text(`Descrição: ${inspection.tipo_descricao}`, { align: 'left' });
    doc.text(`Tipologia: ${inspection.tipologia}`, { align: 'left' });
    doc.text(`Área: ${inspection.area}`, { align: 'left' });
    doc.text(`Altura: ${inspection.altura}`, { align: 'left' });
    doc.text(`Data Útil: ${inspection.data_util}`, { align: 'left' });
    doc.text(`Período: ${inspection.periodo}`, { align: 'left' });
    doc.text(`Funcionamento: ${inspection.funcionamento}`, { align: 'left' });
    doc.text(`Utilização: ${inspection.utilizacao}`, { align: 'left' });
    doc.text(`Número de Fachadas: ${inspection.num_fachadas}`, { align: 'left' });
    doc.text(`Número de Coberturas: ${inspection.num_coberturas}`, { align: 'left' });
    doc.text(`Pré-Esforço: ${inspection.pre_esforco}`, { align: 'left' });
    doc.text(`Kilometro Inicial: ${inspection.km_inicio}`, { align: 'left' });
    doc.text(`Kilometro Final: ${inspection.km_fim}`, { align: 'left' });
    doc.text(`Material Estrutural: ${inspection.material_estrutural}`, { align: 'left' });
    doc.text(`Extensão do Tabuleiro: ${inspection.extensao_tabuleiro}`, { align: 'left' });
    doc.text(`Largura do Tabuleiro: ${inspection.largura_tabuleiro}`, { align: 'left' });
    doc.text(`Vias de Circulação: ${inspection.vias_circulacao}`, { align: 'left' });
    doc.text(`Material do Pavimento: ${inspection.material_pavi}`, { align: 'left' });
    doc.text(`Sistema de Drenagem: ${inspection.sistema_drenagem}`, { align: 'left' });
    doc.text(`Número de Pilares: ${inspection.num_pilares}`, { align: 'left' });
    doc.text(`Geometria: ${inspection.geometria}`, { align: 'left' });
    doc.text(`Material de Revestimento: ${inspection.material_revestimento}`, { align: 'left' });

    // Add plano_voo details
    doc.moveDown().fontSize(14).text('Detalhes do Plano de Voo:', { align: 'left', underline: true });
    doc.fontSize(12).text(`Distância do Objeto: ${inspection.distancia_objecto}`, { align: 'left' });
    doc.text(`OSD: ${inspection.osd}`, { align: 'left' });
    doc.text(`Área de Mapeamento: ${inspection.area_mapeamento}`, { align: 'left' });
    doc.text(`Taxa de Sobreposição: ${inspection.taxa_sobrepos}`, { align: 'left' });
    doc.text(`Intervalo de Foto: ${inspection.intervalo_foto}`, { align: 'left' });
    doc.text(`Tipo de Voo: ${inspection.tipo_voo}`, { align: 'left' });
    doc.text(`Data de Criação: ${inspection.plano_voo_createdOn}`, { align: 'left' });

    doc.end();

    // Respond with the file path where the PDF is saved
    stream.on('finish', () => {
      res.json({ filePath: `/reports/inspection_${inspectionId}.pdf` });
    });
  });
});

// Route GET to obtain pos-inspection report
router.get('/pos-inspecao/:id', (req, res) => {
  const db = global.db;
  const inspectionId = req.params.id;
  console.log('Request received for inspection ID:', req.params.id);

  const query = `
    SELECT
      t.nome AS tipo_nome, t.descricao AS tipo_descricao, t.tipologia, t.area, t.altura, t.data_util, t.periodo,
      t.funcionamento, t.utilizacao, t.num_fachadas, t.num_coberturas, t.pre_esforco, t.km_inicio, t.km_fim,
      t.material_estrutural, t.extensao_tabuleiro, t.largura_tabuleiro, t.vias_circulacao, t.material_pavi,
      t.sistema_drenagem, t.num_pilares, t.geometria, t.material_revestimento,
      i.historico, i.createdOn AS inspecao_createdOn,
      p.distancia_objecto, p.osd, p.area_mapeamento, p.taxa_sobrepos, p.intervalo_foto, p.tipo_voo, p.linha_voo,
      p.createdOn AS plano_voo_createdOn,
      pos.num_voos, pos.hora_inicio, pos.hora_fim, pos.tempo_total, pos.num_fotos, pos.num_videos, pos.cond_meteo,
      pos.createdOn AS pos_voo_createdOn,
      proc.num_anomalias, proc.foto, proc.descricao, proc.causas, proc.reparacao, proc.createdOn AS process_info_createdOn,
      u.nome AS utilizador_nome, u.telefone, u.email, u.especialidade, u.createdOn AS utilizador_createdOn
    FROM
      tipo t
    INNER JOIN
      inspecao i ON t.id = i.id_tipo
    INNER JOIN
      plano_voo p ON i.id = p.id_inspecao
    INNER JOIN
      pos_voo pos ON p.id = pos.id_plano
    INNER JOIN
      process_info proc ON pos.id = proc.id_pos
    INNER JOIN
      utilizador u ON i.id_utilizador = u.id
    WHERE
      i.id = ?
  `;
  
  db.query(query, [inspectionId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Inspection not found' });
    }

    const inspection = results[0];

    // Create a new PDF document
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `../reports/pos_inspection_${inspectionId}.pdf`);

    // Stream the PDF to a file
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Add content to the PDF
    doc.fontSize(16).text(`Detalhes da Inspeção ${inspection.tipo_nome}`, { align: 'center' });

    // Add utilizador details
    doc.moveDown().fontSize(14).text('Detalhes do Utilizador', { align: 'left', underline: true });
    doc.fontSize(12).text(`Nome: ${inspection.utilizador_nome}`, { align: 'left' });
    doc.text(`Telefone: ${inspection.telefone}`, { align: 'left' });
    doc.text(`E-mail: ${inspection.email}`, { align: 'left' });
    doc.text(`Especialidade: ${inspection.especialidade}`, { align: 'left' });

    // adjust the date
    const createdOnDate = new Date(inspection.inspecao_createdOn);
    const formattedDate = createdOnDate.toLocaleDateString('pt-PT', { year: 'numeric', month: '2-digit', day: '2-digit' });

    // Add inspecao details
    doc.moveDown().fontSize(14).text('Detalhes da Inspeção:', { align: 'left', underline: true });
    doc.text(`Data de Criação: ${formattedDate}`, { align: 'left' });


    // Add tipo details
    doc.fontSize(14).text('Detalhes da Construção:', { align: 'left', underline: true });
    doc.fontSize(12).text(`Nome: ${inspection.tipo_nome}`, { align: 'left' });
    doc.text(`Descrição: ${inspection.tipo_descricao}`, { align: 'left' });
    doc.text(`Tipologia: ${inspection.tipologia}`, { align: 'left' });
    doc.text(`Área: ${inspection.area}`, { align: 'left' });
    doc.text(`Altura: ${inspection.altura}`, { align: 'left' });
    doc.text(`Data Útil: ${inspection.data_util}`, { align: 'left' });
    doc.text(`Período: ${inspection.periodo}`, { align: 'left' });
    doc.text(`Funcionamento: ${inspection.funcionamento}`, { align: 'left' });
    doc.text(`Utilização: ${inspection.utilizacao}`, { align: 'left' });
    doc.text(`Número de Fachadas: ${inspection.num_fachadas}`, { align: 'left' });
    doc.text(`Número de Coberturas: ${inspection.num_coberturas}`, { align: 'left' });
    doc.text(`Pré-Esforço: ${inspection.pre_esforco}`, { align: 'left' });
    doc.text(`Kilometro Inicial: ${inspection.km_inicio}`, { align: 'left' });
    doc.text(`Kilometro Final: ${inspection.km_fim}`, { align: 'left' });
    doc.text(`Material Estrutural: ${inspection.material_estrutural}`, { align: 'left' });
    doc.text(`Extensão do Tabuleiro: ${inspection.extensao_tabuleiro}`, { align: 'left' });
    doc.text(`Largura do Tabuleiro: ${inspection.largura_tabuleiro}`, { align: 'left' });
    doc.text(`Vias de Circulação: ${inspection.vias_circulacao}`, { align: 'left' });
    doc.text(`Material do Pavimento: ${inspection.material_pavi}`, { align: 'left' });
    doc.text(`Sistema de Drenagem: ${inspection.sistema_drenagem}`, { align: 'left' });
    doc.text(`Número de Pilares: ${inspection.num_pilares}`, { align: 'left' });
    doc.text(`Geometria: ${inspection.geometria}`, { align: 'left' });
    doc.text(`Material de Revestimento: ${inspection.material_revestimento}`, { align: 'left' });

    // Add plano_voo details
    doc.moveDown().fontSize(14).text('Detalhes do Plano de Voo:', { align: 'left', underline: true });
    doc.fontSize(12).text(`Distância do Objeto: ${inspection.distancia_objecto}`, { align: 'left' });
    doc.text(`OSD: ${inspection.osd}`, { align: 'left' });
    doc.text(`Área de Mapeamento: ${inspection.area_mapeamento}`, { align: 'left' });
    doc.text(`Taxa de Sobreposição: ${inspection.taxa_sobrepos}`, { align: 'left' });
    doc.text(`Intervalo de Foto: ${inspection.intervalo_foto}`, { align: 'left' });
    doc.text(`Tipo de Voo: ${inspection.tipo_voo}`, { align: 'left' });
    doc.text(`Data de Criação: ${inspection.plano_voo_createdOn}`, { align: 'left' });

    // Add pos_voo details
    doc.moveDown().fontSize(14).text('Detalhes do Pos de Voo:', { align: 'left', underline: true });
    doc.fontSize(12).text(`Número de Voos: ${inspection.num_voos}`, { align: 'left' });
    doc.text(`Hora de Início: ${inspection.hora_inicio}`, { align: 'left' });
    doc.text(`Hora de Fim: ${inspection.hora_fim}`, { align: 'left' });
    doc.text(`Tempo Total: ${inspection.tempo_total}`, { align: 'left' });
    doc.text(`Número de Fotos: ${inspection.num_fotos}`, { align: 'left' });
    doc.text(`Número de Vídeos: ${inspection.num_videos}`, { align: 'left' });
    doc.text(`Condição Meteorológica: ${inspection.cond_meteo}`, { align: 'left' });
    doc.text(`Data de Criação: ${inspection.pos_voo_createdOn}`, { align: 'left' });

    // Add process_info details
    doc.moveDown().fontSize(14).text('Detalhes do Processo de Informação:', { align: 'left', underline: true });
    doc.fontSize(12).text(`Número de Anomalias: ${inspection.num_anomalias}`, { align: 'left' });
    doc.text(`Descrição: ${inspection.descricao}`, { align: 'left' });
    doc.text(`Causas: ${inspection.causas}`, { align: 'left' });
    doc.text(`Reparação: ${inspection.reparacao}`, { align: 'left' });
    doc.text(`Data de Criação: ${inspection.process_info_createdOn}`, { align: 'left' });

    doc.end();

    // Respond with the file path where the PDF is saved
    stream.on('finish', () => {
      res.json({ filePath: `/reports/pos_inspection_${inspectionId}.pdf` });
    });
  });
});

// exporta as rotas para o server.js
module.exports = router;