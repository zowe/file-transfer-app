(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.listConfig = mod.exports;
  }
})(this, function (module) {
  'use strict';

  module.exports = {
    variants: [{
      name: 'default',
      label: 'Unordered',
      context: {
        tag: 'ul',
        type: 'unordered',
        displayType: 'Unordered'
      }
    }, {
      name: 'ordered',
      label: 'Ordered',
      context: {
        tag: 'ol',
        type: 'ordered',
        displayType: 'Ordered'
      }
    }]
  };
});