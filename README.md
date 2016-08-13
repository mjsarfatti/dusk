# dusk
_A feathery (light), alacritous (fast), extensible DOM abstraction.
(Partly based on PlainJS. And faster than jQuery)_

At its core it's nothing but a selector that will return an array of `HTMLElement`'s:

```js
var $popup = dusk('#popup');              // will return a single-element array
var $rows  = dusk('.my-table tr');        // will return an array
var $oops  = dusk('.non-existing-class'); // will return an empty array
```

This means it has the same collection of methods as a native array. Pretty cool. And you can pass **dusk** some strange things as well:

```js
var $itself  = dusk(dusk('div'));                      // dusk recognizes itself
var $list    = dusk(document.querySelectorAll('div')); // it turns NodeList's and HTMLCollection's into arrays
var $context = dusk('.class', '#context');             // and it can use a context
```

## Getting Started

**dusk** implements the Universal Module Definition (UMD), and resides on **NPM** so that you can really use it any way you want. To include it in your project:

### Download it...

Get it from `https://github.com/mjsarfatti/dusk/blob/master/dist/dusk.js`, then include it with:

**HTML**
```html
<script src="path/to/dusk.js"></script>
```

**AMD**
```js
require(['path/to/dusk.js'], function(dusk) {
	// ...
});
```

**CommonJS**
```js
var dusk = require('path/to/dusk.js');
```

### ...or NPM it

`$ npm install --save dusk`, then:

**CommonJS + NPM**
```js
var dusk = require('dusk');
```

**ECMAScript 2015**
```js
import dusk from 'dusk';
```

## Methods

At the moment it ships only one, static, method.

### dusk.DOMReady

(shamelessly stolen from jQuery)

```js
dusk.DOMReady(function() {
	// something to execute on DOM ready
});
```

## Extend (Plugins)

But it's already apt to be extended!

```js
const $demo = dusk('#demo');

dusk.fn.plugin1 = function () {
  // do something with `this` (remember, it's an array)
  return this;
};

dusk.fn.plugin2 = function () {
  // do something with `this`
  return this;
};

$demo.plugin1().plugin2();
```

## The Future

Version 1.1 will include the following:

**Events**

- .on()
- .off()
- .one()

**Classes**

- .hasClass()
- .addClass()
- .removeClass()
- .toggleClass()

It will also include polyfills for `matches` and `closest`.

This will cover 95% of the use cases. And remember, for all the rest you have [PlainJS](https://plainjs.com/) and the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

Ps: of course, if you absolutely need `.thirdChild()` you can easily extend the core. In fact, that is the whole purpose of this: a super-lightweight extensible DOM abstraction.

## Browser support

At the moment **dusk** has been tested on

- IE11
- Edge
- Chrome
- Firefox
- Safari

Version 1.1 will be tested against IE9+ and mobile browsers as well.

## License

**dusk** is released under the MIT license.
