'use strict';

class IntervalTreeNode {
  constructor (start, end, data) {
    if (typeof start !== 'number' || Number.isNaN(start)) {
      throw new TypeError('start must be a number');
    }

    if (typeof end !== 'number' || Number.isNaN(end)) {
      throw new TypeError('end must be a number');
    }

    if (start > end) {
      throw new RangeError('start cannot be greater than end');
    }

    this.start = start;
    this.end = end;
    this.max = end;
    this.left = null;
    this.right = null;
    this.data = data;
  }

  insert (node) {
    if (node.end > this.max) {
      this.max = node.end;
    }

    if (compareIntervals(this, node) <= 0) {
      if (this.right === null) {
        this.right = node;
      } else {
        this.right.insert(node);
      }
    } else {
      if (this.left === null) {
        this.left = node;
      } else {
        this.left.insert(node);
      }
    }
  }

  find (start, end, results) {
    if (!(this.start > end || this.end < start)) {
      results.push({ start: this.start, end: this.end, data: this.data });
    }

    if (this.left !== null && this.left.max >= start) {
      this.left.find(start, end, results);
    }

    if (this.right !== null && start <= this.right.max) {
      this.right.find(start, end, results);
    }
  }
}

module.exports = IntervalTreeNode;


function compareIntervals (a, b) {
  if (a.start < b.start) {
    return -1;
  } else if (a.start === b.start) {
    return a.end <= b.end ? -1 : 1;
  } else {
    return 1;
  }
}
