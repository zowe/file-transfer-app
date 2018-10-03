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
    global.codeSnippetConfig = mod.exports;
  }
})(this, function (module) {
  'use strict';

  module.exports = {
    variants: [{
      name: 'default',
      label: 'Single Line',
      notes: '\n        Code snippets are small blocks of reusable code that can be inserted in a code file.\n\n        The Single style is for single-line code snippets.\n      ',
      context: {
        variant: 'single'
      }
    }, {
      name: 'multi',
      label: 'Multi Line',
      notes: '\n        Code snippets are small blocks of reusable code that can be inserted in a code file.\n\n        The Multi-line style is for larger code blocks.\n      ',
      context: {
        variant: 'multi'
      }
    }, {
      name: 'inline',
      label: 'Inline',
      notes: '\n        Code snippets are small blocks of reusable code that can be inserted in a code file.\n\n        The inline style is for code blocks within a block of text on a white background.\n      ',
      context: {
        variant: 'inline'
      }
    }, {
      name: 'inline-light',
      label: 'Inline (Light)',
      notes: '\n        Code snippets are small blocks of reusable code that can be inserted in a code file.\n\n        The inline style is for code blocks within a block of text.\n      ',
      context: {
        variant: 'inline',
        light: 'true'
      }
    }]
  };
});