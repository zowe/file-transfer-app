(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../../globals/js/settings', '../../globals/js/misc/mixin', '../../globals/js/mixins/create-component', '../../globals/js/mixins/init-component-by-search', '../../globals/js/mixins/evented-show-hide-state', '../../globals/js/mixins/handles', '../floating-menu/floating-menu', '../../globals/js/misc/get-launching-details', '../../globals/js/misc/on'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../../globals/js/settings'), require('../../globals/js/misc/mixin'), require('../../globals/js/mixins/create-component'), require('../../globals/js/mixins/init-component-by-search'), require('../../globals/js/mixins/evented-show-hide-state'), require('../../globals/js/mixins/handles'), require('../floating-menu/floating-menu'), require('../../globals/js/misc/get-launching-details'), require('../../globals/js/misc/on'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.settings, global.mixin, global.createComponent, global.initComponentBySearch, global.eventedShowHideState, global.handles, global.floatingMenu, global.getLaunchingDetails, global.on);
    global.overflowMenu = mod.exports;
  }
})(this, function (exports, _settings, _mixin2, _createComponent, _initComponentBySearch, _eventedShowHideState, _handles, _floatingMenu, _getLaunchingDetails, _on) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getMenuOffset = undefined;

  var _settings2 = _interopRequireDefault(_settings);

  var _mixin3 = _interopRequireDefault(_mixin2);

  var _createComponent2 = _interopRequireDefault(_createComponent);

  var _initComponentBySearch2 = _interopRequireDefault(_initComponentBySearch);

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

  var _triggerButtonPositio, _triggerButtonPositio2;

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
   * The CSS property names of the arrow keyed by the floating menu direction.
   * @type {Object<string, string>}
   */
  var triggerButtonPositionProps = (_triggerButtonPositio = {}, _defineProperty(_triggerButtonPositio, _floatingMenu.DIRECTION_TOP, 'bottom'), _defineProperty(_triggerButtonPositio, _floatingMenu.DIRECTION_BOTTOM, 'top'), _triggerButtonPositio);

  /**
   * Determines how the position of arrow should affect the floating menu position.
   * @type {Object<string, number>}
   */
  var triggerButtonPositionFactors = (_triggerButtonPositio2 = {}, _defineProperty(_triggerButtonPositio2, _floatingMenu.DIRECTION_TOP, -2), _defineProperty(_triggerButtonPositio2, _floatingMenu.DIRECTION_BOTTOM, -1), _triggerButtonPositio2);

  /**
   * @param {Element} menuBody The menu body with the menu arrow.
   * @param {string} direction The floating menu direction.
   * @returns {FloatingMenu~offset} The adjustment of the floating menu position, upon the position of the menu arrow.
   * @private
   */
  var getMenuOffset = exports.getMenuOffset = function getMenuOffset(menuBody, direction) {
    var triggerButtonPositionProp = triggerButtonPositionProps[direction];
    var triggerButtonPositionFactor = triggerButtonPositionFactors[direction];
    if (!triggerButtonPositionProp || !triggerButtonPositionFactor) {
      console.warn('Wrong floating menu direction:', direction); // eslint-disable-line no-console
    }
    var menuWidth = menuBody.offsetWidth;
    var arrowStyle = menuBody.ownerDocument.defaultView.getComputedStyle(menuBody, ':before');
    var values = [triggerButtonPositionProp, 'left', 'width', 'height', 'border-top-width'].reduce(function (o, name) {
      return _extends({}, o, _defineProperty({}, name, Number((/^([\d-.]+)px$/.exec(arrowStyle.getPropertyValue(name)) || [])[1])));
    }, {});
    if (Object.keys(values).every(function (name) {
      return !isNaN(values[name]);
    })) {
      var left = values.left,
          width = values.width,
          height = values.height,
          borderTopWidth = values['border-top-width'];

      return {
        left: menuWidth / 2 - (left + Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2),
        top: Math.sqrt(Math.pow(borderTopWidth, 2) * 2) + triggerButtonPositionFactor * values[triggerButtonPositionProp]
      };
    }
    return undefined;
  };

  var OverflowMenu = function (_mixin) {
    _inherits(OverflowMenu, _mixin);

    /**
     * Overflow menu.
     * @extends CreateComponent
     * @extends InitComponentBySearch
     * @extends Handles
     * @param {HTMLElement} element The element working as a modal dialog.
     * @param {Object} [options] The component options.
     * @param {string} [options.selectorOptionMenu] The CSS selector to find the menu.
     * @param {string} [options.classShown] The CSS class for the shown state, for the trigger UI.
     * @param {string} [options.classMenuShown] The CSS class for the shown state, for the menu.
     * @param {string} [options.classMenuFlip] The CSS class for the flipped state of the menu.
     * @param {Object} [options.objMenuOffset] The offset locating the menu for the non-flipped state.
     * @param {Object} [options.objMenuOffsetFlip] The offset locating the menu for the flipped state.
     */
    function OverflowMenu(element, options) {
      _classCallCheck(this, OverflowMenu);

      var _this = _possibleConstructorReturn(this, (OverflowMenu.__proto__ || Object.getPrototypeOf(OverflowMenu)).call(this, element, options));

      _this.manage((0, _on2.default)(_this.element.ownerDocument, 'click', function (event) {
        _this._handleDocumentClick(event);
        _this.wasOpenBeforeClick = undefined;
      }));
      _this.manage((0, _on2.default)(_this.element.ownerDocument, 'keydown', function (event) {
        if (event.which === 27) {
          _this._handleKeyPress(event);
        }
      }));
      _this.manage((0, _on2.default)(_this.element.ownerDocument, 'keypress', function (event) {
        if (event.which !== 27) {
          _this._handleKeyPress(event);
        }
      }));
      _this.manage((0, _on2.default)(_this.element, 'mousedown', function () {
        _this.wasOpenBeforeClick = element.classList.contains(_this.options.classShown);
      }));
      return _this;
    }

    /**
     * Changes the shown/hidden state.
     * @param {string} state The new state.
     * @param {Object} detail The detail of the event trigging this action.
     * @param {Function} callback Callback called when change in state completes.
     */


    _createClass(OverflowMenu, [{
      key: 'changeState',
      value: function changeState(state, detail, callback) {
        if (state === 'hidden') {
          this.element.setAttribute('aria-expanded', 'false');
        } else {
          this.element.setAttribute('aria-expanded', 'true');
        }

        if (!this.optionMenu) {
          var optionMenu = this.element.querySelector(this.options.selectorOptionMenu);
          if (!optionMenu) {
            throw new Error('Cannot find the target menu.');
          }

          // Lazily create a component instance for menu
          this.optionMenu = _floatingMenu2.default.create(optionMenu, {
            refNode: this.element,
            classShown: this.options.classMenuShown,
            classRefShown: this.options.classShown,
            offset: this.options.objMenuOffset
          });
          this.children.push(this.optionMenu);
        }
        if (this.optionMenu.element.classList.contains(this.options.classMenuFlip)) {
          this.optionMenu.options.offset = this.options.objMenuOffsetFlip;
        }

        // Delegates the action of changing state to the menu.
        // (And thus the before/after shown/hidden events are fired from the menu)
        this.optionMenu.changeState(state, Object.assign(detail, { delegatorNode: this.element }), callback);
      }
    }, {
      key: '_handleDocumentClick',
      value: function _handleDocumentClick(event) {
        var element = this.element,
            optionMenu = this.optionMenu,
            wasOpenBeforeClick = this.wasOpenBeforeClick;

        var isOfSelf = element.contains(event.target);
        var isOfMenu = optionMenu && optionMenu.element.contains(event.target);
        var shouldBeOpen = isOfSelf && !wasOpenBeforeClick;
        var state = shouldBeOpen ? 'shown' : 'hidden';

        if (isOfSelf) {
          if (element.tagName === 'A') {
            event.preventDefault();
          }
          event.delegateTarget = element; // eslint-disable-line no-param-reassign
        }

        this.changeState(state, (0, _getLaunchingDetails2.default)(event), function () {
          if (state === 'hidden' && isOfMenu) {
            element.focus();
          }
        });
      }
    }, {
      key: '_handleKeyPress',
      value: function _handleKeyPress(event) {
        var key = event.which;
        var element = this.element,
            optionMenu = this.optionMenu,
            options = this.options;

        var isOfMenu = optionMenu && optionMenu.element.contains(event.target);

        if (key === 27) {
          this.changeState('hidden', (0, _getLaunchingDetails2.default)(event), function () {
            if (isOfMenu) {
              element.focus();
            }
          });
        }

        if (key === 13 || key === 32) {
          var isOfSelf = element.contains(event.target);
          var shouldBeOpen = isOfSelf && !element.classList.contains(options.classShown);
          var state = shouldBeOpen ? 'shown' : 'hidden';

          if (isOfSelf) {
            // 32 is to prevent screen from jumping when menu is opened with spacebar
            if (element.tagName === 'A' || key === 32) {
              event.preventDefault();
            }
            event.delegateTarget = element; // eslint-disable-line no-param-reassign
          }

          this.changeState(state, (0, _getLaunchingDetails2.default)(event), function () {
            if (state === 'hidden' && isOfMenu) {
              element.focus();
            }
          });
        }
      }
    }], [{
      key: 'options',
      get: function get() {
        var prefix = _settings2.default.prefix;

        return {
          selectorInit: '[data-overflow-menu]',
          selectorOptionMenu: '.' + prefix + '--overflow-menu-options',
          classShown: prefix + '--overflow-menu--open',
          classMenuShown: prefix + '--overflow-menu-options--open',
          classMenuFlip: prefix + '--overflow-menu--flip',
          objMenuOffset: getMenuOffset,
          objMenuOffsetFlip: getMenuOffset
        };
      }
    }]);

    return OverflowMenu;
  }((0, _mixin3.default)(_createComponent2.default, _initComponentBySearch2.default, _eventedShowHideState2.default, _handles2.default));

  OverflowMenu.components = new WeakMap();
  exports.default = OverflowMenu;
});