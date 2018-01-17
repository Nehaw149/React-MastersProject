'use strict';

const QuickSort = require('./quickSort');
const Path      = require('./path');

module.exports = function(path, matrix){
   //console.log(path);
   var sumcode=0;    // the sum code is used to sort the cycles

  // var indices = path.edgeIndices();
   var indices = [];
   path.valueflows.forEach(function(valueflow){
      var edgeId =  matrix.edgeMaps2e().get(valueflow.name).getId();
      indices.push(edgeId);
   });

   new QuickSort().sort(indices);
  //  console.log(indices);

   var newPath = new Path(null,matrix.DIM); //Array of edges

/*    for(var i=0; i<indices.length; i++) {
   			newPath.path.push(matrix.edgeMapi2e().get(indices[i]));
   			sumcode += indices[i];
   		}
*/
     for(var i=0; i<indices.length; i++) {
        newPath.path.push(path.valueflows[i]);
        sumcode += indices[i];
      }

      newPath.value = path.value;

  		for(var i=0; i<matrix.DIM; i++) {
         //newPath.cyclecheck[i] = path.cycleCheck(i);
           newPath.cyclecheck[i] = path.cyclecheck[i];
       }

    function sumCode() {  return sumcode;  }

  /*  function compare(c) {
      for(var i=0; i<newPath.length(); i++) {
  			if (newPath.getEdge(i).getId() != c.newPath.getEdge(i).getId())
  				return false;
  		}
  		return true;
	}*/

  function compare(c) {
      for(var i=0; i<newPath.length(); i++) {
  			if (indices[i] != c.indices[i])
  				return false;
  		}
  		return true;
}

  function print(index) {
    var length = newPath.length();
    var help   = '   ';
    for(var i=0; i<length; i++) {
      help += newPath.path[i].getName()+'  ';
    }

    console.log(index+'     '+length+'       '+newPath.value+'      '+help);
}

 return{
   newPath : newPath,

   sumCode : sumCode,

   compare : compare,

   indices : indices,

   print   : print
 }//end Return
}//end function
