const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.send('Hello World From Express!')
  })


// exporta as rotas para o server.js
module.exports = router;