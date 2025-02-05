/*
    In this file, add your own test cases that correspond to functionality introduced for each milestone.
    You should fill out each test case so it adequately tests the functionality you implemented.
    You are left to decide what the complexity of each test case should be, but trivial test cases that abuse this flexibility might be subject to deductions.

    Imporant: Do not modify any of the test headers (i.e., the test('header', ...) part). Doing so will result in grading penalties.
*/

const distribution = require('../../config.js');
const util = distribution.util;

test('(1 pts) student test', () => {
  // Fill out this test case...
  const nestedObject = {
    i: {
      n: 'Allen',
      s: [10, 20, 30],
    },
    b: true
  };

  const serialized = util.serialize(nestedObject);
  const deserialized = util.deserialize(serialized);

  expect(deserialized).not.toBeNull();
  expect(deserialized).toEqual(nestedObject);
});


test('(1 pts) student test', () => {
  // Fill out this test case...
  const bigString = 'Hello,\nWorld!\tCheck "quotes" and \\slashes\\'
  const o = { text: bigString };

  const serialized = util.serialize(o);
  const deserialized = util.deserialize(serialized);

  expect(deserialized.text).toBe(bigString);
});


test('(1 pts) student test', () => {
  // Fill out this test case...
  const date = new Date('2025-01-01T12:34:56Z');
  const objWithDate = { event: 'New Year', when: date };

  const serialized = util.serialize(objWithDate);
  const deserialized = util.deserialize(serialized);

  expect(deserialized.when instanceof Date).toBe(true);
  expect(deserialized.when.toISOString()).toBe(date.toISOString());
  expect(deserialized.event).toBe(objWithDate.event);
});

test('(1 pts) student test', () => {
  // Fill out this test case...
  const num = -10
  const serialized = util.serialize(num);
  const deserialized = util.deserialize(serialized);

  expect(deserialized).toBe(num);
});

test('(1 pts) student test', () => {
  // Fill out this test case...
  const input = {
    a: false,
    s: null,
    c: ['apple', 'banana', 'cherry']
  };

  const serialized = util.serialize(input);
  const deserialized = util.deserialize(serialized);

  expect(deserialized).toEqual(input);
});
