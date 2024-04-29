const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const router = express.Router();
const db = require("../server");

router.get('/', (req, res) => {
    res.send('Hello World From Express!')
  })

// Route to handle user registration
router.post('/register', (req, res) => {
  const db = global.db;
    const { nome, telefone, email, especialidade, password, pais_nome } = req.body;
  
    // Generate salt and hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error hashing password' });
      }
  
      // Get the id of the country based on its name
      const sqlGetCountryId = `SELECT id FROM pais WHERE nome = ?`;
  
      db.query(sqlGetCountryId, [pais_nome], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error fetching country id' });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ message: 'Country not found' });
        }
  
        const pais_id = results[0].id;
  
        // Insert the user with the hashed password and retrieved country id
        const sqlInsertUser = `INSERT INTO utilizador (nome, telefone, email, especialidade, password, createdOn, updatedOn, id_pais) 
                               VALUES (?, ?, ?, ?, ?, CURDATE(), CURDATE(), ?)`;
  
        db.query(sqlInsertUser, [nome, telefone, email, especialidade, hashedPassword, pais_id], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error registering user' });
          }
          
          // Generate JWT token for the registered user
          const secretKey = crypto.randomBytes(32).toString('hex');
          const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
          res.status(201).json({ message: 'User registered successfully', token });
        });
      });
    });
  });


// exporta as rotas para o server.js
module.exports = router;