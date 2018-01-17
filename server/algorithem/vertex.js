'use strict';


//This Object is use to represent The Stakeholder
module.exports = function(name, index, _id) {
  // Store The Name of the Stakeholder
   var name   = name;
 //To assign an Numeber to the Stakeholder
   var intval = index;

   var _id   = _id;


   return {

    getIntval:() => {
      return intval;
    },

  //Return The Name Of The Stakeholder
    getName:() => {
      return name;
    },

    getId:() =>{
      return _id;
    }

  }//End The return
}//End The Function
