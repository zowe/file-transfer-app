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
    global.skeletonConfig = mod.exports;
  }
})(this, function (module) {
  'use strict';

  var tabItems = [{}, {}, {
    selected: true
  }];

  module.exports = {
    variants: [{
      name: 'default',
      label: 'Skeleton',
      context: {
        breadCrumbItems: new Array(3),
        progressIndicatorSteps: new Array(4),
        tabItems: tabItems
      }
    }]
  };
});