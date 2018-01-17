import React, { Component } from 'react';
import Header from './header';
import Test from './steps/testui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Menu,Dropdown,Icon, Grid,Image,Divider, Card, Button,List,Segment,Popup} from 'semantic-ui-react';
import '../../public/style/style.css';

export default class App extends Component {
  render() {
    return (
      // <MuiThemeProvider>
      // <div>// className="row"
      //   <div>
      //     <Header />
      //   </div>
      //   <div className="col-sm-12">
      //   {this.props.children}
      //   </div>
      // </div>
      // </MuiThemeProvider>
      <MuiThemeProvider>

          <div>
            {/* <div className="row"> */}
            <Grid>
            <Grid.Row centered>
              <Grid.Column width={15} >
                <Header />
                </Grid.Column>
            </Grid.Row>
            {/* </div> */}
            </Grid>


                {this.props.children}

          </div>

      </MuiThemeProvider>
    );
  }
}
