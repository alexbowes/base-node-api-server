const express = require('express');

class BaseRouter {

    constructor(route) {
        this.route = route;
        this.router = express.Router();
    }

    useWith(expressApp, _basePath) {
        let basePath = _basePath ? _basePath : "/";
        expressApp.use(`${basePath}${this.route}`, this.router);
    }

}

module.exports = BaseRouter;
