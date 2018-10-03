(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../../globals/js/settings', '../../globals/js/misc/mixin', '../../globals/js/mixins/create-component', '../../globals/js/mixins/init-component-by-search', '../../globals/js/mixins/handles', '../../globals/js/misc/on'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../../globals/js/settings'), require('../../globals/js/misc/mixin'), require('../../globals/js/mixins/create-component'), require('../../globals/js/mixins/init-component-by-search'), require('../../globals/js/mixins/handles'), require('../../globals/js/misc/on'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.settings, global.mixin, global.createComponent, global.initComponentBySearch, global.handles, global.on);
    global.checkbox = mod.exports;
  }
})(this, function (exports, _settings, _mixin2, _createComponent, _initComponentBySearch, _handles, _on) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _settings2 = _interopRequireDefault(_settings);

  var _mixin3 = _interopRequireDefault(_mixin2);

  var _createComponent2 = _interopRequireDefault(_createComponent);

  var _initComponentBySearch2 = _interopRequireDefault(_initComponentBySearch);

  var _handles2 = _interopRequireDefault(_handles);

  var _on2 = _interopRequireDefault(_on);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
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

  var stateChangeTypes = {
    true: 'true',
    false: 'false',
    mixed: 'mixed'
  };

  var Checkbox = function (_mixin) {
    _inherits(Checkbox, _mixin);

    /**
     * Checkbox UI.
     * @extends CreateComponent
     * @extends InitComponentBySearch
     * @extends Handles
     * @param {HTMLElement} element The element working as a checkbox UI.
     */

    function Checkbox(element, options) {
      _classCallCheck(this, Checkbox);

      var _this = _possibleConstructorReturn(this, (Checkbox.__proto__ || Object.getPrototypeOf(Checkbox)).call(this, element, options));

      _this.manage((0, _on2.default)(_this.element, 'click', function (event) {
        _this._handleClick(event);
      }));
      _this.manage((0, _on2.default)(_this.element, 'focus', function (event) {
        _this._handleFocus(event);
      }));
      _this.manage((0, _on2.default)(_this.element, 'blur', function (event) {
        _this._handleBlur(event);
      }));

      _this._indeterminateCheckbox();
      _this._initCheckbox();
      return _this;
    }

    _createClass(Checkbox, [{
      key: '_handleClick',
      value: function _handleClick() {
        if (this.element.checked === true) {
          this.element.setAttribute('checked', '');
          this.element.setAttribute('aria-checked', 'true');
          this.element.checked = true;

          // nested checkboxes inside labels
          if (this.element.parentElement.classList.contains(this.options.classLabel)) {
            this.element.parentElement.setAttribute(this.options.attribContainedCheckboxState, 'true');
          }
        } else if (this.element.checked === false) {
          this.element.removeAttribute('checked');
          this.element.setAttribute('aria-checked', 'false');
          this.element.checked = false;

          // nested checkboxes inside labels
          if (this.element.parentElement.classList.contains(this.options.classLabel)) {
            this.element.parentElement.setAttribute(this.options.attribContainedCheckboxState, 'false');
          }
        }
      }
    }, {
      key: '_handleFocus',
      value: function _handleFocus() {
        if (this.element.parentElement.classList.contains(this.options.classLabel)) {
          this.element.parentElement.classList.add(this.options.classLabelFocused);
        }
      }
    }, {
      key: '_handleBlur',
      value: function _handleBlur() {
        if (this.element.parentElement.classList.contains(this.options.classLabel)) {
          this.element.parentElement.classList.remove(this.options.classLabelFocused);
        }
      }
    }, {
      key: 'setState',
      value: function setState(state) {
        if (state === undefined || stateChangeTypes[state] === undefined) {
          throw new TypeError('setState expects a value of true, false or mixed.');
        }

        this.element.setAttribute('aria-checked', state);
        this.element.indeterminate = state === stateChangeTypes.mixed;
        this.element.checked = state === stateChangeTypes.true;

        var container = this.element.closest(this.options.selectorContainedCheckboxState);
        if (container) {
          container.setAttribute(this.options.attribContainedCheckboxState, state);
        }
      }
    }, {
      key: 'setDisabled',
      value: function setDisabled(value) {
        if (value === undefined) {
          throw new TypeError('setDisabled expects a boolean value of true or false');
        }
        if (value === true) {
          this.element.setAttribute('disabled', true);
        } else if (value === false) {
          this.element.removeAttribute('disabled');
        }
        var container = this.element.closest(this.options.selectorContainedCheckboxDisabled);
        if (container) {
          container.setAttribute(this.options.attribContainedCheckboxDisabled, value);
        }
      }
    }, {
      key: '_indeterminateCheckbox',
      value: function _indeterminateCheckbox() {
        if (this.element.getAttribute('aria-checked') === 'mixed') {
          this.element.indeterminate = true;
        }
        if (this.element.indeterminate === true) {
          this.element.setAttribute('aria-checked', 'mixed');
        }
        if (this.element.parentElement.classList.contains(this.options.classLabel) && this.element.indeterminate === true) {
          this.element.parentElement.setAttribute(this.options.attribContainedCheckboxState, 'mixed');
        }
      }
    }, {
      key: '_initCheckbox',
      value: function _initCheckbox() {
        if (this.element.checked === true) {
          this.element.setAttribute('aria-checked', 'true');
        }
        if (this.element.parentElement.classList.contains(this.options.classLabel) && this.element.checked) {
          this.element.parentElement.setAttribute(this.options.attribContainedCheckboxState, 'true');
        }
        if (this.element.parentElement.classList.contains(this.options.classLabel)) {
          this.element.parentElement.setAttribute(this.options.attribContainedCheckboxDisabled, 'false');
        }
        if (this.element.parentElement.classList.contains(this.options.classLabel) && this.element.disabled) {
          this.element.parentElement.setAttribute(this.options.attribContainedCheckboxDisabled, 'true');
        }
      }
    }], [{
      key: 'options',
      get: function get() {
        var prefix = _settings2.default.prefix;

        return {
          selectorInit: '.' + prefix + '--checkbox',
          selectorContainedCheckboxState: '[data-contained-checkbox-state]',
          selectorContainedCheckboxDisabled: '[data-contained-checkbox-disabled]',
          classLabel: prefix + '--checkbox-label',
          classLabelFocused: prefix + '--checkbox-label__focus',
          attribContainedCheckboxState: 'data-contained-checkbox-state',
          attribContainedCheckboxDisabled: 'data-contained-checkbox-disabled'
        };
      }
    }]);

    return Checkbox;
  }((0, _mixin3.default)(_createComponent2.default, _initComponentBySearch2.default, _handles2.default));

  Checkbox.components = new WeakMap();
  Checkbox.stateChangeTypes = stateChangeTypes;
  exports.default = Checkbox;
});