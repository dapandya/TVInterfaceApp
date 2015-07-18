(function () {
  'use strict';
  /**
   * Supports one or tow dimensional navigable matrix
   * @constructor
   */
  function Navigable() {

    var _ = require('_'),
      currentLocation = {
        x: 0,
        y: 0
      },
      looseFocusDirection,  // When current location reaches to the matrix edge..Which direction makes the navigable to loose focus
      navigableEls,
      totalCount,           // total number of navigable items
      totalColumns,         // count of items per row
      totalRows,
      CLASS_ACTIVE = 'active',
      outerEl;


    /**
     * Given location, checks if index out of bound or not
     * @param location
     * @returns {boolean}
     */
    function isOffTheEdge(location) {
      var atIndex = locationToIndex(location);
      return atIndex >= totalCount || atIndex < 0 || location.x >= totalRows || location.y >= totalColumns || location.x < 0 || location.y < 0;
    }

    /**
     * Translate {x, y} location into index
     * @param location
     * @returns {*}
     */
    function locationToIndex (location) {
      var atIndex = (location.x * totalColumns) + location.y;
      return atIndex;
    }

    /**
     * Translate index to {x, y} location
     * @param index
     * @returns {{x: Number, y: number}}
     */
    function indexToLocation (index) {
      var x = parseInt(index / totalColumns, 10),
          y = totalCount - (x * totalColumns) - 1;

      return {
        x: x,
        y: y
      };
    }

    /**
     * Determines the number of column given elementList has
     * @param elementList
     * @returns {number}
     */
    function getColumnCount(elementList) {
      var len = elementList.length,
        i,
        rowCount = 0,
        lastOffSetTop;


      lastOffSetTop = elementList[0].offsetTop

      for (i = 1; i < len; i++) {
        if (elementList[i].offsetTop === lastOffSetTop) {
          rowCount++;
        } else {
          rowCount++;
          return rowCount;
        }
      }
    }


    /**
     * Sets the navigable on given location active
     * @param currentLocation
     */
    function setActive(location) {
      location = location || currentLocation;
      var currentIndex = locationToIndex(location);
      // set active class
      _.removeClass(navigableEls, CLASS_ACTIVE);
      _.addClass(navigableEls[currentIndex], CLASS_ACTIVE);

      // call selection change handler if implemented by extended class
      if(this.processSelectionChanged) {
        this.processSelectionChanged(navigableEls[currentIndex]);
      }
      _.addClass(outerEl, CLASS_ACTIVE);
      navigableEls[currentIndex].scrollIntoView(false);
    }

    function looseFocus() {
      _.removeClass(outerEl, CLASS_ACTIVE);
    }

    /**
     * Navigate left
     */
    function left() {
      var newLocation = {
        x: currentLocation.x,
        y: currentLocation.y - 1
      };

      if (isOffTheEdge(newLocation)) {
        if (looseFocusDirection === 'left') {
          // inform caller that this component needs to loose focus
          return true;
        }
        return;
      }
      currentLocation = newLocation;
      this.setActive(currentLocation);
    }

    /**
     * Navigate right
     */
    function right() {
      var newLocation = {
        x: currentLocation.x,
        y: currentLocation.y + 1
      };

      if (isOffTheEdge(newLocation)) {
        if (looseFocusDirection === 'right') {
          // inform caller that this component needs to loose focus
          return true;
        }
        return;
      }
      currentLocation = newLocation;
      this.setActive(currentLocation);
    }

    /**
     * Navigate top
     */
    function top() {
      var newLocation = {
        x: currentLocation.x - 1,
        y: currentLocation.y
      };

      if (isOffTheEdge(newLocation)) {
        if (looseFocusDirection === 'top') {
          // inform caller that this component needs to loose focus
          return true;
        }
        return;
      }
      currentLocation = newLocation;
      this.setActive(currentLocation);
    }

    /**
     * Navigate bottom
     */
    function down() {
      var newLocation = {
        x: currentLocation.x + 1,
        y: currentLocation.y
      };

      if (isOffTheEdge(newLocation)) {
        if (looseFocusDirection === 'bottom') {
          // inform caller that this component needs to loose focus
          return true;
        }

        // if off the bottom edge set it to last element
        newLocation = indexToLocation(totalCount - 1);
      }

      currentLocation = newLocation;
      this.setActive(currentLocation);
    }

    /**
     * Initializes navigable component
     * @param config {
     * navigableEls: //list of elements to navigate
     * looseFocusDirection: // direction after on matrix edge to loose focus
     * }
     */
    function initialize(config) {
      looseFocusDirection = config.looseFocusDirection;
      navigableEls = config.navigableEls;
        outerEl = config.outerEl;

      // nothing to navigate
      if (!navigableEls.length) {
        return;
      }

      totalCount = navigableEls.length;
      totalColumns = getColumnCount(navigableEls);
      totalRows = parseInt(Math.ceil(totalCount / totalColumns), 10);
      // reset current location to 0
      currentLocation = {
        x: 0,
        y: 0
      };
    }

    /**
     * overriden so that this object can be used as a key in an object
     * @returns {*}
     */
    function toString() {
      return this.uid();
    }
    this.toString = toString;
    this.left = left;
    this.right = right;
    this.top = top;
    this.down = down;
    this.setActive = setActive;
    this.initialize = initialize;
    this.looseFocus = looseFocus;

  }

  exports.Navigable = Navigable;

}());