const util = require('util');
const uuid = require('uuid/v4');

class ResourceNotFound extends Error {

    constructor(message) {
        super(message);

        //Update stack trace
        Error.captureStackTrace(this, this.constructor);

        this.name = "Requested resource was not found.";
        this.statusCode = 404;
        this.errorCode = uuid();
        this.description = message;
    }

}

module.exports = ResourceNotFound;
