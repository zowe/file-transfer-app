(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './evented-state', '../misc/get-launching-details'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./evented-state'), require('../misc/get-launching-details'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.eventedState, global.getLaunchingDetails);
    global.eventedShowHideState = mod.exports;
  }
})(this, function (exports, _eventedState, _getLaunchingDetails) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _eventedState2 = _interopRequireDefault(_eventedState);

  var _getLaunchingDetails2 = _interopRequireDefault(_getLaunchingDetails);

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

  function eventedShowHideState(ToMix) {
    var EventedShowHideState = function (_ToMix) {
      _inherits(EventedShowHideState, _ToMix);

      function EventedShowHideState() {
        _classCallCheck(this, EventedShowHideState);

        return _possibleConstructorReturn(this, (EventedShowHideState.__proto__ || Object.getPrototypeOf(EventedShowHideState)).apply(this, arguments));
      }

      _createClass(EventedShowHideState, [{
        key: 'show',
        value: function show(evtOrElem, callback) {
          if (!evtOrElem || typeof evtOrElem === 'function') {
            callback = evtOrElem; // eslint-disable-line no-param-reassign
          }
          this.changeState('shown', (0, _getLaunchingDetails2.default)(evtOrElem), callback);
        }
      }, {
        key: 'hide',
        value: function hide(evtOrElem, callback) {
          if (!evtOrElem || typeof evtOrElem === 'function') {
            callback = evtOrElem; // eslint-disable-line no-param-reassign
          }
          this.changeState('hidden', (0, _getLaunchingDetails2.default)(evtOrElem), callback);
        }
      }]);

      return EventedShowHideState;
    }(ToMix);

    return EventedShowHideState;
  }

  var _exports = [_eventedState2.default, eventedShowHideState];
  exports.default = _exports;
});