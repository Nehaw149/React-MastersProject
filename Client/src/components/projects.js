import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import * as actions from '../actions';
import Loader from './loading';

// import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
// import {FlatButton,RaisedButton} from 'material-ui';
import { Grid, Card, Button,Image} from 'semantic-ui-react';

class Projects extends Component{

  // To Do: 1- call an API to bring the projects of the User
  //        2- Display the Projects on the Screen
  constructor(props){
    super(props);
    this.handleGo = this.handleGo.bind(this);
    this.handleDeleteProject = this.handleDeleteProject.bind(this);
  }

  componentWillMount(){
    this.props.fetchProjects();

    }

    handleGo(_id){
      //Show Loader
      this.props.showLoader();
      // Call an Action creator to get the project
      this.props.getProject(_id);
    }
    handleDeleteProject(_id){
      this.props.deleteProject(_id);
    }

  createProjectCard(){
    if(this.props.projects != null && this.props.projects != 0 ){
      return (
        this.props.projects.map((project)=>{
          return (
              <div style={{paddingBottom:"10px"}} key={project._id}>
                <Grid.Column>
                  <Card>
                    <Image src='https://blogs.office.com/wp-content/uploads/2016/10/Project-Ignite-FI.png' />
                    <Card.Content>
                      <Card.Header>
                        {project.title}
                      </Card.Header>
                      <Card.Meta>
                        <span className='date'>
                          Joined in 2015
                        </span>
                      </Card.Meta>
                      <Card.Description>
                        {project.description}
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <div className='ui two buttons'>
                        <Button basic color='green' onClick={()=> this.handleGo(project._id)}>Go To Project</Button>
                        <Button basic color='red' onClick={()=> this.handleDeleteProject(project._id)}>Delete</Button>
                      </div>
                    </Card.Content>
                  </Card>
                  </Grid.Column>
            </div>
          );
        })
      )}
      else {
        return <div>Nothing To Show</div>
      }

  }

  render(){
    return(
      <Grid container columns={3} centered>
          {this.createProjectCard()}
          <Loader />
      </Grid>
    );
  }
}

function mapStateToProps(state){
  return {projects:state.projects.all}
}

export default connect(mapStateToProps,actions)(Projects);
