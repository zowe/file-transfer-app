var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import eventedState from '../../globals/js/mixins/evented-state';
import handles from '../../globals/js/mixins/handles';
import on from '../../globals/js/misc/on';

var Notification = function (_mixin) {
  _inherits(Notification, _mixin);

  /**
   * InlineNotification.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The element working as a InlineNotification.
   */
  function Notification(element, options) {
    _classCallCheck(this, Notification);

    var _this = _possibleConstructorReturn(this, (Notification.__proto__ || Object.getPrototypeOf(Notification)).call(this, element, options));

    _this._changeState = function (state, callback) {
      if (state === 'delete-notification') {
        _this.element.parentNode.removeChild(_this.element);
        _this.release();
      }
      callback();
    };

    _this.button = element.querySelector(_this.options.selectorButton);
    if (_this.button) {
      _this.manage(on(_this.button, 'click', function (evt) {
        if (evt.currentTarget === _this.button) {
          _this.remove();
        }
      }));
    }
    return _this;
  }

  _createClass(Notification, [{
    key: 'remove',
    value: function remove() {
      this.changeState('delete-notification');
    }

    /**
     * The map associating DOM element and accordion UI instance.
     * @type {WeakMap}
     */


    /**
     * The component options.
     * @property {string} selectorInit The CSS selector to find InlineNotification.
     * @property {string} selectorButton The CSS selector to find close button.
     */

  }]);

  return Notification;
}(mixin(createComponent, initComponentBySearch, eventedState, handles));

Notification.components = new WeakMap();
Notification.options = {
  selectorInit: '[data-notification]',
  selectorButton: '[data-notification-btn]',
  eventBeforeDeleteNotification: 'notification-before-delete',
  eventAfterDeleteNotification: 'notification-after-delete'
};


export default Notification;