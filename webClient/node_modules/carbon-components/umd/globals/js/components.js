(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../../components/checkbox/checkbox', '../../components/file-uploader/file-uploader', '../../components/fab/fab', '../../components/content-switcher/content-switcher', '../../components/tabs/tabs', '../../components/overflow-menu/overflow-menu', '../../components/modal/modal', '../../components/loading/loading', '../../components/inline-loading/inline-loading', '../../components/dropdown/dropdown', '../../components/number-input/number-input', '../../components/data-table/data-table', '../../components/data-table-v2/data-table-v2', '../../components/date-picker/date-picker', '../../components/unified-header/left-nav', '../../components/unified-header/profile-switcher', '../../components/pagination/pagination', '../../components/search/search', '../../components/accordion/accordion', '../../components/copy-button/copy-button', '../../components/notification/notification', '../../components/toolbar/toolbar', '../../components/tooltip/tooltip', '../../components/progress-indicator/progress-indicator', '../../components/floating-menu/floating-menu', '../../components/structured-list/structured-list', '../../components/slider/slider', '../../components/tile/tile', '../../components/carousel/carousel', '../../components/lightbox/lightbox', '../../components/code-snippet/code-snippet', '../../components/text-input/text-input'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../../components/checkbox/checkbox'), require('../../components/file-uploader/file-uploader'), require('../../components/fab/fab'), require('../../components/content-switcher/content-switcher'), require('../../components/tabs/tabs'), require('../../components/overflow-menu/overflow-menu'), require('../../components/modal/modal'), require('../../components/loading/loading'), require('../../components/inline-loading/inline-loading'), require('../../components/dropdown/dropdown'), require('../../components/number-input/number-input'), require('../../components/data-table/data-table'), require('../../components/data-table-v2/data-table-v2'), require('../../components/date-picker/date-picker'), require('../../components/unified-header/left-nav'), require('../../components/unified-header/profile-switcher'), require('../../components/pagination/pagination'), require('../../components/search/search'), require('../../components/accordion/accordion'), require('../../components/copy-button/copy-button'), require('../../components/notification/notification'), require('../../components/toolbar/toolbar'), require('../../components/tooltip/tooltip'), require('../../components/progress-indicator/progress-indicator'), require('../../components/floating-menu/floating-menu'), require('../../components/structured-list/structured-list'), require('../../components/slider/slider'), require('../../components/tile/tile'), require('../../components/carousel/carousel'), require('../../components/lightbox/lightbox'), require('../../components/code-snippet/code-snippet'), require('../../components/text-input/text-input'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.checkbox, global.fileUploader, global.fab, global.contentSwitcher, global.tabs, global.overflowMenu, global.modal, global.loading, global.inlineLoading, global.dropdown, global.numberInput, global.dataTable, global.dataTableV2, global.datePicker, global.leftNav, global.profileSwitcher, global.pagination, global.search, global.accordion, global.copyButton, global.notification, global.toolbar, global.tooltip, global.progressIndicator, global.floatingMenu, global.structuredList, global.slider, global.tile, global.carousel, global.lightbox, global.codeSnippet, global.textInput);
    global.components = mod.exports;
  }
})(this, function (exports, _checkbox, _fileUploader, _fab, _contentSwitcher, _tabs, _overflowMenu, _modal, _loading, _inlineLoading, _dropdown, _numberInput, _dataTable, _dataTableV, _datePicker, _leftNav, _profileSwitcher, _pagination, _search, _accordion, _copyButton, _notification, _toolbar, _tooltip, _progressIndicator, _floatingMenu, _structuredList, _slider, _tile, _carousel, _lightbox, _codeSnippet, _textInput) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'Checkbox', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_checkbox).default;
    }
  });
  Object.defineProperty(exports, 'FileUploader', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_fileUploader).default;
    }
  });
  Object.defineProperty(exports, 'FabButton', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_fab).default;
    }
  });
  Object.defineProperty(exports, 'ContentSwitcher', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_contentSwitcher).default;
    }
  });
  Object.defineProperty(exports, 'Tab', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_tabs).default;
    }
  });
  Object.defineProperty(exports, 'OverflowMenu', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_overflowMenu).default;
    }
  });
  Object.defineProperty(exports, 'Modal', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_modal).default;
    }
  });
  Object.defineProperty(exports, 'Loading', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_loading).default;
    }
  });
  Object.defineProperty(exports, 'InlineLoading', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_inlineLoading).default;
    }
  });
  Object.defineProperty(exports, 'Dropdown', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_dropdown).default;
    }
  });
  Object.defineProperty(exports, 'NumberInput', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_numberInput).default;
    }
  });
  Object.defineProperty(exports, 'DataTable', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_dataTable).default;
    }
  });
  Object.defineProperty(exports, 'DataTableV2', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_dataTableV).default;
    }
  });
  Object.defineProperty(exports, 'DatePicker', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_datePicker).default;
    }
  });
  Object.defineProperty(exports, 'LeftNav', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_leftNav).default;
    }
  });
  Object.defineProperty(exports, 'ProfileSwitcher', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_profileSwitcher).default;
    }
  });
  Object.defineProperty(exports, 'Pagination', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_pagination).default;
    }
  });
  Object.defineProperty(exports, 'Search', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_search).default;
    }
  });
  Object.defineProperty(exports, 'Accordion', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_accordion).default;
    }
  });
  Object.defineProperty(exports, 'CopyButton', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_copyButton).default;
    }
  });
  Object.defineProperty(exports, 'Notification', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_notification).default;
    }
  });
  Object.defineProperty(exports, 'Toolbar', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_toolbar).default;
    }
  });
  Object.defineProperty(exports, 'Tooltip', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_tooltip).default;
    }
  });
  Object.defineProperty(exports, 'ProgressIndicator', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_progressIndicator).default;
    }
  });
  Object.defineProperty(exports, 'FloatingMenu', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_floatingMenu).default;
    }
  });
  Object.defineProperty(exports, 'StructuredList', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_structuredList).default;
    }
  });
  Object.defineProperty(exports, 'Slider', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_slider).default;
    }
  });
  Object.defineProperty(exports, 'Tile', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_tile).default;
    }
  });
  Object.defineProperty(exports, 'Carousel', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_carousel).default;
    }
  });
  Object.defineProperty(exports, 'Lightbox', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_lightbox).default;
    }
  });
  Object.defineProperty(exports, 'CodeSnippet', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_codeSnippet).default;
    }
  });
  Object.defineProperty(exports, 'TextInput', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_textInput).default;
    }
  });

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
});