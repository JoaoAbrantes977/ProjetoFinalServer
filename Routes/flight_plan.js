const express = require('express');
const router = express.Router();

// Route to handle POST requests for inserting flight plan information
router.post('/create', (req, res) => {
      //variavel global database
      const db = global.db;
    
    // Extracting flight plan data from request body
    const flightPlanData = { distancia_objecto, osd, area_mapeamento, taxa_sobrepos, intervalo_foto, tipo_voo,
        linha_voo, id_inspecao, id_drone} = req.body;

    // SQL query to insert flight plan data into the database
    const query = 'INSERT INTO plano_voo SET ?, createdOn = CURDATE(), updatedOn = CURDATE()';
  
    // Execute the SQL query
    db.query(query, flightPlanData, (error, results, fields) => {
      if (error) {
        console.error('Error inserting flight plan:', error);
        res.status(500).send("Error inserting flight plan");
        return;
      }
      console.log('Flight plan inserted successfully');
      res.status(200).send("Flight plan inserted successfully");
    });
  });





// exporta as rotas para o server.js
module.exports = router;