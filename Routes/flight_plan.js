const express = require('express');
const router = express.Router();

// Route for retrieving flight plan information by inspection ID
router.get('/:id', (req, res) => {
  //variavel global database
  const db = global.db;
  const inspectionId = req.params.id;

  // SQL query to retrieve flight plan information by inspection ID
  const query = `
    SELECT p.*, i.id AS inspecao_id
    FROM plano_voo p
    INNER JOIN inspecao i ON p.id_inspecao = i.id
    WHERE i.id = ?
  `;

  // Execute the SQL query with the inspection ID as a parameter
  db.query(query, [inspectionId], (error, results, fields) => {
    if (error) {
      console.error('Error retrieving flight plans:', error);
      res.status(500).send("Error retrieving flight plans");
      return;
    }
    console.log('Flight plans retrieved successfully');
    res.status(200).json(results); // Send the flight plan information as JSON response
  });
});
// Route to obtain the flight plan by it's id 
router.get('/flightPlan/:id', (req, res) => {
  // Global database variable
  const db = global.db;
  const flightPlanId = req.params.id;

  // SQL query to retrieve flight plan information by flight plan ID
  const query = `
    SELECT *
    FROM plano_voo
    WHERE id = ?
  `;

  // Execute the SQL query with the flight plan ID as a parameter
  db.query(query, [flightPlanId], (error, results, fields) => {
    if (error) {
      console.error('Error retrieving flight plan:', error);
      res.status(500).send("Error retrieving flight plan");
      return;
    }
    if (results.length === 0) {
      res.status(404).send("Flight plan not found");
      return;
    }
    console.log('Flight plan retrieved successfully');
    res.status(200).json(results[0]); // Send the flight plan information as JSON response
  });
});

// Route to handle POST requests for inserting flight plan information
router.post('/create', (req, res) => {
  //variavel global database
  const db = global.db;

  // Extracting flight plan data from request body
  const flightPlanData = {
    distancia_objecto,
    osd,
    area_mapeamento,
    taxa_sobrepos,
    intervalo_foto,
    tipo_voo,
    linha_voo,
    id_inspecao,
    id_drone
  } = req.body;

  // SQL query to insert flight plan data into the database
  const query = 'INSERT INTO plano_voo SET ?, createdOn = CURDATE(), updatedOn = CURDATE()';

  // Execute the SQL query
  db.query(query, flightPlanData, (error, results, fields) => {
    if (error) {
      console.error('Error inserting flight plan:', error);
      res.status(500).send("Error inserting flight plan");
      return;
    }

    // Extract the ID of the newly inserted row
    const newPlanoVooId = results.insertId;

    console.log('Flight plan inserted successfully with ID:', newPlanoVooId);

    // Send the newPlanoVooId back in the response
    res.status(200).json({
      id: newPlanoVooId,
      message: "Flight plan inserted successfully"
    });
  });
});


// Route to handle PATCH requests for updating flight plan information by ID
router.patch('/:id', (req, res) => {
  //variavel global database
  const db = global.db;
  const flightPlanId = req.params.id;
  
  // Extracting flight plan data from request body
  const flightPlanData = req.body;

  //################################################
  // o id do plano de voo é depois passado no frontend
  //################################################

  // SQL query to update flight plan data by ID
  const query = `
    UPDATE plano_voo 
    SET ?,
    updatedOn = CURDATE()
    WHERE id = ?
  `;
  
  // Execute the SQL query with flight plan data and ID as parameters
  db.query(query, [flightPlanData, flightPlanId], (error, results, fields) => {
    if (error) {
      console.error('Error updating flight plan:', error);
      res.status(500).send("Error updating flight plan");
      return;
    }
    if (results.affectedRows === 0) {
      // If no rows were affected, it means no flight plan was found with the provided ID
      res.status(404).send("Flight plan not found");
      return;
    }
    console.log('Flight plan updated successfully');
    res.status(200).send("Flight plan updated successfully");
  });
});

// exporta as rotas para o server.js
module.exports = router;