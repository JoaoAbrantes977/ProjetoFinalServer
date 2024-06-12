const express = require('express');
const router = express.Router();

// Route to retrieve details of an inspection
router.get('/:id', (req, res) => {
  //variavel global database
  const db = global.db;
  
  const inspectionId = req.params.id;

  // Query to retrieve details of the inspection from the inspecao table
  const inspectionQuery = 'SELECT * FROM inspecao WHERE id = ?';

  db.query(inspectionQuery, [inspectionId], (err, inspectionResult) => {
    if (err) {
      console.error('Error retrieving inspection details: ' + err.stack);
      res.status(500).send('Error retrieving inspection details');
      return;
    }

    if (inspectionResult.length === 0) {
      res.status(404).send('Inspection not found');
      return;
    }
    //console.log(inspectionResult)
    // Retrieve the tipo ID from the inspection result
    const tipoId = inspectionResult[0].id_tipo;

    // Query to retrieve details of the tipo from the tipo table
    const tipoQuery = 'SELECT * FROM tipo WHERE id = ?';

    db.query(tipoQuery, [tipoId], (err, tipoResult) => {
      if (err) {
        console.error('Error retrieving tipo details: ' + err.stack);
        res.status(500).send('Error retrieving tipo details');
        return;
      }

      if (tipoResult.length === 0) {
        res.status(404).send('Tipo details not found');
        return;
      }

      const tipoDetails = tipoResult[0];
      res.status(200).json({ tipo: tipoDetails });
    });
  });
});

// Route to create an inspecao record
router.post('/create', (req, res) => {
  // variavel global database
  const db = global.db;

  const {
    nome, descricao, tipologia, area, altura, data_util, periodo, funcionamento, utilizacao, 
    num_fachadas, num_coberturas, pre_esforco, km_inicio, km_fim, material_estrutural, 
    extensao_tabuleiro, largura_tabuleiro, vias_circulacao, material_pavi, 
    sistema_drenagem, num_pilares, geometria, material_revestimento, 
    pais_nome, distrito_nome, municipio_nome, freguesia_nome, rua, codigo_postal,
    id_utilizador
  } = req.body;

  const tipoValues = { nome, descricao, tipologia, area, altura, data_util, periodo, funcionamento, utilizacao, num_fachadas, num_coberturas, pre_esforco, km_inicio, km_fim, material_estrutural, extensao_tabuleiro, largura_tabuleiro, vias_circulacao, material_pavi, sistema_drenagem, num_pilares, geometria, material_revestimento };

  const findAddressId = `
    SELECT morada.id FROM morada
    JOIN freguesia ON morada.id_freguesia = freguesia.id
    JOIN municipio ON freguesia.id_municipio = municipio.id
    JOIN distrito ON municipio.id_distrito = distrito.id
    JOIN pais ON distrito.id_pais = pais.id
    WHERE morada.rua = ? AND morada.codigo_postal = ? AND freguesia.nome = ? AND municipio.nome = ? AND distrito.nome = ? AND pais.nome = ?`;

  db.query(findAddressId, [rua, codigo_postal, freguesia_nome, municipio_nome, distrito_nome, pais_nome], (err, results) => {
    if (err) {
      console.error('Error fetching address ID: ' + err.stack);
      res.status(500).send('Error fetching address ID');
      return;
    }

    if (results.length === 0) {
      console.error('Address not found');
      res.status(404).send('Address not found');
      return;
    }

    const addressId = results[0].id;
    tipoValues.id_morada = addressId;

    const tipoQuery = 'INSERT INTO tipo SET ?, createdOn = CURDATE(), updatedOn = CURDATE()';

    db.query(tipoQuery, tipoValues, (err, tipoResult) => {
      if (err) {
        console.error('Error inserting into tipo table: ' + err.stack);
        res.status(500).send('Error inserting into tipo table');
        return;
      }

      // Retrieve the ID of the newly inserted tipo record
      const tipoId = tipoResult.insertId;

      // Now, create the inspecao record using the tipo ID
      const inspectionValues = {
        createdOn: new Date(),
        updatedOn: new Date(),
        id_utilizador: id_utilizador,
        id_tipo: tipoId,
        historico: 1
      };

      const inspecaoQuery = 'INSERT INTO inspecao SET ?';
      db.query(inspecaoQuery, inspectionValues, (err, inspecaoResult) => {
        if (err) {
          console.error('Error creating inspecao record: ' + err.stack);
          res.status(500).send('Error creating inspecao record');
          return;
        }

        res.status(200).send('Inspecao record created successfully');
      });
    });
  });
});

