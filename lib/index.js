'use strict';
const IntervalTreeNode = require('./IntervalTreeNode');
const root = Symbol('root');


class IntervalTree {
  constructor () {
    this[root] = null;
  }

  insert (start, end, data) {
    const node = new IntervalTreeNode(start, end, data);

    if (this[root] === null) {
      this[root] = node;
    } else {
      this[root].insert(node);
    }
  }

  find (start, end) {
    const results = [];

    if (end === undefined) {
      end = start;
    }

    if (this[root] !== null) {
      this[root].find(start, end, results);
    }

    return results;
  }
}

module.exports = IntervalTree;
