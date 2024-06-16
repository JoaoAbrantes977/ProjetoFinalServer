const express = require('express');
const router = express.Router();

// Route to handle GET requests to obtain info on the drones
router.get('/', (req, res) => {
    //variavel global database
    const db = global.db;
  
    // SQL query to retrieve process_info entries by id_pos
    const query = 'SELECT * FROM drone';
  
    // Execute the SQL query with id_pos as a parameter
    db.query(query, (error, results, fields) => {
      if (error) {
        console.error('Error retrieving process_info entries:', error);
        res.status(500).send("Error retrieving process_info entries");
        return;
      }
      console.log('drone entries retrieved successfully');
      res.status(200).json(results); // Send the process_info entries as JSON response
    });
  });


// exporta as rotas para o server.js
module.exports = router;