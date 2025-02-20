# distribution

This is the distribution library. When loaded, distribution introduces functionality supporting the distributed execution of programs. To download it:

## Installation

```sh
$ npm i '@brown-ds/distribution'
```

This command downloads and installs the distribution library.

## Testing

There are several categories of tests:
  *	Regular Tests (`*.test.js`)
  *	Scenario Tests (`*.scenario.js`)
  *	Extra Credit Tests (`*.extra.test.js`)
  * Student Tests (`*.student.test.js`) - inside `test/test-student`

### Running Tests

By default, all regular tests are run. Use the options below to run different sets of tests:

1. Run all regular tests (default): `$ npm test` or `$ npm test -- -t`
2. Run scenario tests: `$ npm test -- -c` 
3. Run extra credit tests: `$ npm test -- -ec`
4. Run the `non-distribution` tests: `$ npm test -- -nd`
5. Combine options: `$ npm test -- -c -ec -nd -t`

## Usage

To import the library, be it in a JavaScript file or on the interactive console, run:

```js
let distribution = require("@brown-ds/distribution");
```

Now you have access to the full distribution library. You can start off by serializing some values. 

```js
let s = distribution.util.serialize(1); // '{"type":"number","value":"1"}'
let n = distribution.util.deserialize(s); // 1
```

You can inspect information about the current node (for example its `sid`) by running:

```js
distribution.local.status.get('sid', console.log); // 8cf1b
```

You can also store and retrieve values from the local memory:

```js
distribution.local.mem.put({name: 'nikos'}, 'key', console.log); // {name: 'nikos'}
distribution.local.mem.get('key', console.log); // {name: 'nikos'}
```

You can also spawn a new node:

```js
let node = { ip: '127.0.0.1', port: 8080 };
distribution.local.status.spawn(node, console.log);
```

Using the `distribution.all` set of services will allow you to act 
on the full set of nodes created as if they were a single one.

```js
distribution.all.status.get('sid', console.log); // { '8cf1b': '8cf1b', '8cf1c': '8cf1c' }
```

You can also send messages to other nodes:

```js
distribution.all.comm.send(['sid'], {node: node, service: 'status', method: 'get'}, console.log); // 8cf1c
```

# Results and Reflections

# M1: Serialization / Deserialization


## Summary

> Summarize your implementation, including key challenges you encountered. Remember to update the `report` section of the `package.json` file with the total number of hours it took you to complete each task of M1 (`hours`) and the lines of code per task.


My implementation comprises 2 software components, totaling `200` lines of code. Key challenges included handling recursion for objects and arrays and JSON data format was consistently incorrect when I call json.parse. Firstly, I encountered a "stack max" issue because I was recursively applying JSON.stringify. After extensive debugging with console.log and researching, I switched to using a for loop combined with recursive calls to serialize(), which ultimately resolved the problem.


## Correctness & Performance Characterization


> Describe how you characterized the correctness and performance of your implementation


*Correctness*: I wrote `5` tests; these tests take `0.5` to execute. This includes objects with Nested Object Serialization, Special Character String Handling, Date Object Serialization, Negative Number Serialization and Various Data Types Handling.


*Performance*: The latency of various subsystems is described in the `"latency"` portion of package.json. The characteristics of my development machines are summarized in the `"dev"` portion of package.json.
> ...
# M2: Actors and Remote Procedure Calls (RPC)


## Summary

> Summarize your implementation, including key challenges you encountered. Remember to update the `report` section of the `package.json` file with the total number of hours it took you to complete each task of M2 (`hours`) and the lines of code per task.


My implementation comprises `3` software components, totaling `150` lines of code. Key challenges included how to communicate with other node, I need to understand how the communicate works. I figure out the flow about the communication and then implement comm and node function easily.Also I met some challenges when work on rpc scenarios.I managed to solve the problem by following the hints in the handout "Think carefully about which parts of an RPC computation execute locally and which ones execute remotely.".


## Correctness & Performance Characterization

> Describe how you characterized the correctness and performance of your implementation


*Correctness*: I wrote `5` tests; these tests take `0.4s` to execute.


*Performance*: I characterized the performance of comm and RPC by sending 1000 service requests in a tight loop. Average throughput and latency is recorded in `package.json`.


## Key Feature

> How would you explain the implementation of `createRPC` to someone who has no background in computer science ¡ª i.e., with the minimum jargon possible?
Imagine you have a bakery, but your friend in another city has an amazing recipe for chocolate cake. You want to make the cake, but you don¡¯t have the recipe. Instead of traveling to your friend's city, you call or text your friend and say:

"Hey, can you bake the cake for me and send me the result?"

Your friend follows the recipe, bakes the cake, and then sends it back to you. Now you have the cake, even though the work was done in another city.