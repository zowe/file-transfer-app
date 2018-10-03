'use strict';

module.exports = {
  variants: [{
    name: 'default',
    label: 'Number Input',
    notes: '\n        Number inputs are similar to text fields, but contain controls used to increase or decrease an incremental value.\n        The Number Input component can be passed a starting value, a min, a max, and the step.\n      '
  }, {
    name: 'light',
    label: 'Number Input (Light)',
    context: {
      light: true
    }
  }]
};