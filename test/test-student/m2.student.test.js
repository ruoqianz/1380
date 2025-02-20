/*
    In this file, add your own test cases that correspond to functionality introduced for each milestone.
    You should fill out each test case so it adequately tests the functionality you implemented.
    You are left to decide what the complexity of each test case should be, but trivial test cases that abuse this flexibility might be subject to deductions.

    Imporant: Do not modify any of the test headers (i.e., the test('header', ...) part). Doing so will result in grading penalties.
*/

const distribution = require('../../config.js');
const config = {ip: '127.0.0.1', port: 2345};
const local = distribution.local;
const comm = distribution.local.comm;
const id = distribution.util.id;
test('(1 pts) student test null service', (done) => {
  // Fill out this test case...
  const nullService = {};

  nullService.n = () => {
    return 2;
  };

  local.routes.put(nullService, 'n', (e, v) => {
    local.routes.get('n', (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v.n()).toBe(2);
        done();
      } catch (error) {
        done(new Error('Not implemented'));
      }
    });
  });
    
});


test('(1 pts) student test', (done) => {
  local.status.get('123', (e, v) => {
    try {
      expect(e).toBeDefined();
      expect(e).toBeInstanceOf(Error);
      expect(v).toBeFalsy();
      done();
    } catch (error) {
      done(error);
    }
  });
});


test('(1 pts) student test', (done) => {
  // Fill out this test case...
  local.routes.get('comm', (e, v) => {
    try {
      expect(e).toBeFalsy();
      expect(v).toBe(comm);
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('(1 pts) student test', (done) => {
  // Fill out this test case...
  const node = distribution.node.config;
  const remote = {node: node, service: 'status', method: 'get'};
  const message = [
    'nid',
  ];

  local.comm.send(message, remote, (e, v) => {
    try {
      expect(e).toBeFalsy();
      expect(v).toBe(id.getNID(node));
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('(1 pts) student test', (done) => {
  // Fill out this test case...
  const node = distribution.node.config;
  const remote = {node: node, service: 'status', method: 'get'};
  const message = [
    'ip',
  ];

  local.comm.send(message, remote, (e, v) => {
    try {
      expect(e).toBeFalsy();
      expect(v).toBe(node.ip);
      done();
    } catch (error) {
      done(error);
    }
  });
});

let localServer = null;

beforeAll((done) => {
  distribution.node.start((server) => {
    localServer = server;
    done();
  });
});

afterAll((done) => {
  localServer.close();
  done();
});
