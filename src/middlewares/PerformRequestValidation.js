const Errors = require('../errors/Errors');

function appendPerformValidationToRequest(req, res, next) {
    req.performValidation = function performValidation() {
        return req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    return Promise.reject(new Errors.ValidationError(result));
                }
            });
    }

    next();
}

module.exports = appendPerformValidationToRequest;
