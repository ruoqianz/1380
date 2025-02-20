/** @typedef {import("../types").Callback} Callback */
module.exports = {get, put, rem};
const status = require('./status');
const comm = require('./comm');
const routes = require('./routes');
let services = {status,comm,routes}
const log = require('../util/log');
const serialization = require("../util/serialization");
/**
 * @param {string} configuration
 * @param {Callback} callback
 * @return {void}
 */
function get(configuration, callback) {
    log(`start routes get `);
    callback = callback || function(){};
    let service = ""
    let result = ""
    if (configuration instanceof Object) {
        service = configuration.service;
        gid = configuration.gid || 'local';
      } else {
        service = configuration;
        gid = "local";
      }
      if (gid === "local" && service in services) {
        result = services[service];
        callback(null, result);
      }else if (gid && gid in global.distribution && service in global.distribution[gid]){
        result = global.distribution[gid][service];
        callback(null, result);
      }else if(!(service in global.distribution[gid])) {
        
        const rpc = global.toLocal[service];
      
        if (rpc) {
             callback(null, { call: rpc });
         } else {
             callback(new Error(`Service not found!`),null);
          }
    } 
}


/**
 * @param {object} service
 * @param {string} configuration
 * @param {Callback} callback
 * @return {void}
 */
function put(service, configuration, callback) {
    
    callback = callback || function(){};
    if (configuration instanceof Object) {
        config = configuration.service;
        gid = configuration.gid || 'local';
      } else {
        config = configuration;
        gid = "local";
      }
       if (gid === "local"){
        services[config] = service;
        
       }else{
        global.distribution[gid][config] = service
       }
       log(`put method successfully called`,serialization.serialize(service));
       callback(undefined, service);

}

/**
 * @param {string} configuration
 * @param {Callback} callback
 */
function rem(configuration, callback) {
    callback = callback || function(e,v) {};
    if (services.hasOwnProperty(configuration)) {
        delete services[configuration];

    } else {
        callback(new Error("Invalid or missing parameters"),null)

    }

}

module.exports = { get, put, rem };