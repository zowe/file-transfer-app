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
    global.searchConfig = mod.exports;
  }
})(this, function (module) {
  'use strict';

  module.exports = {
    default: 'large',
    variants: [{
      name: 'large',
      label: 'Normal search',
      notes: '\n        Search enables users to specify a word or a phrase to find particular relevant pieces of content\n        without the use of navigation. Search can be used as the primary means of discovering content,\n        or as a filter to aid the user in finding content.\n      ',
      context: {
        suffix: 'lg'
      }
    }, {
      name: 'small',
      label: 'Small search',
      notes: '\n        Search enables users to specify a word or a phrase to find particular relevant pieces of content\n        without the use of navigation. Search can be used as the primary means of discovering content,\n        or as a filter to aid the user in finding content. With the small version, the search field will be\n        more compact.\n      ',
      context: {
        suffix: 'sm'
      }
    }, {
      name: 'large-light',
      label: 'Normal search (Light)',
      notes: '\n        Search enables users to specify a word or a phrase to find particular relevant pieces of content\n        without the use of navigation. Search can be used as the primary means of discovering content,\n        or as a filter to aid the user in finding content.\n      ',
      context: {
        suffix: 'lg',
        light: true
      }
    }, {
      name: 'small-light',
      label: 'Small search (Light)',
      notes: '\n        Search enables users to specify a word or a phrase to find particular relevant pieces of content\n        without the use of navigation. Search can be used as the primary means of discovering content,\n        or as a filter to aid the user in finding content. With the small version, the search field will be\n        more compact.\n      ',
      context: {
        suffix: 'sm',
        light: true
      }
    }]
  };
});