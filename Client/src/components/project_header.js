import React from 'react';
import { Grid, Header,Icon} from 'semantic-ui-react';

export default function ProjectHeader(props){
  return (
    <Grid.Row centered>
      <Grid.Column width={8}>
      <Header as='h3' block textAlign='center' color="green">
        {props.title}
      </Header>
      {/* <Header as='h2' icon color='blue'>
        <Icon name='industry' />
        {props.title}
      </Header> */}
      </Grid.Column>
    </Grid.Row>
  );
}
