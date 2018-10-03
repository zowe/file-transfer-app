'use strict';

var items = [{
  label: 'Option 1',
  value: 'all'
}, {
  label: 'Option 2',
  value: 'cloudFoundry'
}, {
  label: 'Option 3',
  value: 'staging'
}, {
  label: 'Option 4',
  value: 'dea'
}, {
  label: 'Option 5',
  value: 'router'
}];

module.exports = {
  variants: [{
    name: 'default',
    label: 'Dropdown',
    notes: '\n        The Dropdown component is used for navigating or filtering existing content.\n      ',
    context: {
      items: items
    }
  }, {
    name: 'light',
    label: 'Dropdown (Light)',
    context: {
      light: true,
      items: items
    }
  }, {
    name: 'up',
    label: 'Up',
    context: {
      up: true,
      items: items
    }
  }, {
    name: 'up-light',
    label: 'Up (Light)',
    context: {
      up: true,
      light: true,
      items: items
    }
  }, {
    name: 'inline',
    label: 'Inline',
    context: {
      inline: true,
      items: items
    }
  }]
};