// Route to update a tipo record based on inspection ID
router.patch('/:id', (req, res) => {
  //variavel global database
  const db = global.db;
  
  const inspectionId = req.params.id;

  // Query to find the tipo ID associated with the inspection
  const findTipoIdQuery = 'SELECT id_tipo FROM inspecao WHERE id = ?';

  db.query(findTipoIdQuery, [inspectionId], (err, tipoIdResult) => {
    if (err) {
      console.error('Error retrieving tipo ID: ' + err.stack);
      res.status(500).send('Error retrieving tipo ID');
      return;
    }

    if (tipoIdResult.length === 0) {
      res.status(404).send('Inspection not found');
      return;
    }

    const tipoId = tipoIdResult[0].id_tipo;

    // Extract updated tipo details from the request body
    const { descricao, tipologia, area, altura, data_util, periodo, funcionamento, utilizacao, num_fachadas, num_coberturas, pre_esforco, km_inicio, km_fim, material_estrutural, extensao_tabuleiro, largura_tabuleiro, vias_circulacao, material_pavi, sistema_drenagem, num_pilares, geometria, material_revestimento} = req.body;

    // Query to update the tipo record
    const updateTipoQuery = `UPDATE tipo SET descricao = ?, tipologia = ?, area = ?, altura = ?, data_util = ?, periodo = ?, funcionamento = ?, utilizacao = ?, num_fachadas = ?, num_coberturas = ?, pre_esforco = ?, km_inicio = ?, km_fim = ?, material_estrutural = ?, extensao_tabuleiro = ?, largura_tabuleiro = ?, vias_circulacao = ?, material_pavi = ?, sistema_drenagem = ?, num_pilares = ?, geometria = ?, material_revestimento = ?, updatedOn = CURDATE() WHERE id = ?`;

    // Execute the update query
    db.query(updateTipoQuery, [descricao, tipologia, area, altura, data_util, periodo, funcionamento, utilizacao, num_fachadas, num_coberturas, pre_esforco, km_inicio, km_fim, material_estrutural, extensao_tabuleiro, largura_tabuleiro, vias_circulacao, material_pavi, sistema_drenagem, num_pilares, geometria, material_revestimento, tipoId], (err, updateTipoResult) => {
      if (err) {
        console.error('Error updating tipo record: ' + err.stack);
        res.status(500).send('Error updating tipo record');
        return;
      }

      res.status(200).send('Tipo record updated successfully');
    });
  });
});

// Route to delete an inspection and its associated tipo record
router.delete('/:id', (req, res) => {
  //variavel global database
  const db = global.db;
  
  const inspectionId = req.params.id;

      // Query to find the tipo ID associated with the deleted inspection
      const findTipoIdQuery = 'SELECT id_tipo FROM inspecao WHERE id = ?';

      db.query(findTipoIdQuery, [inspectionId], (err, tipoIdResult) => {
        if (err) {
          console.error('Error retrieving tipo ID: ' + err.stack);
          res.status(500).send('Error retrieving tipo ID');
          return;
        }
  
        if (tipoIdResult.length === 0) {
          console.log('Tipo record not found');
          res.status(200).send('Inspection record deleted successfully');
          return;
        }

  // Query to delete the inspection record
  const deleteInspectionQuery = 'DELETE FROM inspecao WHERE id = ?';

  db.query(deleteInspectionQuery, [inspectionId], (err, deleteInspectionResult) => {
    if (err) {
      console.error('Error deleting inspection record: ' + err.stack);
      res.status(500).send('Error deleting inspection record');
      return;
    }

    if (deleteInspectionResult.affectedRows === 0) {
      res.status(404).send('Inspection not found');
      return;
    }

      const tipoId = tipoIdResult[0].id_tipo;

      // Query to delete the tipo record
      const deleteTipoQuery = 'DELETE FROM tipo WHERE id = ?';

      db.query(deleteTipoQuery, [tipoId], (err, deleteTipoResult) => {
        if (err) {
          console.error('Error deleting tipo record: ' + err.stack);
          res.status(500).send('Error deleting tipo record');
          return;
        }

        res.status(200).send('Inspection and tipo records deleted successfully');
      });
    });
  });
});

// exporta as rotas para o server.js
module.exports = router;