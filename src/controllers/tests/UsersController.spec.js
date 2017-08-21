const chai = require('chai');
const sinon = require('sinon');
const httpMocks = require('node-mocks-http');
const expressValidator = require('express-validator')();
const performRequestValidation = require('../../middlewares/PerformRequestValidation');
const Errors = require('../../utils/Errors');
const uuid = require('uuid/v4');
const expect = chai.expect;

const UsersController = require('../UsersController');

let req, res, next, spy, usersController;

describe('UsersController', function () {

    beforeEach(function (done) {
        usersController = new UsersController();

        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = function noop() { };

        expressValidator(req, {}, () => {
            performRequestValidation(req, {}, done);
        });
    });

    describe('#getAllUsers', function () {

        it('should call res.json with an array', function () {
            spy = res.json = sinon.spy();

            return usersController
                .getAllUsers(req, res)
                .then(() => {
                    expect(spy.calledOnce).to.be.true;

                    let args = spy.args[0]; //args of first call
                    let users = args[0];
                    expect(users).to.be.an('Array');
                });
        });

    });

    describe('#getUserById', function () {

        it('should call res.json with an object when id is valid', function () {
            let validUser = usersController.user.objects[0];
            spy = res.json = sinon.spy();

            req.params.id = validUser.id;

            return usersController
                .getUserById(req, res, next)
                .then(() => {
                    expect(spy.calledOnce).to.be.true;

                    let args = spy.args[0]; //args of first call
                    let user = args[0];
                    expect(user).to.be.an('Object');
                });
        });

        it('should call next with a ValidationError when id is not a UUID', function () {
            let validUser = usersController.user.objects[0];
            spy = next = sinon.spy();

            req.params.id = "abcd";

            return usersController
                .getUserById(req, res, next)
                .then(() => {
                    expect(spy.calledOnce).to.be.true;

                    let args = spy.args[0]; //args of first call
                    let error = args[0];
                    expect(error).to.be.instanceof(Errors.ValidationError);
                });
        });

        it('should call next with a ResourceNotFound error when id is not found', function () {
            spy = next = sinon.spy();
            req.params.id = uuid();

            return usersController
                .getUserById(req, res, next)
                .then(() => {
                    expect(spy.calledOnce).to.be.true;

                    let args = spy.args[0]; //args of first call
                    let error = args[0];
                    expect(error).to.be.instanceof(Errors.ResourceNotFound);
                });
        });

    });


    describe('#createUser', function () {

        it('should call res.json with the created user object', function () {
            let newUser = {
                name: "newUser",
                username: "newUsername",
                email: "newUser@email.com"
            };

            spy = res.json = sinon.spy();

            Object.assign(req.body, newUser);

            return usersController
                .createUser(req, res, next)
                .then(() => {
                    expect(spy.calledOnce).to.be.true;

                    let args = spy.args[0]; //args of first call
                    let user = args[0];
                    expect(user).to.be.an('Object');
                });
        });

        it('should call next with a ValidationError when a body.name is not specified', function () {
            spy = next = sinon.spy();
            Object.assign(req.body, {
                username: "newUsername",
                email: "newUser@email.com"
            });

            return usersController
                .createUser(req, res, next)
                .then(() => {
                    expect(spy.calledOnce).to.be.true;

                    let args = spy.args[0]; //args of first call
                    let error = args[0];
                    expect(error).to.be.instanceof(Errors.ValidationError);
                });
        });


        it('should call next with a ValidationError when a body.username is not specified', function () {
            spy = next = sinon.spy();
            Object.assign(req.body, {
                name: "newUser",
                email: "newUser@email.com"
            });

            return usersController
                .createUser(req, res, next)
                .then(() => {
                    expect(spy.calledOnce).to.be.true;

                    let args = spy.args[0]; //args of first call
                    let error = args[0];
                    expect(error).to.be.instanceof(Errors.ValidationError);
                });
        });

        it('should call next with a ValidationError when a body.email is not specified', function () {
            spy = next = sinon.spy();
            Object.assign(req.body, {
                name: "newUser",
                username: "newUsername"
            });

            return usersController
                .createUser(req, res, next)
                .then(() => {
                    expect(spy.calledOnce).to.be.true;

                    let args = spy.args[0]; //args of first call
                    let error = args[0];
                    expect(error).to.be.instanceof(Errors.ValidationError);
                });
        });

        it('should call next with a ValidationError when a body.email is not an email', function () {
            spy = next = sinon.spy();
            Object.assign(req.body, {
                name: "newUser",
                username: "newUsername",
                email: "notAnEmail"
            });

            return usersController
                .createUser(req, res, next)
                .then(() => {
                    expect(spy.calledOnce).to.be.true;

                    let args = spy.args[0]; //args of first call
                    let error = args[0];
                    expect(error).to.be.instanceof(Errors.ValidationError);
                });
        });
    });


    describe('#updateOrCreateUser', function () {

        it('should call res.json with the created user object', function () {
            let newUser = {
                name: "newUser",
                username: "newUsername",
                email: "newUser@email.com"
            };

            spy = res.json = sinon.spy();

            Object.assign(req.body, newUser);
            req.params.id = uuid();

            return usersController
                .updateOrCreateUser(req, res, next)
                .then(() => {
                    expect(spy.calledOnce).to.be.true;

                    let args = spy.args[0]; //args of first call
                    let user = args[0];
                    expect(user).to.be.an('Object');
                });
        });

        it('should call res.json with the updated user object', function () {
            let curUser = usersController.user.objects[0];
            curUser.name = "newName";

            spy = res.json = sinon.spy();

            Object.assign(req.body, curUser);
            req.params.id = uuid();

            return usersController
                .updateOrCreateUser(req, res, next)
                .then(() => {
                    expect(spy.calledOnce).to.be.true;

                    let args = spy.args[0]; //args of first call
                    let user = args[0];
                    expect(user).to.be.an('Object');
                });
        });

        it('should call next with a ValidationError when id is not a UUID', function () {
            let curUser = usersController.user.objects[0];
            curUser.name = "newName";

            spy = next = sinon.spy();

            Object.assign(req.body, curUser);
            req.params.id = "abcd";

            return usersController
                .updateOrCreateUser(req, res, next)
                .then(() => {
                    expect(spy.calledOnce).to.be.true;

                    let args = spy.args[0]; //args of first call
                    let error = args[0];
                    expect(error).to.be.instanceof(Errors.ValidationError);
                });
        });

        it('should call next with a ValidationError when body properties are not valid', function () {
            let newUser = {
                name: "newUser",
                username: "newUsername",
                email: "notAValidEmail"
            };

            spy = next = sinon.spy();

            Object.assign(req.body, newUser);
            req.params.id = uuid();

            return usersController
                .updateOrCreateUser(req, res, next)
                .then(() => {
                    expect(spy.calledOnce).to.be.true;

                    let args = spy.args[0]; //args of first call
                    let error = args[0];
                    expect(error).to.be.instanceof(Errors.ValidationError);
                });
        });

    });


    describe('#replaceOrCreateUser', function () {

        it('should call res.json with the created user object', function () {
            let newUser = {
                name: "newUser",
                username: "newUsername",
                email: "newUser@email.com"
            };

            spy = res.json = sinon.spy();

            Object.assign(req.body, newUser);
            req.params.id = uuid();

            return usersController
                .replaceOrCreateUser(req, res, next)
                .then(() => {
                    expect(spy.calledOnce).to.be.true;

                    let args = spy.args[0]; //args of first call
                    let user = args[0];
                    expect(user).to.be.an('Object');
                });
        });

        it('should call res.json with the updated user object', function () {
            let curUser = usersController.user.objects[0];
            curUser.name = "newName";

            spy = res.json = sinon.spy();

            Object.assign(req.body, curUser);
            req.params.id = uuid();

            return usersController
                .replaceOrCreateUser(req, res, next)
                .then(() => {
                    expect(spy.calledOnce).to.be.true;

                    let args = spy.args[0]; //args of first call
                    let user = args[0];
                    expect(user).to.be.an('Object');
                });
        });

        it('should call next with a ValidationError when id is not a UUID', function () {
            let curUser = usersController.user.objects[0];
            curUser.name = "newName";

            spy = next = sinon.spy();

            Object.assign(req.body, curUser);
            req.params.id = "abcd";

            return usersController
                .replaceOrCreateUser(req, res, next)
                .then(() => {
                    expect(spy.calledOnce).to.be.true;

                    let args = spy.args[0]; //args of first call
                    let error = args[0];
                    expect(error).to.be.instanceof(Errors.ValidationError);
                });
        });

        it('should call next with a ValidationError when body properties are not valid', function () {
            let newUser = {
                name: "newUser",
                username: "newUsername",
                email: "notAValidEmail"
            };

            spy = next = sinon.spy();

            Object.assign(req.body, newUser);
            req.params.id = uuid();

            return usersController
                .replaceOrCreateUser(req, res, next)
                .then(() => {
                    expect(spy.calledOnce).to.be.true;

                    let args = spy.args[0]; //args of first call
                    let error = args[0];
                    expect(error).to.be.instanceof(Errors.ValidationError);
                });
        });


    });


    describe('#deleteUserById', function () {

        it('should call res.send with no arguments when id is valid', function () {
            let validUser = usersController.user.objects[0];
            spy = res.send = sinon.spy();
            req.params.id = validUser.id;

            return usersController
                .deleteUserById(req, res, next)
                .then(() => {
                    expect(spy.calledOnce).to.be.true;

                    let args = spy.args[0]; //args of first call
                    expect(args).to.have.length(0);
                });
        });

        it('should call next with a ValidationError when id not valid format', function () {
            spy = next = sinon.spy();
            req.params.id = "";

            return usersController
                .deleteUserById(req, res, next)
                .then(() => {
                    expect(spy.calledOnce).to.be.true;

                    let args = spy.args[0]; //args of first call
                    let error = args[0];
                    expect(error).to.be.instanceof(Errors.ValidationError);
                });
        });

        it('should call next with a ResourceNotFound when id not found', function () {
            spy = next = sinon.spy();
            req.params.id = uuid();

            return usersController
                .deleteUserById(req, res, next)
                .then(() => {
                    expect(spy.calledOnce).to.be.true;

                    let args = spy.args[0]; //args of first call
                    let error = args[0];
                    expect(error).to.be.instanceof(Errors.ResourceNotFound);
                });
        });

    });

});
