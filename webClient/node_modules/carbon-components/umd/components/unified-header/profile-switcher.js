(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../../globals/js/settings', '../../globals/js/misc/mixin', '../../globals/js/mixins/create-component', '../../globals/js/mixins/init-component-by-search', '../../globals/js/mixins/handles', '../../globals/js/misc/event-matches', '../../globals/js/misc/on'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../../globals/js/settings'), require('../../globals/js/misc/mixin'), require('../../globals/js/mixins/create-component'), require('../../globals/js/mixins/init-component-by-search'), require('../../globals/js/mixins/handles'), require('../../globals/js/misc/event-matches'), require('../../globals/js/misc/on'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.settings, global.mixin, global.createComponent, global.initComponentBySearch, global.handles, global.eventMatches, global.on);
    global.profileSwitcher = mod.exports;
  }
})(this, function (exports, _settings, _mixin2, _createComponent, _initComponentBySearch, _handles, _eventMatches, _on) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _settings2 = _interopRequireDefault(_settings);

  var _mixin3 = _interopRequireDefault(_mixin2);

  var _createComponent2 = _interopRequireDefault(_createComponent);

  var _initComponentBySearch2 = _interopRequireDefault(_initComponentBySearch);

  var _handles2 = _interopRequireDefault(_handles);

  var _eventMatches2 = _interopRequireDefault(_eventMatches);

  var _on2 = _interopRequireDefault(_on);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var ProfileSwitcher = function (_mixin) {
    _inherits(ProfileSwitcher, _mixin);

    /**
     * Profile Switcher.
     * @extends CreateComponent
     * @extends InitComponentBySearch
     * @extends Handles
     * @param {HTMLElement} element The element working as a profile switcher.
     * @param {Object} [options] The component options
     * @param {string} [options.selectorProfileSwitcher] The data attribute selector for the profile switcher.
     * @param {string} [options.selectorAccount]
     *   The data attribute selector for the element containing the account name in the profile switcher.
     * @param {string} [options.selectorOrg]
     *   The data attribute selector for the element containing the organization name in the profile switcher.
     * @param {string} [options.selectorSpace]
     *   The data attribute selector for the element containing the space name in the profile switcher.
     * @param {string} [options.selectorAccountDropdown]
     *   The data attribute selector for the dropdown item containing the current account name.
     * @param {string} [options.selectorOrgDropdown]
     *   The data attribute selector for the dropdown item containing the current organization name.
     * @param {string} [options.selectorSpaceDropdown]
     *   The data attribute selector for the dropdown item containing the current space name.
     */
    function ProfileSwitcher(element, options) {
      _classCallCheck(this, ProfileSwitcher);

      var _this = _possibleConstructorReturn(this, (ProfileSwitcher.__proto__ || Object.getPrototypeOf(ProfileSwitcher)).call(this, element, options));

      _this.manage((0, _on2.default)(_this.element.ownerDocument, 'click', function (evt) {
        _this.handleDocumentClick(evt);
      }));

      _this.manage((0, _on2.default)(_this.element, 'dropdown-beingselected', function (event) {
        if (event.target.querySelector(_this.options.selectorAccountDropdown) !== null) {
          var linkedIconNode = event.detail.item.querySelector(_this.options.classLinkedIcon);
          _this.element.isLinked = !!linkedIconNode;
          _this.element.linkedIcon = linkedIconNode && linkedIconNode.cloneNode(true);
          var linkedAccountNode = event.detail.item.querySelector(_this.options.selectorAccountSlLinked);
          _this.element.linkedAccount = linkedAccountNode && linkedAccountNode.cloneNode(true);
        }
      }));

      var toggleNode = _this.element.querySelector(_this.options.selectorToggle);
      if (toggleNode) {
        _this.manage((0, _on2.default)(toggleNode, 'keydown', function (event) {
          _this.toggle(event);
        }));

        _this.manage((0, _on2.default)(toggleNode, 'mouseenter', function (event) {
          _this.getLinkedData(event);
          _this.determineSwitcherValues(true);
        }));

        _this.manage((0, _on2.default)(toggleNode, 'mouseleave', function (event) {
          _this.getLinkedData(event);
          _this.determineSwitcherValues(false);
        }));
      }

      _this.manage((0, _on2.default)(_this.element.ownerDocument, 'keyup', function () {
        return _this.handleBlur();
      }));
      return _this;
    }

    /**
     * Opens and closes the menu.
     * @param {Event} event The event triggering this method.
     */


    _createClass(ProfileSwitcher, [{
      key: 'toggle',
      value: function toggle(event) {
        var isOfSelf = this.element.contains(event.target);
        if (event.which === 13 || event.which === 32) {
          if (isOfSelf) {
            this.element.classList.toggle(this.options.classSwitcherOpen);
          } else if (!isOfSelf && this.element.classList.contains(this.options.classSwitcherOpen)) {
            this.element.classList.remove(this.options.classSwitcherOpen);
          }
        }
      }
    }, {
      key: 'getLinkedData',
      value: function getLinkedData(event) {
        if (event.target.querySelector(this.options.selectorLinkedAccount) !== null) {
          if (event.target.querySelector(this.options.selectorLinkedAccount).textContent.length > 1) {
            this.element.isLinked = true;
          } else {
            this.element.isLinked = false;
          }
        }
      }
    }, {
      key: 'handleBlur',
      value: function handleBlur() {
        if (!this.element.contains(document.activeElement)) {
          this.element.classList.remove(this.options.classSwitcherOpen);
        }
      }
    }, {
      key: 'handleDocumentClick',
      value: function handleDocumentClick(evt) {
        var clickTarget = evt.target;
        var isOfSelf = this.element.contains(clickTarget);
        var isToggle = (0, _eventMatches2.default)(evt, this.options.selectorToggle);
        var isOpen = this.element.classList.contains(this.options.classSwitcherOpen);

        if (isOfSelf) {
          if (isToggle && isOpen) {
            this.element.classList.remove(this.options.classSwitcherOpen);
          } else if (isOpen) {
            this.determineSwitcherValues();
          } else {
            this.element.classList.add(this.options.classSwitcherOpen);
          }
        } else {
          this.element.classList.remove(this.options.classSwitcherOpen);
        }
      }
    }, {
      key: 'determineSwitcherValues',
      value: function determineSwitcherValues(isHovered) {
        var linkedElement = this.element.querySelector(this.options.selectorLinkedAccount);
        var nameElement = this.element.querySelector(this.options.selectorAccount);
        var regionElement = this.element.querySelector(this.options.selectorRegion);
        var orgElement = this.element.querySelector(this.options.selectorOrg);
        var spaceElement = this.element.querySelector(this.options.selectorSpace);
        var menuElement = this.element.querySelector(this.options.selectorMenu);
        var isOpen = this.element.classList.contains(this.options.classSwitcherOpen);

        if (linkedElement) {
          if (this.element.isLinked) {
            if (this.element.linkedAccount) {
              if (linkedElement.textContent.length) {
                linkedElement.querySelector(this.options.selectorAccountSlLinked).textContent = this.element.linkedAccount.textContent;
              } else {
                linkedElement.appendChild(this.element.linkedAccount);
                if (this.element.linkedIcon) {
                  linkedElement.appendChild(this.element.linkedIcon);
                }
              }
            }
          } else {
            linkedElement.textContent = '';
          }
        }

        var nameDropdownValue = '';
        if (this.element.querySelector(this.options.selectorAccountDropdown)) {
          if (this.element.isLinked) {
            nameDropdownValue = this.element.querySelector(this.options.selectorAccountLinked).textContent;
          } else {
            nameDropdownValue = this.element.querySelector(this.options.selectorAccountDropdown).textContent;
          }
        }

        var regionDropdownValue = '';
        if (this.element.querySelector(this.options.selectorRegionDropdown)) {
          regionDropdownValue = this.element.querySelector(this.options.selectorRegionDropdown).textContent;
        }

        var orgDropdownValue = '';
        if (this.element.querySelector(this.options.selectorOrgDropdown)) {
          orgDropdownValue = this.element.querySelector(this.options.selectorOrgDropdown).textContent;
        }

        var spaceDropdownValue = '';
        if (this.element.querySelector(this.options.selectorSpaceDropdown)) {
          spaceDropdownValue = this.element.querySelector(this.options.selectorSpaceDropdown).textContent;
        }

        var nameShort = void 0;
        var orgShort = void 0;
        var spaceShort = void 0;

        if (isHovered && !isOpen) {
          if (nameElement) {
            nameElement.textContent = nameDropdownValue;
          }
          if (orgElement) {
            orgElement.textContent = orgDropdownValue;
          }
          if (spaceElement) {
            spaceElement.textContent = spaceDropdownValue;
          }
          if (regionElement) {
            regionElement.textContent = regionDropdownValue;
          }
          if (menuElement) {
            menuElement.style.width = this.element.getBoundingClientRect().width + 'px';
          }
        } else {
          if (nameElement) {
            if (nameDropdownValue.length > 25) {
              nameShort = nameDropdownValue.substr(0, 25) + '...';
              nameElement.textContent = nameShort;
            } else {
              nameElement.textContent = nameDropdownValue;
            }
          }

          if (orgElement) {
            if (orgDropdownValue.length > 25) {
              orgShort = orgDropdownValue.slice(0, 12) + '...' + orgDropdownValue.slice(-13);
              orgElement.textContent = orgShort;
            } else {
              orgElement.textContent = orgDropdownValue;
            }
          }

          if (spaceElement) {
            if (spaceDropdownValue.length > 25) {
              spaceShort = spaceDropdownValue.substr(0, 25) + '...';
              spaceElement.textContent = spaceShort;
            } else {
              spaceElement.textContent = spaceDropdownValue;
            }
          }

          if (regionElement) {
            regionElement.textContent = regionDropdownValue;
          }

          if (menuElement) {
            menuElement.style.width = this.element.getBoundingClientRect().width + 'px';
          }
        }
      }
    }], [{
      key: 'options',
      get: function get() {
        var prefix = _settings2.default.prefix;

        return {
          selectorInit: '[data-profile-switcher]',
          // Data Attribute selectors
          selectorProfileSwitcher: '[data-profile-switcher]',
          selectorToggle: '[data-profile-switcher-toggle]',
          selectorMenu: '[data-switcher-menu]',
          selectorLinkedAccount: '[data-switcher-account-sl]',
          selectorAccount: '[data-switcher-account]',
          selectorRegion: '[data-switcher-region]',
          selectorOrg: '[data-switcher-org]',
          selectorSpace: '[data-switcher-space]',
          selectorDropdown: '[data-dropdown]',
          selectorAccountDropdown: '[data-dropdown-account]',
          selectorAccountSlDropdown: '[data-dropdown-account-sl]',
          selectorAccountLinked: '[data-dropdown-account-linked]',
          selectorAccountSlLinked: '[data-dropdown-account-sl-linked]',
          selectorRegionDropdown: '[data-dropdown-region]',
          selectorOrgDropdown: '[data-dropdown-org]',
          selectorSpaceDropdown: '[data-dropdown-space]',
          classSwitcherOpen: prefix + '--account-switcher--open',
          classLinkedIcon: '.' + prefix + '--account-switcher__linked-icon'
        };
      }
    }]);

    return ProfileSwitcher;
  }((0, _mixin3.default)(_createComponent2.default, _initComponentBySearch2.default, _handles2.default));

  ProfileSwitcher.components = new WeakMap();
  exports.default = ProfileSwitcher;
});