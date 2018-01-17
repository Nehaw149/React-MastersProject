import React , {Component} from 'react';
import {connect} from 'react-redux';
import {browserHistory,hashHistory} from 'react-router';
import Header from './header';
// import '../../public/style/style.css';
import '../../public/style/landing.css';
import landingImage from '../../public/img/landing.jpg'

class Landing extends Component{

  componentWillMount(){
      if(this.props.auth){
        hashHistory.push('/home');
      }
      // document.body.classList.toggle('backgroundStyle');
  }
  componentWillUnmount() {
    // document.body.classList.remove('backgroundStyle');
  }


  render(){

    return (
      <div >
        <Header />
        <section className="backgroundStyle landingContent">
   				<h1 style={{color: 'white'}}>Agilters + </h1>
   				<h3 style={{color: 'white'}}>Don't miss any of your stakeholders</h3>
          <h4 style={{color: 'white'}}>Fikra is the first Tool which help you to find and Analyse your stakeholders.</h4>
          <button>Get Started</button>
        </section>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {auth:state.auth.authenticated}
}

export default connect(mapStateToProps)(Landing);
