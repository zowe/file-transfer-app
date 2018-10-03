(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../../globals/js/settings', '../../globals/js/misc/mixin', '../../globals/js/mixins/create-component', '../../globals/js/mixins/init-component-by-search', '../../globals/js/mixins/handles', '../../globals/js/misc/event-matches', '../../globals/js/misc/on'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../../globals/js/settings'), require('../../globals/js/misc/mixin'), require('../../globals/js/mixins/create-component'), require('../../globals/js/mixins/init-component-by-search'), require('../../globals/js/mixins/handles'), require('../../globals/js/misc/event-matches'), require('../../globals/js/misc/on'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.settings, global.mixin, global.createComponent, global.initComponentBySearch, global.handles, global.eventMatches, global.on);
    global.textInput = mod.exports;
  }
})(this, function (exports, _settings, _mixin2, _createComponent, _initComponentBySearch, _handles, _eventMatches, _on) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _settings2 = _interopRequireDefault(_settings);

  var _mixin3 = _interopRequireDefault(_mixin2);

  var _createComponent2 = _interopRequireDefault(_createComponent);

  var _initComponentBySearch2 = _interopRequireDefault(_initComponentBySearch);

  var _handles2 = _interopRequireDefault(_handles);

  var _eventMatches2 = _interopRequireDefault(_eventMatches);

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

  var TextInput = function (_mixin) {
    _inherits(TextInput, _mixin);

    /**
     * Text Input.
     * @extends CreateComponent
     * @extends InitComponentBySearch
     * @extends Handles
     * @param {HTMLElement} element - The element functioning as a text field.
     */
    function TextInput(element, options) {
      _classCallCheck(this, TextInput);

      var _this = _possibleConstructorReturn(this, (TextInput.__proto__ || Object.getPrototypeOf(TextInput)).call(this, element, options));

      _initialiseProps.call(_this);

      _this.manage((0, _on2.default)(_this.element, 'click', function (event) {
        var toggleVisibilityButton = (0, _eventMatches2.default)(event, _this.options.selectorPasswordVisibilityButton);
        if (toggleVisibilityButton) {
          _this._toggle({ element: element, button: toggleVisibilityButton });
        }
      }));
      return _this;
    }

    /**
     *
     * @param {Object} obj - Object containing selectors and visibility status
     * @param {HTMLElement} obj.iconVisibilityOn - The element functioning as
     * the SVG icon for visibility on
     * @param {HTMLElement} obj.iconVisibilityOff - The element functioning as
     * the SVG icon for visibility off
     * @param {boolean} obj.passwordIsVisible - The visibility of the password in the
     * input field
     */


    /**
     * Toggles the visibility of the password in the input field and changes the
     * SVG icon indicating password visibility
     * @param {Object} obj - The elements that can change in the component
     * @param {HTMLElement} obj.element - The element functioning as a text field
     * @param {HTMLElement} obj.button - The button toggling password visibility
     */


    _createClass(TextInput, null, [{
      key: 'options',
      get: function get() {
        var prefix = _settings2.default.prefix;

        return {
          selectorInit: '[data-text-input]',
          selectorPasswordField: '.' + prefix + '--text-input[data-toggle-password-visibility]',
          selectorPasswordVisibilityButton: '.' + prefix + '--text-input--password__visibility',
          passwordIsVisible: prefix + '--text-input--password-visible',
          svgIconVisibilityOn: 'svg.icon--visibility-on',
          svgIconVisibilityOff: 'svg.icon--visibility-off'
        };
      }
    }]);

    return TextInput;
  }((0, _mixin3.default)(_createComponent2.default, _initComponentBySearch2.default, _handles2.default));

  TextInput.components = new WeakMap();

  var _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this._setIconVisibility = function (_ref) {
      var iconVisibilityOn = _ref.iconVisibilityOn,
          iconVisibilityOff = _ref.iconVisibilityOff,
          passwordIsVisible = _ref.passwordIsVisible;

      if (passwordIsVisible) {
        iconVisibilityOn.setAttribute('hidden', true);
        iconVisibilityOff.removeAttribute('hidden');
        return;
      }
      iconVisibilityOn.removeAttribute('hidden');
      iconVisibilityOff.setAttribute('hidden', true);
    };

    this._toggle = function (_ref2) {
      var element = _ref2.element,
          button = _ref2.button;

      // toggle action must come before querying the classList
      element.classList.toggle(_this2.options.passwordIsVisible);
      var passwordIsVisible = element.classList.contains(_this2.options.passwordIsVisible);
      var iconVisibilityOn = button.querySelector(_this2.options.svgIconVisibilityOn);
      var iconVisibilityOff = button.querySelector(_this2.options.svgIconVisibilityOff);
      var input = element.querySelector(_this2.options.selectorPasswordField);
      _this2._setIconVisibility({
        iconVisibilityOn: iconVisibilityOn,
        iconVisibilityOff: iconVisibilityOff,
        passwordIsVisible: passwordIsVisible
      });
      input.type = passwordIsVisible ? 'text' : 'password';
    };
  };

  exports.default = TextInput;
});