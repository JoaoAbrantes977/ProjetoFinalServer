const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const userRoute = require("./Routes/user");

// Routes
app.use('/user', userRoute);


//CODE FOR CONNECTION TO DATABASE
const dbase = mysql.createConnection({
    host:"localhost",
    port:"3306",
    user:"root",
    database:"projeto_final",
    });
    
    dbase.connect(function(err){
    if(err)throw err;
    
    console.log("Database Connected!");
    
    });

  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })