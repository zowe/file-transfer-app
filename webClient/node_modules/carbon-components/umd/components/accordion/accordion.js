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
    global.accordion = mod.exports;
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

  var Accordion = function (_mixin) {
    _inherits(Accordion, _mixin);

    /**
     * Accordion.
     * @extends CreateComponent
     * @extends InitComponentBySearch
     * @extends Handles
     * @param {HTMLElement} element The element working as an accordion.
     */
    function Accordion(element, options) {
      _classCallCheck(this, Accordion);

      var _this = _possibleConstructorReturn(this, (Accordion.__proto__ || Object.getPrototypeOf(Accordion)).call(this, element, options));

      _this.manage((0, _on2.default)(_this.element, 'click', function (event) {
        var item = (0, _eventMatches2.default)(event, _this.options.selectorAccordionItem);
        if (item && !(0, _eventMatches2.default)(event, _this.options.selectorAccordionContent)) {
          _this._toggle(item);
        }
      }));

      /**
       *
       *  DEPRECATE in v8
       *
       *  Swapping to a button elemenet instead of a div
       *  automatically maps click events to keypress as well
       *  This event listener now is only added if user is using
       *  the older markup
       */

      if (!_this._checkIfButton()) {
        _this.manage((0, _on2.default)(_this.element, 'keypress', function (event) {
          var item = (0, _eventMatches2.default)(event, _this.options.selectorAccordionItem);

          if (item && !(0, _eventMatches2.default)(event, _this.options.selectorAccordionContent)) {
            _this._handleKeypress(event);
          }
        }));
      }
      return _this;
    }

    _createClass(Accordion, [{
      key: '_checkIfButton',
      value: function _checkIfButton() {
        return this.element.firstElementChild.firstElementChild.nodeName === 'BUTTON';
      }
    }, {
      key: '_handleKeypress',
      value: function _handleKeypress(event) {
        if (event.which === 13 || event.which === 32) {
          this._toggle(event.target);
        }
      }
    }, {
      key: '_toggle',
      value: function _toggle(element) {
        var heading = element.querySelector(this.options.selectorAccordionItemHeading);
        var expanded = heading.getAttribute('aria-expanded');

        if (expanded !== null) {
          heading.setAttribute('aria-expanded', expanded === 'true' ? 'false' : 'true');
        }

        element.classList.toggle(this.options.classActive);
      }
    }], [{
      key: 'options',
      get: function get() {
        var prefix = _settings2.default.prefix;

        return {
          selectorInit: '[data-accordion]',
          selectorAccordionItem: '.' + prefix + '--accordion__item',
          selectorAccordionItemHeading: '.' + prefix + '--accordion__heading',
          selectorAccordionContent: '.' + prefix + '--accordion__content',
          classActive: prefix + '--accordion__item--active'
        };
      }
    }]);

    return Accordion;
  }((0, _mixin3.default)(_createComponent2.default, _initComponentBySearch2.default, _handles2.default));

  Accordion.components = new WeakMap();
  exports.default = Accordion;
});