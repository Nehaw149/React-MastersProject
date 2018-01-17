import React,{Component} from 'react';
import {reduxForm} from 'redux-form';
import {Grid, Button, Form, Input, Message,Icon,Header } from 'semantic-ui-react';
import * as actions from '../../actions';
import {browserHistory,hashHistory} from 'react-router';
import MyHeader from '../header';
import Loader  from '../loading';

class Signup extends Component{

  componentWillMount(){
    if(this.props.auth){
      hashHistory.push('/home');
    }
  }

  handleFormSubmit({email,password,passwordConfirm,name}){
    this.props.showLoader();
    this.props.signupUser({email,password,name});
  }

  componentWillMount(){
    this.props.resetFormErrorMessage();
  }

  renderAlert(){
    if(this.props.errorMessage){
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
    const {handleSubmit, fields:{name,email,password,passwordConfirm}} = this.props;
    return (
      <div>
        <MyHeader />
        <Grid container>
          <Grid.Row centered>
            <Header color='grey' as='h2' icon textAlign='center'>
              <Icon name='signup' circular />
              <Header.Content>
                Create New Account
              </Header.Content>
            </Header>
          </Grid.Row>
          <Grid.Row centered>
          <Grid.Column width={10}>
            <Form error onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
              <Form.Field>
                <label>Name</label>
                <input placeholder='Your name' {...name}/>
              </Form.Field>
              {name.touched && name.error && <Message size= 'mini'>{name.error}</Message>}
              <Form.Field>
                <label>Email</label>
                <input placeholder='joe@fikra.com' {...email}/>
              </Form.Field>
              {email.touched && email.error && <Message size= 'mini'>{email.error}</Message>}
              <Form.Field>
                <label>Password</label>
                <input type='password' placeholder='Type you Password' {...password} />
              </Form.Field>
              {password.touched && password.error && <Message negative size= 'mini'>{password.error}</Message>}
              <Form.Field>
                <label>Confirm Pasword</label>
                <input type='password' placeholder='Type you Password again' {...passwordConfirm} />
              </Form.Field>
              {passwordConfirm.touched && passwordConfirm.error && <Message negative size='mini'>{passwordConfirm.error}</Message>}
              {this.renderAlert()}
              <Button>SignUp</Button>
            </Form>
          </Grid.Column>
          </Grid.Row>
        </Grid>
        <Loader />
        </div>
  );
  }

}

function validation(formProps){
  const errors ={};

  if(formProps.password !== formProps.passwordConfirm)
    errors.password = 'Password does not match';

  if(formProps.email== null || formProps.email =='')
    errors.email = 'Please Enter an email'

  if(formProps.name== null || formProps.name =='')
    errors.name = 'Please Enter your name'

  if(!formProps.password)
    errors.password = 'Please Enter a Password'

  if(!formProps.passwordConfirm)
    errors.passwordConfirm = 'Please Enter a Password Confirm'

  return errors;
}

function mapStateToProps(state){
  return {errorMessage:state.auth.error, auth:state.auth.authenticated}
}

export default reduxForm({
  form:'signup',
  fields:['name','email','password','passwordConfirm'],
  validate:validation
},mapStateToProps,actions)(Signup);
