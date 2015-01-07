
angular.module('genomeApp')
	.directive('geAdvancedSearch',function(SearchQuery,NcbiApi,$timeout){
		return{
      templateUrl : '/search/directives/advanced-search/advanced-search.partial.html',
      replace:true,
      restrict:'E',
      scope: {
        isOpen     : '=',
        selectedDb :'='
      },
      link: function(scope,element){

        scope.advancedFilters = [];
        scope.selected = {
          advancedFilter: null
        };
        scope.newAdvancedFilter = {
          text : ''
        };

        scope.advancedFilterOperators = [
          {name:'AND'},
          {name:'OR'},
          {name:'NOT'}
        ];
        scope.selectedAdvancedFilterOperator = scope.advancedFilterOperators[0];

        scope.queryParams = SearchQuery.getParams();



        scope.clearAll = function(){
          scope.selected.advancedFilter = null;
          scope.newAdvancedFilter.text = '';
          scope.selectedAdvancedFilterOperator = scope.advancedFilterOperators[0];
          SearchQuery.removeAllParams();
        };

        scope.addAdvancedFilter = function(operator,filter,text){
          SearchQuery.addParam({
            operator : operator.name,
            fullname : filter.fullname,
            field    : filter.name,
            text     : text
          });
          scope.newAdvancedFilter.text = '';
        };

        scope.removeParam = function(param){
          SearchQuery.removeParam(param);
        };


        scope.selectFilter = function(f){
          scope.selected.advancedFilter = f;
        };

        scope.isFirst = function(){
          return scope.queryParams.length === 0;
        };

         scope.search = function(){
          SearchQuery.setCurrentTextFromParams();
          scope.isOpen = false;
         };

         scope.close = function(){
          scope.isOpen = false;
         };


         var speed = 200;

         function animateClose(){
          element.animate({height:"0"},speed);
          $timeout(function(){
            element.css({'display':'none'});
            scope.isOpen = false;
          },speed);
         }

         function animateOpen(){
          element.css({'display':'block'});
          element.animate({height:"80%"},speed);
          scope.isOpen = true;
         }

         scope.$watch('isOpen',function(newVal){
          if (newVal){
            animateOpen();
          } else{
            animateClose();
          }
         });

         scope.$watch(function(){
          return SearchQuery.getTextFromParams();
         },function(newVal){
          scope.queryStr = newVal;
         });

        /* Advanded Filters
         */
         scope.$watch('selectedDb.name',function(newVal){
          if (newVal){
            scope.advancedFilters.length = 0;
            // scope.advancedFilters = [
            //   {fullname:'first', name:'first',  description:'first desc'},
            //   {fullname:'second',name:'second', description:'second desc'},
            //   {fullname:'thrisd',name:'third',  description:'third desc'},
            //   {fullname:'first', name:'first',  description:'first desc'},
            //   {fullname:'second',name:'second', description:'second desc'},
            //   {fullname:'thrisd',name:'third',  description:'third desc'},
            //   {fullname:'first', name:'first',  description:'first desc'},
            //   {fullname:'second',name:'second', description:'second desc'},
            //   {fullname:'thrisd',name:'third',  description:'third desc'},
            //   {fullname:'first', name:'first',  description:'first desc'},
            //   {fullname:'second',name:'second', description:'second desc'},
            //   {fullname:'thrisd',name:'third',  description:'third desc'},
            //   {fullname:'first', name:'first',  description:'first desc'},
            //   {fullname:'second',name:'second', description:'second desc'},
            //   {fullname:'thrisd',name:'third',  description:'third desc'},
            // ];
            NcbiApi.info({db:newVal}).then(function(data){
              scope.advancedFilters = data.einforesult.dbinfo.fieldlist;
            },function(err){
              console.log(err);
            });
          }
         });
      }
		};
	});