angular.module('genomeApp')
	.factory('SearchQuery',function(){

    var currentText = '';
    var params      = [];

    function Param(p){
      this.operator = p.operator;
      this.fullname = p.fullname;
      this.field    = p.field;
      this.text     = p.text;
    }


    /* Factory API
     */
    return {


      /* Current Text
      */
      setCurrentText: function(t){
        currentText = '';
        if (t) currentText = t;
      },

      getCurrentTextReadable: function(){
        return currentText;
      },

      getCurrentTextMachine: function(){
        var readable = currentText;
        var strArr   = readable.split(" ");
        return strArr.join('+');
      },



      /* Advanced Params
      */
      getParams: function(){
        return params;
      },

      addParam: function(param){
        var exists = false;
        angular.forEach(params,function(p){
          if (!exists && p.field === param.field && p.text === param.text){
            exists = true;
          }
        });
        if (!exists){
          params.push(new Param(param));
        }
      },

      removeParam: function(param){
        var index = params.indexOf(param);
        params.splice(index,1);
      },

      removeAllParams: function(){
        params.length = 0;
      },

      getTextFromParams: function(){
        var str = '';
        var len = params.length;
        for (var i=0; i<len; i++){
          if (i > 0){
            str += ' ' + params[i].operator + ' ';
          }
          str += params[i].text + '[' + params[i].field + ']';
        }
        return str;
      },

      setCurrentTextFromParams: function(){
        currentText = this.getTextFromParams();
      }

    };
	});