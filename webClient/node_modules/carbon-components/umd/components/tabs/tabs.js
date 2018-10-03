(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../../globals/js/settings', '../../globals/js/misc/event-matches', '../content-switcher/content-switcher', '../../globals/js/misc/on'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../../globals/js/settings'), require('../../globals/js/misc/event-matches'), require('../content-switcher/content-switcher'), require('../../globals/js/misc/on'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.settings, global.eventMatches, global.contentSwitcher, global.on);
    global.tabs = mod.exports;
  }
})(this, function (exports, _settings, _eventMatches, _contentSwitcher, _on) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _settings2 = _interopRequireDefault(_settings);

  var _eventMatches2 = _interopRequireDefault(_eventMatches);

  var _contentSwitcher2 = _interopRequireDefault(_contentSwitcher);

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

  var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

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

  var Tab = function (_ContentSwitcher) {
    _inherits(Tab, _ContentSwitcher);

    /**
     * Container of tabs.
     * @extends ContentSwitcher
     * @param {HTMLElement} element The element working as a container of tabs.
     * @param {Object} [options] The component options.
     * @param {string} [options.selectorMenu] The CSS selector to find the drop down menu used in narrow mode.
     * @param {string} [options.selectorTrigger] The CSS selector to find the button to open the drop down menu used in narrow mode.
     * @param {string} [options.selectorTriggerText]
     *   The CSS selector to find the element used in narrow mode showing the selected tab item.
     * @param {string} [options.selectorButton] The CSS selector to find tab containers.
     * @param {string} [options.selectorButtonSelected] The CSS selector to find the selected tab.
     * @param {string} [options.selectorLink] The CSS selector to find the links in tabs.
     * @param {string} [options.classActive] The CSS class for tab's selected state.
     * @param {string} [options.classHidden] The CSS class for the drop down menu's hidden state used in narrow mode.
     * @param {string} [options.eventBeforeSelected]
     *   The name of the custom event fired before a tab is selected.
     *   Cancellation of this event stops selection of tab.
     * @param {string} [options.eventAfterSelected] The name of the custom event fired after a tab is selected.
     */
    function Tab(element, options) {
      _classCallCheck(this, Tab);

      var _this = _possibleConstructorReturn(this, (Tab.__proto__ || Object.getPrototypeOf(Tab)).call(this, element, options));

      _this.manage((0, _on2.default)(_this.element, 'keydown', function (event) {
        _this._handleKeyDown(event);
      }));

      var selected = _this.element.querySelector(_this.options.selectorButtonSelected);
      if (selected) {
        _this._updateTriggerText(selected);
      }
      return _this;
    }

    /**
     * Internal method of {@linkcode Tab#setActive .setActive()}, to select a tab item.
     * @private
     * @param {Object} detail The detail of the event trigging this action.
     * @param {HTMLElement} detail.item The tab item to be selected.
     * @param {Function} callback Callback called when change in state completes.
     */


    _createClass(Tab, [{
      key: '_changeState',
      value: function _changeState(detail, callback) {
        var _this2 = this;

        _get(Tab.prototype.__proto__ || Object.getPrototypeOf(Tab.prototype), '_changeState', this).call(this, detail, function (error) {
          for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            data[_key - 1] = arguments[_key];
          }

          if (!error) {
            _this2._updateTriggerText(detail.item);
          }
          callback.apply(undefined, [error].concat(data));
        });
      }
    }, {
      key: '_handleClick',
      value: function _handleClick(event) {
        var button = (0, _eventMatches2.default)(event, this.options.selectorButton);
        var trigger = (0, _eventMatches2.default)(event, this.options.selectorTrigger);
        if (button) {
          _get(Tab.prototype.__proto__ || Object.getPrototypeOf(Tab.prototype), '_handleClick', this).call(this, event);
          this._updateMenuState(false);
        }
        if (trigger) {
          this._updateMenuState();
        }
      }
    }, {
      key: '_handleKeyDown',
      value: function _handleKeyDown(event) {
        var _this3 = this;

        var triggerNode = (0, _eventMatches2.default)(event, this.options.selectorTrigger);
        if (triggerNode) {
          if (event.which === 13) {
            this._updateMenuState();
          }
          return;
        }

        var direction = {
          37: this.constructor.NAVIGATE.BACKWARD,
          39: this.constructor.NAVIGATE.FORWARD
        }[event.which];

        if (direction) {
          var buttons = [].concat(_toConsumableArray(this.element.querySelectorAll(this.options.selectorButton)));
          var button = this.element.querySelector(this.options.selectorButtonSelected);
          var nextIndex = Math.max(buttons.indexOf(button) + direction, -1 /* For `button` not found in `buttons` */);
          var nextIndexLooped = nextIndex >= 0 && nextIndex < buttons.length ? nextIndex : nextIndex - Math.sign(nextIndex) * buttons.length;
          this.setActive(buttons[nextIndexLooped], function (error, item) {
            if (item) {
              var link = item.querySelector(_this3.options.selectorLink);
              if (link) {
                link.focus();
              }
            }
          });
          event.preventDefault();
        }
      }
    }, {
      key: '_updateMenuState',
      value: function _updateMenuState(force) {
        var menu = this.element.querySelector(this.options.selectorMenu);
        if (menu) {
          menu.classList.toggle(this.options.classHidden, typeof force === 'undefined' ? force : !force);
        }
      }
    }, {
      key: '_updateTriggerText',
      value: function _updateTriggerText(target) {
        var triggerText = this.element.querySelector(this.options.selectorTriggerText);
        if (triggerText) {
          triggerText.textContent = target.textContent;
        }
      }
    }], [{
      key: 'options',
      get: function get() {
        var prefix = _settings2.default.prefix;

        return Object.assign(Object.create(_contentSwitcher2.default.options), {
          selectorInit: '[data-tabs]',
          selectorMenu: '.' + prefix + '--tabs__nav',
          selectorTrigger: '.' + prefix + '--tabs-trigger',
          selectorTriggerText: '.' + prefix + '--tabs-trigger-text',
          selectorButton: '.' + prefix + '--tabs__nav-item',
          selectorButtonSelected: '.' + prefix + '--tabs__nav-item--selected',
          selectorLink: '.' + prefix + '--tabs__nav-link',
          classActive: prefix + '--tabs__nav-item--selected',
          classHidden: prefix + '--tabs__nav--hidden',
          eventBeforeSelected: 'tab-beingselected',
          eventAfterSelected: 'tab-selected'
        });
      }
    }]);

    return Tab;
  }(_contentSwitcher2.default);

  Tab.components = new WeakMap();
  Tab.NAVIGATE = {
    BACKWARD: -1,
    FORWARD: 1
  };
  exports.default = Tab;
});