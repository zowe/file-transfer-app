(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.createComponent = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (ToMix) {
    var CreateComponent = function (_ToMix) {
      _inherits(CreateComponent, _ToMix);

      /**
       * Mix-in class to manage lifecycle of component.
       * The constructor sets up this component's effective options,
       * and registers this component't instance associated to an element.
       * @implements Handle
       * @param {HTMLElement} element The element working as this component.
       * @param {Object} [options] The component options.
       */
      function CreateComponent(element) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, CreateComponent);

        var _this = _possibleConstructorReturn(this, (CreateComponent.__proto__ || Object.getPrototypeOf(CreateComponent)).call(this, element, options));

        _this.children = [];


        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
          throw new TypeError('DOM element should be given to initialize this widget.');
        }

        /**
         * The element the component is of.
         * @type {Element}
         */
        _this.element = element;

        /**
         * The component options.
         * @type {Object}
         */
        _this.options = Object.assign(Object.create(_this.constructor.options), options);

        _this.constructor.components.set(_this.element, _this);
        return _this;
      }

      /**
       * Instantiates this component of the given element.
       * @param {HTMLElement} element The element.
       */

      /**
       * The component instances managed by this component.
       * Releasing this component also releases the components in `this.children`.
       * @type {Component[]}
       */


      _createClass(CreateComponent, [{
        key: 'release',


        /**
         * Releases this component's instance from the associated element.
         */
        value: function release() {
          for (var child = this.children.pop(); child; child = this.children.pop()) {
            child.release();
          }
          this.constructor.components.delete(this.element);
          return null;
        }
      }], [{
        key: 'create',
        value: function create(element, options) {
          return this.components.get(element) || new this(element, options);
        }
      }]);

      return CreateComponent;
    }(ToMix);

    return CreateComponent;
  };

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
});