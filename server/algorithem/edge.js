'use strict';

//var ID=0; // Represent The ID of the edge(Value Flow)

//This Object is represent The Value Flow
module.exports = function( name, start, end, value, id, _id ){

 var name  = name;
 var start = start; // The index of the start Stakeholder
 var end   = end;  //  The index of the end Stakeholder
 var value = value; //The score of the value flow
 var id    = id; //Represent The Internal id
 var _id   = _id;
 //ID++;//Increse The Number of the global ID

function getId() {  return id;  }

return {

 // This is not Right I should Change it
   getID: () => {
         return getId()+1;
     },

   toString: () => {
       return "Edge [" + name + "];  ";
    },

  getName:  () =>  {  return name;  },
  getId:getId,
  getStart: () =>  {  return start;  },
  getEnd:   () =>  {  return end;  },
  getValue: () =>  {  return value;  },
  getObjectId:() => { return _id}
} // end The Return

}// End The Constructor Function
