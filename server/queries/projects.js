const Project = require('../models/project');
const Stakeholder = require('../models/stakeholder');
const mongoose = require('mongoose');
const Need = require('../models/need');
const Output = require('../models/output');
const Valueflow = require('../models/valueflow');

exports.getProjects = function(req,res){
  Project.find({user:req.user._id}, function(err,projects){
    if(err)
      return res.status(422).send(err);
    else {
      return res.status(200).send(projects)
    }
  });
}

exports.createProject = function(req,res){

  const {title,description} = req.body;
  Project.create({title,description,user:req.user}, function(err, project){
    if(err)
      return res.status(422).send(err);
    else {

      return res.status(201).send(project);
    }

  });
}

exports.UpdateProject = function(req,res){
  // Get The Project from ID
  const {project} = req.body;
  //Update the project stakeholders list with the new one.
  Stakeholder.UpdateOrAddArray(project, function(currentProject){
      if(currentProject)
      {

        return res.status(201).send(currentProject);
      }
      else {

        return res.status(422).send("err");
      }
    });

}

exports.updateProjectInfo = function(req,res){
  const info = req.body;
  Project.findByIdAndUpdate(info.id,{title:info.title,description:info.description},{new:true})
  .then((updatedProject)=>{
    return res.status(201).send();
  })
  .catch((err)=>{
    return res.status(501).send(err)
  })
}

exports.GetProject = function(req,res){
  const id = req.params.id;

   Project.findById(req.params.id)
   .populate([{
        path:"stakeholders",
        model: "stakeholder",
        populate:[
          {path:"needs.all", model:"need"}
          ,
          {path:"outputs.all",model:"output"}
        ]
      },
      {
        path:"valueflows",
        model:"valueflow",
        populate:{
          path:"related",
          model:"valueflow"
        }
      }
    ]
  )
  .then((project)=> {

    return res.status(200).send(project);
  })
  .catch((err)=> {
    return res.status(404).send(err);
  })
}

exports.deleteProject = function(req,res){
  // Before we delete a project we should delete all of its stakeholders
  console.log("Get DELETE REQUEST");

  Project.findById(req.params.id, function(err, project){
    if(err)
      return res.status(404).send(err);
    else {
      project.remove((err)=>{
        if(err){

          return res.status(404).send(err);
        }

        else {
          return res.status(200).send("deleted");
        }

      })

    }
  })
}

/**
 @Stakeholder Queries
*/

exports.addStakeholder = function(req,res){

  const info = req.body;
  Project.findById(info.projectId, function(err, project){
    if(err)
      return res.status(404).send("Project Not Found");
    else{

      const stakeholderToAdd = info.stakeholder;
      Stakeholder.create({name:stakeholderToAdd.name},function(err, stakeholder){
        if(err)
          return res.send(409).send(err);
        else {

          project.stakeholders.push(stakeholder);
          project.save(()=>{
            Project.findById(info.projectId)
            .populate([{
             path:"stakeholders",
             model: "stakeholder",
             populate:[
               {path:"needs.all", model:"need"}
               ,
               {path:"outputs.all",model:"output"}
             ]
           }
           ,
           {
             path:"valueflows",
             model:"valueflow",
             populate:{
               path:"related",
               model:"valueflow"
             }
           }
         ])
           .then((updatedProject)=> {

             return res.status(201).send(updatedProject);
           })
         })//End .save()
        }
      })
    }
  })
}

exports.deleteStakeholder = function(req,res){
  debugger;
  var info = req.body;

  Project.findByIdAndUpdate(info.projectId,{$pullAll:{stakeholders:info.list}},{new:true})
  .populate([{
   path:"stakeholders",
   model: "stakeholder",
   populate:{
     path:"needs.all",
     model:"need"
   }
 },{
   path:"valueflows",
   model:"valueflow",
   populate:{
     path:"related",
     model:"valueflow"
   }
 }])
  .then((project)=>{
    Stakeholder.find({_id:{$in:info.list}}, function(err,foundStakeholders){
      if(!err)
      {
        foundStakeholders[0].remove()
        .then(()=> {return res.status(200).send(project)})
        .catch(()=> { return res.status(401).send("Failed To Delete SH")})
      }

  })})
  .catch((err)=>{
    console.log(err);
    return res.status(401).send(err);
  })
}

