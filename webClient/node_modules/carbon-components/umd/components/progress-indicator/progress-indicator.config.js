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
    global.progressIndicatorConfig = mod.exports;
  }
})(this, function (module) {
  'use strict';

  var steps = [{
    state: 'complete',
    label: 'First step'
  }, {
    state: 'current',
    label: 'Second step'
  }, {
    state: 'incomplete',
    label: 'Third step'
  }, {
    state: 'incomplete',
    label: 'Fourth step'
  }];

  module.exports = {
    variants: [{
      name: 'default',
      label: 'Progress Indicator',
      context: {
        steps: steps
      }
    }]
  };
});