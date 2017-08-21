'use strict';

const express = require('express');

const User = require('../models/User.js');
const Errors = require('../utils/Errors');


class UsersController {

    constructor() {
        this.user = new User();
    }

    getAllUsers(req, res, next) {
        return this.user.all()
            .then(function (users) {
                return res.json(users);
            })
            .catch(err => next(new Errors.InternalServerError(err)));
    }

    getUserById(req, res, next) {
        validateId(req);

        let id = req.params.id;

        return req
            .performValidation()
            .then(() => this.user.get(id))
            .then(function (user) {
                if (user === null) {
                    return Promise.reject(new Errors.ResourceNotFound(`Unable to find user with id ${id}`));
                }
                res.json(user);
            })
            .catch(err => handleError(err, next));
    }

    createUser(req, res, next) {
        validateUser(req);

        return req.performValidation()
            .then(() => this.user.create(req.body))
            .then(function (createdUser) {
                return res.status(201).location(`/v1/users/${createdUser.id}`).json(createdUser);
            })
            .catch(err => handleError(err, next));
    }

    updateOrCreateUser(req, res, next) {
        validateId(req);
        validateUser(req);

        let id = req.params.id;

        return req.performValidation()
            .then(() => this.user.updateOrCreate(id, req.body))
            .then(function (response) {
                switch (response.action) {
                    case "create": return res.status(201).location(`/v1/users/${response.value.id}`).json(response.value);
                    case "update": return res.json(response.value);
                    default: return new Errors.InternalServerError(`Unknown response action returned. Action: ${response.action}`);
                }
            })
            .catch(err => handleError(err, next));
    }

    replaceOrCreateUser(req, res, next) {
        validateId(req);
        validateUser(req);

        let id = req.params.id;

        return req.performValidation()
            .then(() => this.user.replaceOrCreate(id, req.body))
            .then(function (response) {
                switch (response.action) {
                    case "create": return res.status(201).location(`/v1/users/${response.value.id}`).json(response.value);
                    case "update": return res.json(response.value);
                    default: return new Errors.InternalServerError(`Unknown response action returned. Action: ${response.action}`);
                }
            })
            .catch(err => handleError(err, next));
    }

    deleteUserById(req, res, next) {
        validateId(req);

        let id = req.params.id;

        return req
            .performValidation()
            .then(() => this.user.delete(id))
            .then(function (successful) {
                if (successful) {
                    return res.status(204).send();
                }
                return Promise.reject(new Errors.ResourceNotFound(`Unable to delete user with id ${id}`));
            })
            .catch(err => handleError(err, next));
    }

}

function validateId(req) {
    req.checkParams('id', 'id is not valid format').isUUID();
}

function validateUser(req) {
    req.checkBody('name', "User's name is not defined or a valid format").notEmpty();
    req.checkBody('username', "User's username is not defined or a valid format").notEmpty();
    req.checkBody('email', "User's username is not defined or a valid format").isEmail();
}

function handleError(err, next) {
    if (typeof err === Error) { next(new Errors.InternalServerError(err)) }
    next(err);
}

module.exports = UsersController;
