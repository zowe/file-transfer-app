(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../../globals/js/misc/mixin', '../../globals/js/mixins/create-component', '../../globals/js/mixins/init-component-by-event', '../../globals/js/mixins/handles', '../../globals/js/misc/on'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../../globals/js/misc/mixin'), require('../../globals/js/mixins/create-component'), require('../../globals/js/mixins/init-component-by-event'), require('../../globals/js/mixins/handles'), require('../../globals/js/misc/on'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.mixin, global.createComponent, global.initComponentByEvent, global.handles, global.on);
    global.fab = mod.exports;
  }
})(this, function (exports, _mixin2, _createComponent, _initComponentByEvent, _handles, _on) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _mixin3 = _interopRequireDefault(_mixin2);

  var _createComponent2 = _interopRequireDefault(_createComponent);

  var _initComponentByEvent2 = _interopRequireDefault(_initComponentByEvent);

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

  var FabButton = function (_mixin) {
    _inherits(FabButton, _mixin);

    /**
     * Floating action button.
     * @extends CreateComponent
     * @extends InitComponentByEvent
     * @extends Handles
     * @param {HTMLElement} element The element working as a floting action button.
     */
    function FabButton(element) {
      _classCallCheck(this, FabButton);

      var _this = _possibleConstructorReturn(this, (FabButton.__proto__ || Object.getPrototypeOf(FabButton)).call(this, element));

      _this.manage((0, _on2.default)(element, 'click', function (event) {
        _this.toggle(event);
      }));
      return _this;
    }

    /**
     * A method called when this widget is created upon clicking.
     * @param {Event} event The event triggering the creation.
     */


    _createClass(FabButton, [{
      key: 'createdByEvent',
      value: function createdByEvent(event) {
        this.toggle(event);
      }
    }, {
      key: 'toggle',
      value: function toggle(event) {
        if (this.element.tagName === 'A') {
          event.preventDefault();
        }

        if (this.element.dataset.state === 'closed') {
          this.element.dataset.state = 'open';
        } else {
          this.element.dataset.state = 'closed';
        }
      }
    }], [{
      key: 'create',
      value: function create(element) {
        return this.components.get(element) || new this(element);
      }
    }]);

    return FabButton;
  }((0, _mixin3.default)(_createComponent2.default, _initComponentByEvent2.default, _handles2.default));

  FabButton.components = new WeakMap();
  FabButton.options = {
    selectorInit: '[data-fab]',
    initEventNames: ['click']
  };
  exports.default = FabButton;
});