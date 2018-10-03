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

var Loading = function (_mixin) {
  _inherits(Loading, _mixin);

  /**
   * Spinner indicating loading state.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The element working as a spinner.
   * @param {Object} [options] The component options.
   * @param {boolean} [options.active] `true` if this spinner should roll.
   */
  function Loading(element, options) {
    _classCallCheck(this, Loading);

    var _this = _possibleConstructorReturn(this, (Loading.__proto__ || Object.getPrototypeOf(Loading)).call(this, element, options));

    _this.active = _this.options.active;

    // Initialize spinner
    _this.set(_this.active);
    return _this;
  }

  /**
   * Sets active/inactive state.
   * @param {boolean} active `true` if this spinner should roll.
   */


  _createClass(Loading, [{
    key: 'set',
    value: function set(active) {
      if (typeof active !== 'boolean') {
        throw new TypeError('set expects a boolean.');
      }

      this.active = active;
      this.element.classList.toggle(this.options.classLoadingStop, !this.active);

      /**
       * If overlay is the parentNode then toggle it too.
       */
      var parentNode = this.element.parentNode;

      if (parentNode && parentNode.classList.contains(this.options.classLoadingOverlay)) {
        parentNode.classList.toggle(this.options.classLoadingOverlayStop, !this.active);
      }

      return this;
    }

    /**
     * Toggles active/inactive state.
     */

  }, {
    key: 'toggle',
    value: function toggle() {
      return this.set(!this.active);
    }

    /**
     * @returns {boolean} `true` if this spinner is rolling.
     */

  }, {
    key: 'isActive',
    value: function isActive() {
      return this.active;
    }

    /**
     * Sets state to inactive and deletes the loading element.
     */

  }, {
    key: 'end',
    value: function end() {
      var _this2 = this;

      this.set(false);
      var handleAnimationEnd = this.manage(on(this.element, 'animationend', function (evt) {
        if (handleAnimationEnd) {
          handleAnimationEnd = _this2.unmanage(handleAnimationEnd).release();
        }
        if (evt.animationName === 'rotate-end-p2') {
          _this2._deleteElement();
        }
      }));
    }

    /**
     * Delete component from the DOM.
     */

  }, {
    key: '_deleteElement',
    value: function _deleteElement() {
      var parentNode = this.element.parentNode;

      parentNode.removeChild(this.element);

      if (parentNode.classList.contains(this.options.selectorLoadingOverlay)) {
        parentNode.remove();
      }
    }

    /**
     * The map associating DOM element and spinner instance.
     * @member Loading.components
     * @type {WeakMap}
     */

  }], [{
    key: 'options',


    /**
     * The component options.
     * If `options` is specified in the constructor, {@linkcode Loading.create .create()}, or {@linkcode Loading.init .init()},
     * properties in this object are overriden for the instance being create and how {@linkcode Loading.init .init()} works.
     * @member Loading.options
     * @type {Object}
     * @property {string} selectorInit The CSS selector to find spinners.
     */
    get: function get() {
      var prefix = settings.prefix;

      return {
        selectorInit: '[data-loading]',
        selectorLoadingOverlay: '.' + prefix + '--loading-overlay',
        classLoadingOverlay: prefix + '--loading-overlay',
        classLoadingStop: prefix + '--loading--stop',
        classLoadingOverlayStop: prefix + '--loading-overlay--stop',
        active: true
      };
    }
  }]);

  return Loading;
}(mixin(createComponent, initComponentBySearch, handles));

Loading.components = new WeakMap();


export default Loading;