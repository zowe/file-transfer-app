(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../../globals/js/settings', '../../globals/js/misc/mixin', '../../globals/js/mixins/create-component', '../../globals/js/mixins/init-component-by-search', '../../globals/js/mixins/track-blur', '../../globals/js/misc/event-matches', '../../globals/js/misc/on'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../../globals/js/settings'), require('../../globals/js/misc/mixin'), require('../../globals/js/mixins/create-component'), require('../../globals/js/mixins/init-component-by-search'), require('../../globals/js/mixins/track-blur'), require('../../globals/js/misc/event-matches'), require('../../globals/js/misc/on'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.settings, global.mixin, global.createComponent, global.initComponentBySearch, global.trackBlur, global.eventMatches, global.on);
    global.dropdown = mod.exports;
  }
})(this, function (exports, _settings, _mixin2, _createComponent, _initComponentBySearch, _trackBlur, _eventMatches, _on) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _settings2 = _interopRequireDefault(_settings);

  var _mixin3 = _interopRequireDefault(_mixin2);

  var _createComponent2 = _interopRequireDefault(_createComponent);

  var _initComponentBySearch2 = _interopRequireDefault(_initComponentBySearch);

  var _trackBlur2 = _interopRequireDefault(_trackBlur);

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

  var Dropdown = function (_mixin) {
    _inherits(Dropdown, _mixin);

    /**
     * A selector with drop downs.
     * @extends CreateComponent
     * @extends InitComponentBySearch
     * @extends TrackBlur
     * @param {HTMLElement} element The element working as a selector.
     * @param {Object} [options] The component options.
     * @param {string} [options.selectorItem] The CSS selector to find clickable areas in dropdown items.
     * @param {string} [options.selectorItemSelected] The CSS selector to find the clickable area in the selected dropdown item.
     * @param {string} [options.classSelected] The CSS class for the selected dropdown item.
     * @param {string} [options.classOpen] The CSS class for the open state.
     * @param {string} [options.classDisabled] The CSS class for the disabled state.
     * @param {string} [options.eventBeforeSelected]
     *   The name of the custom event fired before a drop down item is selected.
     *   Cancellation of this event stops selection of drop down item.
     * @param {string} [options.eventAfterSelected] The name of the custom event fired after a drop down item is selected.
     */
    function Dropdown(element, options) {
      _classCallCheck(this, Dropdown);

      var _this = _possibleConstructorReturn(this, (Dropdown.__proto__ || Object.getPrototypeOf(Dropdown)).call(this, element, options));

      _this.manage((0, _on2.default)(_this.element.ownerDocument, 'click', function (event) {
        _this._toggle(event);
      }));
      _this.manage((0, _on2.default)(_this.element, 'keydown', function (event) {
        _this._handleKeyDown(event);
      }));
      _this.manage((0, _on2.default)(_this.element, 'click', function (event) {
        var item = (0, _eventMatches2.default)(event, _this.options.selectorItem);
        if (item) {
          _this.select(item);
        }
      }));
      return _this;
    }

    /**
     * Handles keydown event.
     * @param {Event} event The event triggering this method.
     */


    _createClass(Dropdown, [{
      key: '_handleKeyDown',
      value: function _handleKeyDown(event) {
        var isOpen = this.element.classList.contains(this.options.classOpen);
        var direction = {
          38: this.constructor.NAVIGATE.BACKWARD,
          40: this.constructor.NAVIGATE.FORWARD
        }[event.which];
        if (isOpen && direction !== undefined) {
          this.navigate(direction);
          event.preventDefault(); // Prevents up/down keys from scrolling container
        } else {
          this._toggle(event);
        }
      }
    }, {
      key: '_toggle',
      value: function _toggle(event) {
        var _this2 = this;

        var isDisabled = this.element.classList.contains(this.options.classDisabled);

        if (isDisabled) {
          return;
        }

        if ([13, 32, 40].indexOf(event.which) >= 0 && !event.target.matches(this.options.selectorItem) || event.which === 27 || event.type === 'click') {
          var isOpen = this.element.classList.contains(this.options.classOpen);
          var isOfSelf = this.element.contains(event.target);
          var actions = {
            add: isOfSelf && event.which === 40 && !isOpen,
            remove: (!isOfSelf || event.which === 27) && isOpen,
            toggle: isOfSelf && event.which !== 27 && event.which !== 40
          };
          Object.keys(actions).forEach(function (action) {
            if (actions[action]) {
              _this2.element.classList[action](_this2.options.classOpen);
              _this2.element.focus();
            }
          });
          var listItems = [].concat(_toConsumableArray(this.element.querySelectorAll(this.options.selectorItem)));
          listItems.forEach(function (item) {
            if (_this2.element.classList.contains(_this2.options.classOpen)) {
              item.tabIndex = 0;
            } else {
              item.tabIndex = -1;
            }
          });
        }
      }
    }, {
      key: 'getCurrentNavigation',
      value: function getCurrentNavigation() {
        var focused = this.element.ownerDocument.activeElement;
        return focused.nodeType === Node.ELEMENT_NODE && focused.matches(this.options.selectorItem) ? focused : null;
      }
    }, {
      key: 'navigate',
      value: function navigate(direction) {
        var items = [].concat(_toConsumableArray(this.element.querySelectorAll(this.options.selectorItem)));
        var start = this.getCurrentNavigation() || this.element.querySelector(this.options.selectorItemSelected);
        var getNextItem = function getNextItem(old) {
          var handleUnderflow = function handleUnderflow(i, l) {
            return i + (i >= 0 ? 0 : l);
          };
          var handleOverflow = function handleOverflow(i, l) {
            return i - (i < l ? 0 : l);
          };
          // `items.indexOf(old)` may be -1 (Scenario of no previous focus)
          var index = Math.max(items.indexOf(old) + direction, -1);
          return items[handleUnderflow(handleOverflow(index, items.length), items.length)];
        };
        for (var current = getNextItem(start); current && current !== start; current = getNextItem(current)) {
          if (!current.matches(this.options.selectorItemHidden) && !current.parentNode.matches(this.options.selectorItemHidden) && !current.matches(this.options.selectorItemSelected)) {
            current.focus();
            break;
          }
        }
      }
    }, {
      key: 'select',
      value: function select(itemToSelect) {
        var _this3 = this;

        var eventStart = new CustomEvent(this.options.eventBeforeSelected, {
          bubbles: true,
          cancelable: true,
          detail: { item: itemToSelect }
        });

        if (this.element.dispatchEvent(eventStart)) {
          if (this.element.dataset.dropdownType !== 'navigation') {
            var selectorText = this.element.dataset.dropdownType !== 'inline' ? this.options.selectorText : this.options.selectorTextInner;
            var text = this.element.querySelector(selectorText);
            if (text) {
              text.innerHTML = itemToSelect.innerHTML;
            }
            itemToSelect.classList.add(this.options.classSelected);
          }
          this.element.dataset.value = itemToSelect.parentElement.dataset.value;

          [].concat(_toConsumableArray(this.element.querySelectorAll(this.options.selectorItemSelected))).forEach(function (item) {
            if (itemToSelect !== item) {
              item.classList.remove(_this3.options.classSelected);
            }
          });

          this.element.dispatchEvent(new CustomEvent(this.options.eventAfterSelected, {
            bubbles: true,
            cancelable: true,
            detail: { item: itemToSelect }
          }));
        }
      }
    }, {
      key: 'handleBlur',
      value: function handleBlur() {
        this.element.classList.remove(this.options.classOpen);
      }
    }], [{
      key: 'options',
      get: function get() {
        var prefix = _settings2.default.prefix;

        return {
          selectorInit: '[data-dropdown]',
          selectorText: '.' + prefix + '--dropdown-text',
          selectorTextInner: '.' + prefix + '--dropdown-text__inner',
          selectorItem: '.' + prefix + '--dropdown-link',
          selectorItemSelected: '.' + prefix + '--dropdown--selected',
          selectorItemHidden: '[hidden],[aria-hidden="true"]',
          classSelected: prefix + '--dropdown--selected',
          classOpen: prefix + '--dropdown--open',
          classDisabled: prefix + '--dropdown--disabled',
          eventBeforeSelected: 'dropdown-beingselected',
          eventAfterSelected: 'dropdown-selected'
        };
      }
    }]);

    return Dropdown;
  }((0, _mixin3.default)(_createComponent2.default, _initComponentBySearch2.default, _trackBlur2.default));

  Dropdown.components = new WeakMap();
  Dropdown.NAVIGATE = {
    BACKWARD: -1,
    FORWARD: 1
  };
  exports.default = Dropdown;
});