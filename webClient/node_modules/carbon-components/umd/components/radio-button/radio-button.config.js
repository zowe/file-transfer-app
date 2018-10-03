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
    global.radioButtonConfig = mod.exports;
  }
})(this, function (module) {
  'use strict';

  var items = [{
    id: 'radio-button-1',
    value: 'red',
    label: 'Radio Button label'
  }, {
    id: 'radio-button-2',
    value: 'green',
    label: 'Radio Button label'
  }, {
    id: 'radio-button-3',
    value: 'blue',
    label: 'Radio Button label',
    disabled: true
  }];

  module.exports = {
    variants: [{
      name: 'default',
      label: 'Progress Indicator',
      context: {
        selectedValue: 'red',
        group: 'radio-button',
        items: items
      }
    }]
  };
});