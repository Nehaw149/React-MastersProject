import {FETCH_PROJECTS,
        CURRENT_STEP,
        CREATE_PROJECT,
        DELETE_STATE,
        GET_PROJECT,
        UPDATE_PROJECT,
        DELETE_PROJECT,
        DELETE_OUTPUT,
        DELETE_NEED,
        MODAL_CLOSE,
        MODAL_SHOW,
        UPDATE_NEED_NAME,
        UPDATE_STAKEHOLDER_NAME,
        UPDATE_OUTPUT_NAME,
        DELETE_VALUE_FLOW,
        AUTH_USER,
        UNAUTH_USER,
        AUTH_ERROR,
        SHOW_LOADER,
        HIDE_LOADER,
        UPDATE_VALUEFLOW_IMPORTANCE,
        UPDATE_VALUEFLOW_INTENSITY,
        UPDATE_VALUEFLOW_VALUE,
        GET_RESULT_1,GET_RESULT_2,GET_RESULT_3,GET_RESULT_4,GET_RESULT_5,GET_RESULT_6,
        SELECTED_STEP,
        RESET_AUTH_ERROR,
        CREATE_STAKEHOLDER } from './types';

import axios from 'axios';
import {browserHistory,hashHistory} from 'react-router';

const ROOT_URL = 'https://mysterious-cliffs-61907.herokuapp.com';
//https://mysterious-cliffs-61907.herokuapp.com
//http://localhost:3090

export function fetchProjects(){
  // call The Server API  To Get Projects
  // Fire an Action with the payload
  return function(dispatch){
    const url = `${ROOT_URL}/projects`;
    axios.get(url,{headers:{authorization:localStorage.getItem('token')}})
    .then((projects)=>{
      dispatch( {type:FETCH_PROJECTS,
                payload:projects});
    });
}

}

export function changeStep(step){
  return {
    type: CURRENT_STEP,
    payload:step
  }
}

export function createProject(title, desc){
  //Make API call
  // When the prject is created, show a snackbar
  const project = {title:title, description:desc};
  return function(dispatch){
    axios.post(`${ROOT_URL}/project`,project,{headers:{authorization:localStorage.getItem('token')}})
    .then((project)=>{
      dispatch({
        type:CREATE_PROJECT,
        payload:project.data
      });
    }).catch((err)=> console.log("can not create project, err: ", err));
  }
}

export function clearState(){
  return {
    type:DELETE_STATE
  }
}

export function getProject(_id){
  return function(dispatch){
    console.log("Enter Action Creator", _id);
    axios.get(`${ROOT_URL}/project/${_id}`,{headers:{authorization:localStorage.getItem('token')}})
    .then((project)=>{
      dispatch({type:HIDE_LOADER});
      dispatch({
        type:GET_PROJECT,
        payload:project.data
      });
      switch(project.data.currentstep){
        case 1:
            hashHistory.push("/home/stakeholders");
            break;
        case 2:
          hashHistory.push("/home/mapping");
          break;
        case 3:
          hashHistory.push("/home/importance");
          break;
        case 4:
          hashHistory.push("/home/results");
          break;
        default:
          hashHistory.push("/home/stakeholders");
      }
    })
    .catch(()=>{
      dispatch({type:HIDE_LOADER});
    })
  }
}

export function deleteProject(_id){
  console.log("ENTER ACTION CREATOR Delete Project");
  return function(dispatch){
    axios.delete(`${ROOT_URL}/project/${_id}`,{headers:{authorization:localStorage.getItem('token')}})
    .then(()=>{
      dispatch({
        type: DELETE_PROJECT,
        payload:_id
      });
    });
  }
}

export function updateProject(project){
  console.log("Project in AC: ",project);
  return function(dispatch){
    axios.put(`${ROOT_URL}/project`,{project})
    .then((updatedProject)=> {
      console.log("Updated Project in AC:",updatedProject)
      dispatch( {
        type:UPDATE_PROJECT,
        payload:updatedProject.data
      });
    }).catch((err)=> console.log(err))
  }

}


export function addStakeholder(info){
  return function(dispatch){
    axios.post(`${ROOT_URL}/stakeholder`, info,{headers:{authorization:localStorage.getItem('token')}})
    .then((project)=>{
      dispatch({
        type:CREATE_STAKEHOLDER,
        payload:project.data
      })
    }).catch((err)=>{
      console.log("Error in AC:", err);
    })
  }
}

export function deleteStakeholder(info){
  console.log("Info In AC:", info);
  return function(dispatch){
    axios.delete(`${ROOT_URL}/stakeholder`,{data:info,headers:{authorization:localStorage.getItem('token')}},)
    .then((project)=>{
      console.log("Reterned Data from Serverin AC:", project.data);
      dispatch({
        type:GET_PROJECT,
        payload: project.data
      })
    }).catch((err)=>{
      console.log("Something went Wrong:",err);
    })
  }
}

