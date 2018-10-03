(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../../globals/js/misc/mixin', '../../globals/js/mixins/create-component', '../../globals/js/mixins/init-component-by-search', '../../globals/js/mixins/evented-state', '../../globals/js/mixins/handles', '../../globals/js/misc/on'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../../globals/js/misc/mixin'), require('../../globals/js/mixins/create-component'), require('../../globals/js/mixins/init-component-by-search'), require('../../globals/js/mixins/evented-state'), require('../../globals/js/mixins/handles'), require('../../globals/js/misc/on'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.mixin, global.createComponent, global.initComponentBySearch, global.eventedState, global.handles, global.on);
    global.notification = mod.exports;
  }
})(this, function (exports, _mixin2, _createComponent, _initComponentBySearch, _eventedState, _handles, _on) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _mixin3 = _interopRequireDefault(_mixin2);

  var _createComponent2 = _interopRequireDefault(_createComponent);

  var _initComponentBySearch2 = _interopRequireDefault(_initComponentBySearch);

  var _eventedState2 = _interopRequireDefault(_eventedState);

  var _handles2 = _interopRequireDefault(_handles);

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

  var Notification = function (_mixin) {
    _inherits(Notification, _mixin);

    /**
     * InlineNotification.
     * @extends CreateComponent
     * @extends InitComponentBySearch
     * @extends Handles
     * @param {HTMLElement} element The element working as a InlineNotification.
     */
    function Notification(element, options) {
      _classCallCheck(this, Notification);

      var _this = _possibleConstructorReturn(this, (Notification.__proto__ || Object.getPrototypeOf(Notification)).call(this, element, options));

      _this._changeState = function (state, callback) {
        if (state === 'delete-notification') {
          _this.element.parentNode.removeChild(_this.element);
          _this.release();
        }
        callback();
      };

      _this.button = element.querySelector(_this.options.selectorButton);
      if (_this.button) {
        _this.manage((0, _on2.default)(_this.button, 'click', function (evt) {
          if (evt.currentTarget === _this.button) {
            _this.remove();
          }
        }));
      }
      return _this;
    }

    _createClass(Notification, [{
      key: 'remove',
      value: function remove() {
        this.changeState('delete-notification');
      }
    }]);

    return Notification;
  }((0, _mixin3.default)(_createComponent2.default, _initComponentBySearch2.default, _eventedState2.default, _handles2.default));

  Notification.components = new WeakMap();
  Notification.options = {
    selectorInit: '[data-notification]',
    selectorButton: '[data-notification-btn]',
    eventBeforeDeleteNotification: 'notification-before-delete',
    eventAfterDeleteNotification: 'notification-after-delete'
  };
  exports.default = Notification;
});