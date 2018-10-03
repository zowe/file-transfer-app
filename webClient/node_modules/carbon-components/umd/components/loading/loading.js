(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../../globals/js/settings', '../../globals/js/misc/mixin', '../../globals/js/mixins/create-component', '../../globals/js/mixins/init-component-by-search', '../../globals/js/mixins/handles', '../../globals/js/misc/on'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../../globals/js/settings'), require('../../globals/js/misc/mixin'), require('../../globals/js/mixins/create-component'), require('../../globals/js/mixins/init-component-by-search'), require('../../globals/js/mixins/handles'), require('../../globals/js/misc/on'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.settings, global.mixin, global.createComponent, global.initComponentBySearch, global.handles, global.on);
    global.loading = mod.exports;
  }
})(this, function (exports, _settings, _mixin2, _createComponent, _initComponentBySearch, _handles, _on) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _settings2 = _interopRequireDefault(_settings);

  var _mixin3 = _interopRequireDefault(_mixin2);

  var _createComponent2 = _interopRequireDefault(_createComponent);

  var _initComponentBySearch2 = _interopRequireDefault(_initComponentBySearch);

  var _handles2 = _interopRequireDefault(_handles);

  var _on2 = _interopRequireDefault(_on);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
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

  var Loading = function (_mixin) {
    _inherits(Loading, _mixin);

    /**
     * Spinner indicating loading state.
     * @extends CreateComponent
     * @extends InitComponentBySearch
     * @extends Handles
     * @param {HTMLElement} element The element working as a spinner.
     * @param {Object} [options] The component options.
     * @param {boolean} [options.active] `true` if this spinner should roll.
     */
    function Loading(element, options) {
      _classCallCheck(this, Loading);

      var _this = _possibleConstructorReturn(this, (Loading.__proto__ || Object.getPrototypeOf(Loading)).call(this, element, options));

      _this.active = _this.options.active;

      // Initialize spinner
      _this.set(_this.active);
      return _this;
    }

    /**
     * Sets active/inactive state.
     * @param {boolean} active `true` if this spinner should roll.
     */


    _createClass(Loading, [{
      key: 'set',
      value: function set(active) {
        if (typeof active !== 'boolean') {
          throw new TypeError('set expects a boolean.');
        }

        this.active = active;
        this.element.classList.toggle(this.options.classLoadingStop, !this.active);

        /**
         * If overlay is the parentNode then toggle it too.
         */
        var parentNode = this.element.parentNode;

        if (parentNode && parentNode.classList.contains(this.options.classLoadingOverlay)) {
          parentNode.classList.toggle(this.options.classLoadingOverlayStop, !this.active);
        }

        return this;
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        return this.set(!this.active);
      }
    }, {
      key: 'isActive',
      value: function isActive() {
        return this.active;
      }
    }, {
      key: 'end',
      value: function end() {
        var _this2 = this;

        this.set(false);
        var handleAnimationEnd = this.manage((0, _on2.default)(this.element, 'animationend', function (evt) {
          if (handleAnimationEnd) {
            handleAnimationEnd = _this2.unmanage(handleAnimationEnd).release();
          }
          if (evt.animationName === 'rotate-end-p2') {
            _this2._deleteElement();
          }
        }));
      }
    }, {
      key: '_deleteElement',
      value: function _deleteElement() {
        var parentNode = this.element.parentNode;

        parentNode.removeChild(this.element);

        if (parentNode.classList.contains(this.options.selectorLoadingOverlay)) {
          parentNode.remove();
        }
      }
    }], [{
      key: 'options',
      get: function get() {
        var prefix = _settings2.default.prefix;

        return {
          selectorInit: '[data-loading]',
          selectorLoadingOverlay: '.' + prefix + '--loading-overlay',
          classLoadingOverlay: prefix + '--loading-overlay',
          classLoadingStop: prefix + '--loading--stop',
          classLoadingOverlayStop: prefix + '--loading-overlay--stop',
          active: true
        };
      }
    }]);

    return Loading;
  }((0, _mixin3.default)(_createComponent2.default, _initComponentBySearch2.default, _handles2.default));

  Loading.components = new WeakMap();
  exports.default = Loading;
});