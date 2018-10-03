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
    global.numberInput = mod.exports;
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

  var NumberInput = function (_mixin) {
    _inherits(NumberInput, _mixin);

    /**
     * Number input UI.
     * @extends CreateComponent
     * @extends InitComponentBySearch
     * @extends Handles
     * @param {HTMLElement} element The element working as a number input UI.
     */
    function NumberInput(element, options) {
      _classCallCheck(this, NumberInput);

      var _this = _possibleConstructorReturn(this, (NumberInput.__proto__ || Object.getPrototypeOf(NumberInput)).call(this, element, options));

      // Broken DOM tree is seen with up/down arrows <svg> in IE, which breaks event delegation.
      // <svg> does not have `Element.classList` in IE11
      _this.manage((0, _on2.default)(_this.element.querySelector('.up-icon'), 'click', function (event) {
        _this._handleClick(event);
      }));
      _this.manage((0, _on2.default)(_this.element.querySelector('.down-icon'), 'click', function (event) {
        _this._handleClick(event);
      }));
      return _this;
    }

    /**
     * Increase/decrease number by clicking on up/down icons.
     * @param {Event} event The event triggering this method.
     */


    _createClass(NumberInput, [{
      key: '_handleClick',
      value: function _handleClick(event) {
        var numberInput = this.element.querySelector(this.options.selectorInput);
        var target = event.currentTarget.getAttribute('class').split(' ');

        if (target.indexOf('up-icon') >= 0) {
          ++numberInput.value;
        } else if (target.indexOf('down-icon') >= 0) {
          --numberInput.value;
        }

        // Programmatic change in value (including `stepUp()`/`stepDown()`) won't fire change event
        numberInput.dispatchEvent(new CustomEvent('change', {
          bubbles: true,
          cancelable: false
        }));
      }
    }], [{
      key: 'options',
      get: function get() {
        var prefix = _settings2.default.prefix;

        return {
          selectorInit: '[data-numberinput]',
          selectorInput: '.' + prefix + '--number input'
        };
      }
    }]);

    return NumberInput;
  }((0, _mixin3.default)(_createComponent2.default, _initComponentBySearch2.default, _handles2.default));

  NumberInput.components = new WeakMap();
  exports.default = NumberInput;
});