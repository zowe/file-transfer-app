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
    global.toggleAttribute = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = toggleAttribute;
  /**
   * Toggles the given attribute of the given element.
   * @param {Element} elem The element.
   * @param {string} name The attribute name.
   * @param {boolean} add `true` to set the attribute.
   */
  function toggleAttribute(elem, name, add) {
    if (add) {
      elem.setAttribute(name, '');
    } else {
      elem.removeAttribute(name);
    }
  }
});