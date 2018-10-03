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

var Toolbar = function (_mixin) {
  _inherits(Toolbar, _mixin);

  /**
   * Toolbar.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The element working as an toolbar.
   */
  function Toolbar(element, options) {
    _classCallCheck(this, Toolbar);

    var _this = _possibleConstructorReturn(this, (Toolbar.__proto__ || Object.getPrototypeOf(Toolbar)).call(this, element, options));

    if (!_this.element.dataset.tableTarget) {
      console.warn('There is no table bound to this toolbar!'); // eslint-disable-line no-console
    } else {
      var boundTable = _this.element.ownerDocument.querySelector(_this.element.dataset.tableTarget);
      var rowHeightBtns = _this.element.querySelector(_this.options.selectorRowHeight);
      if (rowHeightBtns) {
        _this.manage(on(rowHeightBtns, 'click', function (event) {
          _this._handleRowHeightChange(event, boundTable);
        }));
        // [...this.element.querySelectorAll(this.options.selectorRowHeight)].forEach((item) => {
        //   item.addEventListener('click', (event) => { this._handleRowHeightChange(event, boundTable); });
        // });
      }
    }

    _this.manage(on(_this.element.ownerDocument, 'keydown', function (evt) {
      _this._handleKeyDown(evt);
    }));
    _this.manage(on(_this.element.ownerDocument, 'click', function (evt) {
      _this._handleDocumentClick(evt);
    }));
    return _this;
  }

  /**
   * Handles toggling of active state of the toolbar search input
   * @param {Event} event The event triggering this method.
   */


  _createClass(Toolbar, [{
    key: '_handleDocumentClick',
    value: function _handleDocumentClick(event) {
      var _this2 = this;

      var searchInput = eventMatches(event, this.options.selectorSearch);
      var isOfSelfSearchInput = searchInput && this.element.contains(searchInput);

      if (isOfSelfSearchInput) {
        var shouldBeOpen = isOfSelfSearchInput && !this.element.classList.contains(this.options.classSearchActive);
        searchInput.classList.toggle(this.options.classSearchActive, shouldBeOpen);
        if (shouldBeOpen) {
          searchInput.querySelector('input').focus();
        }
      }

      var targetComponentElement = eventMatches(event, this.options.selectorInit);
      [].concat(_toConsumableArray(this.element.ownerDocument.querySelectorAll(this.options.selectorSearch))).forEach(function (item) {
        if (!targetComponentElement || !targetComponentElement.contains(item)) {
          item.classList.remove(_this2.options.classSearchActive);
        }
      });
    }

    /**
     * Handles toggling of active state of the toolbar search input via the keyboard
     * @param {Event} event The event triggering this method.
     */

  }, {
    key: '_handleKeyDown',
    value: function _handleKeyDown(event) {
      var searchInput = eventMatches(event, this.options.selectorSearch);
      var isOfSelf = this.element.contains(event.target);
      var shouldBeOpen = isOfSelf && !this.element.classList.contains(this.options.classSearchActive);

      if (searchInput) {
        if ((event.which === 13 || event.which === 32) && !shouldBeOpen) {
          searchInput.classList.add(this.options.classSearchActive);
        }

        if (event.which === 27) {
          searchInput.classList.remove(this.options.classSearchActive);
        }
      }
    }

    /**
     * Handles toggling of the row height of the associated table
     * @param {Event} event The event triggering this method.
     * @param {HTMLElement} boundTable The table associated with the toolbar.
     */

  }, {
    key: '_handleRowHeightChange',
    value: function _handleRowHeightChange(event, boundTable) {
      var value = event.currentTarget.querySelector('input:checked').value;

      if (value === 'tall') {
        boundTable.classList.add(this.options.classTallRows);
      } else {
        boundTable.classList.remove(this.options.classTallRows);
      }
    }

    /**
     * The map associating DOM element and Toolbar UI instance.
     * @type {WeakMap}
     */

  }], [{
    key: 'options',


    /**
     * The component options.
     * If `options` is specified in the constructor,
     * properties in this object are overriden for the instance being created.
     * @property {string} selectorInit The CSS selector to find toolbar instances.
     * @property {string} selectorSearch The CSS selector to find search inputs in a toolbar.
     * @property {string} selectorRowHeight The CSS selector to find the row height inputs in a toolbar.
     * @property {string} classTallRows The CSS class for making table rows into tall rows.
     * @property {string} classSearchActive The CSS class the active state of the search input.
     */
    get: function get() {
      var prefix = settings.prefix;

      return {
        selectorInit: '[data-toolbar]',
        selectorSearch: '[data-toolbar-search]',
        selectorRowHeight: '[data-row-height]',
        classTallRows: prefix + '--responsive-table--tall',
        classSearchActive: prefix + '--toolbar-search--active'
      };
    }
  }]);

  return Toolbar;
}(mixin(createComponent, initComponentBySearch, handles));

Toolbar.components = new WeakMap();


export default Toolbar;