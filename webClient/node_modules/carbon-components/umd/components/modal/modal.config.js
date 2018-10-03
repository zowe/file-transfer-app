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
    global.modalConfig = mod.exports;
  }
})(this, function (module) {
  'use strict';

  module.exports = {
    variants: [{
      name: 'default',
      label: 'Transactional Modal',
      notes: '\n        Modals communicate information via a secondary window and allow the user to maintain the context of a particular task.\n      ',
      context: {
        idSuffix: Math.random().toString(36).substr(2),
        hasFooter: true,
        classPrimaryButton: 'bx--btn--primary',
        classCloseButton: 'bx--btn--secondary'
      }
    }, {
      name: 'nofooter',
      label: 'Passive Modal',
      notes: 'Passive Modals are modals without footers.',
      context: {
        idSuffix: Math.random().toString(36).substr(2),
        hasFooter: false,
        classPrimaryButton: 'bx--btn--primary',
        classCloseButton: 'bx--btn--secondary'
      }
    }, {
      name: 'danger',
      label: 'Danger Modal',
      context: {
        idSuffix: Math.random().toString(36).substr(2),
        hasFooter: true,
        labelPrimaryButton: 'Danger',
        classModalSupplemental: 'bx--modal--danger',
        classPrimaryButton: 'bx--btn--danger--primary',
        classCloseButton: 'bx--btn--tertiary'
      }
    }, {
      name: 'input',
      label: 'Input Modal',
      context: {
        idSuffix: Math.random().toString(36).substr(2),
        hasInput: true,
        hasFooter: true,
        classPrimaryButton: 'bx--btn--primary',
        classCloseButton: 'bx--btn--secondary'
      }
    }]
  };
});