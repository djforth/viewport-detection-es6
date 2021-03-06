(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require("lodash");

var ViewportDetection = (function () {
  _createClass(ViewportDetection, [{
    key: "addCallback",
    value: function addCallback(c) {
      if (_.isFunction(c)) {
        this.callbacks.push(c);
      } else {
        throw new Error("Not a function");
      }
    }
  }]);

  function ViewportDetection(cb) {
    _classCallCheck(this, ViewportDetection);

    this.currentWidth = 0;
    this.callbacks = [];
    this.trackerCalled = false;
    if (_.isFunction(cb)) {
      this.callbacks.push(cb);
    }
  }

  _createClass(ViewportDetection, [{
    key: "getDevice",
    value: function getDevice() {
      var winWidth = this.windowSize().width;
      // console.log("winWidth", this.windowSize());
      if (winWidth <= 991) {
        return "mobile";
      } else if (winWidth > 992 && winWidth < 1199) {
        return "tablet";
      }

      return "desktop";
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
    key: "init",
    value: function init() {
      var _this = this;

      var tracker = (function () {
        _this.resizeFn();
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
      return /iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/.test(ua);
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
      _.forEach(this.callbacks, function (cb) {
        cb(device, size);
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
      this.addCallback(callback);

      if (!this.trackerCalled) {
        window.addEventListener("DOMContentLoaded", this.init.bind(this), false);
      }
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

},{"lodash":undefined}]},{},[1]);
