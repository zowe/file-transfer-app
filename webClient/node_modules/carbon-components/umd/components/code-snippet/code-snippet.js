(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../../globals/js/settings', '../../globals/js/misc/mixin', '../../globals/js/mixins/create-component', '../../globals/js/mixins/init-component-by-search', '../../globals/js/mixins/handles'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../../globals/js/settings'), require('../../globals/js/misc/mixin'), require('../../globals/js/mixins/create-component'), require('../../globals/js/mixins/init-component-by-search'), require('../../globals/js/mixins/handles'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.settings, global.mixin, global.createComponent, global.initComponentBySearch, global.handles);
    global.codeSnippet = mod.exports;
  }
})(this, function (exports, _settings, _mixin2, _createComponent, _initComponentBySearch, _handles) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _settings2 = _interopRequireDefault(_settings);

  var _mixin3 = _interopRequireDefault(_mixin2);

  var _createComponent2 = _interopRequireDefault(_createComponent);

  var _initComponentBySearch2 = _interopRequireDefault(_initComponentBySearch);

  var _handles2 = _interopRequireDefault(_handles);

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

  var CodeSnippet = function (_mixin) {
    _inherits(CodeSnippet, _mixin);

    /**
     * CodeSnippet UI.
     * @extends CreateComponent
     * @extends InitComponentBySearch
     * @extends Handles
     * @param {HTMLElement} element The element working as a CodeSnippet UI.
     */

    function CodeSnippet(element, options) {
      _classCallCheck(this, CodeSnippet);

      var _this = _possibleConstructorReturn(this, (CodeSnippet.__proto__ || Object.getPrototypeOf(CodeSnippet)).call(this, element, options));

      _this._initCodeSnippet();
      _this.element.querySelector(_this.options.classExpandBtn).addEventListener('click', function (evt) {
        return _this._handleClick(evt);
      });
      return _this;
    }

    _createClass(CodeSnippet, [{
      key: '_handleClick',
      value: function _handleClick() {
        var expandBtn = this.element.querySelector(this.options.classExpandText);
        this.element.classList.toggle(this.options.classExpanded);

        if (this.element.classList.contains(this.options.classExpanded)) {
          expandBtn.textContent = expandBtn.getAttribute(this.options.attribShowLessText);
        } else {
          expandBtn.textContent = expandBtn.getAttribute(this.options.attribShowMoreText);
        }
      }
    }, {
      key: '_initCodeSnippet',
      value: function _initCodeSnippet() {
        var expandBtn = this.element.querySelector(this.options.classExpandText);
        if (!expandBtn) {
          throw new TypeError('Cannot find the expand button.');
        }

        expandBtn.textContent = expandBtn.getAttribute(this.options.attribShowMoreText);

        if (this.element.offsetHeight < this.options.minHeight) {
          this.element.classList.add(this.options.classHideExpand);
          this.element.classList.add(this.options.classExpanded);
        }
      }
    }], [{
      key: 'options',
      get: function get() {
        var prefix = _settings2.default.prefix;

        return {
          selectorInit: '[data-code-snippet]',
          attribShowMoreText: 'data-show-more-text',
          attribShowLessText: 'data-show-less-text',
          minHeight: 288,
          classExpanded: prefix + '--snippet--expand',
          classExpandBtn: '.' + prefix + '--snippet-btn--expand',
          classExpandText: '.' + prefix + '--snippet-btn--text',
          classHideExpand: prefix + '--snippet-btn--expand--hide'
        };
      }
    }]);

    return CodeSnippet;
  }((0, _mixin3.default)(_createComponent2.default, _initComponentBySearch2.default, _handles2.default));

  CodeSnippet.components = new WeakMap();
  exports.default = CodeSnippet;
});