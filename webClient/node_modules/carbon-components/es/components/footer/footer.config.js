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