
/**
 * Distributed status service.
 *
 * @param {object} config - Configuration object. Expected to include a 'gid' property.
 * @return {object} - An object with distributed status methods: get, spawn, stop.
 */
const status = function(config) {
  const context = {};
  // Use provided group id or default to 'all'
  context.gid = config.gid || 'all';

  return {
    /**
     * Retrieves and aggregates status information from all nodes in the group.
     * Each node is expected to return an object with properties:
     *   - count
     *   - heapTotal
     *   - heapUsed
     *
     * The responses are aggregated by summing the corresponding fields.
     *
     * @param {object} configuration - Additional configuration if needed.
     * @param {import("../types").Callback} callback - Callback invoked with aggregated results.
     */
    get: (configuration, callback = (e, v) => console.log(v)) => {
      // Use the distributed comm service to send a "get" request.
      global.distribution[context.gid].comm.send([configuration], { service: "status", method: "get", gid: context.gid }, (e, v) => {
        callback(e, v);
      });

    },

    spawn: (configuration, callback) => {
      global.distribution[context.gid].comm.send([configuration], { service: "status", method: "spawn", gid: context.gid }, (e, v) => {
        callback(e, v);
      });
    },

    stop: (callback) => {
      global.distribution[context.gid].comm.send([], { service: "status", method: "stop", gid: context.gid }, (e, v) => {
        callback(e, v);
      });
    },
  };
};

module.exports = status;