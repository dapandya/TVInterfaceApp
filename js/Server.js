/**
 * This is a Mock Server
 * - Supports only [get] operations
 * - Simulates latency upto 1 sec
 */
(function () {
  'use strict';

  var _ = require('_'),
    serverInstance,
    MAX_DELAY = 1000,   // max server latency
    MAX_DATA_SIZE = 41; // this is because we only have 41 images to render

  /**
   * A generic mock server for the app
   * @returns {*}
   * @constructor
   */
  function Server() {
    // make Server singleton
    if (serverInstance) {
      return serverInstance;
    }

    /**
     * Returns a unique list
     * @returns {Array}
     */
    function getSampledList() {
      var offset = parseInt(Math.random() * 10, 10),
        result = [],
        i;

      for (i = offset + 1; i < MAX_DATA_SIZE; i++) {
        result.push(i);
      }

      return result;
    }

    /**
     * Returns a list given query
     * @param query
     * @returns promise | on resolve returns a list given the query
     */
    function get(query) {
      var latency = parseInt(Math.random() * MAX_DELAY, 10),
        dfd = _.deferred(),
        result;

      setTimeout(function () {
        result = getSampledList();
        dfd.resolve(result);
      }, latency);

      return dfd.promise();
    }

    serverInstance = {};
    serverInstance.get = get;
    return serverInstance;
  }


  exports.Server = Server;
}());