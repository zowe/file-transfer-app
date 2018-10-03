(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './index', './globals/js/watch', './globals/js/boot'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./index'), require('./globals/js/watch'), require('./globals/js/boot'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.watch, global.boot);
    global.bundle = mod.exports;
  }
})(this, function (exports, _index, _watch) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.watch = undefined;
  Object.keys(_index).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _index[key];
      }
    });
  });
  Object.defineProperty(exports, 'watch', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_watch).default;
    }
  });

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
});