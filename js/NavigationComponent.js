(function () {
  'use strict';

  var Navigable = require('Navigable'),
    _ = require('_');

  /**
   * Navigation component
   * @implements Navigable
   * @constructor
   */
  function NavigationComponent() {
    var outerEl,
      data,
      navigableEls,
      contentTitleEl = document.getElementById('title');

    /**
     * Initializes component
     * @param config
     */
    function initialize (config) {
      outerEl = config.outerEl;
      navigableEls = outerEl.getElementsByClassName('navigable');
      config.navigableEls = navigableEls;
      this.super.initialize(config);
    }

    /**
     * Handles selection change
     * gets called by base class
     * @overridden
     * @param el
     */
    function processSelectionChanged(el) {
      var event = new Event('urlChanged');
      event.url = el.getAttribute('data-href');
      outerEl.dispatchEvent(event);
      // set the content title
      contentTitleEl.innerHTML = el.innerHTML;
    }

    this.initialize = initialize;
    this.processSelectionChanged = processSelectionChanged;
  }

  exports.NavigationComponent = _.extend(NavigationComponent, new Navigable());
}());