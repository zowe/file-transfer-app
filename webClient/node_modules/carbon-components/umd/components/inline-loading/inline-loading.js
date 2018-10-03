(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../../globals/js/settings', '../../globals/js/misc/mixin', '../../globals/js/mixins/create-component', '../../globals/js/mixins/init-component-by-search', '../../globals/js/mixins/handles', '../../globals/js/misc/toggle-attribute'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../../globals/js/settings'), require('../../globals/js/misc/mixin'), require('../../globals/js/mixins/create-component'), require('../../globals/js/mixins/init-component-by-search'), require('../../globals/js/mixins/handles'), require('../../globals/js/misc/toggle-attribute'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.settings, global.mixin, global.createComponent, global.initComponentBySearch, global.handles, global.toggleAttribute);
    global.inlineLoading = mod.exports;
  }
})(this, function (exports, _settings, _mixin2, _createComponent, _initComponentBySearch, _handles, _toggleAttribute) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _settings2 = _interopRequireDefault(_settings);

  var _mixin3 = _interopRequireDefault(_mixin2);

  var _createComponent2 = _interopRequireDefault(_createComponent);

  var _initComponentBySearch2 = _interopRequireDefault(_initComponentBySearch);

  var _handles2 = _interopRequireDefault(_handles);

  var _toggleAttribute2 = _interopRequireDefault(_toggleAttribute);

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

  var InlineLoading = function (_mixin) {
    _inherits(InlineLoading, _mixin);

    /**
     * Spinner indicating loading state.
     * @extends CreateComponent
     * @extends InitComponentBySearch
     * @extends Handles
     * @param {HTMLElement} element The element working as a spinner.
     * @param {Object} [options] The component options.
     * @param {string} [options.initialState] The initial state, should be `inactive`, `active` or `finished`.
     */
    function InlineLoading(element, options) {
      _classCallCheck(this, InlineLoading);

      var _this = _possibleConstructorReturn(this, (InlineLoading.__proto__ || Object.getPrototypeOf(InlineLoading)).call(this, element, options));

      // Sets the initial state
      var initialState = _this.options.initialState;
      if (initialState) {
        _this.setState(initialState);
      }
      return _this;
    }

    /**
     * Sets active/inactive state.
     * @param {string} state The new state, should be `inactive`, `active` or `finished`.
     */


    _createClass(InlineLoading, [{
      key: 'setState',
      value: function setState(state) {
        var states = this.constructor.states;
        var values = Object.keys(states).map(function (key) {
          return states[key];
        });
        if (values.indexOf(state) < 0) {
          throw new Error('One of the following value should be given as the state: ' + values.join(', '));
        }

        var elem = this.element;
        var _options = this.options,
            selectorSpinner = _options.selectorSpinner,
            selectorFinished = _options.selectorFinished,
            selectorTextActive = _options.selectorTextActive,
            selectorTextFinished = _options.selectorTextFinished;

        var spinner = elem.querySelector(selectorSpinner);
        var finished = elem.querySelector(selectorFinished);
        var textActive = elem.querySelector(selectorTextActive);
        var textFinished = elem.querySelector(selectorTextFinished);

        if (spinner) {
          spinner.classList.toggle(this.options.classLoadingStop, state !== states.ACTIVE);
          (0, _toggleAttribute2.default)(spinner, 'hidden', state === states.FINISHED);
        }

        if (finished) {
          (0, _toggleAttribute2.default)(finished, 'hidden', state !== states.FINISHED);
        }

        if (textActive) {
          (0, _toggleAttribute2.default)(textActive, 'hidden', state !== states.ACTIVE);
        }

        if (textFinished) {
          (0, _toggleAttribute2.default)(textFinished, 'hidden', state !== states.FINISHED);
        }

        return this;
      }
    }], [{
      key: 'options',
      get: function get() {
        var prefix = _settings2.default.prefix;

        return {
          selectorInit: '[data-inline-loading]',
          selectorSpinner: '[data-inline-loading-spinner]',
          selectorFinished: '[data-inline-loading-finished]',
          selectorTextActive: '[data-inline-loading-text-active]',
          selectorTextFinished: '[data-inline-loading-text-finished]',
          classLoadingStop: prefix + '--loading--stop'
        };
      }
    }]);

    return InlineLoading;
  }((0, _mixin3.default)(_createComponent2.default, _initComponentBySearch2.default, _handles2.default));

  InlineLoading.states = {
    INACTIVE: 'inactive',
    ACTIVE: 'active',
    FINISHED: 'finished'
  };
  InlineLoading.components = new WeakMap();
  exports.default = InlineLoading;
});