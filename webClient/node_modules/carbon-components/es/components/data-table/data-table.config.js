'use strict';

var menuItems = [{
  label: 'Stop app',
  primaryFocus: true
}, {
  label: 'Restart app'
}, {
  label: 'Rename app'
}, {
  label: 'Edit routes and access'
}, {
  label: 'Delete app',
  danger: true
}];

var columns = [{
  name: 'section',
  section: true
}, {
  name: 'select',
  title: 'Label name',
  checkbox: true,
  checkboxId: 'bx--checkbox-1',
  checkboxName: 'checkbox-1',
  checkboxValue: 'green'
}, {
  name: 'firstName',
  title: 'First Name',
  sortable: true
}, {
  name: 'lastName',
  title: 'Last Name',
  sortable: true
}, {
  name: 'house',
  title: 'House',
  sortable: true
}, {
  name: 'menu',
  menu: true
}];

var columnsSimple = [{
  name: 'firstName',
  title: 'First Name',
  sortable: true
}, {
  name: 'lastName',
  title: 'Last Name',
  sortable: true
}, {
  name: 'house',
  title: 'House',
  sortable: true
}];

var rows = [{
  sectionContent: '\n      <h4><strong>Harry Potter</strong></h4>\n      <p>Harry James Potter (b. 31 July, 1980) was a half-blood wizard, the only child and son of the late James and Lily\n        Potter (n\xE9e Evans), and one of the most famous and powerful wizards of modern times. In what proved to be a vain\n        attempt to circumvent a prophecy that stated that a boy born at the end of July of 1980 could be able to defeat\n        him, Lord Voldemort tried to murder him when he was a year and three months old. Voldemort murdered Harry\'s parents\n        as they tried to protect him, shortly before attacking Harry.</p>\n    ',
  section: true,
  select: {
    id: 'checkbox-2',
    label: 'Label name'
  },
  firstName: 'Harry',
  lastName: 'Potter',
  house: 'Gryffindor',
  menu: {
    label: 'Overflow menu description',
    items: menuItems
  }
}, {
  sectionContent: '\n      <table class="bx--responsive-table bx--responsive-table--static-size">\n        <thead>\n          <tr class="bx--table-row">\n            <th class="bx--table-header">First Name</th>\n            <th class="bx--table-header">Last Name</th>\n            <th class="bx--table-header">House</th>\n            <th class="bx--table-header">Hello</th>\n            <th class="bx--table-header">Column</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr>\n            <td>Godric</td>\n            <td>Gryffindor</td>\n            <td>Origin</td>\n            <td>Something</td>\n            <td>Hooray</td>\n          </tr>\n          <tr>\n            <td>Salazar</td>\n            <td>Slytherin</td>\n            <td>Origin</td>\n            <td>Something</td>\n            <td>Hooray</td>\n          </tr>\n        </tbody>\n      </table>\n    ',
  section: true,
  select: {
    id: 'checkbox-3',
    label: 'Label name'
  },
  firstName: 'Hermoine',
  lastName: 'Granger',
  house: 'Gryffindor',
  menu: {
    label: 'Overflow menu description',
    items: menuItems,
    flip: true
  }
}, {
  sectionContent: '\n      <img src="https://upload.wikimedia.org/wikipedia/en/5/5e/Ron_Weasley_poster.jpg" />\n    ',
  section: true,
  select: {
    id: 'checkbox-4',
    label: 'Label name'
  },
  firstName: 'Ron',
  lastName: 'Weasley',
  house: 'Gryffindor',
  menu: {
    label: 'Overflow menu description',
    items: menuItems,
    flip: true
  }
}, {
  sectionContent: '\n      <p>Draco Malfoy is in Gryffindor House. He is in his fifth year.</p>\n    ',
  section: true,
  select: {
    id: 'checkbox-5',
    label: 'Label name'
  },
  firstName: 'Draco',
  lastName: 'Malfoy',
  house: 'Slytherin',
  menu: {
    label: 'Overflow menu description',
    items: menuItems,
    flip: true
  }
}, {
  sectionContent: '\n      <p>Blaise Zabini is in Gryffindor House. He is in his fifth year.</p>\n    ',
  section: true,
  select: {
    id: 'checkbox-6',
    label: 'Label name'
  },
  firstName: 'Blaise',
  lastName: 'Zabini',
  house: 'Slytherin',
  menu: {
    label: 'Overflow menu description',
    items: menuItems,
    flip: true
  }
}, {
  sectionContent: '\n      <p>Cedric Diggory is in Hufflepuff House. He is in his fifth year.</p>\n    ',
  section: true,
  select: {
    id: 'checkbox-7',
    label: 'Label name'
  },
  firstName: 'Cedric',
  lastName: 'Diggory',
  house: 'Hufflepuff',
  menu: {
    label: 'Overflow menu description',
    items: menuItems,
    flip: true
  }
}, {
  sectionContent: '\n      <p>Luna Lovegood is in Ravenclaw House. She is in her fifth year.</p>\n    ',
  section: true,
  select: {
    id: 'checkbox-8',
    label: 'Label name'
  },
  firstName: 'Luna',
  lastName: 'Lovegood',
  house: 'Ravenclaw',
  menu: {
    label: 'Overflow menu description',
    items: menuItems,
    flip: true
  }
}, {
  sectionContent: '\n      <p>Cho Chang is in Gryffindor House. She is in her fifth year.</p>\n    ',
  section: true,
  select: {
    id: 'checkbox-9',
    label: 'Label name'
  },
  firstName: 'Cho',
  lastName: 'Chang',
  house: 'Ravenclaw',
  menu: {
    label: 'Overflow menu description',
    items: menuItems,
    flip: true
  }
}];

module.exports = {
  variants: [{
    name: 'default',
    label: 'Data Table',
    notes: '\n        Data Tables are used to represent a collection of resources, displaying a\n        subset of their fields in columns, or headers.\n      ',
    context: {
      columns: columns,
      rows: rows
    }
  }, {
    name: 'simple',
    label: 'Simple',
    context: {
      simple: true,
      columns: columnsSimple,
      rows: rows
    }
  }]
};