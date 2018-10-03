var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import InitComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import handles from '../../globals/js/mixins/handles';
import on from '../../globals/js/misc/on';

var CopyButton = function (_mixin) {
  _inherits(CopyButton, _mixin);

  /**
   * CopyBtn UI.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The element working as a copy button UI.
   */
  function CopyButton(element, options) {
    _classCallCheck(this, CopyButton);

    var _this = _possibleConstructorReturn(this, (CopyButton.__proto__ || Object.getPrototypeOf(CopyButton)).call(this, element, options));

    _this.manage(on(_this.element, 'click', function () {
      return _this.handleClick();
    }));
    return _this;
  }

  /**
   * Show the feedback tooltip on click. Hide the feedback tooltip after specified timeout value.
   */


  _createClass(CopyButton, [{
    key: 'handleClick',
    value: function handleClick() {
      var _this2 = this;

      var feedback = this.element.querySelector(this.options.feedbackTooltip);
      if (feedback) {
        feedback.classList.add(this.options.classShowFeedback);
        setTimeout(function () {
          feedback.classList.remove(_this2.options.classShowFeedback);
        }, this.options.timeoutValue);
      }
    }

    /**
     * The map associating DOM element and copy button UI instance.
     * @member CopyBtn.components
     * @type {WeakMap}
     */

  }], [{
    key: 'options',


    /**
     * The component options.
     * If `options` is specified in the constructor, {@linkcode CopyBtn.create .create()}, or {@linkcode CopyBtn.init .init()},
     * properties in this object are overriden for the instance being create and how {@linkcode CopyBtn.init .init()} works.
     * @member CopyBtn.options
     * @type {Object}
     * @property {string} selectorInit The data attribute to find copy button UIs.
     * @property {string} feedbackTooltip The data attribute to find feedback tooltip.
     * @property {string} classShowFeedback The CSS selector for showing the feedback tooltip.
     * @property {number} timeoutValue The specified timeout value before the feedback tooltip is hidden.
     */
    get: function get() {
      var prefix = settings.prefix;

      return {
        selectorInit: '[data-copy-btn]',
        feedbackTooltip: '[data-feedback]',
        classShowFeedback: prefix + '--btn--copy__feedback--displayed',
        timeoutValue: 2000
      };
    }
  }]);

  return CopyButton;
}(mixin(createComponent, InitComponentBySearch, handles));

CopyButton.components = new WeakMap();


export default CopyButton;