'use strict';

var columns = [{
  name: 'column1',
  title: 'Column1',
  nowrap: true
}, {
  name: 'column2',
  title: 'Column2'
}, {
  name: 'column3',
  title: 'Column3'
}];

/* eslint-disable max-len */

var rows = [{
  selected: true,
  id: 'apache-id',
  value: 'apache spark',
  selectionLabel: 'apache spark',
  column1: 'Row 1',
  column2: 'Row 1',
  column3: '\n      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed, aliquet bibendum augue. Aenean posuere sem vel euismod dignissim. Nulla ut cursus dolor. Pellentesque vulputate nisl a porttitor interdum.\n    '
}, {
  id: 'cloudant-id',
  value: 'Cloudant',
  selectionLabel: 'Cloudant',
  column1: 'Row 2',
  column2: 'Row 2',
  column3: '\n      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed, aliquet bibendum augue. Aenean posuere sem vel euismod dignissim. Nulla ut cursus dolor. Pellentesque vulputate nisl a porttitor interdum.\n    '
}, {
  id: 'block-storate-id',
  value: 'block-storage',
  selectionLabel: 'block-storage',
  column1: 'Row 3',
  column2: 'Row 3',
  column3: '\n      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed, aliquet bibendum augue. Aenean posuere sem vel euismod dignissim. Nulla ut cursus dolor. Pellentesque vulputate nisl a porttitor interdum.\n    '
}, {
  id: 'open-whisk-id',
  value: 'open-whisk',
  selectionLabel: 'open-whisk',
  column1: 'Row 4',
  column2: 'Row 4',
  column3: '\n      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed, aliquet bibendum augue. Aenean posuere sem vel euismod dignissim. Nulla ut cursus dolor. Pellentesque vulputate nisl a porttitor interdum.\n    '
}];

/* eslint-enable max-len */

module.exports = {
  variants: [{
    name: 'default',
    label: 'Structured List',
    context: {
      columns: columns,
      rows: rows.slice(0, 2)
    }
  }, {
    name: 'selection',
    label: 'With selection',
    context: {
      columns: columns,
      rows: rows,
      hasBorder: true,
      selectable: true,
      group: 'services'
    }
  }]
};