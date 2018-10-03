var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import settings from '../../globals/js/settings';
import eventMatches from '../../globals/js/misc/event-matches';
import ContentSwitcher from '../content-switcher/content-switcher';
import on from '../../globals/js/misc/on';

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

    _this.manage(on(_this.element, 'keydown', function (event) {
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

    /**
     * Handles click on tab container.
     * * If the click is on a tab, activates it.
     * * If the click is on the button to open the drop down menu, does so.
     * @param {Event} event The event triggering this method.
     */

  }, {
    key: '_handleClick',
    value: function _handleClick(event) {
      var button = eventMatches(event, this.options.selectorButton);
      var trigger = eventMatches(event, this.options.selectorTrigger);
      if (button) {
        _get(Tab.prototype.__proto__ || Object.getPrototypeOf(Tab.prototype), '_handleClick', this).call(this, event);
        this._updateMenuState(false);
      }
      if (trigger) {
        this._updateMenuState();
      }
    }

    /**
     * Handles arrow keys on tab container.
     * * Left keys are used to go to previous tab.
     * * Right keys are used to go to next tab.
     * @param {Event} event The event triggering this method.
     */

  }, {
    key: '_handleKeyDown',
    value: function _handleKeyDown(event) {
      var _this3 = this;

      var triggerNode = eventMatches(event, this.options.selectorTrigger);
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

    /**
     * Shows/hides the drop down menu used in narrow mode.
     * @param {boolean} [force] `true` to show the menu, `false` to hide the menu, otherwise toggles the menu.
     */

  }, {
    key: '_updateMenuState',
    value: function _updateMenuState(force) {
      var menu = this.element.querySelector(this.options.selectorMenu);
      if (menu) {
        menu.classList.toggle(this.options.classHidden, typeof force === 'undefined' ? force : !force);
      }
    }

    /**
     * Updates the text indicating the currently selected tab item.
     * @param {HTMLElement} target The newly selected tab item.
     */

  }, {
    key: '_updateTriggerText',
    value: function _updateTriggerText(target) {
      var triggerText = this.element.querySelector(this.options.selectorTriggerText);
      if (triggerText) {
        triggerText.textContent = target.textContent;
      }
    }

    /**
     * The map associating DOM element and tab container instance.
     * @member Tab.components
     * @type {WeakMap}
     */

  }], [{
    key: 'options',


    /**
     * The component options.
     * If `options` is specified in the constructor, {@linkcode ContentSwitcher.create .create()}, or {@linkcode Tab.init .init()},
     * properties in this object are overriden for the instance being create and how {@linkcode Tab.init .init()} works.
     * @member Tab.options
     * @type {Object}
     * @property {string} selectorInit The CSS selector to find tab containers.
     * @property {string} [selectorMenu] The CSS selector to find the drop down menu used in narrow mode.
     * @property {string} [selectorTrigger] The CSS selector to find the button to open the drop down menu used in narrow mode.
     * @property {string} [selectorTriggerText]
     *   The CSS selector to find the element used in narrow mode showing the selected tab item.
     * @property {string} [selectorButton] The CSS selector to find tab containers.
     * @property {string} [selectorButtonSelected] The CSS selector to find the selected tab.
     * @property {string} [selectorLink] The CSS selector to find the links in tabs.
     * @property {string} [classActive] The CSS class for tab's selected state.
     * @property {string} [classHidden] The CSS class for the drop down menu's hidden state used in narrow mode.
     * @property {string} [eventBeforeSelected]
     *   The name of the custom event fired before a tab is selected.
     *   Cancellation of this event stops selection of tab.
     * @property {string} [eventAfterSelected] The name of the custom event fired after a tab is selected.
     */
    get: function get() {
      var prefix = settings.prefix;

      return Object.assign(Object.create(ContentSwitcher.options), {
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

    /**
     * Enum for navigating backward/forward.
     * @readonly
     * @member Tab.NAVIGATE
     * @type {Object}
     * @property {number} BACKWARD Navigating backward.
     * @property {number} FORWARD Navigating forward.
     */

  }]);

  return Tab;
}(ContentSwitcher);

Tab.components = new WeakMap();
Tab.NAVIGATE = {
  BACKWARD: -1,
  FORWARD: 1
};


export default Tab;