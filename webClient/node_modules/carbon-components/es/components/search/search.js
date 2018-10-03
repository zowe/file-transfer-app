var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
import svgToggleClass from '../../globals/js/misc/svg-toggle-class';

var Search = function (_mixin) {
  _inherits(Search, _mixin);

  /**
   * Search with Options.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The element working as the search component.
   * @param {Object} [options] The component options
   * @property {string} [options.selectorInit]
   *   The selector to find search UIs with options.
   * @property {string} [options.selectorSearchView]
   *   The selector to find the search view icon containers.
   * @property {string} [options.selectorSearchInput]
   *   The selector to find the search input.
   * @property {string} [options.selectorClearIcon]
   *   The selector for the clear icon that clears the search box.
   * @property {string} [options.selectorIconContainer] The data attribute selector for the icon layout container.
   * @property {string} [options.classClearHidden] The class used to hide the clear icon.
   * @property {string} [options.classLayoutHidden] The class used to hide nonselected layout view.
   */
  function Search(element, options) {
    _classCallCheck(this, Search);

    var _this = _possibleConstructorReturn(this, (Search.__proto__ || Object.getPrototypeOf(Search)).call(this, element, options));

    var closeIcon = _this.element.querySelector(_this.options.selectorClearIcon);
    var input = _this.element.querySelector(_this.options.selectorSearchInput);
    if (!input) {
      throw new Error('Cannot find the search input.');
    }

    if (closeIcon) {
      _this.manage(on(closeIcon, 'click', function () {
        svgToggleClass(closeIcon, _this.options.classClearHidden, true);
        input.value = '';
        input.focus();
      }));
    }

    _this.manage(on(_this.element, 'click', function (evt) {
      var toggleItem = eventMatches(evt, _this.options.selectorIconContainer);
      if (toggleItem) _this.toggleLayout(toggleItem);
    }));

    _this.manage(on(input, 'input', function (evt) {
      if (closeIcon) _this.showClear(evt.target.value, closeIcon);
    }));
    return _this;
  }

  /**
   * Toggles between the grid and list layout.
   * @param {HTMLElement} element The element contining the layout toggle.
   */


  _createClass(Search, [{
    key: 'toggleLayout',
    value: function toggleLayout(element) {
      var _this2 = this;

      [].concat(_toConsumableArray(element.querySelectorAll(this.options.selectorSearchView))).forEach(function (item) {
        item.classList.toggle(_this2.options.classLayoutHidden);
      });
    }

    /**
     * Toggles the clear icon visibility
     * @param {HTMLElement} value The element serving as the search input.
     * @param {HTMLElement} icon The element serving as close icon.
     */

  }, {
    key: 'showClear',
    value: function showClear(value, icon) {
      svgToggleClass(icon, this.options.classClearHidden, value.length === 0);
    }

    /**
     * The component options.
     * If `options` is specified in the constructor,
     * {@linkcode Search.create .create()}, or {@linkcode Search.init .init()},
     * properties in this object are overriden for the instance being created
     * and how {@linkcode Search.init .init()} works.
     * @member Search.options
     * @type {Object}
     * @property {string} [options.selectorInit]
     *   The selector to find search UIs with options.
     * @property {string} [options.selectorSearchView]
     *   The selector to find the search view icon containers.
     * @property {string} [options.selectorSearchInput]
     *   The selector to find the search input.
     * @property {string} [options.selectorClearIcon]
     *   The selector for the clear icon that clears the search box.
     * @property {string} [options.selectorIconContainer] The data attribute selector for the icon layout container.
     * @property {string} [options.classClearHidden] The class used to hide the clear icon.
     * @property {string} [options.classLayoutHidden] The class used to hide nonselected layout view.
     */

  }], [{
    key: 'options',
    get: function get() {
      var prefix = settings.prefix;

      return {
        selectorInit: '[data-search]',
        selectorSearchView: '[data-search-view]',
        selectorSearchInput: '.' + prefix + '--search-input',
        selectorClearIcon: '.' + prefix + '--search-close',
        selectorIconContainer: '.' + prefix + '--search-button[data-search-toggle]',
        classClearHidden: prefix + '--search-close--hidden',
        classLayoutHidden: prefix + '--search-view--hidden'
      };
    }

    /**
     * The map associating DOM element and search instance.
     * @member Search.components
     * @type {WeakMap}
     */

  }]);

  return Search;
}(mixin(createComponent, initComponentBySearch, handles));

Search.components = new WeakMap();


export default Search;