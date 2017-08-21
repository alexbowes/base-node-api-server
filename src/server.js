const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
const helmet = require('helmet')
const expressValidator = require('express-validator');
const Errors = require('./utils/Errors');
const performRequestValidation = require('./middlewares/PerformRequestValidation');
const errorHandler = require('./middlewares/ErrorHandler');

let app = express();

// Set (and create if required) log dir to ../logs 
let logDir = path.resolve(__dirname, '../logs');
fs.existsSync(logDir) || fs.mkdirSync(logDir);

// Create a rotating write stream for access log
let accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: logDir
});

// Set local variables than can be access in any req
app.locals.CONFIG_ENV = {
    port: process.env.PORT || 3000
};

// Load Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(helmet())
app.use(morgan('combined', { stream: accessLogStream }));
app.use( performRequestValidation ); //must come after express validator

// Load V1 Routes
fs.readdirSync(`${__dirname}/routes/v1/`).forEach(function (filename) {
    let Router = require(`${__dirname}/routes/v1/${filename}`);
    let router = new Router();
    router.useWith(app, '/v1/');
});

// Load Error Middlewares (Note MUST be last)
app.use( errorHandler );


// Start
app.listen(app.locals.CONFIG_ENV.port, function () {
    console.log(`Server is listening on port ${app.locals.CONFIG_ENV.port}`);
});


//Exporting app is required for integration testing
module.exports = app;
