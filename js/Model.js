/**
 * Calls Server, returns data given url
 * Maintains data cache and ensures data is always fresh (data freshness latency is 30s)
 */
(function () {
  'use strict';

  var _ = require('_'),
    Server = require('Server'),
    dataCache = {},
    modelInstance,
    cacheExpireDelay;


  /**
   * Generic Model for the App
   *
   * @param _cacheExpireDelay
   * @returns {*}
   * @constructor
   */
  function Model (_cacheExpireDelay) {

    cacheExpireDelay = _cacheExpireDelay || 30000;
    // return singleton instance
    if (modelInstance) {
      return modelInstance;
    }

    function getTime() {
      var currTime = new Date();
      return currTime.getTime();
    }

    /**
     * Checks if cached data is expired or not
     * @param cachedData
     * @returns {boolean}
     */
    function isExpired(cachedData) {
      var timestamp = cachedData[timestamp];

      if((timestamp + _cacheExpireDelay) < getTime()) {
        return true;
      }
    }

    /**
     * Sets the data into cache
     * @param url
     * @param data
     */
    function set(url, data) {
      dataCache[url] = {
        timeStamp: getTime(),
        data: data
      };
    }

    /**
     * Return data on resolve given url
     * - immediately returns cachedData if not expired else makes server call
     * @param url
     * @returns promise
     */
    function get(url) {
      var dfd = _.deferred(),
        cachedData = dataCache[url];

      if (cachedData && !isExpired(cachedData)) {
        return dfd.resolve(cachedData.data);
      }

      _.when(Server().get(url)).then(function (data) {
        set(url, data);
        return dfd.resolve(data);
      });

      return dfd.promise();
    }


    modelInstance = {
      get: get
    };

    return modelInstance;

  }

  exports.Model = Model;

}());