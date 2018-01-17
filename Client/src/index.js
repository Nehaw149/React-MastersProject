import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware,compose } from 'redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Router, browserHistory, Route, IndexRoute,hashHistory} from 'react-router';
import reduxThunk from 'redux-thunk';
import Signin from './components/auth/signin';

import App from './components/app';
import reducers from './reducers';
import Welcome from './components/welcome';
import Landing from './components/landing';
import Projects from './components/projects';
import Ideas from './components/ideas';
import NewProject from './components/steps/create_project';
import Stakeholders from './components/steps/stakeholders';
import Mapping from './components/steps/mapping';
import Test from './components/steps/test';
import Signout from './components/auth/signout';
import Signup from './components/auth/signup';
import Results from './components/steps/results';
import ImportanceTable from './components/steps/importance_table';
import RequirAuth from './components/auth/require_auth';
import {AUTH_USER,UNAUTH_USER} from './actions/types';
import ResultDetails from './components/steps/result_details';

import {persistStore, autoRehydrate} from 'redux-persist';
import {loadState, saveState} from './localstorage/local_storage';
import throttle from 'lodash/throttle'

const persistedState = loadState();
const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);

const store =createStoreWithMiddleware(reducers,persistedState);
store.subscribe(throttle(()=>{
  saveState(store.getState());
},1000));


// const middleware = [reduxThunk];
// let store = compose(
//   applyMiddleware(...middleware),
//   autoRehydrate()
// )(createStore)(reducers);
// persistStore(store);

// persistStore(store, null, () => {
//   console.log('rehydration complete')}).purge()


const token = localStorage.getItem('token');
if(token){
  store.dispatch({type:AUTH_USER,payload:{userName:localStorage.getItem('userName'),image:localStorage.getItem('image')}})
}
else{
  console.log("No token");
  localStorage.clear();
  store.dispatch({type:UNAUTH_USER});
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={Landing} />
      <Route path='/signin' component={Signin} />
      <Route path= '/signout' component={Signout} />
      <Route path= '/signup' component={Signup} />
      <Route path="/home" component = {RequirAuth(App)} >
        <IndexRoute component= {RequirAuth(Welcome)} />

        <Route path="projects" component={RequirAuth(Projects)} />
        <Route path="ideas" component={RequirAuth(Ideas)} />
        <Route path="newproject" component={RequirAuth(NewProject)} />
        <Route path="stakeholders" component={RequirAuth(Test)} />
        <Route path="mapping" component={RequirAuth(Mapping)} />
        <Route path="importance" component={ImportanceTable} />
        <Route path='results' component={Results}/>
        <Route path="results/resultd/:num" component = {RequirAuth(ResultDetails)} />
        <Route path='*' component={Welcome}/>
      </Route>
      <Route path='*' component={Landing}/>

    </Router>
  </Provider>
  , document.querySelector('.container'));
