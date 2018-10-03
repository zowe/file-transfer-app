var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import debounce from 'lodash.debounce';
import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentByEvent from '../../globals/js/mixins/init-component-by-event';
import eventedShowHideState from '../../globals/js/mixins/evented-show-hide-state';
import handles from '../../globals/js/mixins/handles';
import FloatingMenu, { DIRECTION_LEFT, DIRECTION_TOP, DIRECTION_RIGHT, DIRECTION_BOTTOM } from '../floating-menu/floating-menu';
import getLaunchingDetails from '../../globals/js/misc/get-launching-details';
import on from '../../globals/js/misc/on';

/**
 * @param {Element} menuBody The menu body with the menu arrow.
 * @param {string} menuDirection Where the floating menu menu should be placed relative to the trigger button.
 * @returns {FloatingMenu~offset} The adjustment of the floating menu position, upon the position of the menu arrow.
 * @private
 */
var getMenuOffset = function getMenuOffset(menuBody, menuDirection) {
  var _DIRECTION_LEFT$DIREC, _DIRECTION_LEFT$DIREC2;

  var arrowStyle = menuBody.ownerDocument.defaultView.getComputedStyle(menuBody, ':before');
  var arrowPositionProp = (_DIRECTION_LEFT$DIREC = {}, _defineProperty(_DIRECTION_LEFT$DIREC, DIRECTION_LEFT, 'right'), _defineProperty(_DIRECTION_LEFT$DIREC, DIRECTION_TOP, 'bottom'), _defineProperty(_DIRECTION_LEFT$DIREC, DIRECTION_RIGHT, 'left'), _defineProperty(_DIRECTION_LEFT$DIREC, DIRECTION_BOTTOM, 'top'), _DIRECTION_LEFT$DIREC)[menuDirection];
  var menuPositionAdjustmentProp = (_DIRECTION_LEFT$DIREC2 = {}, _defineProperty(_DIRECTION_LEFT$DIREC2, DIRECTION_LEFT, 'left'), _defineProperty(_DIRECTION_LEFT$DIREC2, DIRECTION_TOP, 'top'), _defineProperty(_DIRECTION_LEFT$DIREC2, DIRECTION_RIGHT, 'left'), _defineProperty(_DIRECTION_LEFT$DIREC2, DIRECTION_BOTTOM, 'top'), _DIRECTION_LEFT$DIREC2)[menuDirection];
  var values = [arrowPositionProp, 'border-bottom-width'].reduce(function (o, name) {
    return _extends({}, o, _defineProperty({}, name, Number((/^([\d-.]+)px$/.exec(arrowStyle.getPropertyValue(name)) || [])[1])));
  }, {});
  values[arrowPositionProp] = values[arrowPositionProp] || -6; // IE, etc.
  if (Object.keys(values).every(function (name) {
    return !isNaN(values[name]);
  })) {
    var arrowPosition = values[arrowPositionProp],
        borderBottomWidth = values['border-bottom-width'];

    return _defineProperty({
      left: 0,
      top: 0
    }, menuPositionAdjustmentProp, Math.sqrt(Math.pow(borderBottomWidth, 2) * 2) - arrowPosition);
  }
  return undefined;
};

