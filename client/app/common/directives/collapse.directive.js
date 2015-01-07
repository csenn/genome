angular.module('genomeApp')
	.directive('geCollapse',function(){
    return{
      templateUrl:'/common/partials/directive-collapse.html',
      replace:true,
      restrict:'E',
      transclude: true,
      scope: {
        label : '=',
        showIcon : '='
      },
			link: function postLink(scope, element, attrs) {

        scope.isOpen = attrs.open || false;

        scope.doShowIcon = function(){
          if (!attrs.showIcon) return true;
          else return scope.showIcon ? true : false;
        };

      }
		};
	});