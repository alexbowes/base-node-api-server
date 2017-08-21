const chai = require('chai');
const expect = chai.expect;

const BaseSimpleModel = require('../BaseSimpleModel');

/**
 * Setup: A simple BaseSimpleModle with 20 items
 */
class BaseSimpleModelImpl extends BaseSimpleModel {
    constructor() {
        super(Array.apply(null, Array(20)).map(generateData))
    }
}

function generateData(o, i) {
    return {
        id: i,
        name: `name_${i}`,
        email: `email_${i}@email.com`,
        prop1: `prop1_${i}`,
        prop2: `prop2_${i}`
    }
}

// ---------------- Tests ----------------

let baseSimpleModelImpl;

describe('BaseSimpleModel sub classes', function () {

    beforeEach(function () {
        baseSimpleModelImpl = new BaseSimpleModelImpl();
    });


    /**
     * All
     */
    describe('#all', function () {
        it('should return a promise with 20 items', function () {
            return baseSimpleModelImpl.all()
                .then((items) => expect(items).to.have.length(20));
        });

        it('should return a promise with items that have the correct data format', function () {
            return baseSimpleModelImpl.all()
                .then((items) => {
                    expect(items[0].id).to.equal(0);
                    expect(items[0].name).to.equal("name_0");
                    expect(items[0].email).to.equal("email_0@email.com");
                    expect(items[0].prop1).to.equal("prop1_0");
                    expect(items[0].prop2).to.equal("prop2_0");
                });
        });
    });

    /**
     * get(id)
     */
    describe('#get', function () {
        it('should return a promise that resolves object with specified id', function () {
            return baseSimpleModelImpl.get(5)
                .then((object) => expect(object.id).to.equal(5));
        });

        it('should return a promise that resolves null when specified id is not found', function () {
            return baseSimpleModelImpl.get(20)
                .then((object) => expect(object).to.equal(null));
        });

        it('should return a promise that rejects when an internal error occurs', function () {
            //Simulate a duplicate entry
            baseSimpleModelImpl.objects.push( baseSimpleModelImpl.objects[0] ); 
            
            return baseSimpleModelImpl.get(0)
                .catch((err) => expect(err).to.be.an.instanceOf(Error));
        });

    });

    /**
     * get(create)
     */
    describe('#create', function () {
        const obj = {
            name: "name",
            email: "email@email.com",
            test: "test"
        };
    
        it('should return a promise that resolves the created object', function () {
            return baseSimpleModelImpl.create(obj)
                .then((created) => {
                    expect(created.name).to.equal("name");
                    expect(created.email).to.equal("email@email.com");
                    expect(created.test).to.equal("test");
                });
        });

        it('should return a promise that resolves the created object with a generated id', function () {
            return baseSimpleModelImpl.create(obj)
                .then((created) => expect(created).to.have.property('id'));
        });

        it('should add created objects to this.objects', function () {
            return baseSimpleModelImpl.create(obj)
                .then((created) => {
                    let ids = baseSimpleModelImpl.objects.map( (o) => o.id );                    
                    expect(ids).to.include(created.id);
                });
        });
    });


    /**
     * updateOrCreate(id, obj)
     */
    describe('#updateOrCreate', function () {
        const obj = {
            name: "updatedName",
            prop1: "updatedProp1",
            newProp: "newProp"
        };
        
        it('should return a promise that resolves an object with an action property', function () {
            return baseSimpleModelImpl.updateOrCreate(2, obj)
                .then((resp) => expect(resp).to.have.property('action'));
        });

        it('should return a promise that resolves an object with a value property', function () {
            return baseSimpleModelImpl.updateOrCreate(2, obj)
                .then((resp) => expect(resp).to.have.property('value'));
        });

        // ----- update -----

        it('should return a promise that resolves an object with an action property = update', function () {
            return baseSimpleModelImpl.updateOrCreate(2, obj)
                .then((resp) => expect(resp).to.have.property('action', 'update'));
        });

        it('should return a promise that resolves an object that is partially updated', function () {
            return baseSimpleModelImpl.updateOrCreate(2, obj)
                .then((resp) => {                    
                    expect(resp).to.have.property('value');
                    expect(resp.value).to.have.property('id', 2);
                });
        });

        it('should update the properties specified', function () {
            return baseSimpleModelImpl.updateOrCreate(2, obj)
                .then((resp) => {
                    expect(resp.value).to.have.property('name', 'updatedName');
                    expect(resp.value).to.have.property('prop1', 'updatedProp1');
                    expect(resp.value).to.have.property('newProp', 'newProp');
                });
        });

        it('should not modify the properties not specified', function () {
            return baseSimpleModelImpl.updateOrCreate(2, obj)
                .then((resp) => {
                    expect(resp.value).to.have.property('email', 'email_2@email.com');
                    expect(resp.value).to.have.property('prop2', 'prop2_2');
                });
        });

        // ----- create -----
 
        it('should return a promise that resolves an object with an action property = create', function () {
            //200 is an id not currently present -> trigger create
            return baseSimpleModelImpl.updateOrCreate(200, obj)
                .then((resp) => expect(resp).to.have.property('action', 'create'));
        });
 
        it('should return a promise that resolves the object that is created', function () {
            return baseSimpleModelImpl.updateOrCreate(20, obj)
                .then((resp) => {
                    expect(resp.value).to.have.property('id', 20);
                    expect(resp.value).to.have.property('name', 'updatedName');
                    expect(resp.value).to.have.property('prop1', 'updatedProp1');
                    expect(resp.value).to.have.property('newProp', 'newProp');
                });
        });

        it('should add created object to this.objects with the correct id', function () {
            return baseSimpleModelImpl.updateOrCreate(20, obj)
                .then((resp) => {
                    let created = baseSimpleModelImpl.objects.filter(o => o.id === 20)[0];                    
                    expect(created).to.exist;
                });
        });      

    });


    /**
     * replaceOrCreate(id, obj)
     */    
    describe('#replaceOrCreate', function () {
        const obj = {
            name: "updatedName",
            prop1: "updatedProp1",
            newProp: "newProp"
        };

        it('should return a promise that resolves an object with an action property', function () {
            return baseSimpleModelImpl.replaceOrCreate(2, obj)
                .then((resp) => expect(resp).to.have.property('action'));
        });

        it('should return a promise that resolves an object with a value property', function () {
            return baseSimpleModelImpl.replaceOrCreate(2, obj)
                .then((resp) => expect(resp).to.have.property('value'));
        });

        // ----- replace -----

        it('should return a promise that resolves an object with an action property = update', function () {
            return baseSimpleModelImpl.replaceOrCreate(2, obj)
                .then((resp) => expect(resp).to.have.property('action', 'update'));
        });

        it('should return a promise that resolves an object that is replaced', function () {
            return baseSimpleModelImpl.replaceOrCreate(2, obj)
                .then((resp) => {                    
                    expect(resp).to.have.property('value');
                    expect(resp.value).to.have.property('id', 2);
                });
        });

        it('should update the properties specified', function () {
            return baseSimpleModelImpl.replaceOrCreate(2, obj)
                .then((resp) => {
                    expect(resp.value).to.have.property('name', 'updatedName');
                    expect(resp.value).to.have.property('prop1', 'updatedProp1');
                    expect(resp.value).to.have.property('newProp', 'newProp');
                });
        });

        it('should completely replace the object', function () {
            return baseSimpleModelImpl.replaceOrCreate(2, obj)
                .then((resp) => {
                    expect(resp.value).to.not.have.property('email');
                    expect(resp.value).to.not.have.property('prop2');
                });
        });

        // ----- create -----
 
        it('should return a promise that resolves an object with an action property = create', function () {
            //200 is an id not currently present -> trigger create
            return baseSimpleModelImpl.replaceOrCreate(200, obj)
                .then((resp) => expect(resp).to.have.property('action', 'create'));
        });
 
        it('should return a promise that resolves the object that is created', function () {
            return baseSimpleModelImpl.replaceOrCreate(20, obj)
                .then((resp) => {
                    expect(resp.value).to.have.property('id', 20);
                    expect(resp.value).to.have.property('name', 'updatedName');
                    expect(resp.value).to.have.property('prop1', 'updatedProp1');
                    expect(resp.value).to.have.property('newProp', 'newProp');
                });
        });

        it('should add created object to this.objects with the correct id', function () {
            return baseSimpleModelImpl.replaceOrCreate(20, obj)
                .then((resp) => {
                    let created = baseSimpleModelImpl.objects.filter(o => o.id === 20)[0];                    
                    expect(created).to.exist;
                });
        });
    
    });


    /**
     * delete(id)
     */    
    describe('#delete', function () {
        
        it('should return a promise that resolves a boolean that is true when the delete is successful', function () {
            return baseSimpleModelImpl.delete(2)
                .then((resp) => expect(resp).to.be.true);
        });

        it('should return a promise that resolves a boolean that is true when the delete is not successful', function () {
            return baseSimpleModelImpl.delete(20)
                .then((resp) => expect(resp).to.be.false);
        });

        it('should delete the object from this.objects', function () {
            return baseSimpleModelImpl.delete(2)
                .then((resp) => {
                    expect(baseSimpleModelImpl.objects).to.have.length(19);
                    
                    let deleted = baseSimpleModelImpl.objects.filter(o => o.id === 2)[0];
                    expect(deleted).to.not.exist;
                });
        });

        it('should not have removed any objects if id is not found', function () {
            return baseSimpleModelImpl.delete(20)
                .then((resp) => {
                    expect(baseSimpleModelImpl.objects).to.have.length(20);
                    
                    let deleted = baseSimpleModelImpl.objects.filter(o => o.id === 2)[0];
                    expect(deleted).to.exist;
                });
        });

    });

});
