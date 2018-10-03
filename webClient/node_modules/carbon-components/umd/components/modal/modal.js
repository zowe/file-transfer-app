(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../../globals/js/settings', '../../globals/js/misc/mixin', '../../globals/js/mixins/create-component', '../../globals/js/mixins/init-component-by-launcher', '../../globals/js/mixins/evented-show-hide-state', '../../globals/js/mixins/handles', '../../globals/js/misc/event-matches', '../../globals/js/misc/on'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../../globals/js/settings'), require('../../globals/js/misc/mixin'), require('../../globals/js/mixins/create-component'), require('../../globals/js/mixins/init-component-by-launcher'), require('../../globals/js/mixins/evented-show-hide-state'), require('../../globals/js/mixins/handles'), require('../../globals/js/misc/event-matches'), require('../../globals/js/misc/on'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.settings, global.mixin, global.createComponent, global.initComponentByLauncher, global.eventedShowHideState, global.handles, global.eventMatches, global.on);
    global.modal = mod.exports;
  }
})(this, function (exports, _settings, _mixin2, _createComponent, _initComponentByLauncher, _eventedShowHideState, _handles, _eventMatches, _on) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _settings2 = _interopRequireDefault(_settings);

  var _mixin3 = _interopRequireDefault(_mixin2);

  var _createComponent2 = _interopRequireDefault(_createComponent);

  var _initComponentByLauncher2 = _interopRequireDefault(_initComponentByLauncher);

  var _eventedShowHideState2 = _interopRequireDefault(_eventedShowHideState);

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

  var Modal = function (_mixin) {
    _inherits(Modal, _mixin);

    /**
     * Modal dialog.
     * @extends CreateComponent
     * @extends InitComponentByLauncher
     * @extends EventedShowHideState
     * @extends Handles
     * @param {HTMLElement} element The element working as a modal dialog.
     * @param {Object} [options] The component options.
     * @param {string} [options.classVisible] The CSS class for the visible state.
     * @param {string} [options.eventBeforeShown]
     *   The name of the custom event fired before this modal is shown.
     *   Cancellation of this event stops showing the modal.
     * @param {string} [options.eventAfterShown]
     *   The name of the custom event telling that modal is sure shown
     *   without being canceled by the event handler named by `eventBeforeShown` option (`modal-beingshown`).
     * @param {string} [options.eventBeforeHidden]
     *   The name of the custom event fired before this modal is hidden.
     *   Cancellation of this event stops hiding the modal.
     * @param {string} [options.eventAfterHidden]
     *   The name of the custom event telling that modal is sure hidden
     *   without being canceled by the event handler named by `eventBeforeHidden` option (`modal-beinghidden`).
     */
    function Modal(element, options) {
      _classCallCheck(this, Modal);

      var _this = _possibleConstructorReturn(this, (Modal.__proto__ || Object.getPrototypeOf(Modal)).call(this, element, options));

      _this._handleFocusin = function (evt) {
        if (_this.element.classList.contains(_this.options.classVisible) && !_this.element.contains(evt.target) && _this.options.selectorsFloatingMenus.every(function (selector) {
          return !(0, _eventMatches2.default)(evt, selector);
        })) {
          _this.element.focus();
        }
      };

      _this._hookCloseActions();
      return _this;
    }

    /**
     * The handle for `focusin` event listener.
     * Used for "focus-wrap" feature.
     * @type {Handle}
     * @private
     */


    /**
     * The handle for `keydown` event listener.
     * Used for "close-on-escape-key" feature.
     * @type {Handle}
     * @private
     */


    _createClass(Modal, [{
      key: 'createdByLauncher',
      value: function createdByLauncher(evt) {
        this.show(evt);
      }
    }, {
      key: 'shouldStateBeChanged',
      value: function shouldStateBeChanged(state) {
        if (state === 'shown') {
          return !this.element.classList.contains(this.options.classVisible);
        }

        return this.element.classList.contains(this.options.classVisible);
      }
    }, {
      key: '_changeState',
      value: function _changeState(state, detail, callback) {
        var _this2 = this;

        var handleTransitionEnd = void 0;
        var transitionEnd = function transitionEnd() {
          if (handleTransitionEnd) {
            handleTransitionEnd = _this2.unmanage(handleTransitionEnd).release();
          }
          if (state === 'shown' && _this2.element.offsetWidth > 0 && _this2.element.offsetHeight > 0) {
            (_this2.element.querySelector(_this2.options.selectorPrimaryFocus) || _this2.element).focus();
          }
          callback();
        };

        if (this._handleFocusinListener) {
          this._handleFocusinListener = this.unmanage(this._handleFocusinListener).release();
        }

        if (state === 'shown') {
          var hasFocusin = 'onfocusin' in this.element.ownerDocument.defaultView;
          var focusinEventName = hasFocusin ? 'focusin' : 'focus';
          this._handleFocusinListener = this.manage((0, _on2.default)(this.element.ownerDocument, focusinEventName, this._handleFocusin, !hasFocusin));
        }

        if (state === 'hidden') {
          this.element.classList.toggle(this.options.classVisible, false);
        } else if (state === 'shown') {
          this.element.classList.toggle(this.options.classVisible, true);
        }
        handleTransitionEnd = this.manage((0, _on2.default)(this.element, 'transitionend', transitionEnd));
      }
    }, {
      key: '_hookCloseActions',
      value: function _hookCloseActions() {
        var _this3 = this;

        this.manage((0, _on2.default)(this.element, 'click', function (evt) {
          var closeButton = (0, _eventMatches2.default)(evt, _this3.options.selectorModalClose);
          if (closeButton) {
            evt.delegateTarget = closeButton; // eslint-disable-line no-param-reassign
          }
          if (closeButton || evt.target === _this3.element) {
            _this3.hide(evt);
          }
        }));

        if (this._handleKeydownListener) {
          this._handleKeydownListener = this.unmanage(this._handleKeydownListener).release();
        }

        this._handleKeydownListener = this.manage((0, _on2.default)(this.element.ownerDocument.body, 'keydown', function (evt) {
          if (evt.which === 27) {
            evt.stopPropagation();
            _this3.hide(evt);
          }
        }));
      }
    }], [{
      key: 'options',
      get: function get() {
        var prefix = _settings2.default.prefix;

        return {
          selectorInit: '[data-modal]',
          selectorModalClose: '[data-modal-close]',
          selectorPrimaryFocus: '[data-modal-primary-focus]',
          selectorsFloatingMenus: ['.' + prefix + '--overflow-menu-options', '.' + prefix + '--tooltip', '.flatpickr-calendar'],
          classVisible: 'is-visible',
          attribInitTarget: 'data-modal-target',
          initEventNames: ['click'],
          eventBeforeShown: 'modal-beingshown',
          eventAfterShown: 'modal-shown',
          eventBeforeHidden: 'modal-beinghidden',
          eventAfterHidden: 'modal-hidden'
        };
      }
    }]);

    return Modal;
  }((0, _mixin3.default)(_createComponent2.default, _initComponentByLauncher2.default, _eventedShowHideState2.default, _handles2.default));

  Modal.components = new WeakMap();
  exports.default = Modal;
});