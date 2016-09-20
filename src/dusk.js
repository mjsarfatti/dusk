/* global window, document, NodeList, HTMLCollection */



/**
 * POLYFILLS
 ******************************************************************************/

// Element.matches polyfill
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

// Element.closest polyfill
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


/**
 * US!
 ******************************************************************************/

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


/**
 * STATIC METHODS
 ******************************************************************************/

/**
 * DOMReady static method (shamelessly stolen from jQuery)
 * @param {function} ready The function to run on DOM ready
 */
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


/**
 * CLASS HELPERS
 ******************************************************************************/

/**
 * Checks if the *first* element of the array has a certain class
 * NOTE: This method is not chainable!
 * @param  {string}  className The name of the class
 * @return {Boolean}
 */
dusk.fn.hasClass = function hasClass(className) {

  // Return early if no element was selected
  if (!this.length) return false;

  return this[0].classList
    ? this[0].classList.contains(className)
    : new RegExp(`\\b${className}\\b`).test(this[0].className);
};

/**
 * addClass helper
 */
function _addClass(element, className) { // eslint-disable-line

  if (element.classList) {
    element.classList.add(className);
  } else if (!(new RegExp(`\\b${className}\\b`).test(element.className))) {
    element.className += ` ${className}`; // eslint-disable-line
  }

}

/**
 * Adds the specified class to each element of the array
 * @param  {string} className The name of the class
 * @return {dusk}
 */
dusk.fn.addClass = function addClass(className) {

  const length = this.length;
  for (let i = 0; i < length; i++) {
    _addClass(this[i], className);
  }

  return this;

};

/**
 * removeClass helper
 */
function _removeClass(element, className) { // eslint-disable-line

  if (element.classList) {
    element.classList.remove(className);
  } else {
    element.className = element.className.replace(new RegExp(`\\b${className}\\b`, 'g'), '');  // eslint-disable-line
  }

}

/**
 * Removes the specified class from each element of the array
 * @param  {string} className The name of the class
 * @return {dusk}
 */
dusk.fn.removeClass = function removeClass(className) {

  const length = this.length;
  for (let i = 0; i < length; i++) {
    _removeClass(this[i], className);
  }

  return this;

};

/**
 * Adds/removes the specified class based on the truthyness of 'condition'
 * @param  {string} className The name of the class
 * @param  {mixed}  condition The condition to evaluate
 * @return {dusk}
 */
dusk.fn.toggleClass = function toggleClass(className, condition) {

  const length = this.length;
  for (let i = 0; i < length; i++) {
    if (condition) {
      _addClass(this[i], className);
    } else {
      _removeClass(this[i], className);
    }
  }

  return this;

};


/**
 * EVENTS HELPERS
 ******************************************************************************/

/**
 * For prefixed events
 * @type {Array}
 */
const prefixes = ['webkit', 'moz', 'MS', 'o', ''];

/**
 * Adds the specified listener to each element of the array
 * @param  {string}   type     The event name
 * @param  {function} listener The callback
 * @return {dusk}
 */
dusk.fn.on = function on(type, listener, prefixed = false) {

  const length = this.length;

  for (let i = 0; i < length; i++) {

    if (prefixed) {
      for (let p = 0; p < prefixes.length; p++) {
        if (!prefixes[p]) type = type.toLowerCase(); // eslint-disable-line
        this[i].addEventListener(prefixes[p] + type, listener);
      }
    } else {
      this[i].addEventListener(type, listener);
    }

  }

  return this;

};

/**
 * Remvoes the specified listener from each element of the array
 * @param  {string}   type     The event name
 * @param  {function} listener The callback
 * @return {dusk}
 */
dusk.fn.off = function off(type, listener, prefixed = false) {

  const length = this.length;

  for (let i = 0; i < length; i++) {

    if (prefixed) {
      for (let p = 0; p < prefixes.length; p++) {
        if (!prefixes[p]) type = type.toLowerCase(); // eslint-disable-line
        this[i].removeEventListener(prefixes[p] + type, listener);
      }
    } else {
      this[i].removeEventListener(type, listener);
    }

  }

  return this;

};

/**
 * Adds the specified listener to each element of the array, so that
 * it is called only once
 * @param  {string}   type     The event name
 * @param  {function} listener The callback
 * @return {dusk}
 */
dusk.fn.one = function one(type, listener, prefixed = false) {

  const oneTime = function oneTime(event) {
    // remove event
    event.target.removeEventListener(event.type, oneTime);
    // call listener
    return listener(event);
  };

  const length = this.length;

  for (let i = 0; i < length; i++) {

    if (prefixed) {
      for (let p = 0; p < prefixes.length; p++) {
        if (!prefixes[p]) type = type.toLowerCase(); // eslint-disable-line
        this[i].addEventListener(prefixes[p] + type, oneTime);
      }
    } else {
      this[i].addEventListener(type, oneTime);
    }

  }

  return this;

};


export default dusk;
