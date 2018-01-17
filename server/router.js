const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport =require('passport');
const ProjectsQuery = require('./queries/projects');
const algorithemQuery = require('./queries/algorithem');

const requireAuth = passport.authenticate('jwt',{session:false});
const requireSignin = passport.authenticate('local',{session:false});

module.exports = function(app){
	// Any request must pass 'requireAuth' and then we can call the function to do what we want
	// when it's ok, we get the User back from requireAuth, which we can find it
	// in req.user
	app.get('/', requireAuth, function(req,res){
		res.send({message:'Super secret code is ABC123'});
	});
	app.post('/signin', requireSignin, Authentication.signin);
	app.post("/signup", Authentication.signup);
	app.get("/projects", requireAuth,ProjectsQuery.getProjects);
	app.post("/project",requireAuth, ProjectsQuery.createProject);
	app.put("/project", ProjectsQuery.UpdateProject);
	app.get("/project/:id", requireAuth,ProjectsQuery.GetProject);
	app.delete("/project/:id", requireAuth,ProjectsQuery.deleteProject);
	app.put("/projectinfo", requireAuth,ProjectsQuery.updateProjectInfo);

	app.post("/stakeholder", requireAuth,ProjectsQuery.addStakeholder);
	app.delete("/stakeholder/", requireAuth,ProjectsQuery.deleteStakeholder);
	app.put("/stakeholder", requireAuth,ProjectsQuery.updateStakeholderName);

	app.post("/need", requireAuth,ProjectsQuery.addNeed);
	app.delete("/need", requireAuth,ProjectsQuery.deleteNeed);
	app.put("/need", requireAuth,ProjectsQuery.updateNeedName);

	app.post("/output", requireAuth,ProjectsQuery.addOutput);
	app.delete("/output", requireAuth,ProjectsQuery.deleteOutput);
	app.put("/output", requireAuth,ProjectsQuery.updateOutputName);

	app.put("/currentstep", requireAuth,ProjectsQuery.updateCurrentStep);

	app.post("/valueflow", requireAuth,ProjectsQuery.createValueflow);
	app.delete("/valueflow", requireAuth,ProjectsQuery.deleteValueFlow);
	app.put("/valueflow/importance", requireAuth,ProjectsQuery.updateValueFlowImportance);
	app.put("/valueflow/intensity", requireAuth,ProjectsQuery.updateValueFlowIntensity);
	app.put("/valueflow/value", requireAuth,ProjectsQuery.updateValueFlowValue);


	//Api for algorithem Implementation
	//@Params: id: ProjectId
	app.get("/algorithem/:id",requireAuth,algorithemQuery.runAlgorithem);
	//@Params: id1:from StakeholderId , id2:to StakeholderID , id3: ProjectId
  app.get("/FocalInfoCycle/:id1/:id2/:id3",requireAuth, algorithemQuery.getFocalInfoCycle);
	//@Params: id1:from StakeholderId , id2:to StakeholderID , id3: ProjectId    1
  app.get("/FocalInfoVertex/:id1/:id2/:id3",requireAuth, algorithemQuery.getFocalInfoVertex);
	//@Params: id1:from StakeholderId , id2:to StakeholderID , id3: ProjectId    2
	app.get("/FocalInfoEdge/:id1/:id2/:id3",requireAuth, algorithemQuery.getFocalInfoEdge);
	//@Params: id: ProjectId
	app.get("/NetworkInfoCycle/:id1",requireAuth, algorithemQuery.getNetworkInfoCycle);
	//@Params: id: ProjectId   3
	app.get("/NetworkInfoVertex/:id1",requireAuth, algorithemQuery.getNetworkInfoVertrex);
	//@Params: id: ProjectId    4
	app.get("/NetworkInfoEdge/:id1",requireAuth, algorithemQuery.getNetworkInfoEdge);


	app.get("*", function(req,res){
		res.send("Hello World");
	})


}
