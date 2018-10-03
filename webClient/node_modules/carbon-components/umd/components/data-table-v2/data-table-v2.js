(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../../globals/js/settings', '../../globals/js/misc/mixin', '../../globals/js/mixins/create-component', '../../globals/js/mixins/init-component-by-search', '../../globals/js/mixins/evented-state', '../../globals/js/misc/event-matches'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../../globals/js/settings'), require('../../globals/js/misc/mixin'), require('../../globals/js/mixins/create-component'), require('../../globals/js/mixins/init-component-by-search'), require('../../globals/js/mixins/evented-state'), require('../../globals/js/misc/event-matches'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.settings, global.mixin, global.createComponent, global.initComponentBySearch, global.eventedState, global.eventMatches);
    global.dataTableV2 = mod.exports;
  }
})(this, function (exports, _settings, _mixin2, _createComponent, _initComponentBySearch, _eventedState, _eventMatches) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _settings2 = _interopRequireDefault(_settings);

  var _mixin3 = _interopRequireDefault(_mixin2);

  var _createComponent2 = _interopRequireDefault(_createComponent);

  var _initComponentBySearch2 = _interopRequireDefault(_initComponentBySearch);

  var _eventedState2 = _interopRequireDefault(_eventedState);

  var _eventMatches2 = _interopRequireDefault(_eventMatches);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var DataTableV2 = function (_mixin) {
    _inherits(DataTableV2, _mixin);

    /**
     * Data Table
     * @extends CreateComponent
     * @extends InitComponentBySearch
     * @extends   EventedState
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
    function DataTableV2(element, options) {
      _classCallCheck(this, DataTableV2);

      var _this = _possibleConstructorReturn(this, (DataTableV2.__proto__ || Object.getPrototypeOf(DataTableV2)).call(this, element, options));

      _initialiseProps.call(_this);

      _this.container = element.parentNode;
      _this.toolbarEl = _this.element.querySelector(_this.options.selectorToolbar);
      _this.batchActionEl = _this.element.querySelector(_this.options.selectorActions);
      _this.countEl = _this.element.querySelector(_this.options.selectorCount);
      _this.cancelEl = _this.element.querySelector(_this.options.selectorActionCancel);
      _this.tableHeaders = _this.element.querySelectorAll('th');
      _this.tableBody = _this.element.querySelector(_this.options.selectorTableBody);
      _this.expandCells = [];
      _this.expandableRows = [];
      _this.parentRows = [];

      _this.refreshRows();

      _this.element.addEventListener('mouseover', function (evt) {
        var eventElement = (0, _eventMatches2.default)(evt, _this.options.selectorChildRow);

        if (eventElement) {
          _this._expandableHoverToggle(eventElement, true);
        }
      });

      _this.element.addEventListener('click', function (evt) {
        var eventElement = (0, _eventMatches2.default)(evt, _this.options.eventTrigger);
        if (eventElement) {
          _this._toggleState(eventElement, evt);
        }
      });

      _this.element.addEventListener('keydown', _this._keydownHandler);

      _this.state = {
        checkboxCount: 0
      };
      return _this;
    }

    _createClass(DataTableV2, [{
      key: '_changeState',
      value: function _changeState(detail, callback) {
        this[this.constructor.eventHandlers[detail.group]](detail);
        callback();
      }
    }], [{
      key: 'options',
      get: function get() {
        var prefix = _settings2.default.prefix;

        return {
          selectorInit: '[data-table-v2]',
          selectorToolbar: '.' + prefix + '--table--toolbar',
          selectorActions: '.' + prefix + '--batch-actions',
          selectorCount: '[data-items-selected]',
          selectorActionCancel: '.' + prefix + '--batch-summary__cancel',
          selectorCheckbox: '.' + prefix + '--checkbox',
          selectorExpandCells: '.' + prefix + '--table-expand-v2',
          selectorExpandableRows: '.' + prefix + '--expandable-row-v2',
          selectorParentRows: '.' + prefix + '--parent-row-v2',
          selectorChildRow: '[data-child-row]',
          selectorTableBody: 'tbody',
          selectorTableSort: '.' + prefix + '--table-sort-v2',
          selectorTableSelected: '.' + prefix + '--data-table-v2--selected',
          classExpandableRow: prefix + '--expandable-row-v2',
          classExpandableRowHidden: prefix + '--expandable-row--hidden-v2',
          classExpandableRowHover: prefix + '--expandable-row--hover-v2',
          classTableSortAscending: prefix + '--table-sort-v2--ascending',
          classTableSortActive: prefix + '--table-sort-v2--active',
          classActionBarActive: prefix + '--batch-actions--active',
          classTableSelected: prefix + '--data-table-v2--selected',
          eventBeforeExpand: 'data-table-v2-beforetoggleexpand',
          eventAfterExpand: 'data-table-v2-aftertoggleexpand',
          eventBeforeSort: 'data-table-v2-beforetogglesort',
          eventAfterSort: 'data-table-v2-aftertogglesort',
          eventTrigger: '[data-event]',
          eventParentContainer: '[data-parent-row]'
        };
      }
    }]);

    return DataTableV2;
  }((0, _mixin3.default)(_createComponent2.default, _initComponentBySearch2.default, _eventedState2.default));

  DataTableV2.components = new WeakMap();
  DataTableV2.eventHandlers = {
    expand: '_rowExpandToggle',
    sort: '_sortToggle',
    select: '_selectToggle',
    'select-all': '_selectAllToggle',
    'action-bar-cancel': '_actionBarCancel'
  };

  var _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this._sortToggle = function (detail) {
      var element = detail.element,
          previousValue = detail.previousValue;


      [].concat(_toConsumableArray(_this2.tableHeaders)).forEach(function (header) {
        var sortEl = header.querySelector(_this2.options.selectorTableSort);

        if (sortEl !== null && sortEl !== element) {
          sortEl.classList.remove(_this2.options.classTableSortActive);
          sortEl.classList.remove(_this2.options.classTableSortAscending);
        }
      });

      if (!previousValue || previousValue === 'descending') {
        element.dataset.previousValue = 'ascending';
        element.classList.add(_this2.options.classTableSortActive);
        element.classList.add(_this2.options.classTableSortAscending);
      } else {
        element.dataset.previousValue = 'descending';
        element.classList.add(_this2.options.classTableSortActive);
        element.classList.remove(_this2.options.classTableSortAscending);
      }
    };

    this._selectToggle = function (detail) {
      var element = detail.element;

      var checked = element.checked;

      // increment the  count
      _this2.state.checkboxCount += checked ? 1 : -1;
      _this2.countEl.textContent = _this2.state.checkboxCount;

      var row = element.parentNode.parentNode;

      row.classList.toggle(_this2.options.classTableSelected);

      // toggle on/off batch action bar
      _this2._actionBarToggle(_this2.state.checkboxCount > 0);
    };

    this._selectAllToggle = function (detail) {
      var checked = detail.element.checked;

      var inputs = [].concat(_toConsumableArray(_this2.element.querySelectorAll(_this2.options.selectorCheckbox)));

      _this2.state.checkboxCount = checked ? inputs.length - 1 : 0;

      inputs.forEach(function (item) {
        item.checked = checked;

        var row = item.parentNode.parentNode;
        if (checked && row) {
          row.classList.add(_this2.options.classTableSelected);
        } else {
          row.classList.remove(_this2.options.classTableSelected);
        }
      });

      _this2._actionBarToggle(_this2.state.checkboxCount > 0);

      if (_this2.batchActionEl) {
        _this2.countEl.textContent = _this2.state.checkboxCount;
      }
    };

    this._actionBarCancel = function () {
      var inputs = [].concat(_toConsumableArray(_this2.element.querySelectorAll(_this2.options.selectorCheckbox)));
      var row = [].concat(_toConsumableArray(_this2.element.querySelectorAll(_this2.options.selectorTableSelected)));

      row.forEach(function (item) {
        item.classList.remove(_this2.options.classTableSelected);
      });

      inputs.forEach(function (item) {
        item.checked = false;
      });

      _this2.state.checkboxCount = 0;
      _this2._actionBarToggle(false);

      if (_this2.batchActionEl) {
        _this2.countEl.textContent = _this2.state.checkboxCount;
      }
    };

    this._actionBarToggle = function (toggleOn) {
      var transition = function transition(evt) {
        _this2.batchActionEl.removeEventListener('transitionend', transition);

        if (evt.target.matches(_this2.options.selectorActions)) {
          if (_this2.batchActionEl.dataset.active === 'false') {
            _this2.batchActionEl.setAttribute('tabIndex', -1);
          } else {
            _this2.batchActionEl.setAttribute('tabIndex', 0);
          }
        }
      };

      if (toggleOn) {
        _this2.batchActionEl.dataset.active = true;
        _this2.batchActionEl.classList.add(_this2.options.classActionBarActive);
      } else if (_this2.batchActionEl) {
        _this2.batchActionEl.dataset.active = false;
        _this2.batchActionEl.classList.remove(_this2.options.classActionBarActive);
      }
      if (_this2.batchActionEl) {
        _this2.batchActionEl.addEventListener('transitionend', transition);
      }
    };

    this._expandableRowsInit = function (expandableRows) {
      expandableRows.forEach(function (item) {
        item.classList.remove(_this2.options.classExpandableRowHidden);
        _this2.tableBody.removeChild(item);
      });
    };

    this._rowExpandToggle = function (detail) {
      var element = detail.element;
      var parent = (0, _eventMatches2.default)(detail.initialEvt, _this2.options.eventParentContainer);

      var index = _this2.expandCells.indexOf(element);
      if (element.dataset.previousValue === undefined || element.dataset.previousValue === 'expanded') {
        element.dataset.previousValue = 'collapsed';
        parent.classList.add(_this2.options.classExpandableRow);
        _this2.tableBody.insertBefore(_this2.expandableRows[index], _this2.parentRows[index + 1]);
      } else {
        parent.classList.remove(_this2.options.classExpandableRow);
        _this2.tableBody.removeChild(parent.nextElementSibling);
        element.dataset.previousValue = 'expanded';
      }
    };

    this._expandableHoverToggle = function (element) {
      element.previousElementSibling.classList.add(_this2.options.classExpandableRowHover);

      var mouseout = function mouseout() {
        element.previousElementSibling.classList.remove(_this2.options.classExpandableRowHover);
        element.removeEventListener('mouseout', mouseout);
      };

      element.addEventListener('mouseout', mouseout);
    };

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

    this._keydownHandler = function (evt) {
      if (evt.which === 27) {
        _this2._actionBarCancel();
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
          _this2._expandableRowsInit(diffExpandableRows);
          _this2.expandableRows = mergedExpandableRows;
        }
      } else if (newExpandableRows.length > 0) {
        _this2._expandableRowsInit(newExpandableRows);
        _this2.expandableRows = newExpandableRows;
      }

      _this2.expandCells = newExpandCells;
      _this2.parentRows = newParentRows;
    };
  };

  exports.default = DataTableV2;
});