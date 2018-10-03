(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './settings', './components'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./settings'), require('./components'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.settings, global.components);
    global.boot = mod.exports;
  }
})(this, function (exports, _settings, _components) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.setComponents = undefined;

  var _settings2 = _interopRequireDefault(_settings);

  var defaultComponents = _interopRequireWildcard(_components);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var components = defaultComponents;

  /**
   * The handles for event handlers to lazily instantiate components.
   * @type {Handle[]}
   */
  var lazyInitHandles = [];

  /**
   * Instantiates components automatically
   * by searching for elements with `data-component-name` (e.g. `data-loading`) attribute
   * or upon DOM events (e.g. clicking) on such elements.
   * See each components' static `.init()` methods for details.
   * @private
   */
  var init = function init() {
    var componentClasses = Object.keys(components).map(function (key) {
      return components[key];
    }).filter(function (component) {
      return typeof component.init === 'function';
    });
    if (!_settings2.default.disableAutoInit) {
      componentClasses.forEach(function (Clz) {
        var h = Clz.init();
        if (h) {
          lazyInitHandles.push(h);
        }
      });
    }
  };

  /**
   * Replaces the list of components to initialize.
   * @param {Object} componentsToReplaceWith The new list of components.
   */
  var setComponents = exports.setComponents = function setComponents(componentsToReplaceWith) {
    components = componentsToReplaceWith;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOMContentLoaded has been fired already
    // Let consumer have chance to see if it wants automatic instantiation disabled, and then run automatic instantiation otherwise
    setTimeout(init, 0);
  }

  exports.default = lazyInitHandles;
});