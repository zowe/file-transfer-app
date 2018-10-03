var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import handles from '../../globals/js/mixins/handles';

var CodeSnippet = function (_mixin) {
  _inherits(CodeSnippet, _mixin);

  /**
   * CodeSnippet UI.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The element working as a CodeSnippet UI.
   */

  function CodeSnippet(element, options) {
    _classCallCheck(this, CodeSnippet);

    var _this = _possibleConstructorReturn(this, (CodeSnippet.__proto__ || Object.getPrototypeOf(CodeSnippet)).call(this, element, options));

    _this._initCodeSnippet();
    _this.element.querySelector(_this.options.classExpandBtn).addEventListener('click', function (evt) {
      return _this._handleClick(evt);
    });
    return _this;
  }

  _createClass(CodeSnippet, [{
    key: '_handleClick',
    value: function _handleClick() {
      var expandBtn = this.element.querySelector(this.options.classExpandText);
      this.element.classList.toggle(this.options.classExpanded);

      if (this.element.classList.contains(this.options.classExpanded)) {
        expandBtn.textContent = expandBtn.getAttribute(this.options.attribShowLessText);
      } else {
        expandBtn.textContent = expandBtn.getAttribute(this.options.attribShowMoreText);
      }
    }
  }, {
    key: '_initCodeSnippet',
    value: function _initCodeSnippet() {
      var expandBtn = this.element.querySelector(this.options.classExpandText);
      if (!expandBtn) {
        throw new TypeError('Cannot find the expand button.');
      }

      expandBtn.textContent = expandBtn.getAttribute(this.options.attribShowMoreText);

      if (this.element.offsetHeight < this.options.minHeight) {
        this.element.classList.add(this.options.classHideExpand);
        this.element.classList.add(this.options.classExpanded);
      }
    }

    /**
     * The map associating DOM element and code snippet UI instance.
     * @member CodeSnippet.components
     * @type {WeakMap}
     */

  }], [{
    key: 'options',


    /**
     * The component options.
     * If `options` is specified in the constructor, {@linkcode CodeSnippet.create .create()},
     * or {@linkcode CodeSnippet.init .init()},
     * properties in this object are overriden for the instance being create and how {@linkcode CodeSnippet.init .init()} works.
     * @member CodeSnippet.options
     * @type {Object}
     * @property {string} selectorInit The data attribute to find code snippet UIs.
     */
    get: function get() {
      var prefix = settings.prefix;

      return {
        selectorInit: '[data-code-snippet]',
        attribShowMoreText: 'data-show-more-text',
        attribShowLessText: 'data-show-less-text',
        minHeight: 288,
        classExpanded: prefix + '--snippet--expand',
        classExpandBtn: '.' + prefix + '--snippet-btn--expand',
        classExpandText: '.' + prefix + '--snippet-btn--text',
        classHideExpand: prefix + '--snippet-btn--expand--hide'
      };
    }
  }]);

  return CodeSnippet;
}(mixin(createComponent, initComponentBySearch, handles));

CodeSnippet.components = new WeakMap();


export default CodeSnippet;