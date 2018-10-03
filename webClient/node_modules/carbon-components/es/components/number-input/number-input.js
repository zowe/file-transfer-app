var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import handles from '../../globals/js/mixins/handles';
import on from '../../globals/js/misc/on';

var NumberInput = function (_mixin) {
  _inherits(NumberInput, _mixin);

  /**
   * Number input UI.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The element working as a number input UI.
   */
  function NumberInput(element, options) {
    _classCallCheck(this, NumberInput);

    // Broken DOM tree is seen with up/down arrows <svg> in IE, which breaks event delegation.
    // <svg> does not have `Element.classList` in IE11
    var _this = _possibleConstructorReturn(this, (NumberInput.__proto__ || Object.getPrototypeOf(NumberInput)).call(this, element, options));

    _this.manage(on(_this.element.querySelector('.up-icon'), 'click', function (event) {
      _this._handleClick(event);
    }));
    _this.manage(on(_this.element.querySelector('.down-icon'), 'click', function (event) {
      _this._handleClick(event);
    }));
    return _this;
  }

  /**
   * Increase/decrease number by clicking on up/down icons.
   * @param {Event} event The event triggering this method.
   */


  _createClass(NumberInput, [{
    key: '_handleClick',
    value: function _handleClick(event) {
      var numberInput = this.element.querySelector(this.options.selectorInput);
      var target = event.currentTarget.getAttribute('class').split(' ');

      if (target.indexOf('up-icon') >= 0) {
        ++numberInput.value;
      } else if (target.indexOf('down-icon') >= 0) {
        --numberInput.value;
      }

      // Programmatic change in value (including `stepUp()`/`stepDown()`) won't fire change event
      numberInput.dispatchEvent(new CustomEvent('change', {
        bubbles: true,
        cancelable: false
      }));
    }

    /**
     * The map associating DOM element and number input UI instance.
     * @member NumberInput.components
     * @type {WeakMap}
     */

  }], [{
    key: 'options',


    /**
     * The component options.
     * If `options` is specified in the constructor,
     * {@linkcode NumberInput.create .create()}, or {@linkcode NumberInput.init .init()},
     * properties in this object are overriden for the instance being create and how {@linkcode NumberInput.init .init()} works.
     * @member NumberInput.options
     * @type {Object}
     * @property {string} selectorInit The CSS selector to find number input UIs.
     * @property {string} [selectorInput] The CSS selector to find the `<input>` element.
     */
    get: function get() {
      var prefix = settings.prefix;

      return {
        selectorInit: '[data-numberinput]',
        selectorInput: '.' + prefix + '--number input'
      };
    }
  }]);

  return NumberInput;
}(mixin(createComponent, initComponentBySearch, handles));

NumberInput.components = new WeakMap();


export default NumberInput;