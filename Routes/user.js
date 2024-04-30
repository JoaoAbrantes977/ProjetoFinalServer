const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//const crypto = require('crypto');
const router = express.Router();
//const db = require("../server");

// Generate JWT token for the registered user
const secretKey = "qwertyuiop";

router.get('/', (req, res) => {
    res.send('Hello World From Express!')
  })

// Route to handle user registration
router.post('/register', (req, res) => {

    //variavel global database
    const db = global.db;
    const { nome, telefone, email, especialidade, password, pais_nome } = req.body;
    console.log(req.body.pais_nome)
    // Generate salt and hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error hashing password' });
      }
  
      // Obtem o id do Pais baseado no nome do pais
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
          const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
          res.status(201).json({ message: 'User registered successfully', token });
        });
      });
    });
  });

// Login Endpoint
router.post('/login', (req, res) => {
  const db = global.db;
  const { email, password } = req.body;
  
  // Check if user exists
  db.query('SELECT * FROM utilizador WHERE email = ?', email, (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error logging in' });
      }

      if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      const user = results[0];

      // Compare hashed passwords
      bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Error comparing passwords' });
          }

          if (!isMatch) {
              return res.status(401).json({ message: 'Invalid email or password' });
          }

          // Passwords match, generate JWT token
          const token = jwt.sign({ id: user.id, email: user.email }, secretKey);
          res.json({ token });
      });
  });
});

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }
    req.userId = decoded.id;
    next();
  });
}

// Protected Route Example
router.get('/profile', verifyToken, (req, res) => {

  //variavel global database
  const db = global.db;
  const userId = req.userId;
  // Fetch user profile from database using userId
  db.query('SELECT * FROM utilizador WHERE id = ?', userId, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching profile' });
    } else {
      const user = results[0];
      res.json({ user });
    }
  });
});

// exporta as rotas para o server.js
module.exports = router;