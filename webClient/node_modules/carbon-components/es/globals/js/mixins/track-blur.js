var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import on from '../misc/on';
import handles from './handles';

function trackBlur(ToMix) {
  var TrackBlur = function (_ToMix) {
    _inherits(TrackBlur, _ToMix);

    /**
     * Mix-in class to add an handler for losing focus.
     * @extends Handles
     * @param {HTMLElement} element The element working as this component.
     * @param {Object} [options] The component options.
     */
    function TrackBlur(element, options) {
      _classCallCheck(this, TrackBlur);

      var _this = _possibleConstructorReturn(this, (TrackBlur.__proto__ || Object.getPrototypeOf(TrackBlur)).call(this, element, options));

      var hasFocusin = 'onfocusin' in window;
      var focusinEventName = hasFocusin ? 'focusin' : 'focus';
      _this.manage(on(_this.element.ownerDocument, focusinEventName, function (event) {
        if (!_this.element.contains(event.target)) {
          _this.handleBlur(event);
        }
      }, !hasFocusin));
      return _this;
    }

    /**
     * The method called when this component loses focus.
     * @abstract
     */


    _createClass(TrackBlur, [{
      key: 'handleBlur',
      value: function handleBlur() {
        throw new Error('Components inheriting TrackBlur mix-in must implement handleBlur() method.');
      }
    }]);

    return TrackBlur;
  }(ToMix);

  return TrackBlur;
}

var exports = [handles, trackBlur];
export default exports;