/* global describe, it, window, document, dusk, _duskImmediateSelect,
   _duskReadySelect, before, after, $ */
/* eslint func-names: 0, prefer-arrow-callback: 0, no-console: 0, no-var: 0
   prefer-template: 0 */

function err() { throw new Error(); }

describe('Dusk', function () {

  it('should exist and be a function', function () {
    if (typeof dusk !== 'function') err();
  });

  it('should accept 0 arguments', function () {
    if (dusk().constructor !== Array || dusk().length !== 0) {
      err();
    }
  });

  it('should accept \'\', null, undefined and true|false as arguments', function () {
    if (dusk('').constructor !== Array || dusk('').length !== 0) {
      err();
    }
    if (dusk(null).constructor !== Array || dusk(null).length !== 0) {
      err();
    }
    if (dusk(undefined).constructor !== Array || dusk(undefined).length !== 0) {
      err();
    }
    if (dusk(true).constructor !== Array || dusk(true).length !== 0) {
      err();
    }
    if (dusk(false).constructor !== Array || dusk(false).length !== 0) {
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

describe('dusk.DOMReady', function () {

  it('should run if attached before DOMReady', function () {
    if (_duskReadySelect.length !== 1) err();
  });

  it('should run if attached after DOMReady', function (done) {
    this.timeout(4000);
    // Window already loaded?
    if (document.readyState === 'complete') {
      setTimeout(function () {
        // eslint-disable-next-line new-cap
        dusk.DOMReady(done);
      }, 100);
    } else {
      window.addEventListener('load', function () {
        // eslint-disable-next-line new-cap
        dusk.DOMReady(done);
      });
    }
  });

});

describe('dusk()', function () {

  it('should select by id', function () {
    if (dusk('#demo').length !== 1) err();
  });

  it('should select by class', function () {
    if (dusk('.demo').length !== 1) err();
  });

  it('should select by tag', function () {
    if (dusk('body').length !== 1) err();
  });

  it('should select with css', function () {
    if (dusk('[id=demo]').length !== 1) err();
    if (dusk('body .demo').length !== 1) err();
  });

  it('should select a node', function () {
    if (dusk(document.querySelector('div')).length !== 1) err();
    if (dusk(document.getElementById('demo')).length !== 1) err();
  });

  it('should select window', function () {
    if (dusk(window)[0] !== window) err();
  });

  it('should select an HTMLCollection or a NodeList', function () {

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

  it('should select itself', function () {
    const $dusked = dusk('#demo');
    if (dusk($dusked).length !== 1) err();
    if (dusk($dusked) !== $dusked) err();
  });

  it('should select with a context', function () {
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

describe('.-––~^ performance', function () {

  var $perf;

  function performance(callback, times) {
    const init = new Date().getTime();
    var j;
    for (j = 0; j < times; j++) {
      callback(j);
    }
    return new Date().getTime() - init;
  }

  function compare(performance1, performance2, times) {
    const result = { a: 0, b: 0 };
    var i;
    for (i = 0; i < 10; i++) {
      if (i % 2) {
        result.a += performance(performance1, times);
        result.b += performance(performance2, times);
      } else {
        result.b += performance(performance2, times);
        result.a += performance(performance1, times);
      }
    }
    return result;
  }

  // Generate a big and varied 1000 elements table
  before(function () {
    $perf = dusk('.performance')[0];
    performance(function (i) {
      $perf.innerHTML += '<tr class="ro">' +
        '<td id="idn' + i + '"></td><td class="tabletest"></td><td></td><td></td>' +
        '</tr>';
    }, 1000);
  });

  after(function () {
    $perf.parentNode.removeChild($perf);
  });

  it('should select, fast (by class, 10k/s)', function () {
    const dTime = performance(function () {
      dusk('.demo');
    }, 1000);
    console.log('[perf] by class 10k/s     - dusk: ' + dTime + 'ms');
    if (dTime > 100) err();
  });

  it('should be comparable or faster than $(\'#id\')', function () {
    const result = compare(function () {
      dusk('#demo');
    }, function () {
      $('#demo');
    }, 1000);
    const dTime = result.a;
    const $Time = result.b;
    console.log('[perf] vs jQuery #id      - dusk: ' + dTime + 'ms; $: ' + $Time + 'ms');
    if (dTime > $Time * 1.1) err();
  });

  it('should be comparable or faster than $(\'tag\')', function () {
    const result = compare(function () {
      dusk('div');
    }, function () {
      $('div');
    }, 1000);
    const dTime = result.a;
    const $Time = result.b;
    console.log('[perf] vs jQuery tag      - dusk: ' + dTime + 'ms; $: ' + $Time + 'ms');
    if (dTime > $Time * 1.1) err();
  });

  it('should be comparable or faster than $(\'.class\')', function () {
    const result = compare(function () {
      dusk('.demo');
    }, function () {
      $('.demo');
    }, 1000);
    const dTime = result.a;
    const $Time = result.b;
    console.log('[perf] vs jQuery .class   - dusk: ' + dTime + 'ms; $: ' + $Time + 'ms');
    if (dTime > $Time * 1.1) err();
  });

  it('should be comparable or faster than $(\'table td:first-child\')', function () {
    const result = compare(function () {
      dusk('table td:first-child');
    }, function () {
      $('table td:first-child');
    }, 1000);
    const dTime = result.a;
    const $Time = result.b;
    console.log('[perf] vs jQuery complex  - dusk: ' + dTime + 'ms; $: ' + $Time + 'ms');
    if (dTime > $Time * 1.1) err();
  });

});
