'use strict';


const DEGREE = 2;

module.exports= function ( edge, DIM, path1, path2, lc){

  //path is array of edge
  var path = [];
  var DIM  = DIM;

  // ensure the condition of simple paths: to check whether the path has already included one or more cycles
  // or to check whether one internal vertex (except the start and end ones) has been visited more than once
  var cyclecheck = new Array(DIM).fill(0);

  var value;

  if(edge){
     // add the edge
     path.push(edge);

     // update the cycle check
     cyclecheck[edge.getStart()]++;
     cyclecheck[edge.getEnd()]++;

     //Store the value of the edge
     value = edge.getValue();

    }// If we want to sote only one edge(Value flow)

if(path1 && path2 && lc){

  // the first path
  for(var i=0; i<path1.length(); i++){
    path.push(path1.path[i]);
  }


  // the second path
  for(var i=0; i<path2.length(); i++)
    path.push(path2.path[i]);
  cyclecheck = lc;

  // ------------ value ---------------
  // can use different methods to update
  //value = path1.value * path2.value;


  value = calcvalue(path1.getValue(), path2.getValue());

}//If we want To Connect Tow Pathes

 function calcvalue (value1, value2)  { return value1 * value2; }

 function getEdge(index){
     return path[index];
 }

 return {

   path:path,

   cyclecheck:cyclecheck,

   value:value,

   DIM:DIM,

   getEdge:  getEdge,

   firstEdge: () => {
      return path[0];
   },

  lastEdge: () => {
     return path[path.length-1];
  },

  getValue: () => {
    return value;
  },

  length: () => {
     return path.length;
  },

  cycleCheck: (index) => {
    return cyclecheck[index];
  },

  // used to connect two paths
  connect: (path1, path2) =>{

    // whether p1.last matchable with p2.first
		if(!path1.connectable(path2)){
       return null;
    }


    var lc = [];
     for(var i=0; i<path1.DIM; i++) {
       lc[i] = path1.cycleCheck(i) + path2.cycleCheck(i);
      //  console.log(path1.cycleCheck(i) +' The Second Path2 is :'+  path2.cycleCheck(i));
       // ensure the condition of simple paths
       if(lc[i] > DEGREE) {
        // console.log('The Length is more than Tow');
         return null;
       }

     }

     // simple paths satisfied, connect the paths together
     //var p = new Path(path1, path2, lc);

     return lc;
  },

  connectable: (path) => {
    /*   Here We schould deal with Internal Assest Condition */
    return true;
  },

 //To store the ids of the Edges (value flows) That constructed the path
  edgeIndices: () => {
    var indices = [];
    for(var i=0; i<path.length; i++) {
      indices[i] = getEdge(i).getId();
    }
    return indices;
  },

  toString: () => {
		var s = "Length: " + path.length + "  " + "Value: " + value + "  ";
	  var i = 0;
		for(i=0; i<path.length; i++) {
			s += path[i].toString();
		}
//		s += path[i].toString() + "\n";
		return s;
	},

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // construct the utility function (value propagation rule) for value paths
  // calcvalue(double, double) is used to define basic operation mode (v1 * v2, or v1 + v2) for utility functions
  // v1 * v2 is suitable for abc, abc^2, and (abc)^2, etc.
  // v1 + v2 is suitable for a+b+c, a+b+c^2, and (a+b+c)^2, etc.
  calcvalue: calcvalue,

  // utility(int) is used to return the variation based on the chosen operation mode
  utility: (u) => {
    var utility = value;
    switch(u) {
      case 0: {	// abc
        utility = value;
        break;
      }
      case 1: {	// abc^2
        utility = value * lastEdge().getValue();
        break;
      }
      default: {
        console.log("Utility function for value paths not defined correctly; Using \"abc\" as default...");
      }
    } // end switch
    return utility;
  }// End utility Function

 }//end Return
}// End function
