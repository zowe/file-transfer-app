var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import trackBlur from '../../globals/js/mixins/track-blur';
import eventMatches from '../../globals/js/misc/event-matches';
import on from '../../globals/js/misc/on';

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

    _this.manage(on(_this.element.ownerDocument, 'click', function (event) {
      _this._toggle(event);
    }));
    _this.manage(on(_this.element, 'keydown', function (event) {
      _this._handleKeyDown(event);
    }));
    _this.manage(on(_this.element, 'click', function (event) {
      var item = eventMatches(event, _this.options.selectorItem);
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

    /**
     * Opens and closes the dropdown menu.
     * @param {Event} [event] The event triggering this method.
     */

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

    /**
     * @returns {Element} Currently highlighted element.
     */

  }, {
    key: 'getCurrentNavigation',
    value: function getCurrentNavigation() {
      var focused = this.element.ownerDocument.activeElement;
      return focused.nodeType === Node.ELEMENT_NODE && focused.matches(this.options.selectorItem) ? focused : null;
    }

    /**
     * Moves up/down the focus.
     * @param {number} direction The direction of navigating.
     */

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

    /**
     * Handles clicking on the dropdown options, doing the following:
     * * Change Dropdown text to selected option.
     * * Remove selected option from options when selected.
     * * Emit custom events.
     * @param {HTMLElement} itemToSelect The element to be activated.
     */

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

    /**
     * Closes the dropdown menu if this component loses focus.
     */

  }, {
    key: 'handleBlur',
    value: function handleBlur() {
      this.element.classList.remove(this.options.classOpen);
    }

    /**
     * The map associating DOM element and selector instance.
     * @member Dropdown.components
     * @type {WeakMap}
     */

  }], [{
    key: 'options',


    /**
     * The component options.
     * If `options` is specified in the constructor, {@linkcode Dropdown.create .create()}, or {@linkcode Dropdown.init .init()},
     * properties in this object are overriden for the instance being create and how {@linkcode Dropdown.init .init()} works.
     * @member Dropdown.options
     * @type {Object}
     * @property {string} selectorInit The CSS selector to find selectors.
     * @property {string} [selectorText] The CSS selector to find the element showing the selected item.
     * @property {string} [selectorTextInner] The CSS selector to find the element showing the selected item, used for inline mode.
     * @property {string} [selectorItem] The CSS selector to find clickable areas in dropdown items.
     * @property {string} [selectorItemHidden]
     *   The CSS selector to find hidden dropdown items.
     *   Used to skip dropdown items for keyboard navigation.
     * @property {string} [selectorItemSelected] The CSS selector to find the clickable area in the selected dropdown item.
     * @property {string} [classSelected] The CSS class for the selected dropdown item.
     * @property {string} [classOpen] The CSS class for the open state.
     * @property {string} [classDisabled] The CSS class for the disabled state.
     * @property {string} [eventBeforeSelected]
     *   The name of the custom event fired before a drop down item is selected.
     *   Cancellation of this event stops selection of drop down item.
     * @property {string} [eventAfterSelected] The name of the custom event fired after a drop down item is selected.
     */
    get: function get() {
      var prefix = settings.prefix;

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

    /**
     * Enum for navigating backward/forward.
     * @readonly
     * @member Dropdown.NAVIGATE
     * @type {Object}
     * @property {number} BACKWARD Navigating backward.
     * @property {number} FORWARD Navigating forward.
     */

  }]);

  return Dropdown;
}(mixin(createComponent, initComponentBySearch, trackBlur));

Dropdown.components = new WeakMap();
Dropdown.NAVIGATE = {
  BACKWARD: -1,
  FORWARD: 1
};


export default Dropdown;