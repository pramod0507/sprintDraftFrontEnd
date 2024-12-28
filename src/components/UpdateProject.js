import React, { useState, useEffect, useRef } from 'react';

import Lottie from 'lottie-react-web';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import M from "materialize-css/dist/js/materialize.min.js";
import * as Method from '../common/Methods.js';


const screenHeight = window.innerHeight


const UpdateProject=(props)=> {
  
  // const [actualPin, setActualPin] = useState("111111")

  const [jiraProjectIdUpdate, setJiraProjectIdUpdate] = useState("")
  const [projectNameUpdate, setProjectNameUpdate] = useState("")
  const [teamsUpdate, setTeamsUpdate] = useState("")
  const [qaHrKeyUpdate, setQaHrKeyUpdate] = useState("")
  const [devHrKeyUpdate, setDevHrKeyUpdate] = useState("")
  const [qaUserFieldUpdate, setQaUserFieldUpdate] = useState("")
  const [projectPinUpdate, setProjectPinUpdate] = useState("")
  const [sprintKeyUpdate, setSprintKeyUpdate] = useState("")


  
  useEffect(() => {
      M.AutoInit()
      M.updateTextFields()
    if(props.selectedProjectToManage.hasOwnProperty("id")){
      UpdateSelectedData()
    }
      
    
  },[props.selectedProjectToManage])


  const UpdateSelectedData=()=>{
    setJiraProjectIdUpdate(props.selectedProjectToManage.project_id)
    setProjectNameUpdate(props.selectedProjectToManage.zs_project_name)
    setTeamsUpdate( JSON.stringify(JSON.parse(props.selectedProjectToManage.project_settings).teams).replaceAll('"',"").replaceAll('[',"").replaceAll(']',"") )
    setQaHrKeyUpdate(props.selectedProjectToManage.qa_hr_key)
    setDevHrKeyUpdate(props.selectedProjectToManage.dev_hr_key)
    setQaUserFieldUpdate(props.selectedProjectToManage.qa_user_field)
    setProjectPinUpdate( window.atob( props.selectedProjectToManage.pass_key ) )
    setSprintKeyUpdate(props.selectedProjectToManage.zs_sprint_key)
  }


  const onCancel=()=>{
   
    var elem = document.getElementById("UpdateProject")
    var instance = M.Modal.getInstance(elem)
    instance.close()

    var elem = document.getElementById("CreateProject")
    var instance = M.Modal.getInstance(elem)
    instance.open()
    
  }

  const validateUpdate=async()=>{
    if(!jiraProjectIdUpdate.length > 0){
      M.toast({html: `<span style="color:yellow">Project ID  cannot be blank</span>`, classes: 'rounded'})
    }else if(!projectNameUpdate.length > 0){
      M.toast({html: `<span style="color:yellow">Project Name  cannot be blank</span>`, classes: 'rounded'})
    }else if(!teamsUpdate.length > 0){
      M.toast({html: `<span style="color:yellow">Teams cannot be blank</span>`, classes: 'rounded'})
    }else if(!projectPinUpdate.length == 6){
      M.toast({html: `<span style="color:yellow">PIN Required 6 characters</span>`, classes: 'rounded'})
    }else if(!qaHrKeyUpdate.length > 0){
      M.toast({html: `<span style="color:yellow">QA HR Key cannot be blank</span>`, classes: 'rounded'})
    }else if(!devHrKeyUpdate.length > 0){
      M.toast({html: `<span style="color:yellow">Dev Hr Key cannot be blank</span>`, classes: 'rounded'})
    }else if(!qaUserFieldUpdate.length > 0){
      M.toast({html: `<span style="color:yellow">QA User field cannot be blank</span>`, classes: 'rounded'})
    }else if(!sprintKeyUpdate.length > 0){
      M.toast({html: `<span style="color:yellow">Sprint field cannot be blank</span>`, classes: 'rounded'})
    }else{
      var all = teamsUpdate + ""
      var tempArray = teamsUpdate.split(",")
      var tempTeams = JSON.stringify({teams:tempArray})
       var responseRecieved = await  Method.editNewSettingsData(jiraProjectIdUpdate, "", tempTeams, qaHrKeyUpdate, devHrKeyUpdate, qaUserFieldUpdate, projectNameUpdate, projectPinUpdate, props.selectedProjectToManage.id, sprintKeyUpdate)

       if(responseRecieved.status){
          var elem = document.getElementById("UpdateProject")
          var instance = M.Modal.getInstance(elem)
          instance.close()
           M.toast({html: `<span style="color:yellow">Project updated successfully</span>`, classes: 'rounded'})
           props.onCreateComplete()
          
       }
       
    }
  }

  
  return (
    <div className="w-100p">
      <div id="UpdateProject" className="modal modal-fixed-footer">
          <div className="modal-content">
            
            <div className="row ">
              <div  className="col s12 ">
                <h5>UPDATE PROJECTS</h5>
                <p>Add detail to create project.</p>
                <div className="row">
                  <div className="input-field col s6">
                    <input id="project_id_update"  disabled type="text" className="validate active" value={jiraProjectIdUpdate} onChange={(e)=>{setJiraProjectIdUpdate(e.target.value)}}/>
                    <label htmlFor="project_id_update">Jira Project ID</label>
                  </div>
                  <div className="input-field col s6">
                    <input id="Project_Name_update" type="text" className="validate" value={projectNameUpdate}  onChange={(e)=>{setProjectNameUpdate(e.target.value)}}/>
                    <label htmlFor="Project_Name_update">Project Name</label>
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col s6">
                    <input id="project_Teams_update" type="text" className="validate active" value={teamsUpdate} onChange={(e)=>{setTeamsUpdate(e.target.value)}}/>
                    <label htmlFor="project_Teams_update">Teams</label>
                    <span className="helper-text">Add multiple team using comma seperated eg Team A, Team B </span>
                  </div>
                  <div className="input-field col s6">
                    <input id="Project_Pin_update" type="number" className="validate" value={projectPinUpdate}  onChange={(e)=>{setProjectPinUpdate(e.target.value)}}/>
                    <label htmlFor="Project_Pin_update">Password</label>
                    <span className="helper-text">Six digit number required</span>
                  </div>
                </div>

                <div className="d-flex w-100p m-top-30">
                  <div style={{width:130}} className="f-17">JIRA Configs</div>
                  <hr className="solid grey  w-100p m-top-10"/>
                </div>
                <div className="row m-top-30">
                  <div className="input-field col s6">
                    <input id="QA_HR_Key_update" type="text" className="validate" value={qaHrKeyUpdate} onChange={(e)=>{setQaHrKeyUpdate(e.target.value)}}/>
                    <label htmlFor="QA_HR_Key_update">QA Hr Key (JIRA)</label>
                  </div>
                  <div className="input-field col s6">
                    <input id="DEV_HR_Key_update" type="text" className="validate" value={devHrKeyUpdate} onChange={(e)=>{setDevHrKeyUpdate(e.target.value)}}/>
                    <label htmlFor="DEV_HR_Key_update">Dev Hr Key (JIRA)</label>
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col s6">
                    <input id="QA_User_update" type="text" className="validate" value={qaUserFieldUpdate} onChange={(e)=>{setQaUserFieldUpdate(e.target.value)}}/>
                    <label htmlFor="QA_User_update">QA User Field (JIRA)</label>
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col s6">
                    <input id="sprintKey_update" type="text" value={sprintKeyUpdate} className="validate" onChange={(e)=>{setSprintKeyUpdate(e.target.value)}}/>
                    <label htmlFor="QA_User">Sprint custom Field (JIRA)</label>
                  </div>
                </div>

                <div className="p-20-right">
                  <a href="#!" className="waves-effect waves-green btn m-left-10 w-100p" onClick={()=>{validateUpdate()}}>SAVE</a>
                </div>

              </div>

              

              

            </div>

            

          </div> 
          <div className="modal-footer">
            <div className="d-flex j-end">
              <a href="#!" className=" waves-effect waves-green btn-flat" onClick={()=>{onCancel()}}>CANCEL</a>
            </div>
          </div>
          
        </div>
    </div>
  );
}

export default UpdateProject;