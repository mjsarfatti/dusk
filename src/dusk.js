/* global window, document, NodeList, HTMLCollection */

/**
 * Polyfills
 */

// matches polyfill
(function matchesPolyfill(ElementPrototype) {
  ElementPrototype.matches = ElementPrototype.matches || // eslint-disable-line
  ElementPrototype.matchesSelector ||
  ElementPrototype.webkitMatchesSelector ||
  ElementPrototype.msMatchesSelector ||
  function polyfill(selector) {
    const node = this;
    const nodes = (node.parentNode || node.document).querySelectorAll(selector);
    let i = -1;
    while (nodes[++i] && nodes[i] !== node);
    return !!nodes[i];
  };
}(window.Element.prototype));

// closest polyfill
(function closestPolyfill(ElementPrototype) {
  ElementPrototype.closest = ElementPrototype.closest || // eslint-disable-line
  function polyfill(selector) {
    let el = this;
    while (el.matches && !el.matches(selector)) el = el.parentNode;
    return el.matches ? el : null;
  };
}(window.Element.prototype));

/**
 * Fastest way to turn a nodeList into a proper Array
 * NOTE: it places nodeList at the beginning of the array!
 * @param  {Array} array    Passed by reference
 * @param  {nodeList|HTMLCollection}
 * @return {void}           It just pushes them into the array
 */
function pushInto(array, nodeList) {
  let i = nodeList.length;
  for (i; i--; array.unshift(nodeList[i]));
}

// Us!
const dusk = function dusk(selector, context) {
  // Select yo'self
  if (selector && selector.dusked) return selector;
  // Or return a new instance
  return new Dusker(selector, context); // eslint-disable-line
};

dusk.fn = [];
dusk.fn.dusked = 1;

const Dusker = function Dusker(selector, context) {

  let classes;
  let els;
  let realContext;

  // If selector is string, do your best to use the built-ins and return ASAP
  if (typeof selector === 'string') {

    // Return if context was not found
    realContext = (!context || context === document) ? document : dusk(context)[0];
    if (realContext === undefined) return this;

    // Redirect simple selectors to the most performant function
    if (/^(#?[\w-]+|\.[\w-.]+)$/.test(selector)) {
      switch (selector.charAt(0)) {
        case '#':
          // Handle ID-based selectors
          els = document.getElementById(selector.substr(1));
          if (els !== null) {
            this[0] = els;
            this.length = 1;
          }
          return this;
        case '.':
          // Handle class-based selectors
          // Query by multiple classes by converting the selector
          // string into single spaced class names
          classes = selector.substr(1).replace(/\./g, ' ');
          els = realContext.getElementsByClassName(classes);
          pushInto(this, els);
          return this;
        default:
          // Handle tag-based selectors
          els = realContext.getElementsByTagName(selector);
          pushInto(this, els);
          return this;
      }
    // Handle empty string
    } else if (selector !== '') {
      els = realContext.querySelectorAll(selector);
      pushInto(this, els);
      return this;
    }

    return this;

  } else if (typeof selector === 'object') {

    // Handle a node (and the null object)
    if (selector && selector.addEventListener) {
      this.push(selector);

    // Handle a list of nodes
    } else if (
      NodeList.prototype.isPrototypeOf(selector) // eslint-disable-line
      || HTMLCollection.prototype.isPrototypeOf(selector) // eslint-disable-line
    ) {
      pushInto(this, selector);
    }

    return this;

  }

  // Default (handles undefined and false)
  return this;

};

// Give the init function the dusk prototype for later instantiation
Dusker.prototype = dusk.fn;

// DOMReady static method (shamelessly stolen from jQuery)
dusk.DOMReady = function DOMReady(ready) {

  // The ready event handler and self cleanup method
  function completed() {
    document.removeEventListener('DOMContentLoaded', completed);
    window.removeEventListener('load', completed);
    ready();
  }

  // Older IE sometimes signals "interactive" too soon
  if (
    document.readyState === 'complete'
    || (document.readyState !== 'loading' && !document.documentElement.doScroll)
  ) {
    // Handle it asynchronously to allow scripts the opportunity to delay ready
    window.setTimeout(ready);
  } else {
    // Use the handy event callback
    document.addEventListener('DOMContentLoaded', completed);
    // A fallback to window.onload, that will always work
    window.addEventListener('load', completed);
  }

};

// Class helpers
dusk.fn.hasClass = function hasClass(className) {

  // Return early if no element was selected
  if (!this.length) return false;

  return this[0].classList
    ? this[0].classList.contains(className)
    : new RegExp(`\\b${className}\\b`).test(this[0].className);
};

dusk.fn.addClass = function addClass(className) {

  for (let i = this.length - 1; i >= 0; i--) {
    if (this[i].classList) {
      this[i].classList.add(className);
    } else if (!(new RegExp(`\\b${className}\\b`).test(this[i].className))) {
      this[i].className += ` ${className}`;
    }
  }

  return this;

};

dusk.fn.removeClass = function removeClass(className) {

  for (let i = this.length - 1; i >= 0; i--) {
    if (this[i].classList) {
      this[i].classList.remove(className);
    } else {
      this[i].className = this[i].className.replace(new RegExp(`\\b${className}\\b`, 'g'), '');
    }
  }

  return this;

};

export default dusk;
