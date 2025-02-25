/** @typedef {import("../types").Callback} Callback */
/** @typedef {import("../types").Node} Node */
const http = require('http');
const serialization = require("../util/serialization");
const log = require('../util/log');
/**
 * @typedef {Object} Target
 * @property {string} service
 * @property {string} method
 * @property {Node} node
 */

/**
 * @param {Array} message
 * @param {Target} remote
 * @param {Callback} [callback]
 * @return {void}
 */
function send(message, remote, callback) {
    const gid = remote.gid || "local";

    const postData = serialization.serialize(message);
    
    const options = {
        hostname: remote.node.ip,  
        port: remote.node.port,              
        path:`/${gid}/${remote.service}/${remote.method}`,       
        method: 'PUT',                  
        headers: {
            'Content-Type': 'application/json',
        }
        
    };
    const req = http.request(options, (res) => {
        
        let responseData = '';
        res.on('data', (chunk) => {
            responseData += chunk;
        });
        res.on("end", () => {
            responseData = serialization.deserialize(responseData);
            
            // Handle conditions that failed              
            callback(responseData.error, responseData.data);
            
        });
        res.on("error", err => console.error(err));
    });
    req.on('error', (error) => {

        callback(error, null);
    });

    req.write(postData); 
    req.end(); 


}

module.exports = {send};
