const { boolean } = require("yargs");
const comm = require("../all/comm");
const fs = require('fs');
const os = require('os');

const nativeToIdMap = new Map([
  [console.log, 'console.log'],
  [fs.readFile, 'fs.readfile'],
  [require('console').log, 'consoleLogFromRequire'],
]);

const idToNativeMap = new Map();
for (const [nativeFun, nativeId] of nativeToIdMap.entries()) {
  idToNativeMap.set(nativeId, nativeFun);
}

function serialize(object) {

  if (nativeToIdMap.has(object)) {
    return JSON.stringify({
      type: "native",
      value: nativeToIdMap.get(object)
    });
  }
  if (typeof object === "string") {

    return `{"type":"string","value":${JSON.stringify(object)}}`; 
  }

  if (typeof object === "number") {

    return `{"type":"number","value":"${JSON.stringify(object)}"}`; 
  }

  if (object === undefined) {
    return  `{"type":"undefined","value":"undefined"}`;
  } 

  if (typeof object === "function") {
      
    return `{"type":"function","value":"${object.toString()}"}`; 
  }

  
  if (object instanceof Error) {

    return `{"type":"error","value":"${object.toString().slice(7)}"}`; 
  }

  if (typeof object === "boolean") {

    return `{"type":"boolean","value":"${JSON.stringify(object)}"}`; 
  }

  if (object === null) {

    return `{"type":"null","value":"${JSON.stringify(object)}"}`; 
  }
  
  if(object instanceof Date){
    return `{"type":"date","value":${JSON.stringify(object)}}`
  }

  if(object instanceof Array){
    const arrResult = [] ;
    for (const key in object) {
      arrResult.push(serialize(object[key]).trim());
    }
    // 
    return JSON.stringify({
      type: "array",
      value: arrResult
    });
  }

  
  if (Object.prototype.toString.call(object) === '[object Object]') {
    
    const resultObj = {};
    for (const key in object) {
      resultObj[key] = serialize(object[key]).trim();
    }
    
    return JSON.stringify({
      type: "object",
      value: resultObj
    }).trim();
}
}


function deserialize(string) {
  
  while (typeof string === "string"){
    
    string = JSON.parse(string);
  }

  if (string.type === "native") {
    const nativeVal = idToNativeMap.get(string.value);
    return nativeVal;
  }
  
  if(string.type == "undefined"){
    return undefined
  }

  if(string.type == "string"){
    return string.value
  }

  if(string.type == "number"){
    return Number(string.value)
  }

  if(string.type == "function"){
    return eval(`(${string.value})`)
  }

  if(string.type == "error"){
    
    return new Error(string.value)
  }

  if(string.type == "boolean"){
    return JSON.parse(string.value)
  } 
  
  if(string.type == "null"){
    return null
  }

  if(string.type == "date"){
    return new Date(string.value);
  }

  if(string.type == "array"){
    const result = [];
    for(i in string.value ){

      result.push(deserialize(string.value[i]))
    }

    return result
  }

  if(string.type == "object"){
    const result = {};
    for(i in string.value ){  
      result[i] = deserialize(string.value[i])
    }
  
  return result
}
}
module.exports = {
  serialize: serialize,
  deserialize: deserialize,
};
