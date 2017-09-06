/*
 * This configuration file will configure the loggers for this application. 
 * We use two logging libraries:
 * 1) Morgan for automatically logging requests to an access log
 * 2) Winston for logging all application flows. 
 * 
 * Configuration:
 * NODE_ENV=production will disable all console logging
 * LOG_LEVEL="level" -> https://www.npmjs.com/package/winston#logging-levels
 */

const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const winston = require('winston');
const rfs = require('rotating-file-stream');
require('winston-daily-rotate-file');

const environment = require('./environment');

// Expect logs to be put in project/logs
const LOG_DIR = path.resolve(__dirname, '../../logs');
const ACCESS_LOG_DIR = path.join(LOG_DIR, 'access');
const APP_LOG_DIR = path.join(LOG_DIR, 'app');

class LoggerSetup{
    constructor(){
        fs.existsSync(LOG_DIR) || fs.mkdirSync(LOG_DIR);
        fs.existsSync(ACCESS_LOG_DIR) || fs.mkdirSync(ACCESS_LOG_DIR);
        fs.existsSync(APP_LOG_DIR) || fs.mkdirSync(APP_LOG_DIR);        
    }

    setupApplicationLogs(){
        // Configure Winston Logger
        // For real prod environments we should be using ELK or another log stack for clustered environments
        // https://www.npmjs.com/package/winston-logstash
        winston.configure({
            level: environment.logLevel(),
            transports: [
                new (winston.transports.DailyRotateFile)({ 
                    filename: path.join(APP_LOG_DIR, '.log'),
                    datePattern: 'yyyy-MM-dd.',
                    prepend: true
                })
            ]
        });

        // Allow console logger for development environment
        if(environment.isDevelopment()){
            winston.add(winston.transports.Console);
        }
    }

    accessLogs(){
        // Create a rotating write stream for access log
        let accessLogStream = rfs('access.log', {
            interval: '1d', // rotate daily
            path: ACCESS_LOG_DIR
        });

        return morgan('combined', { stream: accessLogStream })
    }
}

class Logger{
    constructor(){}

    static Setup() {
        return new LoggerSetup();
    }
}

//Copy over Winston functionality
Object.assign(Logger, winston);


// Export
module.exports = Logger;
