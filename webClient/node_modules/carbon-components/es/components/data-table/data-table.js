var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import eventedState from '../../globals/js/mixins/evented-state';
import handles from '../../globals/js/mixins/handles';
import eventMatches from '../../globals/js/misc/event-matches';
import on from '../../globals/js/misc/on';

var DataTable = function (_mixin) {
  _inherits(DataTable, _mixin);

  /**
   * Data Table
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends EventedState
   * @extends Handles
   * @param {HTMLElement} element The root element of tables
   * @param {Object} [options] the... options
   * @param {string} [options.selectorInit] selector initialization
   * @param {string} [options.selectorExpandCells] css selector for expand
   * @param {string} [options.expandableRow] css selector for expand
   * @param {string} [options.selectorParentRows] css selector for rows housing expansion
   * @param {string} [options.selectorTableBody] root css for table body
   * @param {string} [options.eventTrigger] selector for event bubble capture points
   * @param {string} [options.eventParentContainer] used find the bubble container
   */
  function DataTable(element, options) {
    _classCallCheck(this, DataTable);

    var _this = _possibleConstructorReturn(this, (DataTable.__proto__ || Object.getPrototypeOf(DataTable)).call(this, element, options));

    _initialiseProps.call(_this);

    _this.container = element.parentNode; // requires the immediate parent to be the container
    _this.tableBody = _this.element.querySelector(_this.options.selectorTableBody);
    _this.expandCells = [];
    _this.expandableRows = [];
    _this.parentRows = [];
    _this.overflowInitialized = false;

    _this.refreshRows();

    _this.manage(on(_this.element, 'click', function (evt) {
      var eventElement = eventMatches(evt, _this.options.eventTrigger);
      if (eventElement) {
        _this._toggleState(eventElement, evt);
      }
    }));

    _this.manage(on(_this.element, 'keydown', function (evt) {
      if (evt.which === 13) {
        var eventElement = eventMatches(evt, _this.options.eventTrigger);
        if (eventElement) {
          _this._toggleState(eventElement, evt);
        }
      }
    }));
    return _this;
  }

  /**
   * Toggles the given state.
   * @private
   * @param {Object} detail The detail of the event trigging this action.
   * @param {Function} callback Callback called when change in state completes.
   */


  _createClass(DataTable, [{
    key: '_changeState',
    value: function _changeState(detail, callback) {
      this[this.constructor.eventHandlers[detail.group]](detail);
      callback();
    }

    /**
     * Toggles the state of this component specified by `data-event` attribute of the given element.
     * @param {HTMLElement} element The element.
     * @param {Event} evt The event trigging this action.
     */


    /**
     * Zebra stripes - done in javascript to handle expandable rows
     */


    /**
     * Find all expandable rows and remove them from the DOM
     */


    /**
     * On trigger, insert the expandable row back in
     */


    /**
     * On trigger, flip the sort icon
     */


    /**
     * On trigger, check all checkboxes
     */


    /**
     * On fire, create the parent child rows + striping
     */

  }], [{
    key: 'options',
    get: function get() {
      var prefix = settings.prefix;

      return {
        selectorInit: '[data-responsive-table]',
        selectorExpandCells: '.' + prefix + '--table-expand',
        selectorExpandableRows: '.' + prefix + '--expandable-row',
        selectorParentRows: '.' + prefix + '--parent-row',
        selectorTableBody: '.' + prefix + '--table-body',
        selectorCheckbox: '.' + prefix + '--checkbox',
        classParentRowEven: prefix + '--parent-row--even',
        classExpandableRow: prefix + '--expandable-row',
        classExpandableRowEven: prefix + '--expandable-row--even',
        classExpandableRowHidden: prefix + '--expandable-row--hidden',
        classTableSortAscending: prefix + '--table-sort--ascending',
        eventBeforeExpand: 'responsive-table-beforetoggleexpand',
        eventAfterExpand: 'responsive-table-aftertoggleexpand',
        eventBeforeSort: 'responsive-table-beforetogglesort',
        eventAfterSort: 'responsive-table-aftertogglesort',
        eventBeforeSelectAll: 'responsive-table-beforetoggleselectall',
        eventAfterSelectAll: 'responsive-table-aftertoggleselectall',
        eventTrigger: '[data-event]',
        eventParentContainer: '[data-parent-row]'
      };
    }
  }]);

  return DataTable;
}(mixin(createComponent, initComponentBySearch, eventedState, handles));

