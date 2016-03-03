"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require("lodash/core");
_.remove = require("lodash/remove");
var forIn = require("lodash/forIn");

var ViewportDetection = (function () {
  _createClass(ViewportDetection, [{
    key: "addCallback",
    value: function addCallback(c) {
      if (_.isFunction(c)) {
        var id = this.id = _.uniqueId();
        this.callbacks.push({ cb: c, id: id });
      } else {
        throw new Error("Not a function");
      }

      return id;
    }
  }]);

  function ViewportDetection(cb) {
    _classCallCheck(this, ViewportDetection);

    this.breakpoints = {
      mobile: { st: 0, fn: 767 },
      tablet: { st: 768, fn: 992 },
      desktop: { st: 993, fn: "max" }
    };
    this.currentWidth = 0;
    this.callbacks = [];
    this.trackerCalled = false;
    if (_.isFunction(cb)) {
      this.id = this.addCallback(cb);
    }
  }

  _createClass(ViewportDetection, [{
    key: "checkWidths",
    value: function checkWidths(w, st, fn) {
      if (fn === "max" && w >= st) {
        return true;
      }

      return w >= st && w <= fn;
    }
  }, {
    key: "getDevice",
    value: function getDevice() {
      var _this = this;

      var winWidth = this.windowSize().width;
      var device = "desktop";

      forIn(this.breakpoints, function (v, k) {
        if (_this.checkWidths(winWidth, v.st, v.fn)) {
          device = k;
        }
      });

      return device;
    }
  }, {
    key: "getWidth",
    value: function getWidth(w) {
      if (_.isNumber(w)) {
        this.currentWidth = w;
      }
      return this.currentWidth;
    }
  }, {
    key: "getLastId",
    value: function getLastId() {
      return this.id;
    }
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;

      var tracker = (function () {
        _this2.resizeFn();
      }).bind(this);

      window.addEventListener("resize", tracker, false);

      window.addEventListener("orientationchange", tracker, false);
    }
  }, {
    key: "isSmartDevice",
    value: function isSmartDevice() {
      // Adapted from http://www.detectmobilebrowsers.com
      var ua = window.navigator.userAgent || window.navigator.vendor || window.opera;

      //Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
      return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/.test(ua)
      );
    }
  }, {
    key: "removeCallback",
    value: function removeCallback(id) {
      return _.remove(this.callbacks, function (cb) {
        return cb.id === id;
      });
    }
  }, {
    key: "resizeFn",
    value: function resizeFn() {
      var sizeObj = this.windowSize();
      if (this.sizeChange(sizeObj.width)) {
        this.runCallBacks(sizeObj);
      }
    }
  }, {
    key: "runCallBacks",
    value: function runCallBacks(size) {
      var device = this.getDevice(size.width);
      _.forEach(this.callbacks, function (calls) {
        calls.cb(device, size);
      });
    }
  }, {
    key: "sizeChange",
    value: function sizeChange(w) {
      if (this.currentWidth === w) {
        return false;
      }

      this.currentWidth = w;
      return true;
    }
  }, {
    key: "touchSupport",
    value: function touchSupport() {
      return window.touch;
    }
  }, {
    key: "trackSize",
    value: function trackSize(callback) {
      var id = this.addCallback(callback);

      if (!this.trackerCalled) {
        window.addEventListener("DOMContentLoaded", this.init.bind(this), false);
      }

      return id;
    }
  }, {
    key: "windowSize",
    value: function windowSize() {
      return {
        height: window.innerHeight,
        width: window.innerWidth
      };
    }
  }]);

  return ViewportDetection;
})();

module.exports = ViewportDetection;
