// Main Startin gPoint of the Application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router.js');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
mongoose.Promise = require('bluebird');

// DB Setup
/**
we have to set the database variable to heroku also
DATABASEURL= mongodb://mosbah:fikra@ds161029.mlab.com:61029/fikra_tool;
*/
// var url = process.env.DATABASEURL || "mongodb://localhost:fikra/fikra";
// mongoose.connect(url);

mongoose.connect('mongodb://mosbah:fikra@ds161029.mlab.com:61029/fikra_tool');




// App Setup

//Register our middlewares using app.use()
app.use(bodyParser.json({type:"*/*"}));
app.use(cors());
// morgen is middleware, each request will come through morgan
// morgan shows some info in console when we get request
app.use(morgan('combined'));
router(app);


// Server Setup
const port = process.env.PORT || 3090;

// const server = http.createServer(app);
// server.liten(port);

app.listen(port,process.env.IP,function(){
   console.log("SERVER IS RUNNING on Port 3090 !");
});
