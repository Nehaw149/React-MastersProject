'use strict';

const HashMap = require('hashmap');
const Vertex  = require('./vertex');
const Edge = require('./edge');
const Element = require('./element');
//const stakeHolderModel = require('../models/stakeholder');
//const valueFlowModel = require('../models/valueflow');
const projectModel = require('../models/project');

module.exports = function (projectId){

//I use Promise because this Module is Asnyc
return new Promise(function(resolve, reject) {

 // two redundant for input and output convenience
  var vertexmaps2n = new HashMap();
  var vertexmapi2n = new HashMap();

  function vertexMaps2n() {  return vertexmaps2n;  }
  function vertexMapi2n() {  return vertexmapi2n;  }

  // to write the head of InfoEdge
  var edgemaps2e = new HashMap();
  var edgemapi2e = new HashMap();

  function edgeMaps2e() {  return edgemaps2e;  }
  function edgeMapi2e() {  return edgemapi2e;  }

  // to record the edge connection constraints
  //The key is the Edge and the value is array of connectable edges
	var connection = new HashMap();

  var DIM; // decided after reading the vertex information
	var matrix ; // Array used to store elemnts. The size for it is DIM*DIM

    // construct the initial matrix from database
    var stakeholdersNumber = 0;

    projectModel.findById(projectId)
     .populate([{
          path:"stakeholders",
          model: "stakeholder",
        },
        {
          path:"valueflows",
          model:"valueflow",
          populate:[
            {
              path:'from',
              model:'stakeholder'
            },
            {
              path:'to',
              model:'stakeholder'
            }
          ]
        }
      ]
    ).then(function(project){
        //Put The Value of DIM equal to The number of vertex nodes
        DIM = project.stakeholders.length;

        //Make initialization for the matrix array
        matrix = new Array(DIM*DIM).fill(0);

        //for every stakeholder in the database create a vertex
        project.stakeholders.forEach(function(stakeholder){
            // construct a new vertex
            var vertex = new Vertex(stakeholder.name, stakeholdersNumber, stakeholder._id);
            stakeholdersNumber++;
            //Store The new vertes in the HashMap
            vertexmapi2n.set(vertex.getIntval(), vertex);
            vertexmaps2n.set(vertex.getName(), vertex);
        });//end project.stakeholders loop

        // After finish Reading the stakeholders Information, should Read the valueflows
        var edgeId = 0; //To store as edge Id
        project.valueflows.forEach(function(valueflow){
           var newEdge = parseEdge(valueflow, edgeId);

           //check if this egde in the matrix or not
           if (getElement(newEdge.getStart(), newEdge.getEnd()) == 0)
            {
               setElement(newEdge.getStart(), newEdge.getEnd(), new Element(newEdge, DIM));
            }
            else
             {
                getElement(newEdge.getStart(), newEdge.getEnd()).addPath(newEdge, DIM);
             }//end else

             edgemaps2e.set(newEdge.getName(), newEdge);
             edgemapi2e.set(newEdge.getId(), newEdge);
             edgeId++;

        });//end project.valueflows loop

        //Now we are finish, So we can reslove the promise
        resolve ( {
                   vertexMaps2n:vertexMaps2n, // Return The hashmap for vertex, where key is the name of vertex
                   vertexMapi2n:vertexMapi2n, // Return The hashmap for vertex, where key is the id of vertex
                   edgeMaps2e:edgeMaps2e, // Return The hashmap for edges, where key is the name of edge
                   edgeMapi2e:edgeMapi2e, // Return The hashmap for vertex, where key is the id of edge
                   multi:multi, //Multiplay Tow matrix array togather.
                   getElement:getElement, // Retrun Element form the matrix Array
                   setElement:setElement, // Set Element in the matrix Array
                   DIM: DIM,
                   connection:connection,
                   matrix: matrix
               });// End The Resolve

    }).catch(function(error){
       reject(error);
    });


    /*
    //Read The stakeholders from the database
    stakeHolderModel.find({}, function(err, stakeholders)
     {
        if(err)
          {
            reject(err);
          }
        else
          {
            //Put The Value of DIM equal to The number of vertex nodes
            DIM = stakeholders.length;

            //Make initialization for the matrix array
            matrix = new Array(DIM*DIM).fill(0);

            //for every stakeholder in the database create a vertex
            for(var i=0; i<stakeholders.length; i++)
                {
                    // construct a new vertex
                    var vertex = new Vertex(stakeholders[i].name, count, stakeholders[i]._id);
                    count++;
                    //Store The new vertes in the HashMap
                    vertexmapi2n.set(vertex.getIntval(), vertex);
                    vertexmaps2n.set(vertex.getName(), vertex);

                    // After finish Reading the stakeholders Information, should Read the stakeholders file
                    if(i== DIM-1)
                    {
                      //Read The Value flows for the database
                      valueFlowModel.find({}, function(err, valueflows)
                      {
                        if(err)
                        {
                          reject(err);
                        }
                        else
                         {

                           var edgeId = 0; //To store as edge Id
                           //for every value flow in the database create an Edge Object
                           for(var j=0; j<valueflows.length; j++)
                           {
                             (function(index){
                               var newEdge = parseEdge(valueflows[index], edgeId);
                               newEdge.then(function(edge)
                                 {
                                   //check if this egde in the matrix or not
                                   if (getElement(edge.getStart(), edge.getEnd()) == 0)
                                    {
                                       setElement(edge.getStart(), edge.getEnd(), new Element(edge, DIM));
                                    }
                                    else
                                     {
                                        getElement(edge.getStart(), edge.getEnd()).addPath(edge, DIM);
                                     }//end else

                                     edgemaps2e.set(edge.getName(), edge);
                                     edgemapi2e.set(edge.getId(), edge);
                                     edgeId++;

                                     //When we are finish with reading the value flows, the resolve the Promise
                                     if(edgeId == valueflows.length){
                                       //Resolve The Promise
                                       resolve ( {
                                                  vertexMaps2n:vertexMaps2n, // Return The hashmap for vertex, where key is the name of vertex
                                                  vertexMapi2n:vertexMapi2n, // Return The hashmap for vertex, where key is the id of vertex
                                                  edgeMaps2e:edgeMaps2e, // Return The hashmap for edges, where key is the name of edge
                                                  edgeMapi2e:edgeMapi2e, // Return The hashmap for vertex, where key is the id of edge
                                                  multi:multi, //Multiplay Tow matrix array togather.
                                                  getElement:getElement, // Retrun Element form the matrix Array
                                                  setElement:setElement, // Set Element in the matrix Array
                                                  DIM: DIM,
                                                  connection:connection,
                                                  matrix: matrix
                                              });// End The Resolve

                                     } // end If j ==  vlaueflows.length-1

                                  }).catch(function(error){
                                    console.log('error is happend!');
                                  });//end new Edge

                             })(j); //end IIvf function
                            }//end for j = 0
                         }//end else
                      });// end value flows Reading
                    }// end if i == DIM-1

                }//end for i=0

            }//end else
        }); //end stakeholders find method
       */

//The Input is a String represent the edge(Value flow) Information
 function parseEdge(edge, id)
 {
   var start = vertexmaps2n.get(edge.from.name).getIntval();
   var end   = vertexmaps2n.get(edge.to.name).getIntval();
  // var name  = edge.name + " ( " + edge.from.name + " , " + edge.to.name + " )";
  var name = edge.name;
   var value = edge.value;
   return new Edge(name, start, end, value, id, edge._id);
   /*
  return new Promise(function(resolve, reject)
  {
    stakeHolderModel.findById(edge.from,function(err, from)
    {
       if(err)
         {
           reject(err);
         }
       else
         {
           var start = vertexmaps2n.get(from.name).getIntval();
           stakeHolderModel.findById(edge.to,function(err,to)
           {
              if(err)
                {
                  reject(err);
                }
              else
                {
                  var end = vertexmaps2n.get(to.name).getIntval();
                  var name =edge.name + " ( " + from.name + " , " + to.name + " )";
                  var value = edge.value;
                  resolve(new Edge(name, start, end, value, id, edge._id));
                }
           });//end find to
         }//end else
     });//end find from

  });// end Promise
  */
 }// end paresEdge Function

//This function put Element in the Matrix Array
  function setElement(row, column, element) {
   matrix[row*DIM + column] = element;
 }

// Get element from The matrix Array
   function getElement(row, column) {
        return matrix[row*DIM + column];
   }//end getElement Function

//The function to Multiplay Tow matrix
 function multi(Matrix1, Matrix2,M)
    {
          var num = 0;
          for(var k=0; k<DIM; k++)
          { // Matrix1-row
            for(var c=0; c<DIM; c++)
            { // Matrix2-column
              var sum = new Element();
              for (var r=0; r<DIM; r++)
                {  // M2-row, M1-column
                    var helpElement = new Element();
                    var e = helpElement.multi(Matrix1.getElement(k, r), Matrix2.getElement(r, c), helpElement,DIM);
                    if(e != null)
                      sum.plus(e);
                 } //end for r=0
              if (sum.pathNumber() == 0) sum = 0;
                 num++;
              M.setElement(k, c, sum);
            } //end for c = 0
          } // end for k=0
      return M;
    }//end Multi Matrix Function


  }); //End The Promise
}// End The Constructor Function