exports.updateStakeholderName = function(req,res){
  Stakeholder.findByIdAndUpdate(req.body.id, {name:req.body.newName},{new:true})
  .then((updatedStakeholder)=>{
    console.log("Succeed: ", updatedStakeholder);
    return res.status(201).send({id:updatedStakeholder._id,name:updatedStakeholder.name,shIndex:req.body.shIndex});
  })
  .catch((err)=> {
    console.log("Failure: ", err);
    return res.status(501).send(err)})
}

/**
 @Need Queries
*/

exports.addNeed = function(req,res){
  var info = req.body;
  Need.create({name:info.need}, function(err,newNeed){
    if(err)
      return res.status(401).send(err);
    else{
      Stakeholder.findById(info.stakeholderId, function(err, stakeholder){
        if(err)
          return res.status(401).send(err);
        else {
          stakeholder.needs.all.push(newNeed);
          stakeholder.save(function(error){
            if(error)
              return res.status(401).send(error)
              else {
                Project.findById(info.projectId)
                .populate({
                  path:"stakeholders",
                  model:"stakeholder",
                  populate:[
                    {path:"needs.all", model:"need"}
                    ,
                    {path:"outputs.all",model:"output"}
                  ]
                })
                .then((project)=>{ return res.status(201).send(project)})
                .catch((err)=> {return res.status(401).send(err)})

              }
          })
        }
      })
    }
  })
}

exports.deleteNeed = function(req,res){
  // Get the Data from body
  console.log(req.info);
  var info = req.body;
  //Pull the output from stakeholder
  Stakeholder.findByIdAndUpdate(info.shId,{$pull:{'needs.all':info.needId}})
  .then((sh)=>{
  // delete output by ID
  Need.remove({_id:info.needId})
  .then(()=> {return res.status(201).send()})
  .catch((err)=> {
    return res.status(401).send("Failed Delete a Need")})
  })
  .catch((err)=> {
    return res.status(401).send(err)})

}

exports.updateNeedName = function(req,res){
  Need.findByIdAndUpdate(req.body.id, {name:req.body.newName},{new:true})
  .then((updatedNeed)=>{
    return res.status(201).send({id:updatedNeed._id,name:updatedNeed.name,shIndex:req.body.shIndex});
  })
  .catch((err)=> {return res.status(501).send(err)})
}

/**
 @Output Queries
*/

exports.addOutput = function(req,res){
  var info = req.body;
  Output.create({name:info.output}, function(err,newOutput){
    if(err)
      return res.status(401).send(err);
    else{
      Stakeholder.findById(info.stakeholderId, function(err, stakeholder){
        if(err)
          return res.status(401).send(err);
        else {
          stakeholder.outputs.all.push(newOutput);
          stakeholder.save(function(error){
            if(error)
              return res.status(401).send(error)
              else {
                Project.findById(info.projectId)
                .populate({
                  path:"stakeholders",
                  model:"stakeholder",
                  populate:[
                    {path:"needs.all", model:"need"}
                    ,
                    {path:"outputs.all",model:"output"}
                  ]
                }
              )
                .then((project)=>{ return res.status(201).send(project)})
                .catch((err)=> {return res.status(401).send(err)})

              }
          })
        }
      })
    }
  })
}

