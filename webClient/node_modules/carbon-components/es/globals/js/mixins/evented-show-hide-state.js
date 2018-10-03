var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import eventedState from './evented-state';
import getLaunchingDetails from '../misc/get-launching-details';

function eventedShowHideState(ToMix) {
  /**
   * Mix-in class to launch a floating menu.
   * @class EventedShowHideState
   */
  var EventedShowHideState = function (_ToMix) {
    _inherits(EventedShowHideState, _ToMix);

    function EventedShowHideState() {
      _classCallCheck(this, EventedShowHideState);

      return _possibleConstructorReturn(this, (EventedShowHideState.__proto__ || Object.getPrototypeOf(EventedShowHideState)).apply(this, arguments));
    }

    _createClass(EventedShowHideState, [{
      key: 'show',

      /**
       */
      /**
       * Switch to 'shown' state.
       * @param [evtOrElem] The launching event or element.
       * @param {EventedState~changeStateCallback} [callback] The callback.
       */
      value: function show(evtOrElem, callback) {
        if (!evtOrElem || typeof evtOrElem === 'function') {
          callback = evtOrElem; // eslint-disable-line no-param-reassign
        }
        this.changeState('shown', getLaunchingDetails(evtOrElem), callback);
      }

      /**
       * Switch to 'hidden' state.
       * @param [evtOrElem] The launching event or element.
       * @param {EventedState~changeStateCallback} [callback] The callback.
       */

    }, {
      key: 'hide',
      value: function hide(evtOrElem, callback) {
        if (!evtOrElem || typeof evtOrElem === 'function') {
          callback = evtOrElem; // eslint-disable-line no-param-reassign
        }
        this.changeState('hidden', getLaunchingDetails(evtOrElem), callback);
      }
    }]);

    return EventedShowHideState;
  }(ToMix);

  return EventedShowHideState;
}

var exports = [eventedState, eventedShowHideState];
export default exports;