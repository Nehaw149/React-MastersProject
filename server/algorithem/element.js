'use strict';
//const Path = require('./path');
const _ = require('lodash');
module.exports = function (Edge, DIM){
  const Path = require('./path');
   var paths = [];// To Store The pathes between Two stakeholders

  //Use for read the values in Files
   if(Edge){
     //Create New Path and add it to the Paths Array
     var p = new Path(Edge, DIM);
     paths.push(p);
   }


   return {
     paths:paths,
     // used for reading from the file when having multiple edges between two vertices
     addPath: (Edge, DIM) => {
     		var p = new Path(Edge, DIM);
     		paths.push(p);
     	},

     pathNumber: () =>{
         return paths.length;
      },

     getPath: (index) => {
         return paths[index];
     },

     plus: (element) => {
        for (var i=0; i < element.pathNumber(); i++){
             paths.push(element.getPath(i));
        }
     },
     // to string
     toString: ( start, end ) => {
       var s = "";
       for(var i=0; i<paths.length; i++) {
         s += "Path (" + start + ", " + end + ")." + i + ": " + paths[i].toString();
       }
       return s;
     },

    multi: (element1, element2, element, DIM) => {
        if (element1 == 0 || element2 == 0) {return null;}

        for(var i = 0; i < element1.pathNumber(); i++){
           for (var j = 0; j < element2.pathNumber(); j++){
             var path1 = _.cloneDeep(element1.getPath(i));
            //console.log('the path1 '+path1.cycleCheck(j))
             var path2 = element2.getPath(j);
             var lc =   Path().connect(path1, path2);

             if(lc != null){
               var p = new Path(null, DIM, path1, path2, lc);
               //add the new constructed path to the return element

               element.paths.push(p);
             }
        }// end for the second element
       }// end for the first element
       if (element.pathNumber() == 0) return null;
	       	return element;
     }// End Function multi
   }; // End Return
}//End Function
