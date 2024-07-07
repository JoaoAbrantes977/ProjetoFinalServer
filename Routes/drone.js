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
  
// PRoute to handle POST requests to add new drones
router.post('/', (req, res) => {
      //variavel global database
      const db = global.db;

    const {
      gama,
      propulsao,
      num_rotores,
      peso,
      alcance_max,
      altitude_max,
      tempo_voo_max,
      tempo_bateria,
      velocidade_max,
      velocidade_ascente,
      velocidade_descendente,
      resistencia_vento,
      temperatura,
      sistema_localizacao,
      tipo_camera,
      comprimento_img,
      largura_img,
      fov,
      resolucao_cam
    } = req.body;
  
    const query = `
      INSERT INTO drone (
        gama,
        propulsao,
        num_rotores,
        peso,
        alcance_max,
        altitude_max,
        tempo_voo_max,
        tempo_bateria,
        velocidade_max,
        velocidade_ascente,
        velocidade_descendente,
        resistencia_vento,
        temperatura,
        sistema_localizacao,
        tipo_camera,
        comprimento_img,
        largura_img,
        fov,
        resolucao_cam,
        createdOn,
        updatedOn,
        id_fabricante
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)
    `;
  
    const values = [
      gama,
      propulsao,
      num_rotores,
      peso,
      alcance_max,
      altitude_max,
      tempo_voo_max,
      tempo_bateria,
      velocidade_max,
      velocidade_ascente,
      velocidade_descendente,
      resistencia_vento,
      temperatura,
      sistema_localizacao,
      tipo_camera,
      comprimento_img,
      largura_img,
      fov,
      resolucao_cam,
      1
    ];
  
    db.query(query, values, (error, results, fields) => {
      if (error) {
        console.error('Error inserting drone:', error);
        res.status(500).json({ error: 'Failed to insert drone' });
      } else {
        res.status(201).json({ message: 'Drone inserted successfully', droneId: results.insertId });
      }
    });
  });

// Route to delete a drone based on it's id
router.delete('/:id', async (req, res) => {
    const droneId = req.params.id;
  
    try {
      const result = await global.db.query('DELETE FROM drone WHERE id = ?', [droneId]);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Drone deleted successfully' });
      } else {
        res.status(404).json({ error: 'Drone not found' });
      }
    } catch (error) {
      console.error('Error deleting drone:', error);
      res.status(500).json({ error: 'Failed to delete drone' });
    }
  });
  
  
// exporta as rotas para o server.js
module.exports = router;