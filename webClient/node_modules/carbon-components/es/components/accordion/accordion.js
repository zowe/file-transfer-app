var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import handles from '../../globals/js/mixins/handles';
import eventMatches from '../../globals/js/misc/event-matches';
import on from '../../globals/js/misc/on';

var Accordion = function (_mixin) {
  _inherits(Accordion, _mixin);

  /**
   * Accordion.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The element working as an accordion.
   */
  function Accordion(element, options) {
    _classCallCheck(this, Accordion);

    var _this = _possibleConstructorReturn(this, (Accordion.__proto__ || Object.getPrototypeOf(Accordion)).call(this, element, options));

    _this.manage(on(_this.element, 'click', function (event) {
      var item = eventMatches(event, _this.options.selectorAccordionItem);
      if (item && !eventMatches(event, _this.options.selectorAccordionContent)) {
        _this._toggle(item);
      }
    }));

    /**
     *
     *  DEPRECATE in v8
     *
     *  Swapping to a button elemenet instead of a div
     *  automatically maps click events to keypress as well
     *  This event listener now is only added if user is using
     *  the older markup
     */

    if (!_this._checkIfButton()) {
      _this.manage(on(_this.element, 'keypress', function (event) {
        var item = eventMatches(event, _this.options.selectorAccordionItem);

        if (item && !eventMatches(event, _this.options.selectorAccordionContent)) {
          _this._handleKeypress(event);
        }
      }));
    }
    return _this;
  }

  _createClass(Accordion, [{
    key: '_checkIfButton',
    value: function _checkIfButton() {
      return this.element.firstElementChild.firstElementChild.nodeName === 'BUTTON';
    }

    /**
     * Handles toggling of active state of accordion via keyboard
     * @param {Event} event The event triggering this method.
     */

  }, {
    key: '_handleKeypress',
    value: function _handleKeypress(event) {
      if (event.which === 13 || event.which === 32) {
        this._toggle(event.target);
      }
    }
  }, {
    key: '_toggle',
    value: function _toggle(element) {
      var heading = element.querySelector(this.options.selectorAccordionItemHeading);
      var expanded = heading.getAttribute('aria-expanded');

      if (expanded !== null) {
        heading.setAttribute('aria-expanded', expanded === 'true' ? 'false' : 'true');
      }

      element.classList.toggle(this.options.classActive);
    }

    /**
     * The component options.
     * If `options` is specified in the constructor,
     * {@linkcode NumberInput.create .create()}, or {@linkcode NumberInput.init .init()},
     * properties in this object are overriden for the instance being create and how {@linkcode NumberInput.init .init()} works.
     * @property {string} selectorInit The CSS selector to find accordion UIs.
     */

  }], [{
    key: 'options',
    get: function get() {
      var prefix = settings.prefix;

      return {
        selectorInit: '[data-accordion]',
        selectorAccordionItem: '.' + prefix + '--accordion__item',
        selectorAccordionItemHeading: '.' + prefix + '--accordion__heading',
        selectorAccordionContent: '.' + prefix + '--accordion__content',
        classActive: prefix + '--accordion__item--active'
      };
    }

    /**
     * The map associating DOM element and accordion UI instance.
     * @type {WeakMap}
     */

  }]);

  return Accordion;
}(mixin(createComponent, initComponentBySearch, handles));

Accordion.components = new WeakMap();


export default Accordion;