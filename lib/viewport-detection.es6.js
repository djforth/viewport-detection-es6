
const _ = require("lodash");

class ViewportDetection {

    addCallback(c){
      if(_.isFunction(c)){
        this.callbacks.push(c);
      } else {
        throw new Error("Not a function");
      }
    }

    constructor(cb){
      this.breakpoints = {
        mobile:{st:0, fn:768},
        tablet:{st:769, fn:992},
        desktop:{st:993, fn:"max"}
      };
      this.currentWidth = 0;
      this.callbacks     = [];
      this.trackerCalled = false;
      if(_.isFunction(cb)){
        this.callbacks.push(cb);
      }

    }

    checkWidths(w, st, fn){
      if(fn === "max" && w > st){
        return true;
      }

      return (w > st && w < fn);
    }


    getDevice(){
      let winWidth = this.windowSize().width;
      let device = "desktop";

      _.forIn(this.breakpoints, (v, k)=>{
         if(this.checkWidths(winWidth, v.st, v.fn)){
            device = k;
         }
      });

      return device;
    }

    getWidth(w){
      if(_.isNumber(w)){
        this.currentWidth = w;
      }
      return this.currentWidth;
    }

    init(){
       let tracker = ()=>{
          this.resizeFn();
       }.bind(this);

       window.addEventListener(
          "resize", tracker, false
        );

       window.addEventListener(
          "orientationchange", tracker, false
        );
    }

    isSmartDevice(){
        // Adapted from http://www.detectmobilebrowsers.com
        let ua = window.navigator.userAgent || window.navigator.vendor || window.opera;

        //Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
        return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
    }

    resizeFn(){
      let sizeObj = this.windowSize();
      if(this.sizeChange(sizeObj.width)){
        this.runCallBacks(sizeObj);
      }
    }

    runCallBacks(size){
      let device = this.getDevice(size.width);
      _.forEach(this.callbacks, (cb)=>{
        cb(device, size);
      });
    }

    sizeChange(w){
      if(this.currentWidth === w){
        return false;
      }

      this.currentWidth = w;
      return true;
    }

    touchSupport(){
      return window.touch;
    }

    trackSize(callback){
      this.addCallback(callback);

      if(!this.trackerCalled){
         window.addEventListener(
          "DOMContentLoaded",
          this.init.bind(this),
          false
        );
      }
    }

    windowSize(){
      return {
        height : window.innerHeight,
        width  : window.innerWidth
      };
    }
}

module.exports = ViewportDetection;
