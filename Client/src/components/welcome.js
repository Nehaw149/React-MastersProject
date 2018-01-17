import React,{Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';
import {Statistic,Progress, Menu,Dropdown,Label,Icon, Grid,Image, Button,List,Segment,Popup,Input,Header,Modal,Message} from 'semantic-ui-react';
import { Timeline } from 'antd';
import 'antd/dist/antd.css';

class Welcome extends Component{

  render(){
    return(
      <Grid  container>
        {/* <Grid.Row columns={2}> */}
          <Grid.Column floated='left' width={8}>
            <Segment padded raised >
              <Label as='a' color='blue' ribbon>Last Project</Label>
              <Header size='large' textAlign='center'>Project Name</Header>
              <Header as='h3' color='yellow'>
                <Icon name='tasks' />
                <Header.Content>
                  Current Step
                  <Header.Subheader>
                    Connecting the stakeholders
                  </Header.Subheader>
                </Header.Content>
              </Header>
              <Header as='h3' color='red'>
                <Icon name='line chart' />
                <Header.Content>
                Progress
              </Header.Content>
              <br/>
                <Header.Subheader>
                  <Progress percent={23} color='teal' size='small' progress/>
                </Header.Subheader>
              </Header>
              <Statistic.Group size='mini' textAlign='center'>
                <Statistic color='blue' size='small'>
                  <Statistic.Value>
                    <Icon name='spy' />
                    42
                  </Statistic.Value>
                  <Statistic.Label>Stakeholders</Statistic.Label>
                </Statistic>

                <Statistic color='green' size='small'>
                  <Statistic.Value>
                    <Icon name='plus' />
                    12
                  </Statistic.Value>
                  <Statistic.Label>Outputs</Statistic.Label>
                </Statistic>

                <Statistic color='red' size='small'>
                  <Statistic.Value>
                    <Icon name='minus'  />
                    10
                  </Statistic.Value>
                  <Statistic.Label>Needs</Statistic.Label>
                </Statistic>
              </Statistic.Group>
              <br/>
              <Button basic color='blue'>Continue Working</Button>
            </Segment>
          </Grid.Column>
          <Grid.Column floated='right' width={8}>
            <Segment >
              <Label as='a' color='teal' ribbon='right'>Last Activities</Label>
              <Timeline>
                <Timeline.Item color="green">Add stakeholder 1 10-02-2017</Timeline.Item>
                <Timeline.Item color="green">Add stakeholder 2 10-02-2017</Timeline.Item>
                <Timeline.Item color="green">Add stakeholder 3 10-02-2017</Timeline.Item>
                <Timeline.Item color="red"> Delete Satekholder 10-02-2017</Timeline.Item>
                <Timeline.Item> Update Stakeholder Name</Timeline.Item>
                <Timeline.Item color="green">Add new need for stakeholder 1 10-02-2017</Timeline.Item>
                <Timeline.Item color="green">Add new need for stakeholder 1 10-02-2017</Timeline.Item>
                <Timeline.Item color="green">Add new output for stakeholder 1 10-02-2017</Timeline.Item>
              </Timeline>
            </Segment>

          </Grid.Column>
        {/* </Grid.Row> */}
      </Grid>
    );
  }
}

export default connect(null,actions)(Welcome)
