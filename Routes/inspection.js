const express = require('express');
const router = express.Router();


   router.get('/', (req, res) => {
    res.send('Hello World From Express - Teste!')
  })

// Route to create an inspecao record
router.post('/inspection', (req, res) => {
  //variavel global database
  const db = global.db;

  const tipoValues = { descricao, tipologia, area, altura, data_util, 
  periodo, funcionamento, utilizacao, num_fachadas, num_coberturas,
  pre_esforco, km_inicio, km_fim, material_estrutural, extensao_tabuleiro,
  largura_tabuleiro, vias_circulacao, material_pavi, sistema_drenagem, num_pilares,
  geometria, material_revestimento, id_pais } = req.body;

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
      id_utilizador: 1, // Estou a passar pelo body apenas para testar, depois guardo o id no shared_preferences do flutter
      id_tipo: tipoId
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


// exporta as rotas para o server.js
module.exports = router;