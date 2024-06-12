const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

// Generate JWT token for the registered user
const secretKey = "qwertyuiop";

// Route to handle user registration
router.post('/register', (req, res) => {

  // variavel global database
  const db = global.db;
  const { nome, telefone, email, especialidade, password, pais_nome, distrito_nome, municipio_nome, freguesia_nome, rua, codigo_postal } = req.body;
  
  // Generate salt and hash password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error hashing password' });
    }

    // Check if the email already exists in the database
    const sqlCheckEmail = `SELECT id FROM utilizador WHERE email = ?`;

    db.query(sqlCheckEmail, [email], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error checking email' });
      }

      if (results.length > 0) {
        // If the email already exists, send a 409 response
        return res.status(409).json({ message: 'Email already exists' });
      }

      // Obtain the id of the country based on the country name
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

        // Obtain the id of the district based on the district name and country id
        const sqlGetDistrictId = `SELECT distrito.id FROM distrito
                                  INNER JOIN pais ON distrito.id_pais = pais.id
                                  WHERE distrito.nome = ? AND pais.id = ?`;

        db.query(sqlGetDistrictId, [distrito_nome, pais_id], (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching district id' });
          }

          if (results.length === 0) {
            return res.status(404).json({ message: 'District not found' });
          }

          const distrito_id = results[0].id;

          // Obtain the id of the municipality based on the municipality name and district id
          const sqlGetMunicipalityId = `SELECT municipio.id FROM municipio
                                         INNER JOIN distrito ON municipio.id_distrito = distrito.id
                                         WHERE municipio.nome = ? AND distrito.id = ?`;

          db.query(sqlGetMunicipalityId, [municipio_nome, distrito_id], (err, results) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Error fetching municipality id' });
            }

            if (results.length === 0) {
              return res.status(404).json({ message: 'Municipality not found' });
            }

            const municipio_id = results[0].id;

            // Obtain the id of the parish based on the parish name and municipality id
            const sqlGetParishId = `SELECT freguesia.id FROM freguesia
                                     INNER JOIN municipio ON freguesia.id_municipio = municipio.id
                                     WHERE freguesia.nome = ? AND municipio.id = ?`;

            db.query(sqlGetParishId, [freguesia_nome, municipio_id], (err, results) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error fetching parish id' });
              }

              if (results.length === 0) {
                return res.status(404).json({ message: 'Parish not found' });
              }

              const freguesia_id = results[0].id;

              // Insert address
              const sqlInsertAddress = `INSERT INTO morada (rua, createdOn, updatedOn, codigo_postal, id_freguesia)
                                        VALUES (?, CURDATE(), CURDATE(), ?, ?)`;

              db.query(sqlInsertAddress, [rua, codigo_postal, freguesia_id], (err, result) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({ message: 'Error inserting address' });
                }

                const address_id = result.insertId;

                // Insert the user with the hashed password, retrieved country id, and address id
                const sqlInsertUser = `INSERT INTO utilizador (nome, telefone, email, especialidade, password, createdOn, updatedOn, id_morada) 
                                      VALUES (?, ?, ?, ?, ?, CURDATE(), CURDATE(), ?)`;

                db.query(sqlInsertUser, [nome, telefone, email, especialidade, hashedPassword, address_id], (err, result) => {
                  if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Error registering user' });
                  }
                  const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
                  res.status(200).json({ message: 'User registered successfully', token });
                });
              });
            });
          });
        });
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
          res.json({ token, userId: user.id });
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

// Edits the User
router.patch('/edit', verifyToken, (req, res) => {
  // Extract user ID from the JWT token
  const userId = req.userId;

  // Extract updated user information from the request body
  const { nome, telefone, email, especialidade } = req.body;

  // Update user information in the database
  db.query('UPDATE utilizador SET nome=?, telefone=?, email=?, especialidade=?, updatedOn = CURDATE() WHERE id=?',
      [nome, telefone, email, especialidade, userId],
      (err, result) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Error updating user information' });
          }
          res.status(200).json({ message: 'User information updated successfully' });
      }
  );
});

// Exports the routes to server.js
module.exports = router;