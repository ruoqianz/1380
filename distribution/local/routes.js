/** @typedef {import("../types").Callback} Callback */

const log = require("../util/log");

const table = {};

/**
 * @param {string} configuration
 * @param {Callback} callback
 * @return {void}
 */
function get(configuration, callback) {
  let error = undefined,
    config = undefined,
    gid = undefined,
    service = undefined;
  if (configuration instanceof Object) {
    service = configuration.service;
    gid = configuration.gid || 'local';
  } else {
    service = configuration;
    gid = "local";
  }
  callback = callback || function(e,v){if(e){callback(e,null)}};
  if (gid === "local" && service in table) {
    config = table[service];
    callback(error, config);
  } else if (gid && gid in global.distribution && service in global.distribution[gid]) {
    config = global.distribution[gid][service];
    callback(error, config);
  } else if (global.toLocal[service]) {
    const rpc = global.toLocal[service];
    config = { call: rpc };
    callback(error, config);
  } else {
    error = new Error(`'${service}' doesn't exist!`);
  }
  
  return config;
}

/**
 * @param {object} service
 * @param {string} configuration
 * @param {Callback} callback
 * @return {void}
 */
function put(service, configuration, callback) {
  callback = callback || function(e,v){if(e){ callback(e, null);}}

  table[configuration] = service;
  callback(undefined, service);
}

/**
 * @param {string} configuration
 * @param {Callback} callback
 */
function rem(configuration, callback) {

  callback = callback || function(e,v){if(e){ callback(e, null);}}
  if (configuration in table) {
    delete route_table[configuration];
  } else {
    error = new Error(`${configuration} doesn't exist!`);
  }
  callback(error, configuration);
}

module.exports = { get, put, rem };
