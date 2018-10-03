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
    global.footerConfig = mod.exports;
  }
})(this, function (module) {
  'use strict';

  var items = [{
    title: 'Need Help?',
    label: 'Contact Bluemix Sales'
  }, {
    title: 'Estimate Monthly Cost',
    label: 'Cost Calculator'
  }];

  module.exports = {
    variants: [{
      name: 'default',
      label: 'Footer',
      notes: '\n        Footer is used on configuration screens.\n      ',
      context: {
        items: items
      }
    }]
  };
});