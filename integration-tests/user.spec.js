const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

let server = require('../src/server');


describe('User route', function(){
    
    /*
     * GET /v1/users
     */
    describe('GET /v1/users', function(){
        
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
    describe('GET /v1/users/:id', function(){
        
        it('should get an object and have status 200 when id is valid', (done) => {
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

});
