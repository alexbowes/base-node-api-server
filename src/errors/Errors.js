const fs = require("fs");

/* Load all Error classes */
let errorClasses = fs.readdirSync(__dirname + '/errors');

errorClasses.forEach(function (fn) {
    let name = fn.substring(0, fn.indexOf('.'));

    //Add Class as static property
    module.exports[name] = require('./errors/' + fn);
});