export function addNeed(info){
  return function(dispatch){
    axios.post(`${ROOT_URL}/need`, info,{headers:{authorization:localStorage.getItem('token')}})
    .then((project)=>{
      dispatch({
        type:UPDATE_PROJECT,
        payload:project.data
      })
    })
    .catch((err)=> console.log(err))
  }
}

export function addOutput(info){
  return function(dispatch){
    axios.post(`${ROOT_URL}/output`, info,{headers:{authorization:localStorage.getItem('token')}})
    .then((project)=>{
      dispatch({
        type:UPDATE_PROJECT,
        payload:project.data
      })
    })
    .catch((err)=> console.log(err))
  }
}

export function updateCurrentStep(info){
  console.log(info)
  return function(dispatch){
    axios.put(`${ROOT_URL}/currentstep`, info,{headers:{authorization:localStorage.getItem('token')}})
    .then((response)=>{
      console.log("Response in AC:", response);
      dispatch({
        type:CURRENT_STEP,
        payload:response.data
      });
      // hashHistoryserHistory.push('/home/mapping');
      switch(response.data.currentStep){
        case 2:
          hashHistory.push('/home/mapping');
          break;
        case 3:
          hashHistory.push('/home/importance');
          break;
        case 4:
          hashHistory.push('/home/results');
          break;
      }
    })
    .catch((err)=> console.log("ERROR in AC:", err))
  }
}

export function createValueflow(info){
  return function(dispatch){
    axios.post(`${ROOT_URL}/valueflow`, info,{headers:{authorization:localStorage.getItem('token')}})
    .then((response)=>{
      dispatch({
        type:GET_PROJECT,
        payload:response.data
      })
    }).catch((err)=> {
      console.log("error in AC Valueflow", err)
    })
  }
}

export function deleteOutput(info){
  return function(dispatch){
    axios.delete(`${ROOT_URL}/output`,{data:info,headers:{authorization:localStorage.getItem('token')}})
    .then(()=>{
      dispatch({
        type:DELETE_OUTPUT,
        payload:info
      })
    })
    .catch((err)=> console.log(err))
  }
}
export function deleteNeed(info){
  console.log(info);
  return function(dispatch){
    axios.delete(`${ROOT_URL}/need`,{data:info,headers:{authorization:localStorage.getItem('token')}})
    .then(()=>{
      dispatch({
        type:DELETE_NEED,
        payload:info
      })
    })
    .catch((err)=> console.log(err))
  }
}

export function modalClose(){
  return {
    type:MODAL_CLOSE
  }
}

export function modalShow(info){
  console.log("Enter AC modal", info);
  return {
    type:MODAL_SHOW,
    payload:info
  }
}

export function updateNeedName(info){
  return function(dispatch){
    axios.put(`${ROOT_URL}/need`, info,{headers:{authorization:localStorage.getItem('token')}})
    .then((response)=>{
      dispatch({
        type:UPDATE_NEED_NAME,
        payload:response.data
      })
    })
    .catch((err)=> console.log("ERROR IN UPDATING NEED NAME: ", response.data));
  }
}

export function updateStakeholderName(info){
  return function(dispatch){
    axios.put(`${ROOT_URL}/stakeholder`, info,{headers:{authorization:localStorage.getItem('token')}})
    .then((response)=>{
      dispatch({
        type:UPDATE_STAKEHOLDER_NAME,
        payload:response.data
      })
    })
    .catch((err)=> console.log("ERROR IN UPDATING Stakeholder NAME: ", err));
  }
}

export function updateOutputName(info){
  return function(dispatch){
    axios.put(`${ROOT_URL}/output`, info,{headers:{authorization:localStorage.getItem('token')}})
    .then((response)=>{
      dispatch({
        type:UPDATE_OUTPUT_NAME,
        payload:response.data
      })
    })
    .catch((err)=> console.log("ERROR IN UPDATING Output NAME: ", err));
  }
}

export function deleteValueFlow(id){
  return function(dispatch){
    axios.delete(`${ROOT_URL}/valueflow`, {data:{id},headers:{authorization:localStorage.getItem('token')}})
    .then((response)=> {
      dispatch({
        type:DELETE_VALUE_FLOW,
        payload:id
      })
    })
  }
}