var Tooltip = function (_mixin) {
  _inherits(Tooltip, _mixin);

  /**
   * Tooltip.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   */
  function Tooltip(element, options) {
    _classCallCheck(this, Tooltip);

    var _this = _possibleConstructorReturn(this, (Tooltip.__proto__ || Object.getPrototypeOf(Tooltip)).call(this, element, options));

    _this._hasContextMenu = false;
    _this._debouncedHandleClick = debounce(_this._handleClick, 200);

    _this._hookOn(element);
    return _this;
  }

  /**
   * A flag to detect if `oncontextmenu` event is fired right before `focus`/`blur` events.
   * @type {boolean}
   */


  /**
   * The debounced version of the event handler.
   * @type {Function}
   * @private
   */


  _createClass(Tooltip, [{
    key: 'createdByEvent',


    /**
     * A method called when this widget is created upon events.
     * @param {Event} event The event triggering the creation.
     */
    value: function createdByEvent(event) {
      var relatedTarget = event.relatedTarget,
          type = event.type;

      this._debouncedHandleClick({ relatedTarget: relatedTarget, type: type === 'focusin' ? 'focus' : type, details: getLaunchingDetails(event) });
    }

    /**
     * Changes the shown/hidden state.
     * @param {string} state The new state.
     * @param {Object} detail The detail of the event trigging this action.
     * @param {Function} callback Callback called when change in state completes.
     // */

  }, {
    key: 'changeState',
    value: function changeState(state, detail, callback) {
      if (!this.tooltip) {
        var tooltip = this.element.ownerDocument.querySelector(this.element.getAttribute(this.options.attribTooltipTarget));
        if (!tooltip) {
          throw new Error('Cannot find the target tooltip.');
        }

        // Lazily create a component instance for tooltip
        this.tooltip = FloatingMenu.create(tooltip, {
          refNode: this.element,
          classShown: this.options.classShown,
          offset: this.options.objMenuOffset
        });
        this._hookOn(tooltip);
        this.children.push(this.tooltip);
      }

      // Delegates the action of changing state to the tooltip.
      // (And thus the before/after shown/hidden events are fired from the tooltip)
      this.tooltip.changeState(state, Object.assign(detail, { delegatorNode: this.element }), callback);
    }

    /**
     * Attaches event handlers to show/hide the tooltip.
     * @param {Element} element The element to attach the events to.
     * @private
     */

  }, {
    key: '_hookOn',
    value: function _hookOn(element) {
      var _this2 = this;

      var hasFocusin = 'onfocusin' in window;
      var focusinEventName = hasFocusin ? 'focusin' : 'focus';
      [focusinEventName, 'blur', 'touchleave', 'touchcancel'].forEach(function (name) {
        _this2.manage(on(element, name, function (event) {
          var relatedTarget = event.relatedTarget,
              type = event.type;

          var hadContextMenu = _this2._hasContextMenu;
          _this2._hasContextMenu = type === 'contextmenu';
          _this2._debouncedHandleClick({
            relatedTarget: relatedTarget,
            type: type === 'focusin' ? 'focus' : type,
            hadContextMenu: hadContextMenu,
            details: getLaunchingDetails(event)
          });
        }, name === focusinEventName && !hasFocusin));
      });
    }

    /**
     * Handles click/focus events.
     * @param {Object} params The parameters.
     * @param {Element} params.relatedTarget The element that focus went to. (For `blur` event)
     * @param {string} params.type The event type triggering this method.
     * @param {boolean} params.hadContextMenu
     * @param {Object} params.details The event details.
     * @private
     */

  }, {
    key: '_handleClick',
    value: function _handleClick(_ref2) {
      var relatedTarget = _ref2.relatedTarget,
          type = _ref2.type,
          hadContextMenu = _ref2.hadContextMenu,
          details = _ref2.details;

      var state = {
        focus: 'shown',
        blur: 'hidden',
        touchleave: 'hidden',
        touchcancel: 'hidden'
      }[type];

      var shouldPreventClose = void 0;
      if (type === 'blur') {
        // Note: SVGElement in IE11 does not have `.contains()`
        var wentToSelf = relatedTarget && this.element.contains && this.element.contains(relatedTarget) || this.tooltip && this.tooltip.element.contains(relatedTarget);
        shouldPreventClose = hadContextMenu || wentToSelf;
      }
      if (!shouldPreventClose) {
        this.changeState(state, details);
      }
    }
  }], [{
    key: 'options',
    get: function get() {
      var prefix = settings.prefix;

      return {
        selectorInit: '[data-tooltip-trigger]',
        classShown: prefix + '--tooltip--shown',
        attribTooltipTarget: 'data-tooltip-target',
        objMenuOffset: getMenuOffset,
        initEventNames: ['focus']
      };
    }
  }]);

  return Tooltip;
}(mixin(createComponent, initComponentByEvent, eventedShowHideState, handles));

Tooltip.components = new WeakMap();


export default Tooltip;