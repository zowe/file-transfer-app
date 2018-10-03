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
    global.settings = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   * Settings.
   * @exports CarbonComponents.settings
   * @type Object
   * @property {boolean} [disableAutoInit]
   *   Disables automatic instantiation of components.
   *   By default (`CarbonComponents.disableAutoInit` is `false`),
   *   carbon-components attempts to instantiate components automatically
   *   by searching for elements with `data-component-name` (e.g. `data-loading`) attribute
   *   or upon DOM events (e.g. clicking) on such elements.
   *   See each components' static `.init()` methods for details.
   * @property {string} [prefix=bx]
   *   Brand prefix. Should be in sync with `$prefix` Sass variable in carbon-components/src/globals/scss/_vars.scss.
   */
  var settings = {
    prefix: 'bx'
  };
  exports.default = settings;
});