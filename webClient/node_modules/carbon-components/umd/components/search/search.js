(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../../globals/js/settings', '../../globals/js/misc/mixin', '../../globals/js/mixins/create-component', '../../globals/js/mixins/init-component-by-search', '../../globals/js/mixins/handles', '../../globals/js/misc/event-matches', '../../globals/js/misc/on', '../../globals/js/misc/svg-toggle-class'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../../globals/js/settings'), require('../../globals/js/misc/mixin'), require('../../globals/js/mixins/create-component'), require('../../globals/js/mixins/init-component-by-search'), require('../../globals/js/mixins/handles'), require('../../globals/js/misc/event-matches'), require('../../globals/js/misc/on'), require('../../globals/js/misc/svg-toggle-class'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.settings, global.mixin, global.createComponent, global.initComponentBySearch, global.handles, global.eventMatches, global.on, global.svgToggleClass);
    global.search = mod.exports;
  }
})(this, function (exports, _settings, _mixin2, _createComponent, _initComponentBySearch, _handles, _eventMatches, _on, _svgToggleClass) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _settings2 = _interopRequireDefault(_settings);

  var _mixin3 = _interopRequireDefault(_mixin2);

  var _createComponent2 = _interopRequireDefault(_createComponent);

  var _initComponentBySearch2 = _interopRequireDefault(_initComponentBySearch);

  var _handles2 = _interopRequireDefault(_handles);

  var _eventMatches2 = _interopRequireDefault(_eventMatches);

  var _on2 = _interopRequireDefault(_on);

  var _svgToggleClass2 = _interopRequireDefault(_svgToggleClass);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
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

  var Search = function (_mixin) {
    _inherits(Search, _mixin);

    /**
     * Search with Options.
     * @extends CreateComponent
     * @extends InitComponentBySearch
     * @extends Handles
     * @param {HTMLElement} element The element working as the search component.
     * @param {Object} [options] The component options
     * @property {string} [options.selectorInit]
     *   The selector to find search UIs with options.
     * @property {string} [options.selectorSearchView]
     *   The selector to find the search view icon containers.
     * @property {string} [options.selectorSearchInput]
     *   The selector to find the search input.
     * @property {string} [options.selectorClearIcon]
     *   The selector for the clear icon that clears the search box.
     * @property {string} [options.selectorIconContainer] The data attribute selector for the icon layout container.
     * @property {string} [options.classClearHidden] The class used to hide the clear icon.
     * @property {string} [options.classLayoutHidden] The class used to hide nonselected layout view.
     */
    function Search(element, options) {
      _classCallCheck(this, Search);

      var _this = _possibleConstructorReturn(this, (Search.__proto__ || Object.getPrototypeOf(Search)).call(this, element, options));

      var closeIcon = _this.element.querySelector(_this.options.selectorClearIcon);
      var input = _this.element.querySelector(_this.options.selectorSearchInput);
      if (!input) {
        throw new Error('Cannot find the search input.');
      }

      if (closeIcon) {
        _this.manage((0, _on2.default)(closeIcon, 'click', function () {
          (0, _svgToggleClass2.default)(closeIcon, _this.options.classClearHidden, true);
          input.value = '';
          input.focus();
        }));
      }

      _this.manage((0, _on2.default)(_this.element, 'click', function (evt) {
        var toggleItem = (0, _eventMatches2.default)(evt, _this.options.selectorIconContainer);
        if (toggleItem) _this.toggleLayout(toggleItem);
      }));

      _this.manage((0, _on2.default)(input, 'input', function (evt) {
        if (closeIcon) _this.showClear(evt.target.value, closeIcon);
      }));
      return _this;
    }

    /**
     * Toggles between the grid and list layout.
     * @param {HTMLElement} element The element contining the layout toggle.
     */


    _createClass(Search, [{
      key: 'toggleLayout',
      value: function toggleLayout(element) {
        var _this2 = this;

        [].concat(_toConsumableArray(element.querySelectorAll(this.options.selectorSearchView))).forEach(function (item) {
          item.classList.toggle(_this2.options.classLayoutHidden);
        });
      }
    }, {
      key: 'showClear',
      value: function showClear(value, icon) {
        (0, _svgToggleClass2.default)(icon, this.options.classClearHidden, value.length === 0);
      }
    }], [{
      key: 'options',
      get: function get() {
        var prefix = _settings2.default.prefix;

        return {
          selectorInit: '[data-search]',
          selectorSearchView: '[data-search-view]',
          selectorSearchInput: '.' + prefix + '--search-input',
          selectorClearIcon: '.' + prefix + '--search-close',
          selectorIconContainer: '.' + prefix + '--search-button[data-search-toggle]',
          classClearHidden: prefix + '--search-close--hidden',
          classLayoutHidden: prefix + '--search-view--hidden'
        };
      }
    }]);

    return Search;
  }((0, _mixin3.default)(_createComponent2.default, _initComponentBySearch2.default, _handles2.default));

  Search.components = new WeakMap();
  exports.default = Search;
});