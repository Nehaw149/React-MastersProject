import React, { Component } from 'react';
import { Menu,Dropdown,Icon, Grid,Image,Divider, Card, Button,List,Segment,Popup} from 'semantic-ui-react';
import {Link, browserHistory} from 'react-router';


export default class MenuExampleStackable extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeItem:{}
    }
    this.showNavbar = this.showNavbar.bind(this);
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  showNavbar(){
    const { activeItem } = this.state
    return (

    <Menu stackable>
      <Menu.Item>
        <img src='http://semantic-ui.com/images/logo.png' />
      </Menu.Item>

      <Menu.Item name='projects' active={activeItem === 'projects'} onClick={this.handleItemClick}>
          <Icon name='industry' />
          <Dropdown simple text=''>
          <Dropdown.Menu>
            <Dropdown.Item onClick={()=> browserHistory.push("/newproject")}>Create New Project</Dropdown.Item>
            <Dropdown.Item>All Projects</Dropdown.Item>
          </Dropdown.Menu>
          </Dropdown>
      </Menu.Item>

      <Menu.Item
        name='ideas'
        active={activeItem === 'testimonials'}
        onClick={this.handleItemClick}
      >
        <Icon name="idea" />
        Ideas
      </Menu.Item>

      <Menu.Item
        name='lessons'
        active={activeItem === 'sign-in'}
        onClick={this.handleItemClick}
      >
        lessons Learned
      </Menu.Item>

      <Menu.Item name='gamepad' active={activeItem === 'gamepad'} onClick={this.handleItemClick} position="right">
          <Icon name='user' />
          <Dropdown simple text='User'>
          <Dropdown.Menu>
            <Dropdown.Item>My Account</Dropdown.Item>
            <Dropdown.Item>LogOut</Dropdown.Item>
          </Dropdown.Menu>
          </Dropdown>
      </Menu.Item>
    </Menu>
  )
  }

  render() {


    return (
      <div>
        {this.showNavbar()}
        <Grid columns={3}>
          {/* <Grid.Row columns={3}> */}
            <Grid.Column>
              <Card fluid>
                <Image src='http://semantic-ui.com/images/avatar2/large/matthew.png' />
                <Card.Content>
                  <Card.Header>
                    Matthew
                  </Card.Header>
                  <Card.Meta>
                    <span className='date'>
                      Joined in 2015
                    </span>
                  </Card.Meta>
                  <Card.Description>
                    Matthew is a musician living in Nashville.
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <div className='ui two buttons'>
                    <Button basic color='green'>Approve</Button>
                    <Button basic color='red'>Decline</Button>
                  </div>
                </Card.Content>
              </Card>
            </Grid.Column>

            <Grid.Column>
              <Card fluid>
                <Image src='http://semantic-ui.com/images/avatar2/large/matthew.png' />
                <Card.Content>
                  <Card.Header>
                    Matthew
                  </Card.Header>
                  <Card.Meta>
                    <span className='date'>
                      Created in 2015
                    </span>
                    <br/>
                    <span className='date'>
                      lastmodified in 2015
                    </span>
                  </Card.Meta>
                  <Card.Description>
                    Matthew is a musician living in Nashville.
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <div className='ui two buttons'>
                    <Button basic color='green'>Approve</Button>
                    <Button basic color='red'>Decline</Button>
                  </div>
                </Card.Content>
              </Card>
            </Grid.Column>

            <Grid.Column>
              <Card fluid>
                <Image src='http://semantic-ui.com/images/avatar2/large/matthew.png' />
                <Card.Content>
                  <Card.Header>
                    Matthew
                  </Card.Header>
                  <Card.Meta>
                    <span className='date'>
                      Joined in 2015
                    </span>
                  </Card.Meta>
                  <Card.Description>
                    Matthew is a musician living in Nashville.
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <div className='ui two buttons'>
                    <Button basic color='green'>Approve</Button>
                    <Button basic color='red'>Decline</Button>
                  </div>
                </Card.Content>
              </Card>
            </Grid.Column>

            <Grid.Column>
              <Card>
                <Image src='http://semantic-ui.com/images/avatar2/large/matthew.png' />
                <Card.Content>
                  <Card.Header>
                    Matthew
                  </Card.Header>
                  <Card.Meta>
                    <span className='date'>
                      Joined in 2015
                    </span>
                  </Card.Meta>
                  <Card.Description>
                    Matthew is a musician living in Nashville.
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <a>
                    <Icon name='user' />
                    22 Friends
                  </a>
                </Card.Content>
              </Card>
            </Grid.Column>

          {/* </Grid.Row> */}

          {/* <Grid.Row columns={2}>
            <Grid.Column> */}
              <List selection animated divided verticalAlign='middle'>

                <List.Item onClick={()=> console.log("HI")}>
                  <List.Content floated='right'>
                    <Button>Add</Button>
                  </List.Content>
                  <Image avatar src='http://semantic-ui.com/images/avatar2/small/lena.png' />
                  <List.Content>
                    Lena
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content floated='right'>
                    <Popup
                      trigger={<Button onClick={()=> console.log("Trigger")} icon='trash' />}
                      content="Delete This Stakeholder, This could effect the next Steps"
                      basic
                    />
                    <Popup
                      trigger={<Button onClick={()=> console.log("Trigger")} icon='edit' />}
                      content="Edit the Name Of Stakeholder"
                      basic
                    />

                  </List.Content>
                  <Icon name='spy' />
                  <List.Content>
                    Lindsay
                  </List.Content>
                </List.Item>
              </List>
            {/* </Grid.Column>
          </Grid.Row> */}


        </Grid>
      </div>

    )
  }
}
