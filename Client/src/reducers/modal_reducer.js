import {MODAL_CLOSE, MODAL_SHOW,UNAUTH_USER,DELETE_STATE} from '../actions/types';

export default function(state={show:false,text:"", value:"",type:"",id:"",shIndex:""},action){
  switch(action.type){
    case MODAL_SHOW:
      return {...state,
         show:true,
         text: action.payload.text,
         value:action.payload.value,
         type:action.payload.type,
         id:action.payload.id,
         shIndex:action.payload.shIndex
       }
    case MODAL_CLOSE:
      return {...state, show:false, text: "", value:"",type:"",id:"", shIndex:""}

    case DELETE_STATE:
      return {...state, show:false, text: "", value:"",type:"",id:"", shIndex:""}
  }
  return state;
}
