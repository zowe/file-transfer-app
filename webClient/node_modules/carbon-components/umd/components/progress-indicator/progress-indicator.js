(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../../globals/js/settings', '../../globals/js/misc/mixin', '../../globals/js/mixins/create-component', '../../globals/js/mixins/init-component-by-search'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../../globals/js/settings'), require('../../globals/js/misc/mixin'), require('../../globals/js/mixins/create-component'), require('../../globals/js/mixins/init-component-by-search'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.settings, global.mixin, global.createComponent, global.initComponentBySearch);
    global.progressIndicator = mod.exports;
  }
})(this, function (exports, _settings, _mixin2, _createComponent, _initComponentBySearch) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _settings2 = _interopRequireDefault(_settings);

  var _mixin3 = _interopRequireDefault(_mixin2);

  var _createComponent2 = _interopRequireDefault(_createComponent);

  var _initComponentBySearch2 = _interopRequireDefault(_initComponentBySearch);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

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

  var ProgressIndicator = function (_mixin) {
    _inherits(ProgressIndicator, _mixin);

    /**
     * ProgressIndicator.
     * @extends CreateComponent
     * @extends InitComponentBySearch
     * @param {HTMLElement} element The element representing the ProgressIndicator.
     * @param {Object} [options] The component options.
     * @property {string} [options.selectorStepElement] The CSS selector to find step elements.
     * @property {string} [options.selectorCurrent] The CSS selector to find the current step element.
     * @property {string} [options.selectorIncomplete] The CSS class to find incomplete step elements.
     * @property {string} [options.selectorComplete] The CSS selector to find completed step elements.
     * @property {string} [options.classStep] The className for a step element.
     * @property {string} [options.classComplete] The className for a completed step element.
     * @property {string} [options.classCurrent] The className for the current step element.
     * @property {string} [options.classIncomplete] The className for a incomplete step element.
     */
    function ProgressIndicator(element, options) {
      _classCallCheck(this, ProgressIndicator);

      var _this = _possibleConstructorReturn(this, (ProgressIndicator.__proto__ || Object.getPrototypeOf(ProgressIndicator)).call(this, element, options));

      /**
       * The component state.
       * @type {Object}
       */
      _this.state = {
        /**
         * The current step index.
         * @type {number}
         */
        currentIndex: _this.getCurrent().index,

        /**
         * Total number of steps.
         * @type {number}
         */
        totalSteps: _this.getSteps().length
      };
      return _this;
    }

    /**
     * Returns all steps with details about element and index.
     */


    _createClass(ProgressIndicator, [{
      key: 'getSteps',
      value: function getSteps() {
        return [].concat(_toConsumableArray(this.element.querySelectorAll(this.options.selectorStepElement))).map(function (element, index) {
          return {
            element: element,
            index: index
          };
        });
      }
    }, {
      key: 'getCurrent',
      value: function getCurrent() {
        var currentEl = this.element.querySelector(this.options.selectorCurrent);
        return this.getSteps().filter(function (step) {
          return step.element === currentEl;
        })[0];
      }
    }, {
      key: 'setCurrent',
      value: function setCurrent() {
        var _this2 = this;

        var newCurrentStep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state.currentIndex;

        var changed = false;

        if (newCurrentStep !== this.state.currentIndex) {
          this.state.currentIndex = newCurrentStep;
          changed = true;
        }

        if (changed) {
          this.getSteps().forEach(function (step) {
            if (step.index < newCurrentStep) {
              _this2._updateStep({
                element: step.element,
                className: _this2.options.classComplete,
                html: _this2._getSVGComplete()
              });
            }

            if (step.index === newCurrentStep) {
              _this2._updateStep({
                element: step.element,
                className: _this2.options.classCurrent,
                html: _this2._getCurrentSVG()
              });
            }

            if (step.index > newCurrentStep) {
              _this2._updateStep({
                element: step.element,
                className: _this2.options.classIncomplete,
                html: _this2._getIncompleteSVG()
              });
            }
          });
        }
      }
    }, {
      key: '_updateStep',
      value: function _updateStep(args) {
        var element = args.element,
            className = args.className,
            html = args.html;


        if (element.firstElementChild) {
          element.removeChild(element.firstElementChild);
        }

        if (!element.classList.contains(className)) {
          element.setAttribute('class', this.options.classStep);
          element.classList.add(className);
        }

        element.insertAdjacentHTML('afterbegin', html);
      }
    }, {
      key: '_getSVGComplete',
      value: function _getSVGComplete() {
        return '<svg width="24px" height="24px" viewBox="0 0 24 24">\n        <circle cx="12" cy="12" r="12"></circle>\n        <polygon points="10.3 13.6 7.7 11 6.3 12.4 10.3 16.4 17.8 9 16.4 7.6"></polygon>\n      </svg>';
      }
    }, {
      key: '_getCurrentSVG',
      value: function _getCurrentSVG() {
        return '<svg>\n        <circle cx="12" cy="12" r="12"></circle>\n        <circle cx="12" cy="12" r="6"></circle>\n      </svg>';
      }
    }, {
      key: '_getIncompleteSVG',
      value: function _getIncompleteSVG() {
        return '<svg>\n        <circle cx="12" cy="12" r="12"></circle>\n      </svg>';
      }
    }], [{
      key: 'options',
      get: function get() {
        var prefix = _settings2.default.prefix;

        return {
          selectorInit: '[data-progress]',
          selectorStepElement: '.' + prefix + '--progress-step',
          selectorCurrent: '.' + prefix + '--progress-step--current',
          selectorIncomplete: '.' + prefix + '--progress-step--incomplete',
          selectorComplete: '.' + prefix + '--progress-step--complete',
          classStep: prefix + '--progress-step',
          classComplete: prefix + '--progress-step--complete',
          classCurrent: prefix + '--progress-step--current',
          classIncomplete: prefix + '--progress-step--incomplete'
        };
      }
    }]);

    return ProgressIndicator;
  }((0, _mixin3.default)(_createComponent2.default, _initComponentBySearch2.default));

  ProgressIndicator.components = new WeakMap();
  exports.default = ProgressIndicator;
});