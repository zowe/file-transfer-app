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
    global.eventedState = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (ToMix) {
    /**
     * Mix-in class to manage events associated with states.
     * @class EventedState
     */
    var EventedState = function (_ToMix) {
      _inherits(EventedState, _ToMix);

      function EventedState() {
        _classCallCheck(this, EventedState);

        return _possibleConstructorReturn(this, (EventedState.__proto__ || Object.getPrototypeOf(EventedState)).apply(this, arguments));
      }

      _createClass(EventedState, [{
        key: '_changeState',

        // eslint-disable-next-line jsdoc/check-param-names
        /**
         * The internal implementation for {@link EventedState#changeState `.changeState()`}, performing actual change in state.
         * @param {string} [state] The new state. Can be an omitted, which means toggling.
         * @param {Object} [detail]
         *   The object that should be put to event details that is fired before/after changing state.
         *   Can have a `group` property, which specifies what state to be changed.
         * @param {EventedState~changeStateCallback} callback The callback called once changing state is finished or is canceled.
         * @private
         */
        value: function _changeState() {
          throw new Error('_changeState() should be overriden to perform actual change in state.');
        }

        // eslint-disable-next-line jsdoc/check-param-names
        /**
         * Changes the state of this component.
         * @param {string} [state] The new state. Can be an omitted, which means toggling.
         * @param {Object} [detail]
         *   The object that should be put to event details that is fired before/after changing state.
         *   Can have a `group` property, which specifies what state to be changed.
         * @param {EventedState~changeStateCallback} [callback] The callback called once changing state is finished or is canceled.
         */

      }, {
        key: 'changeState',
        value: function changeState() {
          var _this2 = this;

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var state = typeof args[0] === 'string' ? args.shift() : undefined;
          var detail = Object(args[0]) === args[0] && typeof args[0] !== 'function' ? args.shift() : undefined;
          var callback = typeof args[0] === 'function' ? args.shift() : undefined;

          if (typeof this.shouldStateBeChanged === 'function' && !this.shouldStateBeChanged(state, detail)) {
            if (callback) {
              callback(null, true);
            }
            return;
          }

          var data = {
            group: detail && detail.group,
            state: state
          };

          var eventNameSuffix = [data.group, state].filter(Boolean).join('-').split('-') // Group or state may contain hyphen
          .map(function (item) {
            return item[0].toUpperCase() + item.substr(1);
          }).join('');

          var eventStart = new CustomEvent(this.options['eventBefore' + eventNameSuffix], {
            bubbles: true,
            cancelable: true,
            detail: detail
          });

          var fireOnNode = detail && detail.delegatorNode || this.element;
          var canceled = !fireOnNode.dispatchEvent(eventStart);

          if (canceled) {
            if (callback) {
              var error = new Error('Changing state (' + JSON.stringify(data) + ') has been canceled.');
              error.canceled = true;
              callback(error);
            }
          } else {
            var changeStateArgs = [state, detail].filter(Boolean);
            this._changeState.apply(this, _toConsumableArray(changeStateArgs).concat([function () {
              fireOnNode.dispatchEvent(new CustomEvent(_this2.options['eventAfter' + eventNameSuffix], {
                bubbles: true,
                cancelable: true,
                detail: detail
              }));
              if (callback) {
                callback();
              }
            }]));
          }
        }

        /**
         * Tests if change in state should happen or not.
         * Classes inheriting {@link EventedState `EventedState`} should override this function.
         * @function EventedState#shouldStateBeChanged
         * @param {string} [state] The new state. Can be an omitted, which means toggling.
         * @param {Object} [detail]
         *   The object that should be put to event details that is fired before/after changing state.
         *   Can have a `group` property, which specifies what state to be changed.
         * @returns {boolean}
         *   `false` if change in state shouldn't happen, e.g. when the given new state is the same as the current one.
         */

      }]);

      return EventedState;
    }(ToMix);

    /**
     * The callback called once changing state is finished or is canceled.
     * @callback EventedState~changeStateCallback
     * @param {Error} error
     *   An error object with `true` in its `canceled` property if changing state is canceled.
     *   Cancellation happens if the handler of a custom event, that is fired before changing state happens,
     *   calls `.preventDefault()` against the event.
     * @param {boolean} keptState
     *   `true` if the call to {@link EventedState#changeState `.changeState()`} didn't cause actual change in state.
     */

    return EventedState;
  };

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