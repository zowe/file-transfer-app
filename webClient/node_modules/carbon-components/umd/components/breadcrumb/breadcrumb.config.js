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
    global.breadcrumbConfig = mod.exports;
  }
})(this, function (module) {
  'use strict';

  module.exports = {
    variants: [{
      name: 'default',
      label: 'Breadcrumb',
      notes: 'Breadcrumb enables users to quickly see their location within a path of navigation and move up to a parent level if desired.',
      context: {
        items: [{
          label: 'Breadcrumb 1'
        }, {
          label: 'Breadcrumb 2'
        }, {
          label: 'Breadcrumb 3'
        }]
      }
    }]
  };
});