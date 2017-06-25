'use strict';
const Lab = require('lab');
const IntervalTree = require('../lib');
const IntervalTreeNode = require('../lib/IntervalTreeNode');

const lab = exports.lab = Lab.script();
const expect = Lab.assertions.expect;
const describe = lab.describe;
const it = lab.it;


describe('IntervalTree', () => {
  function getRoot (tree) {
    const symbols = Object.getOwnPropertySymbols(tree);

    expect(symbols.length).to.equal(1);
    return tree[symbols[0]];
  }

  describe('constructor ()', () => {
    it('constructs an interval tree', (done) => {
      const tree = new IntervalTree();

      expect(tree).to.be.an.instanceof(IntervalTree);
      expect(getRoot(tree)).to.equal(null);
      done();
    });
  });

  describe('insert ()', () => {
    it('inserts intervals into tree', (done) => {
      const tree = new IntervalTree();

      expect(getRoot(tree)).to.equal(null);

      tree.insert(5, 10);
      const root = getRoot(tree);
      expect(root).to.be.an.instanceof(IntervalTreeNode);
      expect(root.start).to.equal(5);
      expect(root.end).to.equal(10);
      expect(root.max).to.equal(10);
      expect(root.left).to.equal(null);
      expect(root.right).to.equal(null);

      tree.insert(1, 2);
      expect(root.left.start).to.equal(1);
      expect(root.left.end).to.equal(2);
      expect(root.left.max).to.equal(2);
      expect(root.left.left).to.equal(null);
      expect(root.left.right).to.equal(null);
      expect(root.right).to.equal(null);

      tree.insert(3, 7);
      expect(root.left.right.start).to.equal(3);
      expect(root.left.right.end).to.equal(7);
      expect(root.left.right.max).to.equal(7);
      expect(root.left.right.left).to.equal(null);
      expect(root.left.right.right).to.equal(null);
      expect(root.left.left).to.equal(null);
      expect(root.left.max).to.equal(7);
      expect(root.max).to.equal(10);

      // Add an interval that starts and ends at the same position.
      tree.insert(15, 15);
      expect(root.right.start).to.equal(15);
      expect(root.right.end).to.equal(15);
      expect(root.right.max).to.equal(15);
      expect(root.right.left).to.equal(null);
      expect(root.right.right).to.equal(null);
      expect(root.max).to.equal(15);

      done();
    });
  });

  describe('find ()', () => {
    it('returns all overlapping ranges', (done) => {
      const tree = new IntervalTree();
      let results;

      // Returns an empty array when the tree is empty.
      results = tree.find(1, 20);
      expect(results).to.equal([]);

      tree.insert(5, 10, true);
      tree.insert(1, 2, false);
      tree.insert(3, 7, 1);
      tree.insert(15, 15, []);

      // Match all intervals.
      results = tree.find(1, 20);
      expect(results.length).to.equal(4);
      expect(results).to.include([
        { start: 5, end: 10, data: true },
        { start: 1, end: 2, data: false },
        { start: 3, end: 7, data: 1 },
        { start: 15, end: 15, data: [] }
      ]);

      // Match single point.
      results = tree.find(15);
      expect(results).to.equal([{ start: 15, end: 15, data: [] }]);

      // No matches.
      results = tree.find(11, 14);
      expect(results).to.equal([]);

      results = tree.find(4, 6);
      expect(results.length).to.equal(2);
      expect(results).to.include([
        { start: 5, end: 10, data: true },
        { start: 3, end: 7, data: 1 }
      ]);

      done();
    });
  });
});
