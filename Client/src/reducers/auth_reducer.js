import {AUTH_USER, UNAUTH_USER, AUTH_ERROR,RESET_AUTH_ERROR} from '../actions/types';

export default function(state={}, action){
  switch(action.type){
    case AUTH_USER:
      return {...state, authenticated:true,error:null,userName:action.payload.userName,image:action.payload.image}
    case UNAUTH_USER:
    console.log("enter reducer");
      return {...state, authenticated:false,error:null,userName:null}
    case AUTH_ERROR:
      return {...state, error:action.payload}
    case RESET_AUTH_ERROR:
      return {...state, error:''}
  }
  return state;
}
