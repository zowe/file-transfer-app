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
    global.sliderConfig = mod.exports;
  }
})(this, function (module) {
  'use strict';

  module.exports = {
    variants: [{
      name: 'default',
      label: 'Slider',
      notes: '\n        A slider enables the user to specify a numeric value which must be no less than a given value, \n        and no more than another given value. \n      ',
      context: {
        inputId: 'slider-input-box'
      }
    }, {
      name: 'light',
      label: 'Light',
      context: {
        light: true,
        inputId: 'slider-input-box-light'
      }
    }]
  };
});