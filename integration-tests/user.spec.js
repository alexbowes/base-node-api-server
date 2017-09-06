const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const uuid = require('uuid/v4');
let server = require('../src/server');


describe('User route', function () {

    /*
     * GET /v1/users
     */
    describe('GET /v1/users', function () {

        it('should get an array and have status 200', (done) => {
            request(server)
                .get('/v1/users')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.body).to.be.a('array');
                    done();
                });
        });
    });


    /*
     * GET /v1/users
     */
    describe('GET /v1/users/:id', function () {
        let users;

        before(function (done) {
            request(server)
                .get('/v1/users')
                .end((err, res) => {
                    if (err) return done(err);
                    users = res.body;
                    done();
                });
        });

        it('should get an object and have status 200 when id is valid', function (done) {

            request(server)
                .get(`/v1/users/${users[0].id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.body).to.be.a('Object');
                    expect(res.body).to.have.property('id', users[0].id);
                    done();
                });
        });

        it('should get an Error and have status 404 when id is not found', function (done) {

            request(server)
                .get(`/v1/users/${uuid()}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.body).have.property('description');
                    expect(res.body).have.property('errorCode');
                    expect(res.body).have.property('name', 'Requested resource was not found.');
                    expect(res.body).have.property('statusCode', 404);
                    done();
                });
        });

        it('should get an Error and have status 400 when id is not valid', function (done) {

            request(server)
                .get(`/v1/users/notAUuid`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.body).have.property('errorCode');
                    expect(res.body).have.property('name', 'Request is not valid.');
                    expect(res.body).have.property('statusCode', 400);
                    expect(res.body).have.property('errors');
                    expect(res.body.errors).to.be.a('array');
                    done();
                });
        });

    });


    /*
     * POST /v1/users
     */
    describe('POST /v1/users/', function () {
        
        it('post', function (done) {

            let user = {
                name: "name",
                username: "userName",
                email: "email@email.com"
            };

            request(server)
                .post(`/v1/users`)
                .send(user)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.headers).to.have.property('location', `/v1/users/${res.body.id}`);
                    expect(res.body).to.be.a('Object');
                    done();
                });
        });

        it('post2', function (done) {

            let user = {
                name: "name"
            };

            request(server)
                .post(`/v1/users`)
                .send(user)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.body).have.property('errorCode');
                    expect(res.body.errors).to.be.a('array');
                    expect(res.body.errors).to.be.have.length(2);
                    done();
                });
        });


    });


    /*
     * POST /v1/users/:id
     */
    describe('PUT /v1/users/:id', function () {
        
        let users;
        
        before(function (done) {
            request(server)
                .get('/v1/users')
                .end((err, res) => {
                    if (err) return done(err);
                    users = res.body;
                    done();
                });
        });

        it('post id', function (done) {

            let user = {
                name: "name",
                username: "userName",
                email: "email@email.com"
            };

            request(server)
                .put(`/v1/users/${users[0].id}`)
                .send(user)
                //.set('Accept', 'application/json')
                //.expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);

                    //expect(res.headers).to.have.property('location', `/v1/users/${res.body.id}`);
                    expect(res.body).to.be.a('Object');
                    done();
                });
        });
    });

});
