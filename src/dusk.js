/* global document, NodeList, HTMLCollection */

const dusk = (function iife() {

  function select(selector = {}, context = document) {

    // eslint-disable-next-line no-underscore-dangle
    if (selector.__dusk__) return selector;

    // Our object inherits from Array, and has a prop __dusk__ for recognition
    const c = Object.create(select.fn, { __dusk__: { value: true } }); // collection

    let classes;
    let elements;
    let $context;

    // If selector is string, do your job and return
    switch (typeof selector) {

      case 'string':

        // Return if context was not found
        $context = (context === document) ? document : select(context)[0];
        if ($context === undefined) return c;

        // Redirect simple selectors to the more performant function
        if (/^(#?[\w-]+|\.[\w-.]+)$/.test(selector)) {
          switch (selector.charAt(0)) {
            case '#':
              // Handle ID-based selectors
              elements = $context.getElementById(selector.substr(1));
              if (elements) c.push(elements);
              break;
            case '.':
              // Handle class-based selectors
              // Query by multiple classes by converting the selector
              // string into single spaced class names
              classes = selector.substr(1).replace(/\./g, ' ');
              elements = $context.getElementsByClassName(classes);
              // eslint-disable-next-line prefer-spread
              if (elements) c.push.apply(c, elements);
              break;
            default:
              // Handle tag-based selectors
              elements = $context.getElementsByTagName(selector);
              // eslint-disable-next-line prefer-spread
              if (elements) c.push.apply(c, elements);
              break;
          }
        } else {
          elements = $context.querySelectorAll(selector);
          // eslint-disable-next-line prefer-spread
          if (elements) c.push.apply(c, elements);
        }

        // Return early
        return c;

      case 'object':

        // Handle a node
        if (selector.addEventListener) {
          c.push(selector);
        // Handle a list of nodes
        } else if (
          {}.isPrototypeOf.call(NodeList.prototype, selector)
          || {}.isPrototypeOf.call(HTMLCollection.prototype, selector)
        ) {
          // eslint-disable-next-line prefer-spread
          c.push.apply(c, selector);
        }

        // Return early
        return c;

      case 'function':

        // Handle a function (DOMReady)
        if (document.readyState !== 'loading') selector();
        else document.addEventListener('DOMContentLoaded', selector);

        // Return early
        return c;

      default:
        break;

    }

    // Default
    return c;

  }

  // Extend me!!
  select.fn = [];

  return select;

}());

export default dusk;
