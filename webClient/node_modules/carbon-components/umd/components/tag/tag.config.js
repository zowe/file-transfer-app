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
    global.tagConfig = mod.exports;
  }
})(this, function (module) {
  'use strict';

  var tags = [{
    type: 'ibm',
    label: 'IBM'
  }, {
    type: 'beta',
    label: 'Beta'
  }, {
    type: 'third-party',
    label: 'Third-Party'
  }, {
    type: 'local',
    label: 'Local'
  }, {
    type: 'dedicated',
    label: 'Dedicated'
  }, {
    type: 'custom',
    label: 'Custom'
  }, {
    type: 'experimental',
    label: 'Experimental'
  }, {
    type: 'community',
    label: 'Community'
  }, {
    type: 'private',
    label: 'Private'
  }];

  module.exports = {
    variants: [{
      name: 'default',
      label: 'Tag',
      context: {
        tags: tags
      }
    }]
  };
});