
angular.module('genomeApp')
	.directive('dropDown',function(){
		return{
      templateUrl:'/common/partials/directive-drop-down.html',
      replace:true,
      restrict:'E',
      scope:{
        items        :'=',
        selectedItem :'='
      },
			link: function postLink(scope, element, attrs) {

        /* If multiple dropdowns on page need a unique id
         */
        function getId(){
          var TOKEN_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          var chars = [];
          for (var i = 0; i < 8; i++) {
            var index = Math.floor(Math.random() * TOKEN_CHARS.length);
            chars.push(TOKEN_CHARS[index]);
          }
          return chars.join('');
        }



        /* Set labels */
        var label    = element.children('button');
        var dropDown = element.children('ul');
        var id       = getId();

        label.attr('data-dropdown',id);
        dropDown.attr('id',id);

        /* Apply foundation properties to element */
        $(document).foundation(element);


        /* Select and Close */
        scope.selectItem = function(item,index){
          if (index === 0) return;
          scope.selectedItem = item;
          Foundation.libs.dropdown.close(dropDown);
        };

      }
		}
	});