exports.deleteOutput = function(req,res){
  // Get the Data from body
  var info = req.body;
  //Pull the output from stakeholder
  Stakeholder.findByIdAndUpdate(info.shId,{$pull:{'outputs.all':info.outputId}})
  .then((sh)=>{
  // delete output by ID
  Output.remove({_id:info.outputId})
  .then(()=> {return res.status(201).send()})
  .catch((err)=> {
    return res.status(401).send("Failed Delete an Output")})
  })
  .catch((err)=> {
    return res.status(401).send(err)})

}

exports.updateOutputName = function(req,res){
  Output.findByIdAndUpdate(req.body.id, {name:req.body.newName},{new:true})
  .then((updatedOutput)=>{
    return res.status(201).send({id:updatedOutput._id,name:updatedOutput.name,shIndex:req.body.shIndex});
  })
  .catch((err)=> {return res.status(501).send(err)})
}

exports.updateCurrentStep = function(req,res){
  const info = req.body;
  console.log("Info In Update CS:",info)
  Project.findByIdAndUpdate(info.projectId, {currentstep:info.currentStep}, {new:true}, function(err,project){
    if (err)
      return res.status(500).send("Could Not Update the Project's Step");
    else{
      return res.status(201).send({currentStep:project.currentstep})
    }
  })
}

exports.createValueflow = function(req,res){
  //Get Info from req.body
  // info will contain: name, from:id, to:id, projectId:id, needId: String
  console.log("Data recieved in Post Request:", req.body);
  var {name, from, to,projectId,needId} = req.body;
  Valueflow.create({name,from:mongoose.Types.ObjectId(from),to:mongoose.Types.ObjectId(to),needId}, function(err, valueflow){
    if(err)
      return res.status(401).send("could not create this connection");
    else {
      {
        Project.findByIdAndUpdate(projectId,{$push:{valueflows:valueflow}}, {new:true})
        .populate([{
          path:"stakeholders",
          model:"stakeholder",
          populate:[
            {path:"needs.all", model:"need"}
            ,
            {path:"outputs.all",model:"output"}
          ]
        },{
          path:"valueflows",
          model:"valueflow",
          populate:{
            path:"related",
            model:"valueflow"
          }
        }]).then((project)=> {
          console.log("Returned Project", project);
          return res.status(201).send(project)})
        .catch((err)=> {return res.status(404).send("error in returning back the project info",err)});
      }
    }
  })

}

exports.deleteValueFlow = function(req,res){
  Valueflow.findById(req.body.id, function(err, foundValueFlow){
    if(!err){
      foundValueFlow.remove()
      .then(()=> {return res.status(201).send("Deleted Successfully")})
      .catch((error)=> {return res.status(501).send(error)});
    }
    else {
      return res.status(501).send(err);
    }
  })
}

exports.updateValueFlowImportance = function(req,res){
  //Get Info from req.body {id,value}
  var info = req.body;
  Valueflow.findByIdAndUpdate(info.id,{importanceEstimation:info.value},{new:true})
  .then((updatedVf)=>{
    console.log("Updated Successfully!!", updatedVf);
    return res.status(201).send(updatedVf);
  })
  .catch(()=>{
    console.log("Error Not Updated");
    return res.status(401).send();
  })
}

exports.updateValueFlowIntensity = function(req,res){
  //Get Info from req.body {id,value}
  var info = req.body;
  Valueflow.findByIdAndUpdate(info.id,{intensityEstimation:info.value},function(err,updatedVf){
    if(err){
      console.log("Error Not Updated");
      return res.status(401).send(err);
    }
    else {
      console.log("Updated Successfully!!")
      return res.status(201).send("Updated Successfully");
    }
  })
}

exports.updateValueFlowValue = function(req,res){
  //Get Info from req.body {id,value}
  var info = req.body;
  Valueflow.findByIdAndUpdate(info.id,{value:info.value},function(err,updatedVf){
    if(err)
      {
        console.log("Error Not Updated");
        return res.status(401).send(err);
      }
    else {
      console.log("Updated Successfully!!")
      return res.status(201).send("Updated Successfully");
    }
  })
}
