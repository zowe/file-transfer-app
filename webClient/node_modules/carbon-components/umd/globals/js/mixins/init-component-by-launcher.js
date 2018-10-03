(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../misc/event-matches', '../misc/on'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../misc/event-matches'), require('../misc/on'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.eventMatches, global.on);
    global.initComponentByLauncher = mod.exports;
  }
})(this, function (exports, _eventMatches, _on) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (ToMix) {
    /**
     * Mix-in class to instantiate components events on launcher button.
     * @class InitComponentByLauncher
     */
    var InitComponentByLauncher = function (_ToMix) {
      _inherits(InitComponentByLauncher, _ToMix);

      function InitComponentByLauncher() {
        _classCallCheck(this, InitComponentByLauncher);

        return _possibleConstructorReturn(this, (InitComponentByLauncher.__proto__ || Object.getPrototypeOf(InitComponentByLauncher)).apply(this, arguments));
      }

      _createClass(InitComponentByLauncher, null, [{
        key: 'init',


        /**
         * Instantiates this component in the given element.
         * If the given element indicates that it's an component of this class, instantiates it.
         * Otherwise, instantiates this component by clicking on launcher buttons
         * (buttons with attribute that `options.attribInitTarget` points to) of this component in the given node.
         * @param {Node} target The DOM node to instantiate this component in. Should be a document or an element.
         * @param {Object} [options] The component options.
         * @param {string} [options.selectorInit] The CSS selector to find this component.
         * @param {string} [options.attribInitTarget] The attribute name in the launcher buttons to find target component.
         * @returns {Handle} The handle to remove the event listener to handle clicking.
         */
        value: function init() {
          var _this2 = this;

          var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
          var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          var effectiveOptions = Object.assign(Object.create(this.options), options);
          if (!target || target.nodeType !== Node.ELEMENT_NODE && target.nodeType !== Node.DOCUMENT_NODE) {
            throw new TypeError('DOM document or DOM element should be given to search for and initialize this widget.');
          }
          if (target.nodeType === Node.ELEMENT_NODE && target.matches(effectiveOptions.selectorInit)) {
            this.create(target, options);
          } else {
            var handles = effectiveOptions.initEventNames.map(function (name) {
              return (0, _on2.default)(target, name, function (event) {
                var launcher = (0, _eventMatches2.default)(event, '[' + effectiveOptions.attribInitTarget + ']');

                if (launcher) {
                  event.delegateTarget = launcher; // eslint-disable-line no-param-reassign
                  var elements = [].concat(_toConsumableArray(launcher.ownerDocument.querySelectorAll(launcher.getAttribute(effectiveOptions.attribInitTarget))));
                  if (elements.length > 1) {
                    throw new Error('Target widget must be unique.');
                  }

                  if (elements.length === 1) {
                    if (launcher.tagName === 'A') {
                      event.preventDefault();
                    }

                    var component = _this2.create(elements[0], options);
                    if (typeof component.createdByLauncher === 'function') {
                      component.createdByLauncher(event);
                    }
                  }
                }
              });
            });
            return {
              release: function release() {
                for (var handle = handles.pop(); handle; handle = handles.pop()) {
                  handle.release();
                }
              }
            };
          }
          return '';
        }
        /**
         * `true` suggests that this component is lazily initialized upon an action/event, etc.
         * @type {boolean}
         */

      }]);

      return InitComponentByLauncher;
    }(ToMix);

    InitComponentByLauncher.forLazyInit = true;

    return InitComponentByLauncher;
  };

  var _eventMatches2 = _interopRequireDefault(_eventMatches);

  var _on2 = _interopRequireDefault(_on);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }
});