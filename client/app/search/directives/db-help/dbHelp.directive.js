
angular.module('genomeApp')
	.directive('geDbHelp',function(SearchQuery,NcbiApi,$timeout){
		return{
      templateUrl : '/search/directives/db-help/db-help.partial.html',
      replace:true,
      restrict:'E',
      scope: {
        isOpen     : '=',
        selectedDb :'='
      },
      link: function(scope,element){

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

      }
		};
	});