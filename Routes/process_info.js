const express = require('express');
const router = express.Router();

// Route to handle POST requests for creating entries in the "process_info" table
router.post('/create', (req, res) => {
    //variavel global database
    const db = global.db;
  
    // Extracting data for "process_info" from request body
    const processInfoData = req.body;
  
    // SQL query to insert data into the "process_info" table
    const query = 'INSERT INTO process_info SET ?, createdOn = CURDATE(), updatedOn = CURDATE()';
  
    // Execute the SQL query
    db.query(query, processInfoData, (error, results, fields) => {
      if (error) {
        console.error('Error inserting data into process_info table:', error);
        res.status(500).send("Error inserting data into process_info table");
        return;
      }
      console.log('Data inserted successfully into process_info table');
      res.status(200).send("Data inserted successfully into process_info table");
    });
  });
  
// Route to handle GET requests for retrieving process_info entries by id_pos
router.get('/:id', (req, res) => {
    //variavel global database
    const db = global.db;
    const idPos = req.params.id;
  
    // SQL query to retrieve process_info entries by id_pos
    const query = 'SELECT * FROM process_info WHERE id_pos = ?';
  
    // Execute the SQL query with id_pos as a parameter
    db.query(query, [idPos], (error, results, fields) => {
      if (error) {
        console.error('Error retrieving process_info entries:', error);
        res.status(500).send("Error retrieving process_info entries");
        return;
      }
      console.log('process_info entries retrieved successfully');
      res.status(200).json(results); // Send the process_info entries as JSON response
    });
  });
  
// Route to handle PATCH requests for updating process_info entries by id
router.patch('/:id', (req, res) => {
    //variavel global database
    const db = global.db;
    const id = req.params.id;
  
    // Extracting updated process_info data from request body
    const updatedProcessInfoData = req.body;
  
    // SQL query to update process_info entries by id
    const query = `
      UPDATE process_info 
      SET ?,
      updatedOn = CURDATE()
      WHERE id = ?
    `;
    
    // Execute the SQL query with updated process_info data and id as parameters
    db.query(query, [updatedProcessInfoData, id], (error, results, fields) => {
      if (error) {
        console.error('Error updating process_info entries:', error);
        res.status(500).send("Error updating process_info entries");
        return;
      }
      if (results.affectedRows === 0) {
        // If no rows were affected, it means no process_info entries were found with the provided id
        res.status(404).send("process_info entry not found for the provided id");
        return;
      }
      console.log('process_info entry updated successfully');
      res.status(200).send("process_info entry updated successfully");
    });
  });
  
// exporta as rotas para o server.js
module.exports = router;