function handleErrors(err, req, res, next) {
    // Use a better logger here
    console.log(err);

    res.status(err.statusCode || 500).json(err);
}

module.exports = handleErrors;
