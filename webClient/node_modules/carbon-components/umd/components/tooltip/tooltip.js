(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'lodash.debounce', '../../globals/js/settings', '../../globals/js/misc/mixin', '../../globals/js/mixins/create-component', '../../globals/js/mixins/init-component-by-event', '../../globals/js/mixins/evented-show-hide-state', '../../globals/js/mixins/handles', '../floating-menu/floating-menu', '../../globals/js/misc/get-launching-details', '../../globals/js/misc/on'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('lodash.debounce'), require('../../globals/js/settings'), require('../../globals/js/misc/mixin'), require('../../globals/js/mixins/create-component'), require('../../globals/js/mixins/init-component-by-event'), require('../../globals/js/mixins/evented-show-hide-state'), require('../../globals/js/mixins/handles'), require('../floating-menu/floating-menu'), require('../../globals/js/misc/get-launching-details'), require('../../globals/js/misc/on'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.lodash, global.settings, global.mixin, global.createComponent, global.initComponentByEvent, global.eventedShowHideState, global.handles, global.floatingMenu, global.getLaunchingDetails, global.on);
    global.tooltip = mod.exports;
  }
})(this, function (exports, _lodash, _settings, _mixin2, _createComponent, _initComponentByEvent, _eventedShowHideState, _handles, _floatingMenu, _getLaunchingDetails, _on) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _lodash2 = _interopRequireDefault(_lodash);

  var _settings2 = _interopRequireDefault(_settings);

  var _mixin3 = _interopRequireDefault(_mixin2);

  var _createComponent2 = _interopRequireDefault(_createComponent);

  var _initComponentByEvent2 = _interopRequireDefault(_initComponentByEvent);

  var _eventedShowHideState2 = _interopRequireDefault(_eventedShowHideState);

  var _handles2 = _interopRequireDefault(_handles);

  var _floatingMenu2 = _interopRequireDefault(_floatingMenu);

  var _getLaunchingDetails2 = _interopRequireDefault(_getLaunchingDetails);

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

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  /**
   * @param {Element} menuBody The menu body with the menu arrow.
   * @param {string} menuDirection Where the floating menu menu should be placed relative to the trigger button.
   * @returns {FloatingMenu~offset} The adjustment of the floating menu position, upon the position of the menu arrow.
   * @private
   */
  var getMenuOffset = function getMenuOffset(menuBody, menuDirection) {
    var _DIRECTION_LEFT$DIREC, _DIRECTION_LEFT$DIREC2;

    var arrowStyle = menuBody.ownerDocument.defaultView.getComputedStyle(menuBody, ':before');
    var arrowPositionProp = (_DIRECTION_LEFT$DIREC = {}, _defineProperty(_DIRECTION_LEFT$DIREC, _floatingMenu.DIRECTION_LEFT, 'right'), _defineProperty(_DIRECTION_LEFT$DIREC, _floatingMenu.DIRECTION_TOP, 'bottom'), _defineProperty(_DIRECTION_LEFT$DIREC, _floatingMenu.DIRECTION_RIGHT, 'left'), _defineProperty(_DIRECTION_LEFT$DIREC, _floatingMenu.DIRECTION_BOTTOM, 'top'), _DIRECTION_LEFT$DIREC)[menuDirection];
    var menuPositionAdjustmentProp = (_DIRECTION_LEFT$DIREC2 = {}, _defineProperty(_DIRECTION_LEFT$DIREC2, _floatingMenu.DIRECTION_LEFT, 'left'), _defineProperty(_DIRECTION_LEFT$DIREC2, _floatingMenu.DIRECTION_TOP, 'top'), _defineProperty(_DIRECTION_LEFT$DIREC2, _floatingMenu.DIRECTION_RIGHT, 'left'), _defineProperty(_DIRECTION_LEFT$DIREC2, _floatingMenu.DIRECTION_BOTTOM, 'top'), _DIRECTION_LEFT$DIREC2)[menuDirection];
    var values = [arrowPositionProp, 'border-bottom-width'].reduce(function (o, name) {
      return _extends({}, o, _defineProperty({}, name, Number((/^([\d-.]+)px$/.exec(arrowStyle.getPropertyValue(name)) || [])[1])));
    }, {});
    values[arrowPositionProp] = values[arrowPositionProp] || -6; // IE, etc.
    if (Object.keys(values).every(function (name) {
      return !isNaN(values[name]);
    })) {
      var arrowPosition = values[arrowPositionProp],
          borderBottomWidth = values['border-bottom-width'];

      return _defineProperty({
        left: 0,
        top: 0
      }, menuPositionAdjustmentProp, Math.sqrt(Math.pow(borderBottomWidth, 2) * 2) - arrowPosition);
    }
    return undefined;
  };

  var Tooltip = function (_mixin) {
    _inherits(Tooltip, _mixin);

    /**
     * Tooltip.
     * @extends CreateComponent
     * @extends InitComponentBySearch
     * @extends Handles
     */
    function Tooltip(element, options) {
      _classCallCheck(this, Tooltip);

      var _this = _possibleConstructorReturn(this, (Tooltip.__proto__ || Object.getPrototypeOf(Tooltip)).call(this, element, options));

      _this._hasContextMenu = false;
      _this._debouncedHandleClick = (0, _lodash2.default)(_this._handleClick, 200);

      _this._hookOn(element);
      return _this;
    }

    /**
     * A flag to detect if `oncontextmenu` event is fired right before `focus`/`blur` events.
     * @type {boolean}
     */


    /**
     * The debounced version of the event handler.
     * @type {Function}
     * @private
     */


    _createClass(Tooltip, [{
      key: 'createdByEvent',
      value: function createdByEvent(event) {
        var relatedTarget = event.relatedTarget,
            type = event.type;

        this._debouncedHandleClick({ relatedTarget: relatedTarget, type: type === 'focusin' ? 'focus' : type, details: (0, _getLaunchingDetails2.default)(event) });
      }
    }, {
      key: 'changeState',
      value: function changeState(state, detail, callback) {
        if (!this.tooltip) {
          var tooltip = this.element.ownerDocument.querySelector(this.element.getAttribute(this.options.attribTooltipTarget));
          if (!tooltip) {
            throw new Error('Cannot find the target tooltip.');
          }

          // Lazily create a component instance for tooltip
          this.tooltip = _floatingMenu2.default.create(tooltip, {
            refNode: this.element,
            classShown: this.options.classShown,
            offset: this.options.objMenuOffset
          });
          this._hookOn(tooltip);
          this.children.push(this.tooltip);
        }

        // Delegates the action of changing state to the tooltip.
        // (And thus the before/after shown/hidden events are fired from the tooltip)
        this.tooltip.changeState(state, Object.assign(detail, { delegatorNode: this.element }), callback);
      }
    }, {
      key: '_hookOn',
      value: function _hookOn(element) {
        var _this2 = this;

        var hasFocusin = 'onfocusin' in window;
        var focusinEventName = hasFocusin ? 'focusin' : 'focus';
        [focusinEventName, 'blur', 'touchleave', 'touchcancel'].forEach(function (name) {
          _this2.manage((0, _on2.default)(element, name, function (event) {
            var relatedTarget = event.relatedTarget,
                type = event.type;

            var hadContextMenu = _this2._hasContextMenu;
            _this2._hasContextMenu = type === 'contextmenu';
            _this2._debouncedHandleClick({
              relatedTarget: relatedTarget,
              type: type === 'focusin' ? 'focus' : type,
              hadContextMenu: hadContextMenu,
              details: (0, _getLaunchingDetails2.default)(event)
            });
          }, name === focusinEventName && !hasFocusin));
        });
      }
    }, {
      key: '_handleClick',
      value: function _handleClick(_ref2) {
        var relatedTarget = _ref2.relatedTarget,
            type = _ref2.type,
            hadContextMenu = _ref2.hadContextMenu,
            details = _ref2.details;

        var state = {
          focus: 'shown',
          blur: 'hidden',
          touchleave: 'hidden',
          touchcancel: 'hidden'
        }[type];

        var shouldPreventClose = void 0;
        if (type === 'blur') {
          // Note: SVGElement in IE11 does not have `.contains()`
          var wentToSelf = relatedTarget && this.element.contains && this.element.contains(relatedTarget) || this.tooltip && this.tooltip.element.contains(relatedTarget);
          shouldPreventClose = hadContextMenu || wentToSelf;
        }
        if (!shouldPreventClose) {
          this.changeState(state, details);
        }
      }
    }], [{
      key: 'options',
      get: function get() {
        var prefix = _settings2.default.prefix;

        return {
          selectorInit: '[data-tooltip-trigger]',
          classShown: prefix + '--tooltip--shown',
          attribTooltipTarget: 'data-tooltip-target',
          objMenuOffset: getMenuOffset,
          initEventNames: ['focus']
        };
      }
    }]);

    return Tooltip;
  }((0, _mixin3.default)(_createComponent2.default, _initComponentByEvent2.default, _eventedShowHideState2.default, _handles2.default));

  Tooltip.components = new WeakMap();
  exports.default = Tooltip;
});