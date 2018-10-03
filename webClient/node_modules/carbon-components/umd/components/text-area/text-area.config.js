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
    global.textAreaConfig = mod.exports;
  }
})(this, function (module) {
  'use strict';

  module.exports = {
    variants: [{
      name: 'default',
      label: 'Text Area',
      notes: '\n        Text areas enable the user to interact with and input data. A text area is used when you\n        anticipate the user to input more than 1 sentence.\n      '
    }, {
      name: 'light',
      label: 'Light',
      context: {
        light: true
      }
    }]
  };
});