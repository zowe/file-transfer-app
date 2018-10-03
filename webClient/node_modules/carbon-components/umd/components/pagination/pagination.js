(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../../globals/js/misc/mixin', '../../globals/js/mixins/create-component', '../../globals/js/mixins/init-component-by-search', '../../globals/js/mixins/handles', '../../globals/js/misc/on'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../../globals/js/misc/mixin'), require('../../globals/js/mixins/create-component'), require('../../globals/js/mixins/init-component-by-search'), require('../../globals/js/mixins/handles'), require('../../globals/js/misc/on'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.mixin, global.createComponent, global.initComponentBySearch, global.handles, global.on);
    global.pagination = mod.exports;
  }
})(this, function (exports, _mixin2, _createComponent, _initComponentBySearch, _handles, _on) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

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

  var Pagination = function (_mixin) {
    _inherits(Pagination, _mixin);

    /**
     * Pagination component.
     * @extends CreateComponent
     * @extends InitComponentBySearch
     * @param {HTMLElement} element The element working as a pagination component.
     * @param {Object} [options] The component options.
     * @property {string} [selectorInit] The CSS selector to find pagination components.
     * @property {string} [selectorItemsPerPageInput]
     *   The CSS selector to find the input that determines the number of items per page.
     * @property {string} [selectorPageNumberInput] The CSS selector to find the input that changes the page displayed.
     * @property {string} [selectorPageBackward] The CSS selector to find the button that goes back a page.
     * @property {string} [selectorPageForward] The CSS selector to find the button that goes forward a page.
     * @property {string} [eventItemsPerPage]
     *   The name of the custom event fired when a user changes the number of items per page.
     *   event.detail.value contains the number of items a user wishes to see.
     * @property {string} [eventPageNumber]
     *   The name of the custom event fired when a user inputs a specific page number.
     *   event.detail.value contains the value that the user input.
     * @property {string} [eventPageChange]
     *   The name of the custom event fired when a user goes forward or backward a page.
     *   event.detail.direction contains the direction a user wishes to go.
     */
    function Pagination(element, options) {
      _classCallCheck(this, Pagination);

      var _this = _possibleConstructorReturn(this, (Pagination.__proto__ || Object.getPrototypeOf(Pagination)).call(this, element, options));

      _this._emitEvent = function (evtName, detail) {
        var event = new CustomEvent('' + evtName, {
          bubbles: true,
          cancelable: true,
          detail: detail
        });

        _this.element.dispatchEvent(event);
      };

      _this.manage((0, _on2.default)(_this.element, 'click', function (evt) {
        if (evt.target.matches(_this.options.selectorPageBackward)) {
          var detail = {
            initialEvt: evt,
            element: evt.target,
            direction: 'backward'
          };
          _this._emitEvent(_this.options.eventPageChange, detail);
        } else if (evt.target.matches(_this.options.selectorPageForward)) {
          var _detail = {
            initialEvt: evt,
            element: evt.target,
            direction: 'forward'
          };
          _this._emitEvent(_this.options.eventPageChange, _detail);
        }
      }));

      _this.manage((0, _on2.default)(_this.element, 'input', function (evt) {
        if (evt.target.matches(_this.options.selectorItemsPerPageInput)) {
          var detail = {
            initialEvt: evt,
            element: evt.target,
            value: evt.target.value
          };
          _this._emitEvent(_this.options.eventItemsPerPage, detail);
        } else if (evt.target.matches(_this.options.selectorPageNumberInput)) {
          var _detail2 = {
            initialEvt: evt,
            element: evt.target,
            value: evt.target.value
          };
          _this._emitEvent(_this.options.eventPageNumber, _detail2);
        }
      }));
      return _this;
    }

    /**
     * Dispatches a custom event
     * @param {string} evtName name of the event to be dispatched.
     * @param {Object} detail contains the original event and any other necessary details.
     */


    /**
     * The map associating DOM element and pagination instance.
     * @type {WeakMap}
     */


    /**
     * The component options.
     * If `options` is specified in the constructor,
     * {@linkcode Pagination.create .create()}, or {@linkcode Pagination.init .init()},
     * properties in this object are overriden for the instance being create and how {@linkcode Pagination.init .init()} works.
     * @property {string} [selectorInit] The CSS selector to find pagination components.
     * @property {string} [selectorItemsPerPageInput] The CSS selector to find the input that determines
     * the number of items per page.
     * @property {string} [selectorPageNumberInput] The CSS selector to find the input that changes the page displayed.
     * @property {string} [selectorPageBackward] The CSS selector to find the button that goes back a page.
     * @property {string} [selectorPageForward] The CSS selector to find the button that goes forward a page.
     * @property {string} [eventItemsPerPage]
     *   The name of the custom event fired when a user changes the number of items per page.
     *   event.detail.value contains the number of items a user wishes to see.
     * @property {string} [eventPageNumber]
     *   The name of the custom event fired when a user inputs a specific page number.
     *   event.detail.value contains the value that the user input.
     * @property {string} [eventPageChange]
     *   The name of the custom event fired when a user goes forward or backward a page.
     *   event.detail.direction contains the direction a user wishes to go.
     */


    return Pagination;
  }((0, _mixin3.default)(_createComponent2.default, _initComponentBySearch2.default, _handles2.default));

  Pagination.components = new WeakMap();
  Pagination.options = {
    selectorInit: '[data-pagination]',
    selectorItemsPerPageInput: '[data-items-per-page]',
    selectorPageNumberInput: '[data-page-number-input]',
    selectorPageBackward: '[data-page-backward]',
    selectorPageForward: '[data-page-forward]',
    eventItemsPerPage: 'itemsPerPage',
    eventPageNumber: 'pageNumber',
    eventPageChange: 'pageChange'
  };
  exports.default = Pagination;
});