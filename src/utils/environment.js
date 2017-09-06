/*
 * A common place for all envionment level configuration. Also ensures
 * env variables are only queried once. 
 */

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 3000;
const LOG_LEVEL = process.env.LOG_LEVEL || "info";


module.exports = {
    port: function(){ 
        return PORT; 
    },
    logLevel: function(){ 
        return LOG_LEVEL; 
    },
    isDevelopment: function(){
        return NODE_ENV !== "production";
    },
    isProduction: function(){
        return NODE_ENV === "production";
    }
};