export function signinUser({email,password}){
  return function(dispatch){
    axios.post(`${ROOT_URL}/signin`, {email,password})
    .then((response)=>{
      dispatch({type:HIDE_LOADER});
      dispatch(
        {type:AUTH_USER,
          payload:response.data});
      localStorage.setItem('token',response.data.token);
      localStorage.setItem('userName', response.data.userName);
      localStorage.setItem('image', response.data.image);
      hashHistory.push("/home");
    })
    .catch((err)=>{
      dispatch({type:HIDE_LOADER});
      dispatch(authError('Email or Password is incorrect'));
    })
  }
}

export function signupUser({email,password,name}){
  return function(dispatch){
    axios.post(`${ROOT_URL}/signup`, {name,email,password})
    .then((response)=>{
      dispatch({type:HIDE_LOADER});
      dispatch({type:AUTH_USER,payload:response.data});
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.userName);
      localStorage.setItem('image', response.data.image);
      hashHistory.push('/home');
    })
    .catch((error)=> {
      dispatch({type:HIDE_LOADER});
      dispatch(authError('Email is in use'));})
  }
}

export function authError(error){
  return {
    type:AUTH_ERROR,
    payload:error
  }
}

export function signoutUser(){
  return function(dispatch){
    localStorage.removeItem('token');
    localStorage.removeItem("state");
    localStorage.clear();
    dispatch({type:UNAUTH_USER});
    dispatch({type:DELETE_STATE});
  }

}

export function showLoader(){
  return {
    type:SHOW_LOADER
  }
}

export function updateValueflow(properety, info){
  console.log('properety: ', properety)
  return function(dispatch){
    switch(properety){
      case 'importance':
      console.log("Enter importance");
        axios.put(`${ROOT_URL}/valueflow/importance`,info,{headers:{authorization:localStorage.getItem('token')}})
        .then((response)=>{
          dispatch({type:UPDATE_VALUEFLOW_IMPORTANCE,payload:info});
          console.log(response.data);
        })
        .catch((err)=> console.log("Failed Updating 1 "))
      break;

      case 'intensity':
        console.log("Enter intensity");
        axios.put(`${ROOT_URL}/valueflow/intensity`,info,{headers:{authorization:localStorage.getItem('token')}})
        .then((response)=>{
          dispatch({type:UPDATE_VALUEFLOW_INTENSITY,payload:info});
          console.log(response.data);
        })
        .catch((err)=> console.log("Failed Updating 2"))
      break;

      case 'value':
        console.log("Enter value");
        axios.put(`${ROOT_URL}/valueflow/value`,info,{headers:{authorization:localStorage.getItem('token')}})
        .then((response)=>{
          dispatch({type:UPDATE_VALUEFLOW_VALUE,payload:info});
          console.log(response.data);
        })
        .catch((err)=> console.log("Failed Updating 3"))
      break;

    }
  }

}

export function getResult3(id){
  return function(dispatch){
    axios.get(`${ROOT_URL}/NetworkInfoVertex/${id}`)
    .then((response)=>{
      console.log("Succeed Getting Result");
      dispatch({type:HIDE_LOADER});
      dispatch( {
        type:GET_RESULT_3,
        payload:response.data
      })
    })
    .catch(()=> console.log("Error In Getting Result"))
  }

}

export function getResult4(id){
  return function(dispatch){
    axios.get(`${ROOT_URL}/NetworkInfoEdge/${id}`)
    .then((response)=>{
      console.log("Succeed Getting Result");
      dispatch({type:HIDE_LOADER});
      dispatch( {
        type:GET_RESULT_4,
        payload:response.data
      })
    })
    .catch(()=> console.log("Error In Getting Result"))
  }

}

export function createMatrix(id){
  return function(dispatch){
    axios.get(`${ROOT_URL}/algorithem/${id}`,{headers:{authorization:localStorage.getItem('token')}})
    .then(()=> console.log('work fine'))
    .catch((err)=> console.log('did not work fine',err))
  }
}

export function getResult1(fromId,toId,projectId){
  console.log("Enter Get Result 1");
  return function(dispatch){
    axios.get(`${ROOT_URL}/FocalInfoVertex/${fromId}/${toId}/${projectId}`)
    .then((response)=>{
      console.log("Succeed Getting Result 1");
      dispatch({type:HIDE_LOADER});
      dispatch( {
        type:GET_RESULT_1,
        payload:response.data
      })
    })
    .catch(()=> console.log("Error In Getting Result"))
  }
}
export function getResult2(fromId,toId,projectId){
  console.log("Enter Get Result 2");
  return function(dispatch){
    axios.get(`${ROOT_URL}/FocalInfoEdge/${fromId}/${toId}/${projectId}`)
    .then((response)=>{
      dispatch({type:HIDE_LOADER});
      console.log("Succeed Getting Result 2");

      dispatch( {
        type:GET_RESULT_2,
        payload:response.data
      })
    })
    .catch(()=> console.log("Error In Getting Result"))
  }
}

