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
    global.textInputConfig = mod.exports;
  }
})(this, function (module) {
  'use strict';

  module.exports = {
    variants: [{
      name: 'default',
      label: 'Text Input',
      notes: '\n        Text fields enable the user to interact with and input data. A single line\n        field is used when the input anticipated by the user is a single line of\n        text as opposed to a paragraph.\n      '
    }, {
      name: 'light',
      label: 'Text Input (Light)',
      context: {
        light: true
      }
    }, {
      name: 'password',
      label: 'Password Input',
      context: {
        password: true
      }
    }, {
      name: 'password--light',
      label: 'Password Input (Light)',
      context: {
        light: true,
        password: true
      }
    }]
  };
});