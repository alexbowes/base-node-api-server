const util = require('util');
const uuid = require('uuid/v4');

class ValidationError extends Error {

    constructor(validationResult) {
        super(`Request is not valid. Details: ${util.inspect(validationResult.array())}`);

        //Update stack trace
        Error.captureStackTrace(this, this.constructor);

        this.name = "Request is not valid.";
        this.statusCode = 400;
        this.errorCode = uuid();
        this.errors = validationResult.array();
    }

}

module.exports = ValidationError;
