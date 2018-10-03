(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './globals/js/components', './globals/js/settings'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./globals/js/components'), require('./globals/js/settings'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.components, global.settings);
    global.index = mod.exports;
  }
})(this, function (exports, _components, _settings) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_components).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _components[key];
      }
    });
  });
  Object.defineProperty(exports, 'settings', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_settings).default;
    }
  });

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
});