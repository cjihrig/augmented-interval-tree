'use strict';
const Lab = require('lab');
const IntervalTreeNode = require('../lib/IntervalTreeNode');

const lab = exports.lab = Lab.script();
const expect = Lab.assertions.expect;
const describe = lab.describe;
const it = lab.it;


describe('IntervalTreeNode', () => {
  describe('constructor ()', () => {
    const invalidBoundaries = [undefined, null, true, false, {}, [], '', NaN];

    it('constructs an interval tree node', (done) => {
      let node = new IntervalTreeNode(2, 3);
      expect(node).to.be.an.instanceof(IntervalTreeNode);
      expect(node.start).to.equal(2);
      expect(node.end).to.equal(3);
      expect(node.max).to.equal(node.end);
      expect(node.left).to.equal(null);
      expect(node.right).to.equal(null);
      expect(node.data).to.equal(undefined);

      // Verify that start === end case works.
      node = new IntervalTreeNode(3, 3, 100);
      expect(node).to.be.an.instanceof(IntervalTreeNode);
      expect(node.start).to.equal(3);
      expect(node.end).to.equal(node.start);
      expect(node.max).to.equal(node.end);
      expect(node.left).to.equal(null);
      expect(node.right).to.equal(null);
      expect(node.data).to.equal(100);

      done();
    });

    it('throws if start is invalid', (done) => {
      invalidBoundaries.forEach((value) => {
        expect(() => {
          // eslint-disable-next-line no-new
          new IntervalTreeNode(value, 100);
        }).to.throw(TypeError, 'start must be a number');
      });
      done();
    });

    it('throws if end is invalid', (done) => {
      invalidBoundaries.forEach((value) => {
        expect(() => {
          // eslint-disable-next-line no-new
          new IntervalTreeNode(0, value);
        }).to.throw(TypeError, 'end must be a number');
      });
      done();
    });

    it('throws if start is greater than end', (done) => {
      invalidBoundaries.forEach((value) => {
        expect(() => {
          // eslint-disable-next-line no-new
          new IntervalTreeNode(2, 1);
        }).to.throw(RangeError, 'start cannot be greater than end');
      });
      done();
    });
  });

  describe('insert ()', () => {
    it('inserts nodes into the tree', (done) => {
      const root = new IntervalTreeNode(5, 10);
      let node;

      expect(root.max).to.equal(10);

      node = new IntervalTreeNode(15, 25, { foo: 'bar' });
      root.insert(node);
      expect(root.max).to.equal(25);
      expect(root.left).to.equal(null);
      expect(root.right).to.equal(node);
      expect(root.right.max).to.equal(25);
      expect(root.right.data).to.equal({ foo: 'bar' });

      node = new IntervalTreeNode(1, 12);
      root.insert(node);
      expect(root.max).to.equal(25);
      expect(root.left).to.equal(node);
      expect(root.left.max).to.equal(12);

      node = new IntervalTreeNode(8, 16);
      root.insert(node);
      expect(root.max).to.equal(25);
      expect(root.right.left).to.equal(node);
      expect(root.right.right).to.equal(null);
      expect(root.right.left.max).to.equal(16);

      node = new IntervalTreeNode(14, 20);
      root.insert(node);
      expect(root.max).to.equal(25);
      expect(root.right.left.right).to.equal(node);
      expect(root.right.left.left).to.equal(null);
      expect(root.right.left.right.max).to.equal(20);
      expect(root.right.left.max).to.equal(20);

      node = new IntervalTreeNode(18, 21);
      root.insert(node);
      expect(root.max).to.equal(25);
      expect(root.right.right).to.equal(node);
      expect(root.right.right.max).to.equal(21);

      node = new IntervalTreeNode(2, 8);
      root.insert(node);
      expect(root.max).to.equal(25);
      expect(root.left.right).to.equal(node);

      done();
    });

    it('handles intervals with the same starting point', (done) => {
      const root = new IntervalTreeNode(5, 10, 'foo');

      root.insert(new IntervalTreeNode(5, 12, 'boop'));
      root.insert(new IntervalTreeNode(5, 10, 'baz'));
      root.insert(new IntervalTreeNode(5, 9, 'bar'));
      root.insert(new IntervalTreeNode(5, 11, 'beep'));

      expect(root.data).to.equal('foo');
      expect(root.right.data).to.equal('boop');
      expect(root.right.left.data).to.equal('baz');
      expect(root.left.data).to.equal('bar');
      expect(root.right.left.right.data).to.equal('beep');
      done();
    });
  });

  describe('find ()', () => {
    it('returns all overlapping ranges', (done) => {
      let results;

      const root = new IntervalTreeNode(5, 10);
      root.insert(new IntervalTreeNode(15, 25));
      root.insert(new IntervalTreeNode(1, 12));
      root.insert(new IntervalTreeNode(8, 16));
      root.insert(new IntervalTreeNode(14, 20));
      root.insert(new IntervalTreeNode(18, 21, /foo/));
      root.insert(new IntervalTreeNode(2, 8, null));

      // Match all intervals.
      results = [];
      root.find(1, 25, results);
      expect(results.length).to.equal(7);
      expect(results).to.include([
        { start: 5, end: 10, data: undefined },
        { start: 15, end: 25, data: undefined },
        { start: 1, end: 12, data: undefined },
        { start: 8, end: 16, data: undefined },
        { start: 14, end: 20, data: undefined },
        { start: 18, end: 21, data: /foo/ },
        { start: 2, end: 8, data: null }
      ]);

      // Match no intervals.
      results = [];
      root.find(26, 1000, results);
      expect(results.length).to.equal(0);
      root.find(0, 0, results);
      expect(results.length).to.equal(0);

      // Match a single interval.
      results = [];
      root.find(13, 13, results);
      expect(results.length).to.equal(1);
      expect(results).to.include([{ start: 8, end: 16, data: undefined }]);

      done();
    });

    it('handles intervals with the same starting point', (done) => {
      const root = new IntervalTreeNode(5, 10, 'foo');
      let results = [];

      root.insert(new IntervalTreeNode(5, 12, 'boop'));
      root.insert(new IntervalTreeNode(5, 10, 'baz'));
      root.insert(new IntervalTreeNode(5, 9, 'bar'));
      root.insert(new IntervalTreeNode(5, 11, 'beep'));

      results = [];
      root.find(5, 12, results);
      expect(results.length).to.equal(5);
      expect(results).to.include([
        { start: 5, end: 10, data: 'foo' },
        { start: 5, end: 12, data: 'boop' },
        { start: 5, end: 10, data: 'baz' },
        { start: 5, end: 9, data: 'bar' },
        { start: 5, end: 11, data: 'beep' }
      ]);

      results = [];
      root.find(12, 12, results);
      expect(results).to.equal([{ start: 5, end: 12, data: 'boop' }]);

      done();
    });
  });
});
