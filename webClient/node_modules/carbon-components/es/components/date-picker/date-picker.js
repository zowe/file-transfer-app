var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Flatpickr from 'flatpickr';
import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import handles from '../../globals/js/mixins/handles';
import on from '../../globals/js/misc/on';

/* eslint no-underscore-dangle: [2, { "allow": ["_input", "_updateClassNames", "_updateInputFields"], "allowAfterThis": true }] */

// `this.options` create-component mix-in creates prototype chain
// so that `options` given in constructor argument wins over the one defined in static `options` property
// 'Flatpickr' wants flat structure of object instead

function flattenOptions(options) {
  var o = {};
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (var key in options) {
    o[key] = options[key];
  }
  return o;
}

/**
 * Augments Flatpickr instance so that event objects Flatpickr fires is marked as non-user-triggered events.
 * @param {Flatpickr} calendar The Flatpickr instance.
 * @returns {Flatpickr} The augmented Flatpickr instance.
 * @private
 */
function augmentFlatpickr(calendar) {
  var container = calendar._;
  if (container) {
    if (container.changeEvent) {
      container._changeEvent = container.changeEvent; // eslint-disable-line no-underscore-dangle
    }
    Object.defineProperty(container, 'changeEvent', {
      get: function get() {
        return this._changeEvent;
      },
      set: function set(value) {
        value.detail = Object.assign(value.detail || {}, { fromFlatpickr: true });
        this._changeEvent = value;
      }
    });
  }
  return calendar;
}

// Weekdays shorthand for english locale
Flatpickr.l10ns.en.weekdays.shorthand.forEach(function (day, index) {
  var currentDay = Flatpickr.l10ns.en.weekdays.shorthand;
  if (currentDay[index] === 'Thu' || currentDay[index] === 'Th') {
    currentDay[index] = 'Th';
  } else {
    currentDay[index] = currentDay[index].charAt(0);
  }
});

var DatePicker = function (_mixin) {
  _inherits(DatePicker, _mixin);

  /**
   * DatePicker.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The element working as an date picker.
   */
  function DatePicker(element, options) {
    _classCallCheck(this, DatePicker);

    var _this = _possibleConstructorReturn(this, (DatePicker.__proto__ || Object.getPrototypeOf(DatePicker)).call(this, element, options));

    _initialiseProps.call(_this);

    var type = _this.element.getAttribute(_this.options.attribType);
    _this.calendar = _this._initDatePicker(type);
    _this.manage(on(_this.element, 'keydown', function (e) {
      if (e.which === 40) {
        _this.calendar.calendarContainer.focus();
      }
    }));
    _this.manage(on(_this.calendar.calendarContainer, 'keydown', function (e) {
      if (e.which === 9 && type === 'range') {
        _this._updateClassNames(_this.calendar);
        _this.element.querySelector(_this.options.selectorDatePickerInputFrom).focus();
      }
    }));
    return _this;
  }

  /**
   * Opens the date picker dropdown when this component gets focus.
   * Used only for range mode for now.
   * @private
   */


  /**
   * Closes the date picker dropdown when this component loses focus.
   * Used only for range mode for now.
   * @private
   */


  _createClass(DatePicker, [{
    key: '_rightArrowHTML',
    value: function _rightArrowHTML() {
      return '\n      <svg width="8" height="12" viewBox="0 0 8 12" fill-rule="evenodd">\n        <path d="M0 10.6L4.7 6 0 1.4 1.4 0l6.1 6-6.1 6z"></path>\n      </svg>';
    }
  }, {
    key: '_leftArrowHTML',
    value: function _leftArrowHTML() {
      return '\n      <svg width="8" height="12" viewBox="0 0 8 12" fill-rule="evenodd">\n        <path d="M7.5 10.6L2.8 6l4.7-4.6L6.1 0 0 6l6.1 6z"></path>\n      </svg>';
    }
  }, {
    key: 'release',
    value: function release() {
      if (this._rangeInput && this._rangeInput.parentNode) {
        this._rangeInput.parentNode.removeChild(this._rangeInput);
      }
      if (this.calendar) {
        try {
          this.calendar.destroy();
        } catch (err) {} // eslint-disable-line no-empty
        this.calendar = null;
      }
      return _get(DatePicker.prototype.__proto__ || Object.getPrototypeOf(DatePicker.prototype), 'release', this).call(this);
    }

    /**
     * The component options.
     * If `options` is specified in the constructor,
     * {@linkcode DatePicker.create .create()}, or {@linkcode DatePicker.init .init()},
     * properties in this object are overriden for the instance being create and how {@linkcode DatePicker.init .init()} works.
     * @property {string} selectorInit The CSS selector to find date picker UIs.
     */

  }], [{
    key: 'options',
    get: function get() {
      var prefix = settings.prefix;

      return {
        selectorInit: '[data-date-picker]',
        selectorDatePickerInput: '[data-date-picker-input]',
        selectorDatePickerInputFrom: '[data-date-picker-input-from]',
        selectorDatePickerInputTo: '[data-date-picker-input-to]',
        selectorDatePickerIcon: '[data-date-picker-icon]',
        classCalendarContainer: prefix + '--date-picker__calendar',
        classMonth: prefix + '--date-picker__month',
        classWeekdays: prefix + '--date-picker__weekdays',
        classDays: prefix + '--date-picker__days',
        classWeekday: prefix + '--date-picker__weekday',
        classDay: prefix + '--date-picker__day',
        classFocused: prefix + '--focused',
        classVisuallyHidden: prefix + '--visually-hidden',
        attribType: 'data-date-picker-type',
        dateFormat: 'm/d/Y'
      };
    }

    /**
     * The map associating DOM element and date picker UI instance.
     * @type {WeakMap}
     */

  }]);

  return DatePicker;
}(mixin(createComponent, initComponentBySearch, handles));

