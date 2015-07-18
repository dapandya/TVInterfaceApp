/**
 * Some basic Implementation of deferred and promise API
 * Usage: somewhat similar to jquery promise/defer behaviour
 *
 * function doSomething() {
 *  var dfrd = _.deferred();
 *  callAsynchronous(function(data){
 *    // success
 *    dfrd.resolve(data);
 *
 *  }, function(){
 *    // failure
 *    dfrd.reject(data);
 *  })
 *
 *  return dfrd.promise();
 * }
 *
 * ....
 *
 * _.when(doSomething()).then(callBack).fail(someOtherCallBack);
 *
 *
 *
 */
(function () {
  'use strict';

  var instance;

  function deferred() {
    var doneCallBack,
      failCallBack,
      immediateFail,
      immediateDone,
      deferredCompleteArgument;

    function done(callBack) {
      doneCallBack = callBack;
      if (immediateDone) {
        resolve.apply(this, deferredCompleteArgument);
      }
    }

    function fail(callBack) {
      failCallBack = callBack;
      if (immediateFail) {
        reject.apply(this, deferredCompleteArgument);
      }
    }

    function promise() {
      return {
        done: done,
        then: done,
        fail: fail
      };
    }

    function reject() {
      if (failCallBack) {
        failCallBack.apply(null, arguments);
      } else {
        deferredCompleteArgument = arguments;
        immediateFail = true;
      }
      return promise();
    }

    function resolve() {
      if (doneCallBack) {
        doneCallBack.apply(null, arguments);
      } else {
        deferredCompleteArgument = arguments;
        immediateDone = true;
      }
      return promise();
    }

    return {
      promise: promise,
      reject: reject,
      resolve: resolve
    };

  }

  function when(promise) {
    return promise;
  }

  instance = exports._ || {};

  instance.deferred = deferred;
  instance.when = when;

  exports._ = instance;

}());