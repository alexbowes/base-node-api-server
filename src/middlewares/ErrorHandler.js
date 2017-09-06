const logger = require("../utils/Logger");

function handleErrors(err, req, res, next) {
    logger.error(err);
    res.status(err.statusCode || 500).json(err);
}

module.exports = handleErrors;
