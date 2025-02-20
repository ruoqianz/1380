/** @typedef {import("../types").Callback} Callback */
/** @typedef {import("../types").Node} Node */
const { error } = require("console");
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
    console.log(433)
    const gid = remote.gid || "local";
    const postData = serialization.serialize(message);
    const options = {
        hostname: remote.node.ip,  
        port: remote.node.port,              
        path: `/${gid}/${remote.service}/${remote.method}`,       
        method: 'PUT',                  
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData) 
        }
        
    };
    console.log(remote)
    
    const req = http.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
            responseData += chunk;
        });
    
        res.on('end', () => {
            const parsedData = serialization.deserialize(responseData);
            if (parsedData.error){
                return callback(new Error("Invalid or missing parameters"), null);
            }
            callback(null, parsedData.data);
        });
        res.on('error', (error) => {
            callback(error, null);
        });
    });

    req.on('error', (error) => {

        callback(error, null);
    });

    req.write(postData); 
    req.end(); 


}

module.exports = {send};
