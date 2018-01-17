import React,{Component} from 'react';
import {Link} from 'react-router';
import {reduxForm} from 'redux-form';

import * as actions from '../../actions';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MyStepper from '../stepper';
import {Snackbar} from 'material-ui';
import {browserHistory,hashHistory} from 'react-router';
import { Input,TextArea, Grid,Form,Header,Icon,Button,Message} from 'semantic-ui-react';
import Loader from '../loading';

class NewProject extends Component{
  constructor(props){
    super(props);
    this.state ={open:false} ;
    if(this.props.currentProject)
    {
      this.state= {title:this.props.currentProject.title,description:this.props.currentProject.description}
    }
  }

  handleNext({title, desc}){
    //Call an Action Creator to create new Project
    this.props.createProject(title,desc);
    this.setState({open:true});
    setTimeout(function(){hashHistory.push('/home/stakeholders');},1100);

  }
  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  }

  handleUpdateProject(){
    if(this.state.title!="" && this.state.description!=""){
      console.log("Enter Update Project");
      this.props.showLoader();
      this.props.updateProjectInfo({id:this.props.currentProject._id,title:this.state.title,description:this.state.description})

    }
    else{
      console.log(this.state.title,this.state.description)
    }
  }


  render(){
    	const {handleSubmit, fields:{title,desc} } = this.props;
      if(this.props.currentProject){
        return(
              <Grid container>
                <MyStepper />
                <Grid.Row centered>
                  <Header color='blue' as='h2' icon textAlign='center'>
                    <Icon name='cubes' circular />
                    <Header.Content>
                      Edit Project Information

                    </Header.Content>
                  </Header>
                </Grid.Row>
                <Grid.Row centered>
                  <Grid.Column width={10}>
                    {/* <Form onSubmit={handleSubmit(this.handleNext.bind(this))}>
                      <Form.Field>
                        <label style={{color:'teal'}}>Project Name</label>
                        <input placeholder='Your name' {...title}/>
                      </Form.Field>
                      {title.touched && title.error && <Message color='red' size= 'mini'>{title.error}</Message>}
                      <Form.Field>
                        <label style={{color:'teal'}}>Description</label>
                        <TextArea placeholder='This project aims to ...' {...desc}/>
                      </Form.Field>
                      {desc.touched && desc.error && <Message color='red' size= 'mini'>{desc.error}</Message>}
                      <Button  content='Update' icon='right arrow' labelPosition='right' color='green' />
                    </Form> */}
                    <Form>

                      <Form.Field>
                        <label style={{color:'teal'}}>Project Name</label>
                        <input placeholder='Project Title (must not be empty)'  value={this.state.title} onChange={(event)=> this.setState({title:event.target.value})}/>
                      </Form.Field>
                      <Form.Field>
                        <label style={{color:'teal'}}>Description</label>
                        <TextArea placeholder='Project Description(must not be empty)' value ={this.state.description} onChange={(event)=> this.setState({description:event.target.value})}/>
                      </Form.Field>
                      <Button  content='Update' icon='right arrow' labelPosition='right' color='green' onClick={()=> this.handleUpdateProject()}/>

                    </Form>
                  </Grid.Column>
                </Grid.Row>
                <Loader />
              </Grid>
              );
      }
      else {
        return(
        <Grid container>
          <MyStepper />
          <Grid.Row centered>
            <Header color='blue' as='h2' icon textAlign='center'>
              <Icon name='cubes' circular />
              <Header.Content>
                Create New Project
              </Header.Content>
            </Header>
          </Grid.Row>
          <Grid.Row centered>
            <Grid.Column width={10}>
              <Form onSubmit={handleSubmit(this.handleNext.bind(this))}>
                <Form.Field>
                  <label style={{color:'teal'}}>Project Name</label>
                  <input placeholder='Type project title' {...title}/>
                </Form.Field>
                {title.touched && title.error && <Message color='red' size= 'mini'>{title.error}</Message>}
                <Form.Field>
                  <label style={{color:'teal'}}>Description</label>
                  <TextArea placeholder='This project aims to ...' {...desc}/>
                </Form.Field>
                {desc.touched && desc.error && <Message color='red' size= 'mini'>{desc.error}</Message>}
                <Form.Field>
                    <Input icon='upload' type="file" name="fileToUpload" id="fileToUpload" />
                </Form.Field>
                <Button type="submit" content='Next' icon='right arrow' labelPosition='right' color='green' />
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Snackbar
             open={this.state.open}
             message="The project is created!"
             autoHideDuration={1000}
             onRequestClose={this.handleRequestClose}
           />
        </Grid>)
      }

  }
}
function validateForm(values){
  const errors={};
  if(!values.title){
    errors.title = 'Enter a Project Title';
  }

  if(!values.desc){
    errors.desc = 'Enter Some Description';
  }

  return errors;
}

function mapStateToProps(state){
  return {currentProject:state.currentProject}
}

export default reduxForm({
  form:'NewProject',
  fields:['title', 'desc'],
  validate:validateForm
},mapStateToProps,actions)(NewProject);
