const chai = require('chai');
const expect = chai.expect;

const BaseSimpleModel = require('../BaseSimpleModel');

describe('BaseSimpleModel', function () {
    describe('constructor', function () {
        it('should throw a TypeError exception if contructed directly', function () {
            let constructDirectly = () => { new BaseSimpleModel([]) };
            expect( constructDirectly ).to.throw(TypeError);
        });
    });
});


function generateData(o, i){
    return {
        id: i,
        name: `name_${i}`,
        email: `email_${i}@email.com`,
        prop1: `prop1_${i}`,
        prop2: `prop2_${i}`
    }
}
