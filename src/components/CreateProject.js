import React, { useState, useEffect, useRef } from 'react';

import Lottie from 'lottie-react-web';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import M from "materialize-css/dist/js/materialize.min.js";
import * as Method from '../common/Methods.js';


const screenHeight = window.innerHeight


const CreateProject=(props)=> {
  
  const [actualPin, setActualPin] = useState("332211")

  const [jiraProjectId, setJiraProjectId] = useState("")
  const [projectName, setProjectName] = useState("")
  const [teams, setTeams] = useState("")
  const [qaHrKey, setQaHrKey] = useState("")
  const [devHrKey, setDevHrKey] = useState("")
  const [qaUserField, setQaUserField] = useState("")
  const [sprintKey, setSprintKey] = useState("")
  const [projectPin, setProjectPin] = useState("")
  const [sprintBoardId, setSprintBoardId] = useState("")



  useEffect(() => {
      M.AutoInit()
      M.updateTextFields()
  },[])

  const validate=async()=>{
    if(!jiraProjectId.length > 0){
      M.toast({html: `<span style="color:yellow">Project ID  cannot be blank</span>`, classes: 'rounded'})
    }else if(!projectName.length > 0){
      M.toast({html: `<span style="color:yellow">Project Name  cannot be blank</span>`, classes: 'rounded'})
    }else if(!teams.length > 0){
      M.toast({html: `<span style="color:yellow">Teams cannot be blank</span>`, classes: 'rounded'})
    }else if(!projectPin.length == 6){
      M.toast({html: `<span style="color:yellow">PIN Required 6 characters</span>`, classes: 'rounded'})
    }else if(!qaHrKey.length > 0){
      M.toast({html: `<span style="color:yellow">QA HR Key cannot be blank</span>`, classes: 'rounded'})
    }else if(!devHrKey.length > 0){
      M.toast({html: `<span style="color:yellow">Dev Hr Key cannot be blank</span>`, classes: 'rounded'})
    }else if(!qaUserField.length > 0){
      M.toast({html: `<span style="color:yellow">QA User field cannot be blank</span>`, classes: 'rounded'})
    }else if(!sprintBoardId.length > 0){
      M.toast({html: `<span style="color:yellow">Sprint board id cannot be blank</span>`, classes: 'rounded'})
    }else if(!sprintKey.length > 0){
      M.toast({html: `<span style="color:yellow">Sprint field cannot be blank</span>`, classes: 'rounded'})
    }else{
      var tempArray = teams.split(",")
      var tempTeams = JSON.stringify({teams:tempArray})
       var responseRecieved = await  Method.addNewSettingsData(jiraProjectId, sprintBoardId, tempTeams, qaHrKey, devHrKey, qaUserField, projectName, projectPin, sprintKey)

       if(responseRecieved.status){
          var elem = document.getElementById("CreateProject")
          var instance = M.Modal.getInstance(elem)
          instance.close()
           M.toast({html: `<span style="color:yellow">New project created successfully</span>`, classes: 'rounded'})
           props.onCreateComplete()

            setJiraProjectId("")
            setProjectName("")
            setTeams("")
            setQaHrKey("")
            setDevHrKey("")
            setQaUserField("")
            setSprintKey("")
            setProjectPin("")
            setSprintBoardId("")
          
       }
      
    }
  }

  const onDelete=(e)=>{
    props.updateSelectedProjectToManage(props.allProjects[e])
    var elem = document.getElementById("CreateProject")
    var instance = M.Modal.getInstance(elem)
    instance.close()

    var elem = document.getElementById("DeleteConfirmation")
    var instance = M.Modal.getInstance(elem)
    instance.open()
  }


  const onEdit=(e)=>{

    var elem = document.getElementById("CreateProject")
    var instance = M.Modal.getInstance(elem)
    instance.close()

    var elem = document.getElementById("UpdateProject")
    var instance = M.Modal.getInstance(elem)
    instance.open()
    
      props.updateSelectedProjectToManage(props.allProjects[e])
  }


  const renderProjects=()=>{
    return(
      props.allProjects.map((item, index) =>
    <tr key={index}>
          <td>
              <div>{item.zs_project_name}</div>
          </td>
          <td>
              <div className="d-flex">
                <i className="material-icons f-17 hand" onClick={(e)=>{onEdit(index)}}>mode_edit</i>
                <i className="material-icons m-left-10 f-17 hand" onClick={(e)=>{onDelete(index)}}>delete_forever</i>
              </div>
            </td>
    </tr>
    ))
  }



  return (
    <div className="w-100p">
      <div id="CreateProject" className="modal modal-fixed-footer">
          <div className="modal-content">
            
            <div className="row ">
              <div  className="col s12 m6 l6 b-right">
                <h5>CREATE PROJECTS</h5>
                <p>Add detail to create project.</p>
                <div className="row">
                  <div className="input-field col s6">
                    <input id="project_id" type="text" className="validate" onChange={(e)=>{setJiraProjectId(e.target.value)}}/>
                    <label htmlFor="project_id">Jira Project ID</label>
                  </div>
                  <div className="input-field col s6">
                    <input id="Project_Name" type="text" className="validate"  onChange={(e)=>{setProjectName(e.target.value)}}/>
                    <label htmlFor="Project_Name">Project Name</label>
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col s6">
                    <input id="project_Teams" type="text" className="validate" onChange={(e)=>{setTeams(e.target.value)}}/>
                    <label htmlFor="project_Teams">Teams</label>
                    <span className="helper-text">Add multiple team using comma seperated eg Team A, Team B</span>
                  </div>
                  <div className="input-field col s6">
                    <input id="Project_Pin" type="number" className="validate"  onChange={(e)=>{setProjectPin(e.target.value)}}/>
                    <label htmlFor="Project_Pin">Password</label>
                    <span className="helper-text">Six digit number required</span>
                  </div>
                </div>

                <div className="d-flex w-100p m-top-30">
                  <div style={{width:130}} className="f-17">JIRA Configs</div>
                  <hr className="solid grey  w-100p m-top-10"/>
                </div>
                <div className="row m-top-30">
                  <div className="input-field col s6">
                    <input id="QA_HR_Key" type="text" className="validate" onChange={(e)=>{setQaHrKey(e.target.value)}}/>
                    <label htmlFor="QA_HR_Key">QA Hr Key (JIRA)</label>
                  </div>
                  <div className="input-field col s6">
                    <input id="DEV_HR_Key" type="text" className="validate" onChange={(e)=>{setDevHrKey(e.target.value)}}/>
                    <label htmlFor="DEV_HR_Key">Dev Hr Key (JIRA)</label>
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col s6">
                    <input id="QA_User" type="text" className="validate" onChange={(e)=>{setQaUserField(e.target.value)}}/>
                    <label htmlFor="QA_User">QA User Field (JIRA)</label>
                  </div>

                  <div className="input-field col s6">
                    <input id="zs_sprint_board" type="text" className="validate" onChange={(e)=>{setSprintBoardId(e.target.value)}}/>
                    <label htmlFor="zs_sprint_board">Sprint Board Id</label>
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col s6">
                    <input id="sprintKey" type="text" className="validate" onChange={(e)=>{setSprintKey(e.target.value)}}/>
                    <label htmlFor="sprintKey">Sprint custom Field (JIRA)</label>
                  </div>
                </div>

                <div className="p-20-right">
                  <a href="#!" className="waves-effect waves-green btn m-left-10 w-100p" onClick={()=>{validate()}}>SAVE</a>
                </div>

              </div>

              <div className="col  s12 m6 l6 b-left" style={{}}>
                <h5>MANAGE PROJECTS</h5>
                <p>Manage project edit or delete project </p>
                <table className="m-top-20">
                  <thead>
                    <tr>
                       <th>Projects</th>
                       <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {renderProjects()}
                  </tbody>
                </table>
              </div>

              

            </div>

            

          </div> 
          <div className="modal-footer">
            <div className="d-flex j-end">
              <a href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={()=>{}}>CANCEL</a>
            </div>
          </div>
          
        </div>
    </div>
  );
}

export default CreateProject;