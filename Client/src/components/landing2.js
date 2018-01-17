import React , {Component} from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import HeaderComponent from './header';
import Video from './landingPageComponents/video';
import Features from './landingPageComponents/features';
import Steps from './landingPageComponents/steps';
import { Grid, Button , Icon} from 'semantic-ui-react';
import {SectionsContainer, Section, Header, Footer} from 'react-fullpage';
var Slider = require('react-slick');



class Landing extends Component{

  componentWillMount(){
      if(this.props.auth)
        browserHistory.push('/home');
  }

  render(){
    let options = {
      sectionClassName:     'section',
      anchors:              ['sectionOne', 'sectionTwo', 'sectionThree','sectionFour','five-section'],
      scrollBar:            false,
      navigation:           false,
      verticalAlign:        false,
      sectionPaddingTop:    '0px',
      sectionPaddingBottom: '0px',
      arrowNavigation:      true,
      fitToSection:         true,
      slidesNavigation:     true
    };


    return (
    <div>
        <link rel="stylesheet" type="text/css" href="../../public/style/landing.css"></link>


        <SectionsContainer className="container" {...options}>

          <HeaderComponent />
            <Section>
              <Grid className='first-section'>

               <Grid.Row>
                 <Grid.Column>
                  <h1>HiStake </h1>
                  <h3>Don not miss any of your stakeholders</h3>
                  <h4>Fikra is the first Tool which help you to find and Analyse your stakeholders.</h4>
                  <Button positive>Get Started</Button>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              </Section>

            <Section className="second-section" >
            <Grid  relaxed stackable doubling centered  padded >
              <Grid.Row>
                <Grid.Column>
                    <h1>The #1 software development tool used for Stakeholders Analysis</h1>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                 <Grid.Column width={11}>
                      <Video />
                 </Grid.Column>
              </Grid.Row>
            </Grid>
            </Section>

            <Section className="third-section">
                <Features />
            </Section>

            <Section className='fourth-section' >
               <Steps />
            </Section>

          <Section className='five-section' >
              <Grid padded relaxed centered doubling stackabl>
              <Grid.Row className='about'>
                 <Grid.Column width={16}>
                     <h1>Use HiStake With Jira</h1>
                     <p>With our Jira add-on you can use HiStake with Your Jira Accout, without the need
                        to make signup in our Website</p>
                 </Grid.Column>
              </Grid.Row>
              <Grid.Row className='footer'>
                 <Grid.Column width={16}>
                     <h4>Stay in touch</h4>
                     <Button circular color='facebook' icon='facebook' />
                      <Button circular color='twitter' icon='twitter' />
                      <Button circular color='linkedin' icon='linkedin' />
                      <Button circular color='google plus' icon='google plus' />
                 </Grid.Column>
              </Grid.Row>
              </Grid>
          </Section>
          </SectionsContainer>
        </div>
    );
  }
}

function mapStateToProps(state){
  return {auth:state.auth.authenticated}
}

export default connect(mapStateToProps)(Landing);
