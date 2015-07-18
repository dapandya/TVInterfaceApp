(function () {
  'use strict';

  var Navigable = require('Navigable'),
    _ = require('_');

  /**
   * Movie grid component
   * @implements Navigable
   * @constructor
   */
  function MovieGridComponent() {
    var outerEl,
      data,
      navigableEls;

    function generateMovieList(data) {
      var listElments = data.map(function (val) {
        return '<li class="navigable"><img src="images/movieThumbs/' + val + '.jpg" alt="' + val + '" title = "' + val + '"/></li>';
      });
      listElments = listElments.join('');
      outerEl.innerHTML = listElments;
    }


    /**
     * Initializes component
     * @param config
     */
    function initialize (config) {
      outerEl = config.outerEl;
      data = config.data;

      if (data) {
        generateMovieList(data);
      }

      navigableEls = outerEl.getElementsByClassName('navigable');
      config.navigableEls = navigableEls;
      this.super.initialize(config);
    }

    this.initialize = initialize;
  }

  exports.MovieGridComponent = _.extend(MovieGridComponent, new Navigable());
}());