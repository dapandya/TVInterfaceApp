(function (document) {
  'use strict';

  var _ = require('_'),
    NavigationComponent = require('NavigationComponent'),
    MovieGridComponent = require('MovieGridComponent'),
    Model = require('Model');

  /**
   * TV interface App
   * @constructor
   */
  function App() {
    var outerEl,
      data,
      currentFocusComponent,
      KEY_NAMES = {
        LEFT: 'left',
        RIGHT: 'right',
        TOP: 'top',
        DOWN: 'down',
        ENTER: 'enter'
      },
      KEYBOARD_EVENT_TO_FUNCTION_LOOKUP = {
        37 : KEY_NAMES.LEFT,
        39: KEY_NAMES.RIGHT,
        38: KEY_NAMES.TOP,
        40: KEY_NAMES.DOWN,
        13: KEY_NAMES.ENTER
      },
      componentFocusTransferMap = {},
      movieGridConfig,
      navigationConfig,
      movieGridComponent,
      leftSideNavigationComponent;

    /**
     * Transfers focus from old to new component.. depending on componentFocusTransferMap
     * @param eventName
     */
    function handleLooseFocus(eventName) {
      var newFocusComponent = componentFocusTransferMap[currentFocusComponent][eventName];
      if(newFocusComponent) {
        setFocus(newFocusComponent);
      }
    }

    /**
     * Handles key press events
     * Note: Currently only supports up, down, left, right
     * @param event
     */
    function handleKeyPress(event) {
      var functionName = KEYBOARD_EVENT_TO_FUNCTION_LOOKUP[event.keyCode],
        shouldLooseFocus;
      if(functionName && typeof currentFocusComponent[functionName] === 'function') {
        shouldLooseFocus = currentFocusComponent[functionName].apply(currentFocusComponent);

        if(shouldLooseFocus) {
          handleLooseFocus(functionName);
        }

      }
    }

    /**
     * Fetches new movie data given url
     * @param event
     */
    function processUrlChanged(event) {
      var url = event.url;
      Model().get(url).then(function (_data) {
        // update data and re-initialize grid
        movieGridConfig.data = _data;
        movieGridComponent.initialize(movieGridConfig);
      });
    }

    /**
     * Binds key press events
     */
    function bindKeyPressEvents() {
      document.addEventListener('keydown', handleKeyPress);
    }

    /**
     * Binds navigational events
     * @param outerEl
     */
    function bindNavigationEvents(outerEl) {
      outerEl.addEventListener('urlChanged', processUrlChanged);
    }

    /**
     * Sets up looseFocus trasfer map
     * For ex: when on left event, the control should go from navigation to movie grid.
     * and on right event when user is on movie grid column 0, it should move to navigation
     */
    function setupLooseFocusMap() {
      var tmp = {};
      tmp[KEY_NAMES.RIGHT] = movieGridComponent;
      componentFocusTransferMap[leftSideNavigationComponent] = tmp;

      tmp = {};
      tmp[KEY_NAMES.LEFT] = leftSideNavigationComponent;
      componentFocusTransferMap[movieGridComponent] = tmp;
      // TODO: add support for movie search screen
      //  componentFocusTransferMap[searchComponent] = {keyPressDirection: KEY_NAMES.DOWN, newFocusComponent: movieGridComponent};
    }

    /**
     * Sets the focus on given component
     * focused component will respond to navigation events until it looses focus
     * @param comp
     */
    function setFocus(comp) {
      if(currentFocusComponent) {
        currentFocusComponent.looseFocus();
      }
      currentFocusComponent = comp;
      comp.setActive();
    }


    /**
     * Initializes the App
     * Note: Currently this app supports nav and movieGrid components
     * More can be added and wired up to implement further functionalities
     * @param config
     */
    function initialize() {
      var navigationOuterEl = document.getElementById('navigation'),
        gridOuterEl = document.getElementById('grid');

      // set up navigation component
      navigationConfig = {
        outerEl: navigationOuterEl,
        looseFocusDirection: KEY_NAMES.RIGHT
      };
      leftSideNavigationComponent = new NavigationComponent();
      leftSideNavigationComponent.initialize(navigationConfig);
      bindNavigationEvents(navigationOuterEl);

      // set up movie grid component
      movieGridConfig = {
        outerEl: gridOuterEl,
        looseFocusDirection: KEY_NAMES.LEFT
      };
      movieGridComponent = new MovieGridComponent();
      movieGridComponent.initialize(movieGridConfig);

      bindKeyPressEvents();
      setupLooseFocusMap();
      // set initial focus on navigation comp
      setFocus(leftSideNavigationComponent);
    }

    this.initialize = initialize;
  }

  exports.App = App;

}(document));

// Start the app
var App = require('App');
window.addEventListener('load', function () {
  var app = new App();
  app.initialize();
});