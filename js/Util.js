/**
 * Util functions
 */
(function () {

  var instance;

  /**
   * Adds class
   * @param el
   * @param className
   */
  function addClass(el, className) {
    var classArr;
    if(!hasClass(el, className)) {
      classArr = el.className.split(' ');
      classArr.push(className);
      el.className = classArr.join(' ');
    }
  }

  /**
   * Check if element has given class
   * @param el
   * @param className
   * @returns {boolean}
   */
  function hasClass(el, className) {
    var classArr = el.className.split(' ');
    for (var i = 0; i < classArr.length; i++) {
      if(className === classArr[i]) {
        return true;
      }
    }
    return false;
  }

  /**
   * Removes class from the element
   * @param el
   * @param className
   */
  function removeClass(els, className) {
    var i,
        len =0;

    if(els.length && els.length > 1) {
      len = els.length;
      for (i = 0; i < len; i++) {
        _removeClass(els[i], className);
      }
    } else {
      _removeClass(els, className);
    }

    function _removeClass(el, className) {
      var classArr;
      if(hasClass(el, className)) {
        classArr = el.className.split(' ');
        classArr = classArr.filter(function(cname) {
          return className !== cname;
        });

        el.className = classArr.join(' ');
      }
    }
  }

  /**
   * prototypal extend
   * @param destination
   * @param source
   * @returns {*}
   */
  function extend(child, base) {
    var f = function(){};
    f.prototype = base;
    child.prototype = new f();
    child.prototype.super = base;
    return child;
  }

  instance = exports._ || {};

  instance.addClass = addClass;
  instance.hasClass = hasClass;
  instance.removeClass = removeClass;
  instance.extend = extend;

  exports._ = instance;

}());

/**
 * Generates Object unique id.. for using object as key
 */
(function(){
  var id = 0;

  Object.prototype.uid = function() {
    if(this.__uid === undefined) {
      this.__uid = id++;
    }
    return this.__uid;
  }
}());