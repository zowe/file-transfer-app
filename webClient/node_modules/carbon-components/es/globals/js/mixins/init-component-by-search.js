var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export default function (ToMix) {
  /**
   * Mix-in class to instantiate components by searching for their root elements.
   * @class InitComponentBySearch
   */
  var InitComponentBySearch = function (_ToMix) {
    _inherits(InitComponentBySearch, _ToMix);

    function InitComponentBySearch() {
      _classCallCheck(this, InitComponentBySearch);

      return _possibleConstructorReturn(this, (InitComponentBySearch.__proto__ || Object.getPrototypeOf(InitComponentBySearch)).apply(this, arguments));
    }

    _createClass(InitComponentBySearch, null, [{
      key: 'init',

      /**
       * Instantiates component in the given node.
       * If the given element indicates that it's an component of this class, instantiates it.
       * Otherwise, instantiates components by searching for components in the given node.
       * @param {Node} target The DOM node to instantiate components in. Should be a document or an element.
       * @param {Object} [options] The component options.
       * @param {boolean} [options.selectorInit] The CSS selector to find components.
       */
      value: function init() {
        var _this2 = this;

        var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var effectiveOptions = Object.assign(Object.create(this.options), options);
        if (!target || target.nodeType !== Node.ELEMENT_NODE && target.nodeType !== Node.DOCUMENT_NODE) {
          throw new TypeError('DOM document or DOM element should be given to search for and initialize this widget.');
        }
        if (target.nodeType === Node.ELEMENT_NODE && target.matches(effectiveOptions.selectorInit)) {
          this.create(target, options);
        } else {
          [].concat(_toConsumableArray(target.querySelectorAll(effectiveOptions.selectorInit))).forEach(function (element) {
            return _this2.create(element, options);
          });
        }
      }
    }]);

    return InitComponentBySearch;
  }(ToMix);

  return InitComponentBySearch;
}