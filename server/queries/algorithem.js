const ProjectModel     = require('../models/project');
const StakeholderModel = require('../models/stakeholder');
const mongoose         = require('mongoose');
mongoose.Promise = require('bluebird');
const ValueflowModel   = require('../models/valueflow');
const MatrixModel      = require('../models/matrix');
const ElementModel     = require('../models/element');
const PathModel        = require('../models/path');
const Matrix           = require('../algorithem/matrix');
const Cycle            = require('../algorithem/cycle');
const _                = require('lodash');
const async            = require('async');


//********* Helping Functions *************************
function fillMatrexInformation(projectId ){
  return MatrixModel.findOne({projectID:projectId}).populate(
    {
      path:'elements',
      model:'element',
      populate:{
        path:'paths',
        model:'path',
        populate:{
          path:'valueflows',
          model:'valueflow',
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
      }
    }
  )// end MatrixModel findOne
}// end Function fillMatrexInformation


function multiplyingMatrix(matrix1, matrix2, projectId, multi, callback){

  //The Third Matrix will be for Helping
  new Matrix(projectId).then(function(matrix3)
  {
  //   console.log('We are In Round Number: '+multi+' Before Multiplying ');

    //Now we Multiplying the matrix1 with matrix2
    var matrix4 = matrix3.multi(matrix1,matrix2,matrix3);
    //  console.log('We are In Round Number: '+multi+' After Multiplying ');
      //console.log('                      ');

    //The length of The Result Matrix will be:
    var length = matrix1.DIM * matrix1.DIM;
    var elementsSavePromises = [];
    var elementIndex = 0;

    // this loop to go to every element in the matrix Array
    matrix4.matrix.forEach(function(element){
        //We Should Check if this element != 0
        if( element != 0)
        {
          elementsSavePromises.push(new Promise (function(resolve, reject){

          //First We should Find the elemnt in The dataBase
          var fromId = Math.floor(elementIndex / matrix1.DIM);
          var toId   = elementIndex - (fromId * matrix1.DIM);
          var fromObject = matrix1.vertexMapi2n().get(fromId);
          var toObject   = matrix1.vertexMapi2n().get(toId);
          //console.log('         ');
          //console.log('The element Nmber '+ elementIndex);
        //  console.log('The paths length of this element is '+element.paths.length);
      //    console.log('           ');
          elementIndex++;

          ElementModel.findOne({from:fromObject.getId(), to:toObject.getId()}, function(error, foundedElement){
            if(error)
              {
               console.log(error);
              }
            else
              {
                var pathsSavePromises =[];
                element.paths.forEach(function(pathObject){
                   pathsSavePromises.push(new Promise(function(res, rej){

                     //We Should Now Create The paths in database
                     PathModel.create({value: pathObject.getValue(), cyclecheck:pathObject.cyclecheck}, function(err,newPath){
                         if(err){
                            rej(err);
                         }else{
                           //We Should add The Valueflow ObjectId to the new path
                            pathObject.path.forEach(function(valueflow){
                              newPath.valueflows.push(mongoose.Types.ObjectId(valueflow.getObjectId()));
                            });//pathObject.path.forEach

                            //After we finish we Should now save the newPath and resolve the promise
                            newPath.save().then(()=>{
                              foundedElement.paths.push(newPath);
                              res(newPath);
                            });
                         }//end else in pathModel create
                    });//end Path Creat

                 }));//end pathsSavePromises.push
               });//end element.paths.forEach Array
               Promise.all(pathsSavePromises).then(()=>{
                   //We Should now save the foundedElement
                   foundedElement.save().then(()=>{
                      // console.log('The Element is Save in '+multi);
                     //Resolve Now the promise
                      resolve(foundedElement);
                     }).catch(function(err){
                      //  console.log('there are something wrong');
                       reject(err);
                   });

                  }).catch((err)=>{
                  //console.log('there are something wrong')
                  reject(err);
                 });
              }//end else in Eelement findModel
          });//end find Element in The dataBases
         }));//end elementsSavePromises.push
        }//end if element !=0
        else
        {
          //We Should Increse The element Index Any way
          elementIndex++;
        }
    });//end  matrix4.matrix.forEach Array

    //After we finish from The loop, we should wait until all promises to resolve
    Promise.all(elementsSavePromises).then(()=>{
      //  console.log('The Round number '+multi+' is finished');

         callback(null, matrix4);
      }).catch(
            () => console.log('error in Round Number: '+ multi)
          );

  });//end new matrix3

}//end Function Multiplying Matrix

function createMatrixResult(projectId, res){

  //First Make a Matrix Collection for the result of Algorithem execution
  MatrixModel.create({projectID:projectId}, function(err, newMatrix)
  {
      if(err)
      {
        console.log(err);
      }
      else
      {
        //Now We Schould execute The algorithem
        // First we initialization The Require variables
        new Matrix(projectId).then(function(matrix1)
        {
          //Here we Schould create the elements collection in The database
          var createdElementNumber = 0;
          var allElementsNumber = matrix1.DIM * matrix1.DIM;
          for(var createdElement = 0; createdElement<allElementsNumber; createdElement++)
          {
            var fromId = Math.floor(createdElement / matrix1.DIM);
            var toId   = createdElement - (fromId * matrix1.DIM);
            var fromObject = matrix1.vertexMapi2n().get(fromId);
            var toObject   = matrix1.vertexMapi2n().get(toId);
            ElementModel.create({from:fromObject.getId(), to:toObject.getId()}, function(err, newElement){
             if(err)
               {
                 console.log(err);
               }
             else
             {
               createdElementNumber++;
               newMatrix.elements.push(newElement);
               //When we ceate all elements in the database
               if(createdElementNumber == allElementsNumber)
               {
                 //Now should I save the updates to The newMatrix
                 newMatrix.save().then(() =>{
                   //initialization The secod matrix variables
                   new Matrix(projectId).then(function(matrix2)
                   {
                     var MultiplyingRoundNumber = 0;// Represent the Number of round Multiplying
                     //Here We decid The max Lenght path(How many The Matrix will Multiplying)
                     var MultiplyingTimes;
                     if(matrix1.DIM<6)
                       {
                         MultiplyingTimes = matrix1.DIM;
                       }
                     else
                       {
                         MultiplyingTimes = 6;
                       }

                       var arrayFunctions = [function(callback){
                          multiplyingMatrix(matrix1,matrix2, projectId,0, function(error, resultMatrix){
                               if(!error){
                                 callback(null,resultMatrix);
                               }
                          });
                       }];

                       for(var multi=0; multi<MultiplyingTimes-1; multi++)
                         {
                           (function(multi){
                             arrayFunctions.push(function(previousMatrix,callback){
                                multiplyingMatrix(previousMatrix,matrix2,projectId, multi+1, function(error, resultMatrix){
                                  if(!error){
                                    callback(null, resultMatrix);
                                  }
                                });//End multiplyingMatrix calling
                             });
                           })(multi);
                          }//end for multi=0

                           async.waterfall(arrayFunctions, function(error, result) {
                                if(error){
                                  res.send('There is an error');
                                }else{
                                  // result now equals 'done'
                                  res.send('ok');
                                }
                             }); //end async.waterfall
                      /*
                      async.waterfall([
                        function(callback)
                        {
                          multiplyingMatrix(matrix1,matrix2, projectId,0, function(error,resultMatrix){
                                callback(null,resultMatrix);
                          });
                        },
                        function(previousMatrix,callback)
                        {
                          multiplyingMatrix(previousMatrix,matrix2, projectId,1, function(error,resultMatrix){
                                callback(null,resultMatrix);
                          });
                        },
                        function(previousMatrix,callback)
                        {
                          multiplyingMatrix(previousMatrix,matrix2, projectId,2, function(error,matrix3){
                                callback(null,matrix3);
                          });
                        },
                        function(previousMatrix,callback)
                        {
                          multiplyingMatrix(previousMatrix,matrix2, projectId,3, function(error,matrix4){
                                callback(null,matrix4);
                          });
                        },
                        function(previousMatrix,callback)
                        {
                          multiplyingMatrix(previousMatrix,matrix2, projectId,4, function(error,matrix5){
                                callback(null,matrix5);
                          });
                        },
                        function(previousMatrix,callback)
                        {
                          multiplyingMatrix(previousMatrix,matrix2, projectId,5, function(error,matrix6){
                                callback(null, matrix6);
                          });
                        }
                      ],
                      function (err, result) {
                        if(err){
                           console.log('big error happened');
                        }else{
                        //  console.log(result);
                          // result now equals 'done'
                          res.send('ok');
                        }
                      }); */
                   }); // end new matrix2
                 });// end newMatrix.save().then()
               }//end If elementNumber == allElementsNumber
             }//end else ElementModel.create != err
           });//end ElementModel.create
          }//end for createdElement = 0
        });//end new matrix1
      }//end else In MatrixModel Create
 });// end MatrixModel Create query

}//end Function findStakeholderId




exports.runAlgorithem = function(req,res){

 //Read The projectId for the Request and Then change it to ObjectId structure
 var projectId = mongoose.Types.ObjectId(req.params.id);


  //IF There If already result In the data Base We should remove it.
   MatrixModel.findOne({projectID:projectId},function(err, matrix){
    if(!err){
      if(matrix != null)
      {
        matrix.remove().then(()=>
        {
        //  console.log('***** All Element is Removed ********');
          createMatrixResult(projectId, res);

        });//end Then After matrix.remove
      }//end If (matrix != null)
      else
      {
       createMatrixResult(projectId, res);
      }
    }//end if (!err)
    else{
      console.log("Not found")
    }
  });// ending Removing Matrix Result
//  createMatrixResult(projectId, res);

}//end function run algorithem



exports.getFocalInfoCycle = function(req, res) {
  //Get The Id for the start and end Stakeholders
  var start_id  = mongoose.Types.ObjectId(req.params.id1);
  var end_id    = mongoose.Types.ObjectId(req.params.id2);
  var projectId = mongoose.Types.ObjectId(req.params.id3);

  fillMatrexInformation(projectId).then(function(matrix){
    var found = false;
    var index = 0;
    var requiredElement;
    console.log(String(matrix.elements[index].from) == String(start_id));
    while((index < matrix.elements.length) && !found){
       if(String(matrix.elements[index].from) == String(start_id) && String(matrix.elements[index].to) == String(end_id)){
              //console.log(index);
              found = true;
              requiredElement = matrix.elements[index];
        }else {
          index++;
        }
    }//end While Loop

    if(requiredElement.paths.length > 0){
      var result = [];
      requiredElement.paths.forEach(function(path){
        var valueflowInformaion =[];
        path.valueflows.forEach(function(valueflow){
            var requriedInformation ={
                name: valueflow.name,
                from: valueflow.from.name,
                to:   valueflow.to.name
            };
            valueflowInformaion.push(requriedInformation);
        });

        var pathInformatin = {
           value: path.value,
           valueflows: valueflowInformaion
         }
         result.push(pathInformatin);
      }); //rerequiredElement.paths.forEach
      //console.log(requiredElement.paths.length);
    //  console.log(result.length);
      res.send(result);
    }//end If requiredElement.paths.length > 0
    else{
      res.send('There are no results for this Request');
    }
  }).catch(function(error){
     console.log(error);
  });

}//end Focal Info Cycle


/************************************************************************/
exports.getFocalInfoVertex = function(req,res){
  //Get The Id for the start and end Stakeholders
  var start_id  = mongoose.Types.ObjectId(req.params.id1);
  var end_id    = mongoose.Types.ObjectId(req.params.id2);
  var projectId = mongoose.Types.ObjectId(req.params.id3);

  fillMatrexInformation(projectId).then(function(matrix){
    var found = false;
    var index = 0;
    var requiredElement;
    while((index < matrix.elements.length) && !found){
       if(String(matrix.elements[index].from) == String(start_id) && String(matrix.elements[index].to) == String(end_id)){
              found = true;
              requiredElement = matrix.elements[index];
        }else {
          index++;
        }
    }//end While Loop


    var vertexScores;// used to calculate WSO (Weighted Stakeholder Occurrence)
    var totalscore = 0;//The total Score of all paths values
    var WSO = []; //Array of Objects. Every objects Contains The name of the stakeholders And his wso value

   //We need the help function from the matrix, So we will create a help matrix
   new Matrix(projectId).then(function(helpMatrix)
   {
      //Initialize The vertexScores array
      vertexScores = new Array(helpMatrix.DIM).fill(0);
      //check If the element contain a paths
      if(requiredElement.paths.length > 0)
      {
        requiredElement.paths.forEach(function(path)
          {
            totalscore += path.value;
            for (var i = 0; i< helpMatrix.DIM; i++ )
            {
                 if(path.cyclecheck[i] >0)
                 {
                   vertexScores[i] += path.value;
                 }
            }
         });//end requiredElement.paths for loop

         var stakholderIndex = 0;
         vertexScores.forEach(function(score){
           var stakeholder ={
              name: helpMatrix.vertexMapi2n().get(stakholderIndex).getName(),
              wsoValue: score/totalscore
           };
           WSO.push(stakeholder);
           stakholderIndex++;
         });//end vertex scores loop
         //Return The WSO Matrix as a Result
         res.send(WSO);
      }//end If(requiredElement.paths.length > 0)
      else
      {
        res.send([]);
      }

   });//End new Matrix

  }).catch(function(error){
    console.log(error);
  });
}//end Focal Info Vertex


/*****************************************************************/
exports.getFocalInfoEdge = function(req, res){
  //Get The Id for the start and end Stakeholders
  var start_id  = mongoose.Types.ObjectId(req.params.id1);
  var end_id    = mongoose.Types.ObjectId(req.params.id2);
  var projectId = mongoose.Types.ObjectId(req.params.id3);

  fillMatrexInformation(projectId).then(function(matrix){
    var found = false;
    var index = 0;
    var requiredElement;

    while((index < matrix.elements.length) && !found){
       if(String(matrix.elements[index].from) == String(start_id) && String(matrix.elements[index].to) == String(end_id)){
              found = true;
              requiredElement = matrix.elements[index];
        }else {
          index++;
        }
    }//end While Loop

    var edgeScore;// used to calculate WVFO
    var scoresum = 0;//The total Score of all valueFlows Score value
    var WVFO = []; //Array of Objects. Every objects Contains The name of the stakeholders And his wso value

   //We need the help function from the matrix, So we will create a help matrix
   new Matrix(projectId).then(function(helpMatrix)
   {
     var edgeCount = helpMatrix.edgeMapi2e().count();

     //Initialize The vertexScores array
      edgeScores = new Array(edgeCount).fill(0);
     if(requiredElement.paths.length > 0)
     {
         requiredElement.paths.forEach(function(path)
         {
            var edgeIdx = new Array(edgeCount).fill(false);

            path.valueflows.forEach(function(valueflow)
            {
              // console.log(helpMatrix.edgeMapi2e().get(22).getName());
               var valueflowId =  helpMatrix.edgeMaps2e().get(valueflow.name).getId();
               edgeIdx[valueflowId] = true;
            });//end path.valueflows Array

             //Check to Know which vlaueflow is participate in this path
             for(var edgeIndex = 0; edgeIndex< edgeCount; edgeIndex++)
                {
                  if(edgeIdx[edgeIndex])
                   {
                     edgeScores[edgeIndex] += path.value;
                   }//end If edgeIdx
               }//end for var edgeIndex = 0
         }); //end requiredElement.paths Array

         //calculate The scoresum
         for(var i=0; i<edgeCount; i++){
              scoresum += edgeScores[i];
           }

          //Fill The Reslut Array
          var valueFlowIndex = 0;
          edgeScores.forEach(function(score){
            var valueflow ={
               name: helpMatrix.edgeMapi2e().get(valueFlowIndex).getName(),
               wvfoValue: score/scoresum
            };
        WVFO.push(valueflow);
        valueFlowIndex++;
      });//end vertex scores loop
      //Return The WSO Matrix as a Result
      res.send(WVFO);
    }//end requiredElement.paths.length > 0
     else{
       res.send([]);
     }

   });//end mew Matrix

 }).catch(function(error){
   console.log(error);
 }); //end the promise dealing

}//end function get Focal Info Edge



/********************** Newtork Analaysis **********************/

exports.getNetworkInfoCycle = function(req, res){
  var projectId = mongoose.Types.ObjectId(req.params.id1);

  fillMatrexInformation(projectId).then(function(matrix)
  {
     new Matrix(projectId).then(function(helpMatrix)
     {
        //We will store all cycles in The Network Here
         var cycls = [];

         if(matrix.elements.length > 0){
           matrix.elements.forEach(function(element)
           {
             if(String(element.from) == String(element.to) && element.paths.length > 0){

                element.paths.forEach(function(path){

                   //Initialize newa cycle
                   var cycle = new Cycle(path, helpMatrix);

                   //Check If the cycles Array is empty
                   if(cycls.length == 0) {
                      cycls.push(cycle);
                   }
                   // now we just compare in order, but we can definitely use bi-search to insert new cycles
                   // but will not make too much different if different cycles are not too many
                  else
                   {
                    var index = 0;
                    var equal = false;

                    while( index < cycls.length && !equal){
                         var curc = cycls[index];

                         if(cycle.newPath.length() == curc.newPath.length())
                         {

                           if (cycle.sumCode() < curc.sumCode())
                           {
                             if(index == 0 )
                               {
                                 //Insert the new Cycle at the first
                                 cycls.unshift(cycle);
                                 equal = true;
                               }
                             else
                              {
                                // cycle should be inserted before curc
                                  var newCycls   = _.chunk(cycls, index);
                                  cycls  = _.concat(newCycls[0], cycle);
                                  for(var i=1; i<newCycls.length;i++){
                                    cycls = _.concat(cycls,newCycls[i]);
                                  }
                                  equal  = true;
                              }

                            }//end if if (cycle.sumCode() < curc.sumCode())
                            else if (cycle.sumCode() == curc.sumCode())
                             {
                                 if (cycle.compare(curc))
                                   {
                                      // the same cycle, do nothing
                                      equal = true;
                                   }
                                 else
                                   {
                                     index++;
                                   }
                           }//end else if (cycle.sumCode() == curc.sumCode())
                           else
                             {
                               index++;
                             }
                         }//end if cycle.newPath.length() != curc.newPath.length()
                         else
                         {
                           index++;
                         }
                       }//end while
                     // cycle has the largest sum code, attach to the last
                     if(!equal)
                     {
                       cycls.push(cycle);
                      }

                   }//end else cycls.length == 0
                });//end element.paths loop
             }//end if element.from == element.to && element.paths.length > 0
           });//end matrix.elements loop
         }//end  if(matrix.elements.length > 0)
         else{
           res.send('There is No Results');
         }

         //Send The Result
         var result = [];
         if(cycls.length > 0 )
         {
             cycls.forEach(function(cycle)
             {
               var valueflowInformaion =[];
               cycle.newPath.path.forEach(function(valueflow){
                   var requriedInformation ={
                       name: valueflow.name,
                       from: valueflow.from.name,
                       to:   valueflow.to.name
                   };
                   valueflowInformaion.push(requriedInformation);
               });
               var pathInformatin = {
                  value: cycle.newPath.value,
                  valueflows: valueflowInformaion
                }
              result.push(pathInformatin);
           }); //cycls.forEach
          //   console.log(cycls.length);
             res.send(result);
         }//end if cycls.length > 0
        else
         {
           res.send('There are no reults for this request');
         }
     });//end new Matrix
  }).catch(function(error){
    console.log(error);
  }); //end the promise dealing
}//end Function getNetworkInfoCycle


/*******************************************************************/
exports.getNetworkInfoVertrex = function(req, res){
  var projectId = mongoose.Types.ObjectId(req.params.id1);

  fillMatrexInformation(projectId).then(function(matrix)
  {
     new Matrix(projectId).then(function(helpMatrix)
     {
        //We will store all cycles in The Network Here
         var cycls = [];
         var totalscore = 0;
         var vertexScores = [];
         var NWSO =[];

        if(matrix.elements.length >0){
          matrix.elements.forEach(function(element)
          {
            if(String(element.from) == String(element.to) && element.paths.length > 0){

              element.paths.forEach(function(path){

                 //Initialize newa cycle
                 var cycle = new Cycle(path, helpMatrix);

                 //Check If the cycles Array is empty
                 if(cycls.length == 0) {
                    cycls.push(cycle);
                 }
                 // now we just compare in order, but we can definitely use bi-search to insert new cycles
                // but will not make too much different if different cycles are not too many
                else
                 {
                  var index = 0;
                  var equal = false;

                  while( index < cycls.length && !equal){
                       var curc = cycls[index];

                       if(cycle.newPath.length() == curc.newPath.length())
                       {

                         if (cycle.sumCode() < curc.sumCode())
                         {
                           if(index == 0 )
                             {
                               //Insert the new Cycle at the first
                               cycls.unshift(cycle);
                               equal = true;
                             }
                           else
                            {
                              // cycle should be inserted before curc
                                var newCycls   = _.chunk(cycls, index);
                                cycls  = _.concat(newCycls[0], cycle);
                                for(var i=1; i<newCycls.length;i++){
                                  cycls = _.concat(cycls,newCycls[i]);
                                }
                                equal  = true;
                            }

                          }//end if if (cycle.sumCode() < curc.sumCode())
                          else if (cycle.sumCode() == curc.sumCode())
                           {
                               if (cycle.compare(curc))
                                 {
                                    // the same cycle, do nothing
                                    equal = true;
                                 }
                               else
                                 {
                                   index++;
                                 }
                         }//end else if (cycle.sumCode() == curc.sumCode())
                         else
                           {
                             index++;
                           }
                       }//end if cycle.newPath.length() != curc.newPath.length()
                       else
                       {
                         index++;
                       }
                     }//end while
                   // cycle has the largest sum code, attach to the last
                   if(!equal)
                   {
                     cycls.push(cycle);
                    }

                 }//end else cycls.length == 0
              });//end element.paths loop
            }//end if element.from == element.to && element.paths.length > 0
          });//end matrix.elements loop
        }//end If matrix.elements.length >0

       if(cycls.length > 0)
         {
           //Initialize The vertexScores array
           vertexScores = new Array(helpMatrix.DIM).fill(0);

             //calculate The NWSO
             cycls.forEach(function(cycle)
               {
                 totalscore += cycle.newPath.value;
                 for (var i = 0; i< helpMatrix.DIM; i++ )
                 {
                      if(cycle.newPath.cyclecheck[i] >0)
                      {
                        vertexScores[i] += cycle.newPath.value;
                      }
                 }
              });//end requiredElement.paths for loop

              var stakholderIndex = 0;
              vertexScores.forEach(function(score){
                var stakeholder ={
                   name: helpMatrix.vertexMapi2n().get(stakholderIndex).getName(),
                   nwsoValue: score/totalscore
                };
                NWSO.push(stakeholder);
                stakholderIndex++;
              });//end vertex scores loop
           //Send The Result
          // console.log(cycls.length);
           res.send(NWSO);
         }//end If cycls.length > 0
         else
         {
            res.send([]);
         }

     });//end new Matrix
  }).catch(function(error){
    console.log(error);
  }); //end the promise dealing
}//end Function getNetworkInfoVertex



/**************************************************/
exports.getNetworkInfoEdge = function(req, res){
  var projectId = mongoose.Types.ObjectId(req.params.id1);

  fillMatrexInformation(projectId).then(function(matrix)
  {
     new Matrix(projectId).then(function(helpMatrix)
     {
        //We will store all cycles in The Network Here
         var cycls = [];
         var edgeScore;// used to calculate WVFO
         var scoresum = 0;//The total Score of all valueFlows Score value
         var NWVFO = []; //Array of Objects. Every objects Contains The name of the stakeholders And his wso value

         if(matrix.elements.length>0){
           matrix.elements.forEach(function(element)
           {
             if(String(element.from) == String(element.to) && element.paths.length > 0){

               element.paths.forEach(function(path){

                  //Initialize newa cycle
                  var cycle = new Cycle(path, helpMatrix);

                  //Check If the cycles Array is empty
                  if(cycls.length == 0) {
                     cycls.push(cycle);
                  }
                  // now we just compare in order, but we can definitely use bi-search to insert new cycles
                  // but will not make too much different if different cycles are not too many
                 else
                  {
                   var index = 0;
                   var equal = false;

                   while( index < cycls.length && !equal){
                        var curc = cycls[index];

                        if(cycle.newPath.length() == curc.newPath.length())
                        {

                          if (cycle.sumCode() < curc.sumCode())
                          {
                            if(index == 0 )
                              {
                                //Insert the new Cycle at the first
                                cycls.unshift(cycle);
                                equal = true;
                              }
                            else
                             {
                               // cycle should be inserted before curc
                                 var newCycls   = _.chunk(cycls, index);
                                 cycls  = _.concat(newCycls[0], cycle);
                                 for(var i=1; i<newCycls.length;i++){
                                   cycls = _.concat(cycls,newCycls[i]);
                                 }
                                 equal  = true;
                             }

                           }//end if if (cycle.sumCode() < curc.sumCode())
                           else if (cycle.sumCode() == curc.sumCode())
                            {
                                if (cycle.compare(curc))
                                  {
                                     // the same cycle, do nothing
                                     equal = true;
                                  }
                                else
                                  {
                                    index++;
                                  }
                          }//end else if (cycle.sumCode() == curc.sumCode())
                          else
                            {
                              index++;
                            }
                        }//end if cycle.newPath.length() != curc.newPath.length()
                        else
                        {
                          index++;
                        }
                      }//end while
                    // cycle has the largest sum code, attach to the last
                    if(!equal)
                    {
                      cycls.push(cycle);
                     }

                  }//end else cycls.length == 0
               });//end element.paths loop
             }//end if element.from == element.to && element.paths.length > 0
           });//end matrix.elements loop
         }//end if(matrix.elements.length>0)



         if(cycls.length > 0)
         {
           var edgeCount = helpMatrix.edgeMapi2e().count();

           //Initialize The vertexScores array
            edgeScores = new Array(edgeCount).fill(0);

             //calculate The NWSO
             cycls.forEach(function(cycle)
               {

                 var edgeIdx = new Array(edgeCount).fill(false);

                 cycle.newPath.path.forEach(function(valueflow)
                 {
                   // console.log(helpMatrix.edgeMapi2e().get(22).getName());
                    var valueflowId =  helpMatrix.edgeMaps2e().get(valueflow.name).getId();
                    edgeIdx[valueflowId] = true;
                 });//end path.valueflows Array

                  //Check to Know which vlaueflow is participate in this path
                  for(var edgeIndex = 0; edgeIndex< edgeCount; edgeIndex++)
                     {
                       if(edgeIdx[edgeIndex])
                        {
                          edgeScores[edgeIndex] += cycle.newPath.value;
                        }//end If edgeIdx
                    }//end for var edgeIndex = 0
              });//end cycls.path for loop
              //calculate The scoresum
              for(var i=0; i<edgeCount; i++){
                   scoresum += edgeScores[i];
                }

               //Fill The Reslut Array
               var valueFlowIndex = 0;
               edgeScores.forEach(function(score){
                 var valueflow ={
                    name: helpMatrix.edgeMapi2e().get(valueFlowIndex).getName(),
                    wvfoValue: score/scoresum
                 };
             NWVFO.push(valueflow);
             valueFlowIndex++;
             });//end vertex scores loop
             //Return The WSO Matrix as a Result
             res.send(NWVFO);
         }//end If cycls.length > 0
         else
         {
            res.send([]);
         }

     });//end new Matrix
  }).catch(function(error){
    console.log(error);
  }); //end the promise dealing
}//end Function getNetworkInfoEdge

/**************************************************/
exports.getNetworkInfoStakeholder = function(req, res){
  var projectId = mongoose.Types.ObjectId(req.params.id3);

  fillMatrexInformation(projectId).then(function(matrix){

  }).catch(function(error){
    console.log(error);
  }); //end the promise dealing
}//end Function getNetworkInfoStakeholder
