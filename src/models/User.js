'use strict';

const BaseSimpleModel = require('./BaseSimpleModel');

const faker = require('faker');
const DEFAULT_NUM_USERS = 20;


class User extends BaseSimpleModel {

    constructor() {
        super( Array.apply(null, Array(DEFAULT_NUM_USERS)).map(generateUser) )
    }

}

/*
 * Generates a new User using Faker Library.
 */
function generateUser() {
    let user = faker.helpers.userCard();
    user.id = faker.random.uuid();
    return user;
}


module.exports = User;
