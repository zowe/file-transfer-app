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
    global.accordionConfig = mod.exports;
  }
})(this, function (module) {
  'use strict';

  module.exports = {
    variants: [{
      name: 'default',
      label: 'Accordion',
      notes: 'Accordions allow users to expand and collapse sections of content.',
      context: {
        sections: [{
          title: 'Section 1 title',
          paneId: 'pane1'
        }, {
          title: 'Section 2 title',
          paneId: 'pane2'
        }, {
          title: 'Section 3 title',
          paneId: 'pane3'
        }, {
          title: 'Section 4 title',
          paneId: 'pane4'
        }]
      }
    }, {
      name: 'legacy',
      label: 'Legacy',
      context: {
        sections: [{
          title: 'Section 1 title'
        }, {
          title: 'Section 2 title'
        }, {
          title: 'Section 3 title'
        }, {
          title: 'Section 4 title'
        }]
      }
    }]
  };
});