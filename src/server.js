const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const expressValidator = require('express-validator');

const Errors = require('./errors/Errors');
const performRequestValidation = require('./middlewares/PerformRequestValidation');
const errorHandler = require('./middlewares/ErrorHandler');
const environment = require('./utils/environment');
const logger = require('./utils/Logger');
const loggerSetup = logger.Setup();


let app = express();
loggerSetup.setupApplicationLogs();


// Load Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(loggerSetup.accessLogs());
app.use(performRequestValidation); //must come after express validator

// Load V1 Routes
fs.readdirSync(`${__dirname}/routes/v1/`).forEach(function (filename) {
    let Router = require(`${__dirname}/routes/v1/${filename}`);
    let router = new Router();
    router.useWith(app, '/v1/');
});

// Load Error Middlewares (Note MUST be last)
app.use(errorHandler);

// Start
app.listen(environment.port(), function () {
     logger.info(`Server is listening on port ${environment.port()}`);
});


//Exporting app is required for integration testing
module.exports = app;
