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
    global.initComponentByEvent = mod.exports;
  }
})(this, function (exports, _eventMatches, _on) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (ToMix) {
    /**
     * Mix-in class to instantiate components upon events.
     * @class InitComponentByEvent
     */
    var InitComponentByEvent = function (_ToMix) {
      _inherits(InitComponentByEvent, _ToMix);

      function InitComponentByEvent() {
        _classCallCheck(this, InitComponentByEvent);

        return _possibleConstructorReturn(this, (InitComponentByEvent.__proto__ || Object.getPrototypeOf(InitComponentByEvent)).apply(this, arguments));
      }

      _createClass(InitComponentByEvent, null, [{
        key: 'init',


        /**
         * Instantiates this component in the given element.
         * If the given element indicates that it's an component of this class, instantiates it.
         * Otherwise, instantiates this component by clicking on this component in the given node.
         * @param {Node} target The DOM node to instantiate this component in. Should be a document or an element.
         * @param {Object} [options] The component options.
         * @param {string} [options.selectorInit] The CSS selector to find this component.
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
            // To work around non-bubbling `focus` event, use `focusin` event instead of it's available, and "capture mode" otherwise
            var hasFocusin = 'onfocusin' in (target.nodeType === Node.ELEMENT_NODE ? target.ownerDocument : target).defaultView;
            var handles = effectiveOptions.initEventNames.map(function (name) {
              var eventName = name === 'focus' && hasFocusin ? 'focusin' : name;
              return (0, _on2.default)(target, eventName, function (event) {
                var element = (0, _eventMatches2.default)(event, effectiveOptions.selectorInit);
                // Instantiated components handles events by themselves
                if (element && !_this2.components.has(element)) {
                  var component = _this2.create(element, options);
                  if (typeof component.createdByEvent === 'function') {
                    component.createdByEvent(event);
                  }
                }
              }, name === 'focus' && !hasFocusin);
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

      return InitComponentByEvent;
    }(ToMix);

    InitComponentByEvent.forLazyInit = true;

    return InitComponentByEvent;
  };

  var _eventMatches2 = _interopRequireDefault(_eventMatches);

  var _on2 = _interopRequireDefault(_on);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
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