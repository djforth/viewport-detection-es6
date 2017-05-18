import Viewport from '../src/viewport-detection';

import _ from 'lodash';


describe('viewport-detection-es6', function() {
  let viewport;
  describe('standard setup', function() {
    beforeEach(function() {
      viewport = new Viewport();
    });

    it("should be defined", function() {
      expect(viewport).toBeDefined();
    });

    it("should set up default", function() {
      expect(viewport.currentWidth).toEqual(0);
      expect(viewport.callbacks).toEqual([]);
      expect(viewport.trackerCalled).toBeFalsy();
      expect(viewport.breakpoints.mobile).toEqual({st:0, fn:767});
      expect(viewport.breakpoints.tablet).toEqual({st:768, fn:992});
      expect(viewport.breakpoints.desktop).toEqual({st:993, fn:"max"});
    });

    describe('add callback', function() {
      it("should add callback if a function", function() {
        let cb = jasmine.createSpy("callback");
        viewport.addCallback(cb)
        expect(viewport.callbacks.length).toEqual(1);
      });

      it("should not add callback if not function", function() {
        let cb = "Not a function";
        expect(()=> {
          viewport.addCallback(cb)

        }).toThrowError("Not a function");
      });
    });

    describe('getDevice', function() {
      let val = 1200;
      beforeEach(()=>{

        spyOn(viewport, "windowSize").and.returnValue({width:500});

        spyOn(viewport, "checkWidths").and.callFake((w,st, fn)=>{
          if(st === val){
            return true;
          }
          return false;
        })
      })

      it("should set to mobile", function() {
        val = 0;

        let device = viewport.getDevice();
        expect(device).toEqual("mobile")
      });

      it("should set to tablet", function() {
        val = 768;

        let device = viewport.getDevice();
        expect(device).toEqual("tablet")
      });

      it("should set to desktop", function() {
        val = 993;

        let device = viewport.getDevice();
        expect(device).toEqual("desktop")
      });
    });
  });

  describe('checkWidths', function() {
    it("should return true if max and width is larger", function() {
      let check = viewport.checkWidths(1250, 1200, "max");
      expect(check).toBeTruthy()
    });

    it("should return true if width is larger than st and small then fn", function() {
      let check = viewport.checkWidths(992, 992, 1199);
      expect(check).toBeTruthy()
    });

    it("should return false if width is small than st ", function() {
      let check = viewport.checkWidths(800, 992, 1199);
      expect(check).toBeFalsy()
    });

    it("should return false if width is greater than fn", function() {
      let check = viewport.checkWidths(1300, 992, 1199);
      expect(check).toBeFalsy()
    });
  });

  describe('check if smart device', function() {
    let __originalNavigator = navigator;
    let val = "Apple-iPhone7C2/1202.466"
    beforeEach(()=>{
      // Stubs user agent
      navigator = new Object();
      navigator.__proto__ = __originalNavigator;
      navigator.__defineGetter__('userAgent', ()=>{
          return val // customized user agent
      });
    })
    it("should return true if iphone", function() {
      expect(viewport.isSmartDevice()).toBeTruthy()
    });

    it("should return false if not device", function() {
      val = "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/534.34 (KHTML, like Gecko) PhantomJS/1.9.8 Safari/534.34"
      expect(viewport.isSmartDevice()).toBeFalsy()
    });
  });

  describe('detect a size change', function() {
    it("should return false if width does match", ()=>{
      expect(viewport.sizeChange(0)).toBeFalsy();
      expect(viewport.currentWidth).toEqual(0);
    });

    it("should return true and set width if doesn't match", ()=>{
      expect(viewport.sizeChange(100)).toBeTruthy();
      expect(viewport.currentWidth).toEqual(100);
    });
  });

  describe('runCallbacks', function() {
    let callback0, callback1;
    beforeEach(()=>{
      callback0 = jasmine.createSpy('callback0');
      callback1 = jasmine.createSpy('callback1');
      viewport.addCallback(callback0);
      viewport.addCallback(callback1);
      spyOn(viewport, "getDevice").and.returnValue('mobile');

      viewport.runCallBacks({width:100});
    });

    it("should call getDevice", function() {
      expect(viewport.getDevice).toHaveBeenCalledWith(100);
    });

    it("should call all callbacks", function() {
      expect(callback0).toHaveBeenCalledWith('mobile', {width:100})
      expect(callback1).toHaveBeenCalledWith('mobile', {width:100})
    });
  });

  describe('resizeFn', function() {

    beforeEach(function() {
      spyOn(viewport, 'runCallBacks');
      spyOn(viewport, 'windowSize').and.returnValue({width:480, height:500});
    });

    it("should call windowSize", function() {
      viewport.resizeFn();
      expect(viewport.windowSize).toHaveBeenCalled();
    });

    it("should not call runCallBack if sizeChange is false", function() {
      spyOn(viewport, "sizeChange").and.returnValue(false);
      viewport.resizeFn();
      expect(viewport.sizeChange).toHaveBeenCalledWith(480);
      expect(viewport.runCallBacks).not.toHaveBeenCalled();

    });

    it("should call runCallBack if sizeChange is true", function() {
      spyOn(viewport, "sizeChange").and.returnValue(true);
      viewport.resizeFn();
      expect(viewport.sizeChange).toHaveBeenCalledWith(480);
      expect(viewport.runCallBacks).toHaveBeenCalledWith({width:480, height:500});
    });

  });
});