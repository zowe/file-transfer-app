(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../../globals/js/settings', '../../globals/js/misc/mixin', '../../globals/js/mixins/create-component', '../../globals/js/mixins/init-component-by-search', '../../globals/js/mixins/handles', '../../globals/js/misc/event-matches', '../../globals/js/misc/on'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../../globals/js/settings'), require('../../globals/js/misc/mixin'), require('../../globals/js/mixins/create-component'), require('../../globals/js/mixins/init-component-by-search'), require('../../globals/js/mixins/handles'), require('../../globals/js/misc/event-matches'), require('../../globals/js/misc/on'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.settings, global.mixin, global.createComponent, global.initComponentBySearch, global.handles, global.eventMatches, global.on);
    global.toolbar = mod.exports;
  }
})(this, function (exports, _settings, _mixin2, _createComponent, _initComponentBySearch, _handles, _eventMatches, _on) {
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

  var Toolbar = function (_mixin) {
    _inherits(Toolbar, _mixin);

    /**
     * Toolbar.
     * @extends CreateComponent
     * @extends InitComponentBySearch
     * @extends Handles
     * @param {HTMLElement} element The element working as an toolbar.
     */
    function Toolbar(element, options) {
      _classCallCheck(this, Toolbar);

      var _this = _possibleConstructorReturn(this, (Toolbar.__proto__ || Object.getPrototypeOf(Toolbar)).call(this, element, options));

      if (!_this.element.dataset.tableTarget) {
        console.warn('There is no table bound to this toolbar!'); // eslint-disable-line no-console
      } else {
        var boundTable = _this.element.ownerDocument.querySelector(_this.element.dataset.tableTarget);
        var rowHeightBtns = _this.element.querySelector(_this.options.selectorRowHeight);
        if (rowHeightBtns) {
          _this.manage((0, _on2.default)(rowHeightBtns, 'click', function (event) {
            _this._handleRowHeightChange(event, boundTable);
          }));
          // [...this.element.querySelectorAll(this.options.selectorRowHeight)].forEach((item) => {
          //   item.addEventListener('click', (event) => { this._handleRowHeightChange(event, boundTable); });
          // });
        }
      }

      _this.manage((0, _on2.default)(_this.element.ownerDocument, 'keydown', function (evt) {
        _this._handleKeyDown(evt);
      }));
      _this.manage((0, _on2.default)(_this.element.ownerDocument, 'click', function (evt) {
        _this._handleDocumentClick(evt);
      }));
      return _this;
    }

    /**
     * Handles toggling of active state of the toolbar search input
     * @param {Event} event The event triggering this method.
     */


    _createClass(Toolbar, [{
      key: '_handleDocumentClick',
      value: function _handleDocumentClick(event) {
        var _this2 = this;

        var searchInput = (0, _eventMatches2.default)(event, this.options.selectorSearch);
        var isOfSelfSearchInput = searchInput && this.element.contains(searchInput);

        if (isOfSelfSearchInput) {
          var shouldBeOpen = isOfSelfSearchInput && !this.element.classList.contains(this.options.classSearchActive);
          searchInput.classList.toggle(this.options.classSearchActive, shouldBeOpen);
          if (shouldBeOpen) {
            searchInput.querySelector('input').focus();
          }
        }

        var targetComponentElement = (0, _eventMatches2.default)(event, this.options.selectorInit);
        [].concat(_toConsumableArray(this.element.ownerDocument.querySelectorAll(this.options.selectorSearch))).forEach(function (item) {
          if (!targetComponentElement || !targetComponentElement.contains(item)) {
            item.classList.remove(_this2.options.classSearchActive);
          }
        });
      }
    }, {
      key: '_handleKeyDown',
      value: function _handleKeyDown(event) {
        var searchInput = (0, _eventMatches2.default)(event, this.options.selectorSearch);
        var isOfSelf = this.element.contains(event.target);
        var shouldBeOpen = isOfSelf && !this.element.classList.contains(this.options.classSearchActive);

        if (searchInput) {
          if ((event.which === 13 || event.which === 32) && !shouldBeOpen) {
            searchInput.classList.add(this.options.classSearchActive);
          }

          if (event.which === 27) {
            searchInput.classList.remove(this.options.classSearchActive);
          }
        }
      }
    }, {
      key: '_handleRowHeightChange',
      value: function _handleRowHeightChange(event, boundTable) {
        var value = event.currentTarget.querySelector('input:checked').value;

        if (value === 'tall') {
          boundTable.classList.add(this.options.classTallRows);
        } else {
          boundTable.classList.remove(this.options.classTallRows);
        }
      }
    }], [{
      key: 'options',
      get: function get() {
        var prefix = _settings2.default.prefix;

        return {
          selectorInit: '[data-toolbar]',
          selectorSearch: '[data-toolbar-search]',
          selectorRowHeight: '[data-row-height]',
          classTallRows: prefix + '--responsive-table--tall',
          classSearchActive: prefix + '--toolbar-search--active'
        };
      }
    }]);

    return Toolbar;
  }((0, _mixin3.default)(_createComponent2.default, _initComponentBySearch2.default, _handles2.default));

  Toolbar.components = new WeakMap();
  exports.default = Toolbar;
});