const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// utilizador 
const userRoute = require("./Routes/user");
// inspecao
const inspectionRoute = require("./Routes/inspection");
// plano_voo
const flightRoute = require("./Routes/flight_plan");
// pos_voo
const afterFlightRoute = require("./Routes/after_flight");
// process_info
const processInfoRoute = require("./Routes/process_info");
// drone
const droneRoute = require("./Routes/drone");

// Routes
app.use('/user', userRoute);
app.use('/inspection', inspectionRoute);
app.use('/flightPlan', flightRoute);
app.use('/afterFlight',afterFlightRoute);
app.use('/processInfo',processInfoRoute);
app.use('/drone',droneRoute);

//CODE FOR CONNECTION TO DATABASE
const db = mysql.createConnection({
    host:"localhost",
    port:"3306",
    user:"root",
    database:"cenas",
    });
    
    db.connect(function(err){
    if(err)throw err;
    
    console.log("Database Connected!");
    
    });

    //Global variable for the mysql connection
    global.db = db;
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })