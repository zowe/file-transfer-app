'use strict';

var items = [{
  label: 'Choose an option',
  disabled: true,
  selected: true,
  hidden: true
}, {
  label: 'A much longer option that is worth having around to check how text flows',
  value: 'solong'
}, {
  label: 'Category 1',
  items: [{
    label: 'Option 1',
    value: 'option1'
  }, {
    label: 'Option 2',
    value: 'option2'
  }]
}, {
  label: 'Category 2',
  items: [{
    label: 'Option 1',
    value: 'option1'
  }, {
    label: 'Option 2',
    value: 'option2'
  }]
}];

module.exports = {
  variants: [{
    name: 'default',
    label: 'Select',
    notes: '\n        Select displays a list below its title when selected. They are used primarily in forms,\n        where a user chooses one option from a list. Once the user selects an item, the dropdown will\n        dissapear and the field will reflect the user\'s choice. Create Select Item components for each\n        option in the list.\n      ',
    context: {
      items: items
    }
  }, {
    name: 'inline',
    label: 'Inline Select',
    notes: 'Inline select is for use when there will be multiple elements in a row.',
    context: {
      inline: true,
      items: items
    }
  }, {
    name: 'light',
    label: 'Select (Light)',
    context: {
      light: true,
      items: items
    }
  }, {
    name: 'invalid',
    label: 'Select (Invalid)',
    context: {
      invalid: true,
      items: items
    }
  }, {
    name: 'inline-invalid',
    label: 'Inline Select (Invalid)',
    context: {
      inline: true,
      invalid: true,
      items: items
    }
  }, {
    name: 'light-invalid',
    label: 'Select (Light/Invalid)',
    context: {
      light: true,
      invalid: true,
      items: items
    }
  }]
};