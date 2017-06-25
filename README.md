# augmented-interval-tree

[![Current Version](https://img.shields.io/npm/v/augmented-interval-tree.svg)](https://www.npmjs.org/package/augmented-interval-tree)
[![Build Status via Travis CI](https://travis-ci.org/continuationlabs/augmented-interval-tree.svg?branch=master)](https://travis-ci.org/continuationlabs/augmented-interval-tree)
![Dependencies](http://img.shields.io/david/continuationlabs/augmented-interval-tree.svg)

[![belly-button-style](https://cdn.rawgit.com/continuationlabs/belly-button/master/badge.svg)](https://github.com/continuationlabs/belly-button)

Augmented interval tree implementation with no dependencies.

## Basic Usage

`augmented-interval-tree` exports a single `IntervalTree` constructor. After constructing an interval tree instance, intervals can be added to the tree using the `insert()` method. The tree can be queried using the `find()` method.

```javascript
const IntervalTree = require('augmented-interval-tree');
const tree = new IntervalTree();
let results;

tree.insert(5, 10, 'foo');
tree.insert(1, 2, 'bar');
tree.insert(3, 7, 'baz');
tree.insert(15, 15);

// Match all intervals.
results = tree.find(1, 20);
/*
results equals [
  { start: 5, end: 10, data: 'foo' },
  { start: 1, end: 2, data: 'bar' },
  { start: 3, end: 7, data: 'baz' },
  { start: 15, end: 15, data: undefined }
].
*/

// Match single point.
results = tree.find(15);
// results equals [{ start: 15, end: 15, data: undefined }].

// No matches.
results = tree.find(11, 14);
// results equals [].

results = tree.find(4, 6);
/*
results equals [
  { start: 5, end: 10, data: 'foo' },
  { start: 3, end: 7, data: 'baz' }
].
*/
```

## API

### `IntervalTree()` constructor

  - Arguments
    - None

Constructs a new augmented interval tree instance. Must be called with `new`.

### `IntervalTree.prototype.insert(start, end[, data])`

  - Arguments
    - `start` (number) - The interval's starting value (inclusive).
    - `end` (number) - The interval's ending value (inclusive).
    - `data` (value) - Optional data to store with the interval. Defaults to `undefined`.
  - Returns
    - Nothing

Inserts an interval into the tree. The interval spans from `start` (inclusive) to `end` (inclusive). `data` can be used to optionally store metadata with the interval.


### `IntervalTree.prototype.find(start[, end = start])`

  - Arguments
    - `start` (number) - The query interval's starting value (inclusive).
    - `end` (number) - The query interval's ending value (inclusive). Defaults to `start`, meaning that the query searches for all intervals containing a specific value.
  - Returns
    - `matches` (array of objects) - An array of intervals, where each interval adheres to the following schema:
      - `start` (number) - The interval's starting value.
      - `end` (number) - The interval's ending value.
      - `data` (value) - Any data stored with the interval.

Returns all intervals in the tree that overlap with the interval of `[start, end]`.
