const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const userRoute = require("./Routes/user");
const testeRoute = require("./Routes/teste");

// Routes
app.use('/user', userRoute);
app.use('/teste', testeRoute);

//CODE FOR CONNECTION TO DATABASE
const db = mysql.createConnection({
    host:"localhost",
    port:"3306",
    user:"root",
    database:"projeto_final",
    });
    
    db.connect(function(err){
    if(err)throw err;
    
    console.log("Database Connected!");
    
    });

    global.db = db;
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })