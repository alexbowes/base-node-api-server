const util = require('util');
const uuid = require('uuid/v4');

class InternalServerError extends Error {

    constructor(err) {
        super(err);

        //Update stack trace
        Error.captureStackTrace(this, this.constructor);

        this.name = "Internal Server Error";
        this.statusCode = 500;
        this.errorCode = uuid();

        // Show message as decription if a string
        if(Object.prototype.toString.call(err) === "[object String]"){
            this.description = err;
        }
    }

}

module.exports = InternalServerError;
