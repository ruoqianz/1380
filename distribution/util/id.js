/** @typedef {import("../types.js").Node} Node */

const assert = require('assert');
const crypto = require('crypto');

// The ID is the SHA256 hash of the JSON representation of the object
/** @typedef {!string} ID */

/**
 * @param {any} obj
 * @return {ID}
 */
function getID(obj) {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(obj));
  return hash.digest('hex');
}

/**
 * The NID is the SHA256 hash of the JSON representation of the node
 * @param {Node} node
 * @return {ID}
 */
function getNID(node) {
  node = {ip: node.ip, port: node.port};
  return getID(node);
}

/**
 * The SID is the first 5 characters of the NID
 * @param {Node} node
 * @return {ID}
 */
function getSID(node) {
  return getNID(node).substring(0, 5);
}


function getMID(message) {
  const msg = {};
  msg.date = new Date().getTime();
  msg.mss = message;
  return getID(msg);
}

function idToNum(id) {
  const n = parseInt(id, 16);
  assert(!isNaN(n), 'idToNum: id is not in KID form!');
  return n;
}

function naiveHash(kid, nids) {
  nids.sort();
  return nids[idToNum(kid) % nids.length];
}

function consistentHash(kid, nids) {

  const sortedNids = [...nids].sort();


  for (const nid of sortedNids) {
    if (nid >= kid) {
      return nid;
    }
  }

  return sortedNids[0];
}


function computeWeight(kid, nid) {

  const combined = kid + nid;
  return crypto.createHash('sha256').update(combined).digest();
}



function rendezvousHash(kid, nids) {


  return nids.reduce((selected, nid) => {
    const weightSelected = computeWeight(kid, selected);
    const weightNid = computeWeight(kid, nid);

    return weightNid.compare(weightSelected) > 0 ? nid : selected;
  }, nids[0]);
}

module.exports = {
  getID,
  getNID,
  getSID,
  getMID,
  naiveHash,
  consistentHash,
  rendezvousHash,
  idToNum,
};
