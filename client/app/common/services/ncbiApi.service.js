angular.module('genomeApp')
	.factory('NcbiApi',function($http,$q,$rootScope){


    /* Url
    */
    var URL_ROOT = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils';

    var URLS = {
      INFO    : URL_ROOT + '/einfo.fcgi',
      SEARCH  : URL_ROOT + '/esearch.fcgi',
      SUMMARY : URL_ROOT + '/esummary.fcgi',
      FETCH   : URL_ROOT + '/efetch.fcgi'
    };



    /* Helpers
    *  Append Transform Function instead of replacing
    */
    function appendTransform(defaults, transform) {
      defaults = angular.isArray(defaults) ? defaults : [defaults];
      return defaults.concat(transform);
    }



    /* Track Number of requests
     */
    var requestCount = 0;

    function requestSent(){
      requestCount += 1;
      if (requestCount === 1){
        $rootScope.$emit('request-sent');
      }
    }

    function requestRecieved(){
      requestCount -= 1;
      if (requestCount === 0){
        $rootScope.$emit('requests-received');
      }
    }



    /* Build Request - method,url
     */

    function buildRequest(options){
      var deferred = $q.defer();
      requestSent();
      $http(options).success(function(data){
        requestRecieved();
        deferred.resolve(data);
      }).error(function(err){
        requestRecieved();
        deferred.reject(err);
      });
      return deferred.promise;
    }




    return {

      info: function(options){

        var opts = {
          method :'GET',
          url    : URLS.INFO,
          params : {
            db      :  options.db,
            version : '2.0',
            retmode :  options.retmode || 'json',
          }
        };

        return buildRequest(opts);
      },



      search: function(options){

        var opts  = {
          method : 'GET',
          url    : URLS.SEARCH + '?term=' + options.search,
          params : {
            db       : options.db,
            retmax   : options.retmax   || 20,
            retstart : options.retstart || undefined,
            retmode  : options.retmode  || 'json',
            sort     : options.sort     || undefined
          }
        };

        return buildRequest(opts);
      },


      summary: function(options){

        var opts = {
          method : 'GET',
          url    : URLS.SUMMARY,
          params : {
            db      : options.db,
            retmode : options.retmode || 'json',
            id      : options.id
          }
        };

        if (options.transformResponse) {
          opts.transformResponse = appendTransform($http.defaults.transformResponse, options.transformResponse);
        }

        return buildRequest(opts);
      },


      fetch: function(options){

        var opts  = {
          method : 'GET',
          url    : URLS.FETCH,
          params : {
            db      : options.db,
            id      : options.id,
            retmax  : options.retmax  || 20,
            retmode : options.retmode || undefined,
            rettype : options.rettype || undefined
          }
        };

        if (options.transformResponse) {
          opts.transformResponse = appendTransform($http.defaults.transformResponse, options.transformResponse);
        }

        return buildRequest(opts);
      }

    };
	});