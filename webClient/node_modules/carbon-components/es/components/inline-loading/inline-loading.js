var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import handles from '../../globals/js/mixins/handles';
import toggleAttribute from '../../globals/js/misc/toggle-attribute';

var InlineLoading = function (_mixin) {
  _inherits(InlineLoading, _mixin);

  /**
   * Spinner indicating loading state.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The element working as a spinner.
   * @param {Object} [options] The component options.
   * @param {string} [options.initialState] The initial state, should be `inactive`, `active` or `finished`.
   */
  function InlineLoading(element, options) {
    _classCallCheck(this, InlineLoading);

    // Sets the initial state
    var _this = _possibleConstructorReturn(this, (InlineLoading.__proto__ || Object.getPrototypeOf(InlineLoading)).call(this, element, options));

    var initialState = _this.options.initialState;
    if (initialState) {
      _this.setState(initialState);
    }
    return _this;
  }

  /**
   * Sets active/inactive state.
   * @param {string} state The new state, should be `inactive`, `active` or `finished`.
   */


  _createClass(InlineLoading, [{
    key: 'setState',
    value: function setState(state) {
      var states = this.constructor.states;
      var values = Object.keys(states).map(function (key) {
        return states[key];
      });
      if (values.indexOf(state) < 0) {
        throw new Error('One of the following value should be given as the state: ' + values.join(', '));
      }

      var elem = this.element;
      var _options = this.options,
          selectorSpinner = _options.selectorSpinner,
          selectorFinished = _options.selectorFinished,
          selectorTextActive = _options.selectorTextActive,
          selectorTextFinished = _options.selectorTextFinished;

      var spinner = elem.querySelector(selectorSpinner);
      var finished = elem.querySelector(selectorFinished);
      var textActive = elem.querySelector(selectorTextActive);
      var textFinished = elem.querySelector(selectorTextFinished);

      if (spinner) {
        spinner.classList.toggle(this.options.classLoadingStop, state !== states.ACTIVE);
        toggleAttribute(spinner, 'hidden', state === states.FINISHED);
      }

      if (finished) {
        toggleAttribute(finished, 'hidden', state !== states.FINISHED);
      }

      if (textActive) {
        toggleAttribute(textActive, 'hidden', state !== states.ACTIVE);
      }

      if (textFinished) {
        toggleAttribute(textFinished, 'hidden', state !== states.FINISHED);
      }

      return this;
    }

    /**
     * The list of states.
     * @type {Object<string, string>}
     */


    /**
     * The map associating DOM element and spinner instance.
     * @member InlineLoading.components
     * @type {WeakMap}
     */

  }], [{
    key: 'options',


    /**
     * The component options.
     * If `options` is specified in the constructor, {@linkcode InlineLoading.create .create()},
     * or {@linkcode InlineLoading.init .init()},
     * properties in this object are overriden for the instance being create and how {@linkcode InlineLoading.init .init()} works.
     * @member InlineLoading.options
     * @type {Object}
     * @property {string} selectorInit The CSS selector to find inline loading components.
     * @property {string} selectorSpinner The CSS selector to find the spinner.
     * @property {string} selectorFinished The CSS selector to find the "finished" icon.
     * @property {string} selectorTextActive The CSS selector to find the text describing the active state.
     * @property {string} selectorTextFinished The CSS selector to find the text describing the finished state.
     * @property {string} classLoadingStop The CSS class for spinner's stopped state.
     */
    get: function get() {
      var prefix = settings.prefix;

      return {
        selectorInit: '[data-inline-loading]',
        selectorSpinner: '[data-inline-loading-spinner]',
        selectorFinished: '[data-inline-loading-finished]',
        selectorTextActive: '[data-inline-loading-text-active]',
        selectorTextFinished: '[data-inline-loading-text-finished]',
        classLoadingStop: prefix + '--loading--stop'
      };
    }
  }]);

  return InlineLoading;
}(mixin(createComponent, initComponentBySearch, handles));

InlineLoading.states = {
  INACTIVE: 'inactive',
  ACTIVE: 'active',
  FINISHED: 'finished'
};
InlineLoading.components = new WeakMap();


export default InlineLoading;