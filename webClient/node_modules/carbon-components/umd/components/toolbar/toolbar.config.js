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
    global.toolbarConfig = mod.exports;
  }
})(this, function (module) {
  'use strict';

  var filterOptions = [{
    id: 'filter-option-1',
    value: 'filter-option-1',
    label: 'Filter option 1'
  }, {
    id: 'filter-option-2',
    value: 'filter-option-2',
    label: 'Filter option 2'
  }, {
    id: 'filter-option-3',
    value: 'filter-option-3',
    label: 'Filter option 3'
  }];

  var rowHeightOptions = [{
    id: 'short-rows',
    value: 'short',
    label: 'Short',
    selected: true
  }, {
    id: 'tall-rows',
    value: 'tall',
    label: 'Tall'
  }];

  module.exports = {
    variants: [{
      name: 'default',
      label: 'Toolbar',
      context: {
        filterOptions: filterOptions,
        rowHeightOptions: rowHeightOptions
      }
    }]
  };
});