import {CURRENT_STEP,CREATE_PROJECT, DELETE_STATE,GET_PROJECT,SELECTED_STEP} from '../actions/types';

export default function currentStep(state = {currentStep:0, step1:false, step2:false,step3:false,step4:false,step5:false,selectedStep:0}, action){
  switch(action.type){
    case GET_PROJECT:
    {
      switch(action.payload.currentstep){
        case 1:
          return {...state, currentStep:1 , step1:true,step2:false, step3:false,step4:false,selectedStep:1 } //in Stakhodlers page
        case 2:
          return {...state,currentStep:2,  step1:true, step2:true,step3:false,step4:false,selectedStep:2} // in Mapping Page
        case 3:
          return {...state, currentStep:3, step1:true,step2:true, step3:true,step4:false,selectedStep:3} // in Table Page
        case 4:
          return {...state, currentStep:4, step1:true,step2:true, step3:true,step4:true,step5:true,selectedStep:4} // in Results Page
      }
    }
    case CURRENT_STEP:
    {
      switch(action.payload.currentStep){
        case 1:
          return {...state, currentStep:1 , step1:true,selectedStep: 1} //in Stakhodlers page
        case 2:
          return {...state,currentStep:2,  step1:true, step2:true,selectedStep:2} // in Mapping Page
        case 3:
          return {...state, currentStep:3, step1:true,step2:true, step3:true,selectedStep:3} // in Table Page
        case 4:
          return {...state, currentStep:4, step1:true,step2:true, step3:true,step4:true,selectedStep:4} // in Results Page
      }
    }

    case CREATE_PROJECT:
        return {...state, currentStep:1 , step1:true,selectedStep:1}

    case DELETE_STATE:
      return {...state, currentStep:0, step1:false, step2:false,step3:false,selectedStep:0}

    case SELECTED_STEP:
      return{...state, selectedStep:action.payload}

  }
  return state;
}
