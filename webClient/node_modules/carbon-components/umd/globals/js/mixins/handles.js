(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.handles = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (ToMix) {
    /**
     * Mix-in class to manage handles in component.
     * Managed handles are automatically released when the component with this class mixed in is released.
     * @class Handles
     * @implements Handle
     */
    var Handles = function (_ToMix) {
      _inherits(Handles, _ToMix);

      function Handles() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Handles);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Handles.__proto__ || Object.getPrototypeOf(Handles)).call.apply(_ref, [this].concat(args))), _this), _this.handles = new Set(), _temp), _possibleConstructorReturn(_this, _ret);
      }
      /**
       * The handled managed by this component.
       * Releasing this component releases the handles.
       * @type {Set<Handle>}
       */


      _createClass(Handles, [{
        key: "manage",


        /**
         * Manages the given handle.
         * @param {Handle} handle The handle to manage.
         * @returns {Handle} The given handle.
         */
        value: function manage(handle) {
          this.handles.add(handle);
          return handle;
        }

        /**
         * Stop managing the given handle.
         * @param {Handle} handle The handle to stop managing.
         * @returns {Handle} The given handle.
         */

      }, {
        key: "unmanage",
        value: function unmanage(handle) {
          this.handles.delete(handle);
          return handle;
        }
      }, {
        key: "release",
        value: function release() {
          var _this2 = this;

          this.handles.forEach(function (handle) {
            handle.release();
            _this2.handles.delete(handle);
          });
          return _get(Handles.prototype.__proto__ || Object.getPrototypeOf(Handles.prototype), "release", this).call(this);
        }
      }]);

      return Handles;
    }(ToMix);

    return Handles;
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

  var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

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