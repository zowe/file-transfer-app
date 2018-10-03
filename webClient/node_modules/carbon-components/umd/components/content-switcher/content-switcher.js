(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../../globals/js/settings', '../../globals/js/misc/mixin', '../../globals/js/mixins/create-component', '../../globals/js/mixins/init-component-by-search', '../../globals/js/mixins/evented-state', '../../globals/js/mixins/handles', '../../globals/js/misc/event-matches', '../../globals/js/misc/on'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../../globals/js/settings'), require('../../globals/js/misc/mixin'), require('../../globals/js/mixins/create-component'), require('../../globals/js/mixins/init-component-by-search'), require('../../globals/js/mixins/evented-state'), require('../../globals/js/mixins/handles'), require('../../globals/js/misc/event-matches'), require('../../globals/js/misc/on'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.settings, global.mixin, global.createComponent, global.initComponentBySearch, global.eventedState, global.handles, global.eventMatches, global.on);
    global.contentSwitcher = mod.exports;
  }
})(this, function (exports, _settings, _mixin2, _createComponent, _initComponentBySearch, _eventedState, _handles, _eventMatches, _on) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _settings2 = _interopRequireDefault(_settings);

  var _mixin3 = _interopRequireDefault(_mixin2);

  var _createComponent2 = _interopRequireDefault(_createComponent);

  var _initComponentBySearch2 = _interopRequireDefault(_initComponentBySearch);

  var _eventedState2 = _interopRequireDefault(_eventedState);

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

  var ContentSwitcher = function (_mixin) {
    _inherits(ContentSwitcher, _mixin);

    /**
     * Set of content switcher buttons.
     * @extends CreateComponent
     * @extends InitComponentBySearch
     * @extends EventedState
     * @extends Handles
     * @param {HTMLElement} element The element working as a set of content switcher buttons.
     * @param {Object} [options] The component options.
     * @param {string} [options.selectorButton] The CSS selector to find switcher buttons.
     * @param {string} [options.selectorButtonSelected] The CSS selector to find the selected switcher button.
     * @param {string} [options.classActive] The CSS class for switcher button's selected state.
     * @param {string} [options.eventBeforeSelected]
     *   The name of the custom event fired before a switcher button is selected.
     *   Cancellation of this event stops selection of content switcher button.
     * @param {string} [options.eventAfterSelected] The name of the custom event fired after a switcher button is selected.
     */
    function ContentSwitcher(element, options) {
      _classCallCheck(this, ContentSwitcher);

      var _this = _possibleConstructorReturn(this, (ContentSwitcher.__proto__ || Object.getPrototypeOf(ContentSwitcher)).call(this, element, options));

      _this.manage((0, _on2.default)(_this.element, 'click', function (event) {
        _this._handleClick(event);
      }));
      return _this;
    }

    /**
     * Handles click on content switcher button set.
     * If the click is on a content switcher button, activates it.
     * @param {Event} event The event triggering this method.
     */


    _createClass(ContentSwitcher, [{
      key: '_handleClick',
      value: function _handleClick(event) {
        var button = (0, _eventMatches2.default)(event, this.options.selectorButton);

        if (button) {
          this.changeState({
            group: 'selected',
            item: button,
            launchingEvent: event
          });
        }
      }
    }, {
      key: '_changeState',
      value: function _changeState(detail, callback) {
        var _this2 = this;

        var item = detail.item;
        // `options.selectorLink` is not defined in this class itself, code here primary is for inherited classes
        var itemLink = item.querySelector(this.options.selectorLink);
        if (itemLink) {
          [].concat(_toConsumableArray(this.element.querySelectorAll(this.options.selectorLink))).forEach(function (link) {
            if (link !== itemLink) {
              link.setAttribute('aria-selected', 'false');
            }
          });
          itemLink.setAttribute('aria-selected', 'true');
        }

        var selectorButtons = [].concat(_toConsumableArray(this.element.querySelectorAll(this.options.selectorButton)));

        selectorButtons.forEach(function (button) {
          if (button !== item) {
            button.setAttribute('aria-selected', false);
            button.classList.toggle(_this2.options.classActive, false);
            [].concat(_toConsumableArray(button.ownerDocument.querySelectorAll(button.dataset.target))).forEach(function (element) {
              element.setAttribute('hidden', '');
              element.setAttribute('aria-hidden', 'true');
            });
          }
        });

        item.classList.toggle(this.options.classActive, true);
        item.setAttribute('aria-selected', true);
        [].concat(_toConsumableArray(item.ownerDocument.querySelectorAll(item.dataset.target))).forEach(function (element) {
          element.removeAttribute('hidden');
          element.setAttribute('aria-hidden', 'false');
        });

        if (callback) {
          callback();
        }
      }
    }, {
      key: 'setActive',
      value: function setActive(item, callback) {
        this.changeState({
          group: 'selected',
          item: item
        }, function (error) {
          if (error) {
            if (callback) {
              callback(Object.assign(error, { item: item }));
            }
          } else if (callback) {
            callback(null, item);
          }
        });
      }
    }], [{
      key: 'options',
      get: function get() {
        var prefix = _settings2.default.prefix;

        return {
          selectorInit: '[data-content-switcher]',
          selectorButton: 'input[type="radio"], .' + prefix + '--content-switcher-btn',
          classActive: prefix + '--content-switcher--selected',
          eventBeforeSelected: 'content-switcher-beingselected',
          eventAfterSelected: 'content-switcher-selected'
        };
      }
    }]);

    return ContentSwitcher;
  }((0, _mixin3.default)(_createComponent2.default, _initComponentBySearch2.default, _eventedState2.default, _handles2.default));

  ContentSwitcher.components = new WeakMap();
  exports.default = ContentSwitcher;
});