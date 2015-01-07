angular.module('genomeApp')
	.factory('RequestHandler',function(NcbiApi){


    /* Helpers
    */
    function unescapeHTML(escapedHTML) {
      if (!escapedHTML) return '';
      return escapedHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/(\r\n|\n|\r)/gm,"");
    }



    /* Some DBs have different api requirements
     * Handle each specific case here
     */

    var query = {

      summary: {

        general: function(db,ids){
          var options = { db: db, id: ids.join() };
          return NcbiApi.summary(options);
        },

        /* Provides a string of XML in conceptmeta
         * that needs to be JSONified
         */
        medgen: function(db,ids){
          var options = {
            db : db,
            id : ids.join(),
            transformResponse : function(data) {
              angular.forEach(data.result, function(t){

                /* Wrap XML in single root */
                var str = '<result>' + unescapeHTML(t.conceptmeta) + '</result>';

                /* Very important property, allows consistent view rendering (no confustion btwn [] and {} ) */
                var x2js = new X2JS({
                    arrayAccessForm: "property"
                });

                t.meta =x2js.xml_str2json(str);
              });
              return data;
            }
          };

          return NcbiApi.summary(options);
        }
       },


      /* Only some DBs have data available for fetch (do not use general function)
       * Also each db with fetch has different query (retmode,rettype) requirements
       * See table for options -> http://www.ncbi.nlm.nih.gov/books/NBK25499/table/chapter4.T._valid_values_of__retmode_and/?report=objectonly
       */
      fetch: {

        protein: function(db,id){

          var options = {
            db                : db,
            id                : id,
            retmode           : 'xml',
            rettype           : 'fasta',
            transformResponse : function(value) {
              var x2js = new X2JS();
              return x2js.xml_str2json(value);
            }
          };

          return NcbiApi.fetch(options);
        }
      }

    };




    /* Public Api
     */
		return{

      summary: function(db,ids){
        var summaryFunc = query.summary[db];

        if (summaryFunc) return summaryFunc(db,ids);
        else             return query.summary.general(db,ids);
      },

      fetch: function(db,id){
        var fetchFunc = query.fetch[db];

        if (fetchFunc) return fetchFunc(db,id);
        else           return null;
      }

		};
	});