export function getResult(info){
  console.log("Info In Result AC: ", info)
  return function(dispatch){
    switch(info.resultNumber){
      case 'result1':
        axios.get(`${ROOT_URL}/FocalInfoVertex/${info.fromId}/${info.toId}/${info.projectId}`,{headers:{authorization:localStorage.getItem('token')}})
        .then((response)=>{
          dispatch({type:HIDE_LOADER});
          dispatch( {
            type:GET_RESULT_1,
            payload:{data:response.data, from:info.fromName,to:info.toName,currentResult:info.resultNumber}
          })
          hashHistory.push(`/home/results/resultd/${'result1'}`);
        })
        .catch(()=> console.log("Error In Getting Result"))
      break;

      case 'result2':
        axios.get(`${ROOT_URL}/FocalInfoEdge/${info.fromId}/${info.toId}/${info.projectId}`,{headers:{authorization:localStorage.getItem('token')}})
        .then((response)=>{
          dispatch({type:HIDE_LOADER});
          dispatch( {
            type:GET_RESULT_1,
            payload:{data:response.data, from:info.fromName,to:info.toName,currentResult:info.resultNumber}
          })
          hashHistory.push(`/home/results/resultd/${'result2'}`);
        })
        .catch(()=> console.log("Error In Getting Result"))
      break;

      case 'result3':

        axios.get(`${ROOT_URL}/NetworkInfoVertex/${info.projectId}`,{headers:{authorization:localStorage.getItem('token')}})
        .then((response)=>{
          dispatch({type:HIDE_LOADER});
          dispatch( {
            type:GET_RESULT_1,
            payload:{data:response.data, from:info.fromName,to:info.toName,currentResult:info.resultNumber}
          })
          hashHistory.push(`/home/results/resultd/${'result3'}`);
        })
        .catch(()=> console.log("Error In Getting Result"))
      break;

      case 'result4':
        axios.get(`${ROOT_URL}/NetworkInfoEdge/${info.projectId}`,{headers:{authorization:localStorage.getItem('token')}})
        .then((response)=>{
          dispatch({type:HIDE_LOADER});
          dispatch( {
            type:GET_RESULT_1,
            payload:{data:response.data, from:info.fromName,to:info.toName,currentResult:info.resultNumber}
          })
          hashHistory.push(`/home/results/resultd/${'result4'}`);
        })
        .catch(()=> console.log("Error In Getting Result"))
      break;

      case 'result5':
        axios.get(`${ROOT_URL}/NetworkInfoCycle/${info.projectId}`,{headers:{authorization:localStorage.getItem('token')}})
        .then((response)=>{
          console.log("Reponse of network:", response.data)
          dispatch({type:HIDE_LOADER});
          dispatch( {
            type:GET_RESULT_1,
            payload:{data:response.data, from:info.fromName,to:info.toName,currentResult:info.resultNumber}
          })
          hashHistory.push(`/home/results/resultd/${'result5'}`);
        })
        .catch(()=> console.log("Error In Getting Result"))
      break;

      case 'result6':
        axios.get(`${ROOT_URL}/FocalInfoCycle/${info.fromId}/${info.toId}/${info.projectId}`,{headers:{authorization:localStorage.getItem('token')}})
        .then((response)=>{
          console.log("Reponse of network:", response.data)
          dispatch({type:HIDE_LOADER});
          dispatch( {
            type:GET_RESULT_1,
            payload:{data:response.data, from:info.fromName,to:info.toName,currentResult:info.resultNumber}
          })
          hashHistory.push(`/home/results/resultd/${'result6'}`);
        })
        .catch(()=> console.log("Error In Getting Result"))
      break;



    }
  }

}

export function selectedStep(selectedStep){
  return {
    type:SELECTED_STEP,
    payload:selectedStep
  }
}

export function resetFormErrorMessage(){
  return {type:RESET_AUTH_ERROR}
}

export function updateProjectInfo(info){
  console.log("enter update project ac:", info);
  return function(dispatch){
    axios.put(`${ROOT_URL}/projectinfo`,info,{headers:{authorization:localStorage.getItem('token')}})
    .then((response)=>{
      console.log("Updated Successfully");
      dispatch({
        type:UPDATE_PROJECT,
        payload:info
      })
      dispatch({
        type:HIDE_LOADER
      })
      hashHistory.push("/home/projects");
    })
    .catch((err)=> console.log(err))
  }
}


/**
Make authorized Request To Server !!
axios.get(ROOT_URL, {headers:{authorization:localStorage.getItem('token')}})
*/
