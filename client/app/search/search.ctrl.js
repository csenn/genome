
angular.module('genomeApp')

	.controller('SearchCtrl',function($scope,$http,NcbiApi,RequestHandler,SearchQuery){

		/* Init Variables
		*/
		$scope.dbs = [
      {display : 'Choose One',  name:null,      desc: 'Brief Description'},
			{display : 'Gene',        name:'gene',    desc: 'Gene provides detailed information about genes'},
			{display : 'Med Gen',     name:'medgen',  desc: 'Med Gen provides medical literature about genetic diseases and findings'},
			{display : 'Protein',     name:'protein', desc: 'Protein provides sequence and genome info'}
		];
		$scope.selectedDb = $scope.dbs[0];

    $scope.selectedData = {
      summary : null,
      details : null
    };

    $scope.showZeroResults = false;

    $scope.search = {
      text        : '',
      results     : [],
      resultCount : 0,
      query       : {
        page  : 0,
        limit : 10
      },
     };


    /* Helpers
     */
    $scope.getSynonymnString = function(arr){
      if (!angular.isArray(arr)) return '';
      return arr.join('; ');
    };

    // $scope.getResultRank = function(index){
    //   return $scope.searchQuery.page * $scope.searchQuery.limit + index + 1;
    // };

    $scope.getPageSpread = function(){
      var first,last;
      var page  = $scope.search.query.page;
      var limit = $scope.search.query.limit;
      var total = $scope.search.resultCount;
      if (!total) return;

      first = page * limit + 1;
      last  = page * limit + limit;

      if (last > total){
        last = total;
      }

      return first + '-' + last;
    };


    $scope.$watch('selectedDb',function(newVal){
      $scope.showZeroResults = false;
    });

    $scope.$watch('search.text',function(newVal){
      $scope.showZeroResults = false;
    });

		//var db    = 'protein';
		//var query = 'Dystrophin[title]+AND+homo+sapiens[organism]';

		//var db    = 'medgen';

		//db ="gene";
		//var query = 'achondroplasia';
		//$scope.searchText = 'FGFR3';
		//var db    = 'genome';
		//var query = 'homo sapiens';
		//retmax:10
		//retstart

    /* Help and Advanced Toggles
    */
    $scope.toggleHelp = function(){
      $scope.showHelp = !$scope.showHelp;
      if ($scope.showAdvanced){
        $scope.showAdvanced = false;
      }
    };


    $scope.toggleAdvanced = function(){
      $scope.showAdvanced = !$scope.showAdvanced;
      if ($scope.showAdvanced){
        $scope.showHelp = false;
      }
    };





    /* Search
     */
    $scope.$watch(function(){
      return SearchQuery.getCurrentTextReadable();
    },function(newVal){
      $scope.showDbTutorial = false;
      $scope.search.text = newVal;
      search();
    });

		$scope.searchForText = function(text){
      $scope.search.query.page = 0;
      SearchQuery.setCurrentText(text);
      if ($scope.selectedDb.name === 'medgen'){
        SearchQuery.setCurrentText(text + ' AND "diseases"[Filter]');
      }
			//query += '+AND+medgen_gene_diseases[Filter]';
			//query +=  '+AND+disease+or+syndrome[semantictype]';
		};

    $scope.nextPage = function(){
      var s = $scope.search;

      var total = s.resultCount;
      var limit = s.query.limit;
      var check = s.query.page + 1;

      if ( check * limit >= total) return;
      s.results.length = 0;
      s.query.page += 1;
      search();
    };

    $scope.previousPage = function(){
      var s = $scope.search;

      if ( s.query.page > 0 ){
        s.results.length = 0;
        s.query.page -= 1;
        search();
      }
    };


    function search(){

      var db   = $scope.selectedDb.name;
      var text = SearchQuery.getCurrentTextMachine();

      if (!db || !text) return;

      /* Todo: sort parameters can be differ in each DB, need to find source */
      var options = {
        db       : db,
        search   : text,
        retmax   : $scope.search.query.limit,
        retstart : $scope.search.query.limit * $scope.search.query.page,
        sort     : 'relevance'
      };

      $scope.showZeroResults = false;

      NcbiApi.search(options).then(function(data){
        var ids   = data.esearchresult.idlist;
        var count = Number(data.esearchresult.count);
        $scope.search.resultCount = count;
        if (count === 0){
          console.log('asdasd');
          $scope.showZeroResults = true;
        }
        if(ids && ids.length){
           getDataSummary(ids);
        }
      },function(err){
        console.log(err);
      });
    }




	  //getData('protein','kinase[title]+AND+homo+sapiens[organism]');

	  // $scope.selectSearchResult = function(result){
	  // 	getOtherOtherData(db,result.uid);
	  // };


	  $scope.selectSearchResult = function(result){
	  	$scope.selectedData.summary = result;
      getDataDetailed(result.uid);
	  };

		function getDataSummary(ids){

      var db = $scope.selectedDb.name;

      RequestHandler.summary(db,ids).then(function(data){
        $scope.search.results = data.result;
      },function(err){
        console.log(err);
      });
		}


		function getDataDetailed(id){

      var db      = $scope.selectedDb.name;
      var promise = RequestHandler.fetch(db,id);

      if (promise){
        promise.then(function(data){
          $scope.selectedData.details = data;
        },function(err){
          console.log(err);
        });
      }

		}




	});