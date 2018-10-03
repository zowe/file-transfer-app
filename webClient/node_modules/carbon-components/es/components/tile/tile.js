var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import eventMatches from '../../globals/js/misc/event-matches';

var Tile = function (_mixin) {
  _inherits(Tile, _mixin);

  /**
   * Tile.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @param {HTMLElement} element The element working as an Tile.
   */
  function Tile(element, options) {
    _classCallCheck(this, Tile);

    var _this = _possibleConstructorReturn(this, (Tile.__proto__ || Object.getPrototypeOf(Tile)).call(this, element, options));

    _this._getClass = function (type) {
      var typeObj = {
        expandable: _this.options.classExpandedTile,
        clickable: _this.options.classClickableTile,
        selectable: _this.options.classSelectableTile
      };
      return typeObj[type];
    };

    _this._hookActions = function (tileClass) {
      var isExpandable = _this.tileType === 'expandable';
      if (isExpandable) {
        var aboveTheFold = _this.element.querySelector(_this.options.selectorAboveTheFold);
        var getStyle = _this.element.ownerDocument.defaultView.getComputedStyle(_this.element, null);
        var tilePaddingTop = parseInt(getStyle.getPropertyValue('padding-top'), 10);
        var tilePaddingBottom = parseInt(getStyle.getPropertyValue('padding-bottom'), 10);
        var tilePadding = tilePaddingTop + tilePaddingBottom;
        if (aboveTheFold) {
          _this.tileHeight = _this.element.getBoundingClientRect().height;
          _this.atfHeight = aboveTheFold.getBoundingClientRect().height + tilePadding;
          _this.element.style.maxHeight = _this.atfHeight + 'px';
        }

        if (_this.element.classList.contains(_this.options.classExpandedTile)) {
          _this._setTileHeight();
        }
      }

      _this.element.addEventListener('click', function (evt) {
        var input = eventMatches(evt, _this.options.selectorTileInput);
        if (!input) {
          _this.element.classList.toggle(tileClass);
        }
        if (isExpandable) {
          _this._setTileHeight();
        }
      });
      _this.element.addEventListener('keydown', function (evt) {
        var input = _this.element.querySelector(_this.options.selectorTileInput);
        if (input) {
          if (evt.which === 13 || evt.which === 32) {
            if (!isExpandable) {
              _this.element.classList.toggle(tileClass);
              input.checked = !input.checked;
            }
          }
        }
      });
    };

    _this._setTileHeight = function () {
      var isExpanded = _this.element.classList.contains(_this.options.classExpandedTile);
      _this.element.style.maxHeight = isExpanded ? _this.tileHeight + 'px' : _this.atfHeight + 'px';
    };

    _this.tileType = _this.element.dataset.tile;
    _this.tileHeight = 0; // Tracks expandable tile height
    _this.atfHeight = 0; // Tracks above the fold height
    _this._hookActions(_this._getClass(_this.tileType));
    return _this;
  }

  _createClass(Tile, [{
    key: 'release',
    value: function release() {
      _get(Tile.prototype.__proto__ || Object.getPrototypeOf(Tile.prototype), 'release', this).call(this);
    }

    /**
     * The map associating DOM element and Tile UI instance.
     * @type {WeakMap}
     */

  }], [{
    key: 'options',


    /**
     * The component options.
     * If `options` is specified in the constructor,
     * properties in this object are overriden for the instance being created.
     * @property {string} selectorInit The CSS selector to find Tile instances.
     */
    get: function get() {
      var prefix = settings.prefix;

      return {
        selectorInit: '[data-tile]',
        selectorAboveTheFold: '[data-tile-atf]',
        selectorTileInput: '[data-tile-input]',
        classExpandedTile: prefix + '--tile--is-expanded',
        classClickableTile: prefix + '--tile--is-clicked',
        classSelectableTile: prefix + '--tile--is-selected'
      };
    }
  }]);

  return Tile;
}(mixin(createComponent, initComponentBySearch));

Tile.components = new WeakMap();


export default Tile;