var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';

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

    /**
     * The component state.
     * @type {Object}
     */
    var _this = _possibleConstructorReturn(this, (ProgressIndicator.__proto__ || Object.getPrototypeOf(ProgressIndicator)).call(this, element, options));

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

    /**
     * Returns current step; gives detail about element and index.
     */

  }, {
    key: 'getCurrent',
    value: function getCurrent() {
      var currentEl = this.element.querySelector(this.options.selectorCurrent);
      return this.getSteps().filter(function (step) {
        return step.element === currentEl;
      })[0];
    }

    /**
     * Sets the current step.
     * * @param {Number} new step index or use default in `this.state.currentIndex`.
     */

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

    /**
     * Update step with correct inline SVG and className
     * @param {Object} args
     * @param {Object} [args.element] target element
     * @param {Object} [args.className] new className
     * @param {Object} [args.html] new inline SVG to insert
     */

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

    /**
     * Returns HTML string for an SVG used to represent a compelted step (checkmark)
     */

  }, {
    key: '_getSVGComplete',
    value: function _getSVGComplete() {
      return '<svg width="24px" height="24px" viewBox="0 0 24 24">\n        <circle cx="12" cy="12" r="12"></circle>\n        <polygon points="10.3 13.6 7.7 11 6.3 12.4 10.3 16.4 17.8 9 16.4 7.6"></polygon>\n      </svg>';
    }

    /**
     * Returns HTML string for an SVG used to represent current step (circles, like a radio button, but not.)
     */

  }, {
    key: '_getCurrentSVG',
    value: function _getCurrentSVG() {
      return '<svg>\n        <circle cx="12" cy="12" r="12"></circle>\n        <circle cx="12" cy="12" r="6"></circle>\n      </svg>';
    }

    /**
     * Returns HTML string for an SVG used to represent incomple step (grey empty circle)
     */

  }, {
    key: '_getIncompleteSVG',
    value: function _getIncompleteSVG() {
      return '<svg>\n        <circle cx="12" cy="12" r="12"></circle>\n      </svg>';
    }
  }], [{
    key: 'options',


    /**
     * The component options.
     * If `options` is specified in the constructor,
     * {@linkcode ProgressIndicator.create .create()}, or {@linkcode ProgressIndicator.init .init()},
     * properties in this object are overriden for the instance being created.
     * @member ProgressIndicator.options
     * @type {Object}
     * @property {string} selectorInit The CSS selector to find content switcher button set.
     * @property {string} [selectorStepElement] The CSS selector to find step elements.
     * @property {string} [selectorCurrent] The CSS selector to find the current step element.
     * @property {string} [selectorIncomplete] The CSS class to find incomplete step elements.
     * @property {string} [selectorComplete] The CSS selector to find completed step elements.
     * @property {string} [classStep] The className for a step element.
     * @property {string} [classComplete] The className for a completed step element.
     * @property {string} [classCurrent] The className for the current step element.
     * @property {string} [classIncomplete] The className for a incomplete step element.
     */
    get: function get() {
      var prefix = settings.prefix;

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
}(mixin(createComponent, initComponentBySearch));

ProgressIndicator.components = new WeakMap();


export default ProgressIndicator;