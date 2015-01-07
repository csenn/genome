
angular.module('genomeApp')
	.directive('geSearchSlider',function($location){
		return{
      replace:true,
      restrict:'E',
      scope: {},
      controller: function($scope){

        var isOpen = true;
        var time   = 500;
        var right  = 40;
        var left   = 5;

        var leftSide  = null;
        var rightSide = null;


        this.setLeftSide = function(el){
          leftSide = el;
        };

        this.setRightSide = function(el){
          rightSide = el;
        };

        this.toggleOpen = function(){
          if (isOpen){

            leftSide.animate({
              left: '-'+(right-left)+'%'
            },time);

            rightSide.animate({
              left: left+'%'
            }, time);
          }
          else{
            leftSide.animate({left:'0px'},time);
            rightSide.animate({left:right+'%'},time);
          }
          isOpen = !isOpen;
        };

      }
		};
	})


  .directive('geLeftSide',function(){
    return{
      require    : '^geSearchSlider',
      restrict   : 'E',
      replace    : true,
      transclude : true,
      template   :
        '<div id="search-section">' +
          '<button class="toggle-btn grey-btn" ng-click="toggle()" style="float:right;">' +
            '<fa class="fa fa-align-justify"></fa>' +
          '</button>' +
          '<div ng-transclude></div>' +
        '</div>',
      link: function(scope, element, attrs, ctrl){

        ctrl.setLeftSide(element);

        scope.toggle = function(){
          ctrl.toggleOpen();
        };

      }
    };
  })


  .directive('geRightSide',function(){
    return{
      require    : '^geSearchSlider',
      restrict   : 'E',
      replace    : true,
      transclude : true,
      template   : '<div id="search-results" ng-transclude></div>',
      link: function(scope, element, attrs, ctrl){
        ctrl.setRightSide(element);
      }
    };
  });