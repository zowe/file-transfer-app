(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.carouselConfig = mod.exports;
  }
})(this, function (module) {
  'use strict';

  module.exports = {
    variants: [{
      name: 'default',
      label: 'Carousel',
      context: {
        items: [{
          filmstripImageUrl: 'http://via.placeholder.com/256x144?text=/0',
          lightboxImageUrl: 'http://via.placeholder.com/1056x594?text=/0'
        }, {
          filmstripImageUrl: 'http://via.placeholder.com/256x144?text=1',
          lightboxImageUrl: 'http://via.placeholder.com/1056x594?text=1'
        }, {
          filmstripImageUrl: 'http://via.placeholder.com/256x144?text=2',
          lightboxImageUrl: 'http://via.placeholder.com/1056x594?text=2'
        }, {
          filmstripImageUrl: 'http://via.placeholder.com/256x144?text=3',
          lightboxImageUrl: 'http://via.placeholder.com/1056x594?text=3'
        }, {
          filmstripImageUrl: 'http://via.placeholder.com/256x144?text=4',
          lightboxImageUrl: 'http://via.placeholder.com/1056x594?text=4'
        }, {
          filmstripImageUrl: 'http://via.placeholder.com/256x144?text=5',
          lightboxImageUrl: 'http://via.placeholder.com/1056x594?text=5'
        }]
      }
    }]
  };
});