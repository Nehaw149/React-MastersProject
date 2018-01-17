import React, { Component } from 'react';
import { Menu,Dropdown,Icon, Grid,Image,Divider, Card, Button,List,Segment,Popup} from 'semantic-ui-react';
import {Link, browserHistory,hashHistory} from 'react-router';
import * as actions from '../actions';
import {connect} from 'react-redux';
import profilePhoto from '../../public/img/mosbah.jpg';
import logoPhoto from '../../public/img/log3.jpg';

class Header extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeItem:{}
    }
    this.showNavbar = this.showNavbar.bind(this);
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  handleCreateNewProject(){
    this.props.clearState();
    this.setState({activeItem:""})
    hashHistory.push("/home/newproject");
  }

  showNavbar(){
    var {activeItem} = this.state;
    if(this.props.authenticated){
      const trigger = (
        <span>
          <Image avatar src={profilePhoto} />
          {this.props.userName}
        </span>);
        const trigger2 = (
          <span>
            <Icon name='industry' />
            Projects
          </span>);
        return (
        <Menu stackable inverted style={{backgroundColor:'#14384c'}} >
          <Menu.Item>
            <img src={logoPhoto} />
          </Menu.Item>

          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={()=> {hashHistory.push("/home");this.handleItemClick}}
            color='green'
          >
            <Icon name="home" />
            Home
          </Menu.Item>

          <Menu.Item   name='projects' onClick={this.handleItemClick}>
              <Dropdown trigger={trigger2}>
                <Dropdown.Menu color='blue'>
                  <Dropdown.Item onClick={()=> {this.handleCreateNewProject()}}>Create New Project</Dropdown.Item>
                  <Dropdown.Item onClick={()=> {hashHistory.push("/home/projects");this.setState({activeItem:""})}}>All Projects</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
          </Menu.Item>

          <Menu.Item
            name='ideas'
            active={activeItem === 'ideas'}
            onClick={()=> {hashHistory.push("home/results/resultd");this.handleItemClick}}
          >
            <Icon name="idea" />
            Ideas
          </Menu.Item>

          <Menu.Item
            name='lessons'
            active={activeItem === 'lessons'}
            onClick={this.handleItemClick}
          >
            lessons Learned
          </Menu.Item>

          <Menu.Item name='gamepad' position="right">
            <Dropdown trigger={trigger} pointing='top right' icon={null}>
              <Dropdown.Menu>
                <Dropdown.Item text='Account' icon='user' />
                <Dropdown.Item text='Settings' icon='settings' />
                <Dropdown.Item text='Sign Out' icon='sign out' onClick={()=> hashHistory.push('/signout')} />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </Menu>
      )
    }
    else
    {
      return (
      <Menu className='headerStyle' stackable inverted color='blue'>
        <Menu.Item onClick={()=> hashHistory.push('/')}>
          <img src='../../public/img/log.png'/>
        </Menu.Item>

        <Menu.Item position="right">
          <Button color='facebook' onClick={()=> hashHistory.push('/signin')}>
          <Icon name='sign in' /> Sign In</Button>
        </Menu.Item>
        <Menu.Item>
          <Button color='google plus' onClick={()=> hashHistory.push('/signup')}>
          <Icon name='signup' /> Sign Up</Button>
        </Menu.Item>
      </Menu>
      )
    }

    //https://s3.amazonaws.com/uifaces/faces/twitter/luxe/128.jpg
    //http://www.agilters.com/img/log.png
}

  render() {
    return (
      <div>
        {this.showNavbar()}
      </div>
    );
  }
}

function mapStateToProps(state){
  return {authenticated: state.auth.authenticated, userName:state.auth.userName,image:state.auth.image}
}

export default connect(mapStateToProps, actions)(Header);
