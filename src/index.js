/* eslint-disable */
import _ from 'lodash';
import remove from 'lodash/remove';
import forIn from 'lodash/forIn';
/* eslint-enable */

class ViewportDetection{
    addCallback(c){
      let id = this.id = _.uniqueId();
      if (_.isFunction(c)){
        this.callbacks.push({cb: c, id: id});
      } else {
        throw new Error('Not a function');
      }

      return id;
    }

    constructor(cb){
      this.breakpoints = {
        mobile: {st: 0, fn: 767}
        , tablet: {st: 768, fn: 992}
        , desktop: {st: 993, fn: 'max'}
      };
      this.currentWidth = 0;
      this.callbacks     = [];
      this.trackerCalled = false;
      if (_.isFunction(cb)){
        this.id = this.addCallback(cb);
      }
    }

    checkWidths(w, st, fn){
      if (fn === 'max' && w >= st){
        return true;
      }

      return (w >= st && w <= fn);
    }


    getDevice(){
      let winWidth = this.windowSize().width;
      let device = 'desktop';

      forIn(this.breakpoints, (v, k)=>{
         if (this.checkWidths(winWidth, v.st, v.fn)){
            device = k;
         }
      });

      return device;
    }

    getWidth(w){
      if (_.isNumber(w)){
        this.currentWidth = w;
      }
      return this.currentWidth;
    }

    getLastId(){
      return this.id;
    }

    init(){
       let tracker = ()=>{
          this.resizeFn();
       };

       window.addEventListener(
          'resize', tracker, false
        );

       window.addEventListener(
          'orientationchange', tracker, false
        );
    }

    isSmartDevice(){
        // Adapted from http://www.detectmobilebrowsers.com
        let ua = window.navigator.userAgent ||
                 window.navigator.vendor ||
                 window.opera;
        /* eslint-disable */
        const regexp = /iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/;
        /* eslint-enable */
        // Checks for iOs, Android, Blackberry, Opera Mini,
        // and Windows mobile devices
        return (regexp).test(ua);
    }

    removeCallback(id){
      return remove(this.callbacks, function(cb){
        return cb.id === id;
      });
    }

    resizeFn(){
      let sizeObj = this.windowSize();
      if (this.sizeChange(sizeObj.width)){
        this.runCallBacks(sizeObj);
      }
    }

    runCallBacks(size){
      let device = this.getDevice(size.width);
      _.forEach(this.callbacks, (calls)=>{
        calls.cb(device, size);
      });
    }

    sizeChange(w){
      if (this.currentWidth === w){
        return false;
      }

      this.currentWidth = w;
      return true;
    }

    touchSupport(){
      return window.touch;
    }

    trackSize(callback){
      let id = this.addCallback(callback);

      if (!this.trackerCalled){
         window.addEventListener(
          'DOMContentLoaded',
          this.init.bind(this),
          false
        );
      }

      return id;
    }

    windowSize(){
      return {
        height: window.innerHeight
        , width: window.innerWidth
      };
    }
}

export default ViewportDetection;
