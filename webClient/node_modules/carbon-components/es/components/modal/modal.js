var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentByLauncher from '../../globals/js/mixins/init-component-by-launcher';
import eventedShowHideState from '../../globals/js/mixins/evented-show-hide-state';
import handles from '../../globals/js/mixins/handles';
import eventMatches from '../../globals/js/misc/event-matches';
import on from '../../globals/js/misc/on';

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
        return !eventMatches(evt, selector);
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


    /**
     * A method that runs when `.init()` is called from `initComponentByLauncher`.
     * @param {Event} evt The event fired on the launcher button.
     */
    value: function createdByLauncher(evt) {
      this.show(evt);
    }

    /**
     * Determines whether or not to emit events and callback function when `.changeState()` is called from `eventedState`.
     * @param {string} state The new state.
     * @returns {boolean} `true` if the given `state` is different from current state.
     */

  }, {
    key: 'shouldStateBeChanged',
    value: function shouldStateBeChanged(state) {
      if (state === 'shown') {
        return !this.element.classList.contains(this.options.classVisible);
      }

      return this.element.classList.contains(this.options.classVisible);
    }

    /**
     * Changes the shown/hidden state.
     * @private
     * @param {string} state The new state.
     * @param {Object} detail The detail data to be included in the event that will be fired.
     * @param {Function} callback Callback called when change in state completes.
     */

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
        this._handleFocusinListener = this.manage(on(this.element.ownerDocument, focusinEventName, this._handleFocusin, !hasFocusin));
      }

      if (state === 'hidden') {
        this.element.classList.toggle(this.options.classVisible, false);
      } else if (state === 'shown') {
        this.element.classList.toggle(this.options.classVisible, true);
      }
      handleTransitionEnd = this.manage(on(this.element, 'transitionend', transitionEnd));
    }
  }, {
    key: '_hookCloseActions',
    value: function _hookCloseActions() {
      var _this3 = this;

      this.manage(on(this.element, 'click', function (evt) {
        var closeButton = eventMatches(evt, _this3.options.selectorModalClose);
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

      this._handleKeydownListener = this.manage(on(this.element.ownerDocument.body, 'keydown', function (evt) {
        if (evt.which === 27) {
          evt.stopPropagation();
          _this3.hide(evt);
        }
      }));
    }

    /**
     * Handles `focusin` (or `focus` depending on browser support of `focusin`) event to do wrap-focus behavior.
     * @param {Event} evt The event.
     * @private
     */


    /**
     * The map associating DOM element and modal instance.
     * @member Modal.components
     * @type {WeakMap}
     */

  }], [{
    key: 'options',


    /**
     * The component options.
     * If `options` is specified in the constructor, {@linkcode Modal.create .create()}, or {@linkcode Modal.init .init()},
     * properties in this object are overriden for the instance being create and how {@linkcode Modal.init .init()} works.
     * @member Modal.options
     * @type {Object}
     * @property {string} selectorInit The CSS class to find modal dialogs.
     * @property {string} [selectorModalClose] The selector to find elements that close the modal.
     * @property {string} [selectorPrimaryFocus] The CSS selector to determine the element to put focus when modal gets open.
     * @property {string} attribInitTarget The attribute name in the launcher buttons to find target modal dialogs.
     * @property {string[]} [selectorsFloatingMenu]
     *   The CSS selectors of floating menus.
     *   Used for detecting if focus-wrap behavior should be disabled temporarily.
     * @property {string} [classVisible] The CSS class for the visible state.
     * @property {string} [classNoScroll] The CSS class for hiding scroll bar in body element while modal is shown.
     * @property {string} [eventBeforeShown]
     *   The name of the custom event fired before this modal is shown.
     *   Cancellation of this event stops showing the modal.
     * @property {string} [eventAfterShown]
     *   The name of the custom event telling that modal is sure shown
     *   without being canceled by the event handler named by `eventBeforeShown` option (`modal-beingshown`).
     * @property {string} [eventBeforeHidden]
     *   The name of the custom event fired before this modal is hidden.
     *   Cancellation of this event stops hiding the modal.
     * @property {string} [eventAfterHidden]
     *   The name of the custom event telling that modal is sure hidden
     *   without being canceled by the event handler named by `eventBeforeHidden` option (`modal-beinghidden`).
     */
    get: function get() {
      var prefix = settings.prefix;

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
}(mixin(createComponent, initComponentByLauncher, eventedShowHideState, handles));

Modal.components = new WeakMap();


export default Modal;