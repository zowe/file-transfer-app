(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.eventMatches = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = eventMatches;
  /**
   * @param {Event} event The event.
   * @param {string} selector The selector.
   * @returns {Element}
   *   The closest ancestor of the event target (or the event target itself) which matches the selectors given in parameter.
   */
  function eventMatches(event, selector) {
    var target = event.target,
        currentTarget = event.currentTarget;

    if (typeof target.matches === 'function') {
      if (target.matches(selector)) {
        // If event target itself matches the given selector, return it
        return target;
      } else if (target.matches(selector + ' *')) {
        var closest = target.closest(selector);
        if ((currentTarget.nodeType === Node.DOCUMENT_NODE ? currentTarget.documentElement : currentTarget).contains(closest)) {
          return closest;
        }
      }
    }
    return undefined;
  }
});