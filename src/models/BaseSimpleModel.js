'use strict';

const faker = require('faker');

const CREATE_ACTION = "create";
const UPDATE_ACTION = "update";


class BaseSimpleModel {

    constructor(objects) {
        this.objects = objects || [];

        if (new.target === BaseSimpleModel) {
            throw new TypeError("Cannot construct BaseSimpleModel instances directly");
        }
    }

    /**
     * Get all objects
     * @returns {Promise.<Array, Error>} A promise that returns an array if resolved and an error if rejected. Array will 
     * be empty if there are no objects 
     */
    all() {
        return Promise.resolve(this.objects);
    }

    /**
     * Gets object with specified ID
     * @param {*} id unique to object
     * @returns {Promise.<*, Error>} A promise that returns object with specified id or null (no matching id) if resolved and an error if rejected.
     */
    get(id) {
        let obj = this.objects.filter(o => o.id === id);
        switch (obj.length) {
            case 0: return Promise.resolve(null);
            case 1: return Promise.resolve(obj[0]);
            default: return Promise.reject(new Error(`More than one object exists with id ${id}`));
        }
    }

    /**
     * Creates a new object and adds it to object list. An id will be generated if required.
     * @param {*} obj to create. 
     * @returns {Promise.<*, Error>} A promise that returns the successfully added object if resolved and an error if rejected.
     */
    create(obj) {
        obj.id = faker.random.uuid();
        this.objects.push(obj);
        return Promise.resolve(obj);
    }

    /**
     * Partially updates the object if id is found. Otherwise creates object.
     * @param {*} id of object to update
     * @param {*} obj to update or create
     * @returns {Promise.<Object, Error>} A promise that returns the successfully updated or created object if resolved and an error if rejected. The 'action' property will specify if the action was create or update 
     */
    updateOrCreate(id, obj) {
        let delta = null;
        this.objects.forEach(function (o) {
            if (id === o.id) {
                Object.assign(o, obj);
                delta = o;
            }
        });

        let action = delta !== null ? UPDATE_ACTION : CREATE_ACTION;

        //Created
        if (delta === null) {
            obj.id = id;
            this.objects.push(obj);
            delta = obj;
        }

        return Promise.resolve({
            'action': action,
            'value': delta
        });
    }

    /**
     * Replaces the object if id is found. Otherwise creates object.
     * @param {*} id of object to update
     * @param {*} obj to update or create
     * @returns {Promise.<Object, Error>} A promise that returns the successfully replaced or created object if resolved and an error if rejected. The 'action' property will specify if the action was create or update 
     */
    replaceOrCreate(id, obj) {
        let index = this.objects.findIndex(o => id === o.id);
        let action = "";

        //replace
        if (index >= 0) {
            obj.id = id;
            this.objects[index] = obj;
            action = UPDATE_ACTION;
        }

        //create
        else {
            obj.id = id;
            this.objects.push(obj);
            action = CREATE_ACTION;
        }

        return Promise.resolve({
            'action': action,
            'value': obj
        });
    }


    /**
     * Deletes Object with ID
     * @param {*} id of object to delete
     * @returns {Promise.<boolean, Error>} A promise that returns true if successfully deleted and false if would not be deleted when resolved and an error if rejected.
     */
    delete(id) {
        let len = this.objects.length;
        this.objects = this.objects.filter(o => o.id !== id);
        return Promise.resolve(this.objects.length < len);
    }

}


module.exports = BaseSimpleModel;
