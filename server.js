const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// user 
const userRoute = require("./Routes/user");
// inspection
const inspectionRoute = require("./Routes/inspection");
// flight_plan
const flightRoute = require("./Routes/flight_plan");
// after_flight
const afterFlightRoute = require("./Routes/after_flight");
// process_info
const processInfoRoute = require("./Routes/process_info");
// drone
const droneRoute = require("./Routes/drone");
// report
const reportRoute = require("./Routes/reports");

// Routes
app.use('/user', userRoute);
app.use('/inspection', inspectionRoute);
app.use('/flightPlan', flightRoute);
app.use('/afterFlight',afterFlightRoute);
app.use('/processInfo',processInfoRoute);
app.use('/drone',droneRoute);
app.use('/report',reportRoute);

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