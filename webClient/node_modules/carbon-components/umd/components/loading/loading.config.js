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
    global.loadingConfig = mod.exports;
  }
})(this, function (module) {
  'use strict';

  module.exports = {
    variants: [{
      name: 'default',
      label: 'Loading',
      notes: '\n        Loading spinners are used when retrieving data or performing slow computations,\n        and help to notify users that loading is underway.\n      ',
      context: {
        overlay: true
      }
    }, {
      name: 'without-overlay',
      label: 'Without overlay',
      context: {
        overlay: false
      }
    }, {
      name: 'small',
      label: 'Small',
      context: {
        overlay: false,
        small: true
      }
    }]
  };
});