DatePicker.components = new WeakMap();

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this._handleFocus = function () {
    if (_this2.calendar) {
      _this2.calendar.open();
    }
  };

  this._handleBlur = function (event) {
    if (_this2.calendar) {
      var focusTo = event.relatedTarget;
      if (!focusTo || !_this2.element.contains(focusTo) && !_this2.calendar.calendarContainer.contains(focusTo)) {
        _this2.calendar.close();
      }
    }
  };

  this._initDatePicker = function (type) {
    if (type === 'range') {
      // Given FlatPickr assumes one `<input>` even in range mode,
      // use a hidden `<input>` for such purpose, separate from our from/to `<input>`s
      var doc = _this2.element.ownerDocument;
      var rangeInput = doc.createElement('input');
      rangeInput.className = _this2.options.classVisuallyHidden;
      rangeInput.setAttribute('aria-hidden', 'true');
      doc.body.appendChild(rangeInput);
      _this2._rangeInput = rangeInput;

      // An attempt to open the date picker dropdown when this component gets focus,
      // and close the date picker dropdown when this component loses focus
      var w = doc.defaultView;
      var hasFocusin = 'onfocusin' in w;
      var hasFocusout = 'onfocusout' in w;
      var focusinEventName = hasFocusin ? 'focusin' : 'focus';
      var focusoutEventName = hasFocusout ? 'focusout' : 'blur';
      _this2.manage(on(_this2.element, focusinEventName, _this2._handleFocus, !hasFocusin));
      _this2.manage(on(_this2.element, focusoutEventName, _this2._handleBlur, !hasFocusout));
      _this2.manage(on(_this2.element.querySelector(_this2.options.selectorDatePickerIcon), focusoutEventName, _this2._handleBlur, !hasFocusout));

      // An attempt to disable Flatpickr's focus tracking system,
      // which has adverse effect with our old set up with two `<input>`s or our latest setup with a hidden `<input>`
      _this2.manage(on(doc, 'mousedown', function () {
        if (_this2.calendar.isOpen) {
          _this2.calendar.config.inline = true;
          setTimeout(function () {
            _this2.calendar.config.inline = false;
          }, 0);
        }
      }));
    }
    var self = _this2;
    var date = type === 'range' ? _this2._rangeInput : _this2.element.querySelector(_this2.options.selectorDatePickerInput);
    var _options = _this2.options,
        _onClose = _options.onClose,
        _onChange = _options.onChange,
        _onMonthChange = _options.onMonthChange,
        _onYearChange = _options.onYearChange,
        _onOpen = _options.onOpen,
        _onValueUpdate = _options.onValueUpdate;

    var calendar = new Flatpickr(date, Object.assign(flattenOptions(_this2.options), {
      allowInput: true,
      mode: type,
      positionElement: type === 'range' && _this2.element.querySelector(_this2.options.selectorDatePickerInputFrom),
      onClose: function onClose(selectedDates) {
        for (var _len = arguments.length, remainder = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          remainder[_key - 1] = arguments[_key];
        }

        if (!_onClose || _onClose.call.apply(_onClose, [this, selectedDates].concat(_toConsumableArray(remainder))) !== false) {
          self._updateClassNames(calendar);
          self._updateInputFields(selectedDates, type);
        }
      },
      onChange: function onChange() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        if (!_onChange || _onChange.call.apply(_onChange, [this].concat(_toConsumableArray(args))) !== false) {
          self._updateClassNames(calendar);
          if (type === 'range') {
            if (calendar.selectedDates.length === 1 && calendar.isOpen) {
              self.element.querySelector(self.options.selectorDatePickerInputTo).classList.add(self.options.classFocused);
            } else {
              self.element.querySelector(self.options.selectorDatePickerInputTo).classList.remove(self.options.classFocused);
            }
          }
        }
      },
      onMonthChange: function onMonthChange() {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        if (!_onMonthChange || _onMonthChange.call.apply(_onMonthChange, [this].concat(_toConsumableArray(args))) !== false) {
          self._updateClassNames(calendar);
        }
      },
      onYearChange: function onYearChange() {
        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        if (!_onYearChange || _onYearChange.call.apply(_onYearChange, [this].concat(_toConsumableArray(args))) !== false) {
          self._updateClassNames(calendar);
        }
      },
      onOpen: function onOpen() {
        for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          args[_key5] = arguments[_key5];
        }

        if (!_onOpen || _onOpen.call.apply(_onOpen, [this].concat(_toConsumableArray(args))) !== false) {
          self._updateClassNames(calendar);
        }
      },
      onValueUpdate: function onValueUpdate() {
        for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          args[_key6] = arguments[_key6];
        }

        if ((!_onValueUpdate || _onValueUpdate.call.apply(_onValueUpdate, [this].concat(_toConsumableArray(args))) !== false) && type === 'range') {
          self._updateInputFields(self.calendar.selectedDates, type);
        }
      },

      nextArrow: _this2._rightArrowHTML(),
      prevArrow: _this2._leftArrowHTML()
    }));
    if (type === 'range') {
      _this2._addInputLogic(_this2.element.querySelector(_this2.options.selectorDatePickerInputFrom), 0);
      _this2._addInputLogic(_this2.element.querySelector(_this2.options.selectorDatePickerInputTo), 1);
    }
    _this2.manage(on(_this2.element.querySelector(_this2.options.selectorDatePickerIcon), 'click', function () {
      calendar.open();
    }));
    _this2._updateClassNames(calendar);
    if (type !== 'range') {
      _this2._addInputLogic(date);
    }
    return augmentFlatpickr(calendar);
  };

  this._addInputLogic = function (input, index) {
    if (!isNaN(index) && (index < 0 || index > 1)) {
      throw new RangeError('The index of <input> (' + index + ') is out of range.');
    }
    var inputField = input;
    _this2.manage(on(inputField, 'change', function (evt) {
      if (!evt.detail || !evt.detail.fromFlatpickr) {
        var inputDate = _this2.calendar.parseDate(inputField.value);
        if (inputDate && !isNaN(inputDate.valueOf())) {
          if (isNaN(index)) {
            _this2.calendar.setDate(inputDate);
          } else {
            var selectedDates = _this2.calendar.selectedDates;
            selectedDates[index] = inputDate;
            _this2.calendar.setDate(selectedDates);
          }
        }
      }
      _this2._updateClassNames(_this2.calendar);
    }));
    // An attempt to temporarily set the `<input>` being edited as the one FlatPicker manages,
    // as FlatPicker attempts to take over `keydown` event handler on `document` to run on the date picker dropdown.
    _this2.manage(on(inputField, 'keydown', function (evt) {
      var origInput = _this2.calendar._input;
      _this2.calendar._input = evt.target;
      setTimeout(function () {
        _this2.calendar._input = origInput;
      });
    }));
  };

  this._updateClassNames = function (calendar) {
    var calendarContainer = calendar.calendarContainer;
    calendarContainer.classList.add(_this2.options.classCalendarContainer);
    calendarContainer.querySelector('.flatpickr-month').classList.add(_this2.options.classMonth);
    calendarContainer.querySelector('.flatpickr-weekdays').classList.add(_this2.options.classWeekdays);
    calendarContainer.querySelector('.flatpickr-days').classList.add(_this2.options.classDays);
    [].concat(_toConsumableArray(calendarContainer.querySelectorAll('.flatpickr-weekday'))).forEach(function (item) {
      var currentItem = item;
      currentItem.innerHTML = currentItem.innerHTML.replace(/\s+/g, '');
      currentItem.classList.add(_this2.options.classWeekday);
    });
    [].concat(_toConsumableArray(calendarContainer.querySelectorAll('.flatpickr-day'))).forEach(function (item) {
      item.classList.add(_this2.options.classDay);
      if (item.classList.contains('today') && calendar.selectedDates.length > 0) {
        item.classList.add('no-border');
      } else if (item.classList.contains('today') && calendar.selectedDates.length === 0) {
        item.classList.remove('no-border');
      }
    });
  };

  this._updateInputFields = function (selectedDates, type) {
    if (type === 'range') {
      if (selectedDates.length === 2) {
        _this2.element.querySelector(_this2.options.selectorDatePickerInputFrom).value = _this2._formatDate(selectedDates[0]);
        _this2.element.querySelector(_this2.options.selectorDatePickerInputTo).value = _this2._formatDate(selectedDates[1]);
      } else if (selectedDates.length === 1) {
        _this2.element.querySelector(_this2.options.selectorDatePickerInputFrom).value = _this2._formatDate(selectedDates[0]);
      }
    } else if (selectedDates.length === 1) {
      _this2.element.querySelector(_this2.options.selectorDatePickerInput).value = _this2._formatDate(selectedDates[0]);
    }
    _this2._updateClassNames(_this2.calendar);
  };

  this._formatDate = function (date) {
    return _this2.calendar.formatDate(date, _this2.calendar.config.dateFormat);
  };
};

export default DatePicker;