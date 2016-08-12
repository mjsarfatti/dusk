/* global describe, it, window, document, dusk, _duskImmediateSelect, _duskReadySelect */
/* eslint func-names: 0, prefer-arrow-callback: 0 */

function err() { throw new Error(); }

describe('Dusk', function () {

  it('should exist and be a function', function () {
    if (typeof dusk !== 'function') err();
  });

  it('should accept 0 arguments', function () {
    if (typeof dusk() !== 'object' || dusk().length !== 0) {
      err();
    }
  });

  it('should create a new instance every time it is called', function () {
    const $dusk1 = dusk();
    const $dusk2 = dusk();
    if ($dusk1 === $dusk2) {
      err();
    }
  });

  it('should fail to select before DOMReady', function () {
    if (_duskImmediateSelect.length !== 0) err();
  });

});

describe('Dusk DOM Ready', function () {

  it('should run if attached before DOMReady', function () {
    if (_duskReadySelect.length !== 1) err();
  });

  it('should run if attached after DOMReady', function (done) {
    this.timeout(4000);
    window.addEventListener('load', function () {
      dusk(function () {
        done();
      });
    });
  });

});

describe('dusk()', function () {

  it('can select by id', function () {
    if (dusk('#demo').length !== 1) err();
  });

  it('can select by class', function () {
    if (dusk('.demo').length !== 1) err();
  });

  it('can select by tag', function () {
    if (dusk('body').length !== 1) err();
  });

  it('can select with css', function () {
    if (dusk('[id=demo]').length !== 1) err();
    if (dusk('body .demo').length !== 1) err();
  });

  it('can select a node', function () {
    if (dusk(document.querySelector('div')).length !== 1) err();
    if (dusk(document.getElementById('demo')).length !== 1) err();
  });

  it('can select window', function () {
    if (dusk(window)[0] !== window) err();
  });

  it('can select an HTMLCollection or a NodeList', function () {

    const collection = document.getElementsByTagName('div');
    if (
      dusk(collection).length !== collection.length
      || dusk(collection)[0] !== collection[0]
    ) {
      err();
    }

    const list = document.querySelectorAll('div');
    if (
      dusk(list).length !== list.length
      || dusk(list)[0] !== list[0]
    ) {
      err();
    }

  });

  it('can select itself', function () {
    const $dusked = dusk('#demo');
    if (dusk($dusked).length !== 1) err();
    if (dusk($dusked) !== $dusked) err();
  });

  it('can select with a context', function () {
    if (dusk('div', '.demo').length !== 3) err();
    if (dusk('div', '#demo').length !== 3) err();
    if (dusk('div', 'body .demo').length !== 3) err();
    if (dusk('div', dusk('#demo')).length !== 3) err();
  });

  it('should return an empty array if no element matched', function () {
    if (dusk('#nonexisting-id').length !== 0) err();
    if (dusk('nonexisting-tag').length !== 0) err();
    if (dusk('.nonexisting-class').length !== 0) err();
    if (dusk('.nonexisting .selector').length !== 0) err();
  });

  it('should return an empty array if wrong context is passed', function () {
    if (dusk('div', '#nonexisting-id').length !== 0) err();
    if (dusk('div', 'nonexisting-tag').length !== 0) err();
    if (dusk('div', '.nonexisting-class').length !== 0) err();
    if (dusk('div', '.nonexisting .selector').length !== 0) err();
  });

  it('should be able to be extended (plugins)', function (done) {
    const $demo = dusk('#demo');
    dusk.fn.plugin = function () {
      if ($demo === this) done();
      else err();
    };
    $demo.plugin();
  });

  it('should be able to be chain-extended (plugins return this)', function (done) {
    const $demo = dusk('#demo');
    dusk.fn.plugin1 = function () {
      return this;
    };
    dusk.fn.plugin2 = function () {
      if ($demo === this) done();
      else err();
    };
    $demo.plugin1().plugin2();
  });

});
