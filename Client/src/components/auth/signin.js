import React,{Component} from 'react';
import {reduxForm} from 'redux-form';
import {Grid, Button, Form, Input, Message,Header,Icon } from 'semantic-ui-react';
import * as actions from '../../actions';
import {browserHistory,hashHistory} from 'react-router';
import MyHeader from '../header';
import Loader from '../loading';

class Signin extends Component{

  componentWillMount(){
    this.props.resetFormErrorMessage();
    if(this.props.auth){
      hashHistory.push('/home');
    }
  }

  handleFormSubmit({email,password}){
    this.props.showLoader();
    this.props.signinUser({email,password});
  }

  renderAlert(){
    if(this.props.errorMessage != null && this.props.errorMessage!=''){
      console.log("error:",this.props.errorMessage)
      return (
        <Message
         error
         header='Oops!'
         content={this.props.errorMessage}
       />
      );
    }
  }

  render(){
    const {handleSubmit, fields:{email,password}} = this.props;
    return (
      <div>
      <MyHeader />
      <Grid container>
        <Grid.Row centered>
          <Header color='grey' as='h2' icon textAlign='center'>
            <Icon name='sign in' circular />
            <Header.Content>
              SignIn
            </Header.Content>
          </Header>
        </Grid.Row>
        <Grid.Row centered>
          <Grid.Column width={10}>
            <Form error onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
              <Form.Field>
                <label>Email</label>
                <input placeholder='joe@fikra.com' {...email}/>
              </Form.Field>
              {/* <Form.Input label='Email' placeholder='joe@schmoe.com' {...email} /> */}
              {email.touched && email.error && <Message size= 'mini'>{email.error}</Message>}
              <Form.Field>
                <label>Password</label>
                <input type='password' placeholder='Type you Password' {...password} />
              </Form.Field>
              {/* <Form.Input type='password' label='Password' placeholder='Type you Password' {...password} /> */}
              {password.touched && password.error && <Message negative size= 'mini'>{password.error}</Message>}
              {this.renderAlert()}
              <Button>Submit</Button>
            </Form>
          </Grid.Column>
        </Grid.Row>
        <Loader />
      </Grid>
    </div>

  );
  }

}

function validation(formProps){
  const errors ={};

  if(formProps.email== null || formProps.email =='')
    errors.email = 'Please Enter an email'


  if(!formProps.password)
    errors.password = 'Please Enter a Password'


  return errors;
}


function mapStateToProps(state){
  return {errorMessage:state.auth.error, auth:state.auth.authenticated,loading:state.loadingModal}
}

export default reduxForm({
  form:'signin',
  fields:['email','password'],
  validate:validation
},mapStateToProps,actions)(Signin);
