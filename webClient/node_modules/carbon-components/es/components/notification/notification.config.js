'use strict';

var items = [{
  type: 'error',
  title: 'Notification title',
  subtitle: 'Subtitle text goes here.',
  timestamp: 'Time stamp [00:00:00]'
}, {
  type: 'info',
  title: 'Notification title',
  subtitle: 'Subtitle text goes here.',
  timestamp: 'Time stamp [00:00:00]'
}, {
  type: 'success',
  title: 'Notification title',
  subtitle: 'Subtitle text goes here.',
  timestamp: 'Time stamp [00:00:00]'
}, {
  type: 'warning',
  title: 'Notification title',
  subtitle: 'Subtitle text goes here.',
  timestamp: 'Time stamp [00:00:00]'
}];

module.exports = {
  variants: [{
    name: 'default',
    label: 'Inline Notification',
    context: {
      variant: 'inline',
      items: items
    }
  }, {
    name: 'toast',
    label: 'Toast Notification',
    notes: '\n        Toast notifications are typically passive, meaning they won\'t affect the user\'s workflow if not addressed.\n        Toast Notifications use \'kind\' props to specify the kind of notification that should render (error, info, success, warning).\n      ',
    context: {
      variant: 'toast',
      items: items
    }
  }]
};