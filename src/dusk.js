/* global window, document, NodeList, HTMLCollection */

const dusk = (function iife() {

  /**
   * Fastest way to turn a nodeList into a proper Array
   * NOTE: it places nodeList at the beginning of the array!
   * @param  {Array} array    Passed by reference
   * @param  {nodeList|HTMLCollection}
   * @return {void}          It just pushes them into the array
   */
  function pushInto(array, nodeList) {
    let i = nodeList.length;
    for (i; i--; array.unshift(nodeList[i]));
  }

  const select = function (selector, context) {
    if (selector && selector.dusked) {
      return selector;
    }

    // The *jQuery* object is actually just the init constructor 'enhanced'
    // eslint-disable-next-line new-cap
    return new select.fn.init(selector, context);
  };

  select.fn = [];
  select.fn.dusked = 1;

  select.fn.init = function (selector, context) {

    let classes;
    let els;
    let realContext;

    // If selector is string, do your job and return
    if (typeof selector === 'string') {

      // Return if context was not found
      realContext = (!context || context === document) ? document : select(context)[0];
      if (realContext === undefined) return this;

      // Redirect simple selectors to the more performant function
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
      // Handles empty string
      } else if (selector !== '') {
        els = realContext.querySelectorAll(selector);
        pushInto(this, els);
        return this;
      } else {
        return this;
      }

    } else if (typeof selector === 'object') {

      // Handle a node (and the null object)
      if (selector && selector.addEventListener) {
        this.push(selector);
      // Handle a list of nodes
      } else if (
        {}.isPrototypeOf.call(NodeList.prototype, selector)
        || {}.isPrototypeOf.call(HTMLCollection.prototype, selector)
      ) {
        // eslint-disable-next-line prefer-spread
        this.push.apply(this, selector);
      }

      // Return early
      return this;

    }

    // Default (handles undefined and false)
    return this;

  };

  // Give the init function the *jQuery* prototype for later instantiation
  select.fn.init.prototype = select.fn;

  // DOMReady static method (stolen from jQuery)
  select.DOMReady = function DOMReady(ready) {

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

  return select;

}());

export default dusk;
