
angular.module('genomeApp')
	.directive('geSpinner',function($rootScope){
		return{
      template:'<img src="common/images/spinner.gif">',
      replace:true,
      restrict:'E',
			link: function postLink(scope, element, attrs) {

				element.hide();

        $rootScope.$on('request-sent',function(event){
        	element.show();
        });

        $rootScope.$on('requests-received',function(event){
        	element.hide();
        });
      }
		};
	});