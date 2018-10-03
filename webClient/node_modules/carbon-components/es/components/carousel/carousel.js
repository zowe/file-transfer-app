var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';

var Carousel = function (_mixin) {
  _inherits(Carousel, _mixin);

  /**
   * Carousel.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @param {HTMLElement} element The element working as an carousel.
   */
  function Carousel(element, options) {
    _classCallCheck(this, Carousel);

    var _this = _possibleConstructorReturn(this, (Carousel.__proto__ || Object.getPrototypeOf(Carousel)).call(this, element, options));

    _this.handleClick = function (evt) {
      if (evt.target.matches(_this.options.selectorScrollRight)) {
        _this.sideScroll('right');
      } else {
        _this.sideScroll('left');
      }
    };

    _this.sideScroll = function (direction) {
      var filmstripWidth = _this.filmstrip.getBoundingClientRect().width;
      var itemWidth = _this.carouselItem.getBoundingClientRect().width + 20;
      var re = /\.*translateX\((.*)px\)/i;

      var translateXValue = _this.filmstrip.style.transform ? Number(_this.filmstrip.style.transform.split(re)[1]) : 0;
      var directionValue = direction === 'right' ? -1 : 1;

      var itemWidthDirection = itemWidth * directionValue;
      var newTranslateValue = itemWidthDirection + translateXValue;
      if (newTranslateValue > 0) {
        newTranslateValue = 0;
      }
      if (newTranslateValue < filmstripWidth * -1) {
        newTranslateValue = filmstripWidth * -1;
      }
      _this.filmstrip.style.transform = 'translateX(' + newTranslateValue + 'px)';
    };

    _this.filmstrip = _this.element.querySelector(_this.options.selectorFilmstrip);
    _this.carouselItem = _this.element.querySelector(_this.options.selectorCarouselItem);

    _this.element.addEventListener('click', function (evt) {
      return _this.handleClick(evt);
    });
    return _this;
  }

  _createClass(Carousel, null, [{
    key: 'options',
    get: function get() {
      var prefix = settings.prefix;

      return {
        selectorInit: '[data-carousel]',
        selectorFilmstrip: '.' + prefix + '--filmstrip',
        selectorScrollRight: '[data-scroll-right]',
        selectorScrollLeft: '[data-scroll-left]',
        selectorCarouselBtn: '.' + prefix + '--carousel__btn',
        selectorCarouselItem: '.' + prefix + '--carousel__item'
      };
    }

    /**
     * The map associating DOM element and accordion UI instance.
     * @type {WeakMap}
     */

  }]);

  return Carousel;
}(mixin(createComponent, initComponentBySearch));

Carousel.components = new WeakMap();


export default Carousel;