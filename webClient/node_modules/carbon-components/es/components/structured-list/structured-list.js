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

var StructuredList = function (_mixin) {
  _inherits(StructuredList, _mixin);

  /**
   * StructuredList
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The root element of tables
   * @param {Object} [options] the... options
   * @param {string} [options.selectorInit] selector initialization
   * @param {string} [options.selectorRow] css selector for selected row
   */
  function StructuredList(element, options) {
    _classCallCheck(this, StructuredList);

    var _this = _possibleConstructorReturn(this, (StructuredList.__proto__ || Object.getPrototypeOf(StructuredList)).call(this, element, options));

    _this.manage(on(_this.element, 'keydown', function (evt) {
      if (evt.which === 38 || evt.which === 40) {
        _this._handleKeydownArrow(evt);
      }
      if (evt.which === 13 || evt.which === 32) {
        _this._handleKeydownChecked(evt);
      }
    }));
    _this.manage(on(_this.element, 'click', function (evt) {
      _this._handleClick(evt);
    }));
    return _this;
  }

  _createClass(StructuredList, [{
    key: '_direction',
    value: function _direction(evt) {
      return {
        38: -1, // backward
        40: 1 // forward
      }[evt.which];
    }
  }, {
    key: '_nextIndex',
    value: function _nextIndex(array, arrayItem, direction) {
      return array.indexOf(arrayItem) + direction; // returns -1, 0, 1, 2, 3, 4...
    }
  }, {
    key: '_getInput',
    value: function _getInput(index) {
      var rows = [].concat(_toConsumableArray(this.element.querySelectorAll(this.options.selectorRow)));
      return this.element.ownerDocument.querySelector(this.options.selectorListInput(rows[index].getAttribute('for')));
    }
  }, {
    key: '_handleInputChecked',
    value: function _handleInputChecked(index) {
      var input = this._getInput(index);
      input.checked = true;
    }
  }, {
    key: '_handleClick',
    value: function _handleClick(evt) {
      var _this2 = this;

      var selectedRow = eventMatches(evt, this.options.selectorRow);
      [].concat(_toConsumableArray(this.element.querySelectorAll(this.options.selectorRow))).forEach(function (row) {
        return row.classList.remove(_this2.options.classActive);
      });
      if (selectedRow) {
        selectedRow.classList.add(this.options.classActive);
      }
    }

    // Handle Enter or Space keydown events for selecting <label> rows

  }, {
    key: '_handleKeydownChecked',
    value: function _handleKeydownChecked(evt) {
      var _this3 = this;

      var selectedRow = eventMatches(evt, this.options.selectorRow);
      [].concat(_toConsumableArray(this.element.querySelectorAll(this.options.selectorRow))).forEach(function (row) {
        return row.classList.remove(_this3.options.classActive);
      });
      if (selectedRow) {
        selectedRow.classList.add(this.options.classActive);
        var input = this.element.querySelector(this.options.selectorListInput(selectedRow.getAttribute('for')));
        input.checked = true;
      }
    }

    // Handle up and down keydown events for selecting <label> rows

  }, {
    key: '_handleKeydownArrow',
    value: function _handleKeydownArrow(evt) {
      var _this4 = this;

      var selectedRow = eventMatches(evt, this.options.selectorRow);
      var direction = this._direction(evt);

      if (direction && selectedRow !== undefined) {
        var rows = [].concat(_toConsumableArray(this.element.querySelectorAll(this.options.selectorRow)));
        rows.forEach(function (row) {
          return row.classList.remove(_this4.options.classActive);
        });
        var firstIndex = 0;
        var nextIndex = this._nextIndex(rows, selectedRow, direction);
        var lastIndex = rows.length - 1;

        switch (nextIndex) {
          case -1:
            rows[lastIndex].classList.add(this.options.classActive);
            rows[lastIndex].focus();
            this._handleInputChecked(lastIndex);
            break;
          case rows.length:
            rows[firstIndex].classList.add(this.options.classActive);
            rows[firstIndex].focus();
            this._handleInputChecked(firstIndex);
            break;
          default:
            rows[nextIndex].classList.add(this.options.classActive);
            rows[nextIndex].focus();
            this._handleInputChecked(nextIndex);
            break;
        }
      }
    }
  }], [{
    key: 'options',
    get: function get() {
      var prefix = settings.prefix;

      return {
        selectorInit: '[data-structured-list]',
        selectorRow: '[data-structured-list] .' + prefix + '--structured-list-tbody > label.' + prefix + '--structured-list-row',
        selectorListInput: function selectorListInput(id) {
          return '#' + id + '.' + prefix + '--structured-list-input';
        },
        classActive: prefix + '--structured-list-row--selected'
      };
    }
  }]);

  return StructuredList;
}(mixin(createComponent, initComponentBySearch, handles));

StructuredList.components = new WeakMap();


export default StructuredList;