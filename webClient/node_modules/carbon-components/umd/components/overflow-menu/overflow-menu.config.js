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
    global.overflowMenuConfig = mod.exports;
  }
})(this, function (module) {
  'use strict';

  var items = [{
    title: 'An example option that is really long to show what should be done to handle long text',
    label: 'An example option that is really long to show what should be done to handle long text',
    primaryFocus: true
  }, {
    label: 'Option 2'
  }, {
    label: 'Option 3'
  }, {
    label: 'Option 4'
  }, {
    label: 'Disabled',
    disabled: true
  }, {
    label: 'Danger option',
    danger: true
  }];

  module.exports = {
    variants: [{
      name: 'default',
      label: 'Overflow Menu',
      notes: '\n        Overflow Menu is used when additional options are available to the user and there is a space constraint.\n        Create Overflow Menu Item components for each option on the menu.\n      ',
      context: {
        direction: 'bottom',
        items: items
      }
    }, {
      name: 'up',
      label: 'Up',
      context: {
        direction: 'top',
        items: items
      }
    }]
  };
});