DataTable.components = new WeakMap();
DataTable.eventHandlers = {
  expand: '_toggleRowExpand',
  sort: '_toggleSort',
  'select-all': '_toggleSelectAll'
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this._toggleState = function (element, evt) {
    var data = element.dataset;
    var label = data.label ? data.label : '';
    var previousValue = data.previousValue ? data.previousValue : '';
    var initialEvt = evt;
    _this2.changeState({
      group: data.event,
      element: element,
      label: label,
      previousValue: previousValue,
      initialEvt: initialEvt
    });
  };

  this._zebraStripe = function (parentRows) {
    parentRows.forEach(function (item, index) {
      if (index % 2 === 0) {
        item.classList.add(_this2.options.classParentRowEven);
        if (item.nextElementSibling && item.nextElementSibling.classList.contains(_this2.options.classExpandableRow)) {
          item.nextElementSibling.classList.add(_this2.options.classExpandableRowEven);
        }
      } else {
        item.classList.remove(_this2.options.classParentRowEven);
      }
    });
  };

  this._initExpandableRows = function (expandableRows) {
    expandableRows.forEach(function (item) {
      item.classList.remove(_this2.options.classExpandableRowHidden);
      _this2.tableBody.removeChild(item);
    });
  };

  this._toggleRowExpand = function (detail) {
    var element = detail.element;
    var parent = eventMatches(detail.initialEvt, _this2.options.eventParentContainer);

    var index = _this2.expandCells.indexOf(element);
    if (element.dataset.previousValue === undefined || element.dataset.previousValue === 'expanded') {
      element.dataset.previousValue = 'collapsed';
      _this2.tableBody.insertBefore(_this2.expandableRows[index], _this2.parentRows[index + 1]);
    } else {
      _this2.tableBody.removeChild(parent.nextElementSibling);
      element.dataset.previousValue = 'expanded';
    }
  };

  this._toggleSort = function (detail) {
    var element = detail.element,
        previousValue = detail.previousValue;


    if (!previousValue || previousValue === 'descending') {
      element.dataset.previousValue = 'ascending';
      element.classList.add(_this2.options.classTableSortAscending);
    } else {
      element.dataset.previousValue = 'descending';
      element.classList.remove(_this2.options.classTableSortAscending);
    }
  };

  this._toggleSelectAll = function (detail) {
    var element = detail.element,
        previousValue = detail.previousValue;

    var inputs = [].concat(_toConsumableArray(_this2.element.querySelectorAll(_this2.options.selectorCheckbox)));
    if (!previousValue || previousValue === 'toggled') {
      inputs.forEach(function (item) {
        item.checked = true; // eslint-disable-line no-param-reassign
      });
      element.dataset.previousValue = 'off';
    } else {
      inputs.forEach(function (item) {
        item.checked = false; // eslint-disable-line no-param-reassign
      });
      element.dataset.previousValue = 'toggled';
    }
  };

  this.refreshRows = function () {
    var newExpandCells = [].concat(_toConsumableArray(_this2.element.querySelectorAll(_this2.options.selectorExpandCells)));
    var newExpandableRows = [].concat(_toConsumableArray(_this2.element.querySelectorAll(_this2.options.selectorExpandableRows)));
    var newParentRows = [].concat(_toConsumableArray(_this2.element.querySelectorAll(_this2.options.selectorParentRows)));

    // check if this is a refresh or the first time
    if (_this2.parentRows.length > 0) {
      var diffParentRows = newParentRows.filter(function (newRow) {
        return !_this2.parentRows.some(function (oldRow) {
          return oldRow === newRow;
        });
      });

      // check if there are expandable rows
      if (newExpandableRows.length > 0) {
        var diffExpandableRows = diffParentRows.map(function (newRow) {
          return newRow.nextElementSibling;
        });
        var mergedExpandableRows = [].concat(_toConsumableArray(_this2.expandableRows), _toConsumableArray(diffExpandableRows));
        _this2._initExpandableRows(diffExpandableRows);
        _this2.expandableRows = mergedExpandableRows;
      }

      _this2._zebraStripe(newParentRows);
    } else {
      _this2._zebraStripe(newParentRows);

      if (newExpandableRows.length > 0) {
        _this2._initExpandableRows(newExpandableRows);
        _this2.expandableRows = newExpandableRows;
      }
    }

    _this2.expandCells = newExpandCells;
    _this2.parentRows = newParentRows;
  };
};

export default DataTable;