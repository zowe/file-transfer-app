var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentByEvent from '../../globals/js/mixins/init-component-by-event';
import handles from '../../globals/js/mixins/handles';
import on from '../../globals/js/misc/on';

var FabButton = function (_mixin) {
  _inherits(FabButton, _mixin);

  /**
   * Floating action button.
   * @extends CreateComponent
   * @extends InitComponentByEvent
   * @extends Handles
   * @param {HTMLElement} element The element working as a floting action button.
   */
  function FabButton(element) {
    _classCallCheck(this, FabButton);

    var _this = _possibleConstructorReturn(this, (FabButton.__proto__ || Object.getPrototypeOf(FabButton)).call(this, element));

    _this.manage(on(element, 'click', function (event) {
      _this.toggle(event);
    }));
    return _this;
  }

  /**
   * A method called when this widget is created upon clicking.
   * @param {Event} event The event triggering the creation.
   */


  _createClass(FabButton, [{
    key: 'createdByEvent',
    value: function createdByEvent(event) {
      this.toggle(event);
    }

    /**
     * Toggles this floating action button.
     * @param {Event} event The event triggering this method.
     */

  }, {
    key: 'toggle',
    value: function toggle(event) {
      if (this.element.tagName === 'A') {
        event.preventDefault();
      }

      if (this.element.dataset.state === 'closed') {
        this.element.dataset.state = 'open';
      } else {
        this.element.dataset.state = 'closed';
      }
    }

    /**
     * Instantiates floating action button of the given element.
     * @param {HTMLElement} element The element.
     */

  }], [{
    key: 'create',
    value: function create(element) {
      return this.components.get(element) || new this(element);
    }

    /**
     * The map associating DOM element and floating action button instance.
     * @member FabButton.components
     * @type {WeakMap}
     */


    /**
     * The component options.
     * If `options` is specified in the constructor, {@linkcode FabButton.create .create()}, or {@linkcode FabButton.init .init()},
     * properties in this object are overriden for the instance being create and how {@linkcode FabButton.init .init()} works.
     * @member FabButton.options
     * @type {Object}
     * @property {string} selectorInit The CSS selector to find floating action buttons.
     */

  }]);

  return FabButton;
}(mixin(createComponent, initComponentByEvent, handles));

FabButton.components = new WeakMap();
FabButton.options = {
  selectorInit: '[data-fab]',
  initEventNames: ['click']
};


export default FabButton;