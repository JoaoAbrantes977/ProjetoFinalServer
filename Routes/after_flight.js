const express = require('express');
const router = express.Router();

// Route to handle POST requests for creating a "pos_voo" entry
router.post('/create', (req, res) => {
  const db = global.db;
  const posVooData = req.body;
  
  const query = 'INSERT INTO pos_voo SET ?, createdOn = CURDATE(), updatedOn = CURDATE()';
  
  db.query(query, posVooData, (error, results) => {
    if (error) {
      console.error('Error inserting pos_voo data:', error);
      res.status(500).send("Error inserting pos_voo data");
      return;
    }
    console.log('pos_voo inserted successfully');
    res.status(200).json({ insertedId: results.insertId });
  });
});

// Route to handle GET requests for retrieving pos_voo entries by id_plano
router.get('/:id', (req, res) => {
    //variavel global database
    const db = global.db;
    const idPlano = req.params.id;
  
    // SQL query to retrieve pos_voo entries by id_plano
    const query = 'SELECT * FROM pos_voo WHERE id_plano = ?';
  
    // Execute the SQL query with id_plano as a parameter
    db.query(query, [idPlano], (error, results, fields) => {
      if (error) {
        console.error('Error retrieving pos_voo entries:', error);
        res.status(500).send("Error retrieving pos_voo entries");
        return;
      }
      console.log('pos_voo entries retrieved successfully');
      res.status(200).json(results); // Send the pos_voo entries as JSON response
    });
  });
  
 // Route to handle PATCH requests for updating pos_voo entries by id_plano
router.patch('/:id', (req, res) => {
    //variavel global database
    const db = global.db;
    const idPlano = req.params.id;
  
    // Extracting updated pos_voo data from request body
    const updatedPosVooData = req.body;
  
    // SQL query to update pos_voo entries by id_plano
    const query = `
      UPDATE pos_voo 
      SET ?,
      updatedOn = CURDATE()
      WHERE id_plano = ?
    `;
    
    // Execute the SQL query with updated pos_voo data and id_plano as parameters
    db.query(query, [updatedPosVooData, idPlano], (error, results, fields) => {
      if (error) {
        console.error('Error updating pos_voo entries:', error);
        res.status(500).send("Error updating pos_voo entries");
        return;
      }
      if (results.affectedRows === 0) {
        // If no rows were affected, it means no pos_voo entries were found with the provided id_plano
        res.status(404).send("pos_voo entries not found for the provided id");
        return;
      }
      console.log('pos_voo entries updated successfully');
      res.status(200).send("pos_voo entries updated successfully");
    });
  });
   
  

// exporta as rotas para o server.js
module.exports = router;