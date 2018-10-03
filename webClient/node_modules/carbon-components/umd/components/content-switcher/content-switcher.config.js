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
    global.contentSwitcherConfig = mod.exports;
  }
})(this, function (module) {
  'use strict';

  var items = [{
    label: 'First section',
    target: '.demo--panel--opt-1',
    selected: true
  }, {
    label: 'Second section',
    target: '.demo--panel--opt-2'
  }, {
    label: 'Third section',
    target: '.demo--panel--opt-3'
  }];

  module.exports = {
    variants: [{
      name: 'default',
      label: 'Content Switcher',
      notes: '\n        The Content Switcher component manipulates the content shown following an exclusive or \u201Ceither/or\u201D pattern.\n        Create Switch components for each section in the content switcher.\n      ',
      context: {
        items: items
      }
    }, {
      name: 'with-icon',
      label: 'With icon',
      context: {
        hasIcon: true,
        items: items
      }
    }]
  };
});