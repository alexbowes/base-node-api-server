const chai = require('chai');
const expect = chai.expect;

const User = require('../User');

let user;

describe('User', function () {
    
    beforeEach(function () {
        user = new User();
    });
        
    describe('default data', function () {        
        
        it('should comprise of 20 objects', function () {
            expect(user.objects).to.have.length(20);        
        });

        it('for each user should have expected properties', function () {
            expect(user.objects[0]).to.have.property('name').that.is.a('string');
            expect(user.objects[0]).to.have.property('username').that.is.a('string');
            expect(user.objects[0]).to.have.property('email').that.is.a('string');
            expect(user.objects[0]).to.have.property('address').that.is.an('object');  
            expect(user.objects[0]).to.have.property('phone').that.is.a('string');
            expect(user.objects[0]).to.have.property('website').that.is.a('string');  
            expect(user.objects[0]).to.have.property('company').that.is.an('object');         
        });
    });
    
    describe('api', function () {        
        
        it('should have the #all method', function () {
            expect(user).to.respondTo('all');        
        });

        it('should have the #get method', function () {
            expect(user).to.respondTo('get');        
        });

        it('should have the #create method', function () {
            expect(user).to.respondTo('create');        
        });

        it('should have the #updateOrCreate method', function () {
            expect(user).to.respondTo('updateOrCreate');        
        });

        it('should have the #replaceOrCreate method', function () {
            expect(user).to.respondTo('replaceOrCreate');        
        });

        it('should have the #delete method', function () {
            expect(user).to.respondTo('delete');        
        });

    });
});
