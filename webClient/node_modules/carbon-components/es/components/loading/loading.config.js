'use strict';

module.exports = {
  variants: [{
    name: 'default',
    label: 'Loading',
    notes: '\n        Loading spinners are used when retrieving data or performing slow computations,\n        and help to notify users that loading is underway.\n      ',
    context: {
      overlay: true
    }
  }, {
    name: 'without-overlay',
    label: 'Without overlay',
    context: {
      overlay: false
    }
  }, {
    name: 'small',
    label: 'Small',
    context: {
      overlay: false,
      small: true
    }
  }]
};