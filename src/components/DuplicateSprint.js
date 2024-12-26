import React, { useState, useEffect } from 'react';

import Lottie from 'lottie-react-web';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import M from "materialize-css/dist/js/materialize.min.js";
import * as Method from '../common/Methods.js';

const screenHeight = window.innerHeight


const DuplicateSprint=(props)=> {
  
  const [duplicateSprintID, setDuplicateSprintID] = useState("");
  const [isSprintSettingEnabled, setIsSprintSettingEnabled] = useState(true);
  const [isCopyusersEnabled, setIsCopyusersEnabled] = useState(false);
  const [isJiraEnabled, setIsJiraEnabled] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("")

  const navigate = useNavigate();

  useEffect(() => {
      M.AutoInit()
      M.updateTextFields()

      setSelectedSprint(props.sprintId)
      setSelectedTeam(props.selectedTeam)
      

  },[props.sprintList])


  const onBack=()=>{
    var elem = document.getElementById("duplicateSprint")
        var instance = M.Modal.getInstance(elem)
        instance.close()

    var elem = document.getElementById("selectSprintPopup")
        var instance = M.Modal.getInstance(elem)
        instance.open()
  }



  const checkSprintAlreadyPresent=async()=>{
     if(duplicateSprintID.length === 0 ){
      M.toast({html: '<span style="color:yellow">Sprint name cannot be blank</span>', classes: 'rounded'})
    }else{
      var responseRecieved = await Method.getSprintAvailibility(duplicateSprintID, selectedTeam)
      if(responseRecieved.status){
        if(responseRecieved.data !== 0){
          M.toast({html: '<span style="color:yellow">Sprint with this name already present</span>', classes: 'rounded'})
        }else{
          onDuplicate()
        }
         
      }
    }
  }


  const onDuplicate=async()=>{
    
    var tempUserList = []
    if(isCopyusersEnabled){
      tempUserList = [...props.selectedUsers]
      for (var i = 0; i < tempUserList.length ; i++) {
        tempUserList[i].allocatedHrs = 0
      }


    } 

    var jiraTickets = []
    if(isJiraEnabled){
      jiraTickets = [...props.allJiraData]
    }

    var responseRecieved = await Method.creatSprintData(duplicateSprintID, props.projectId, props.sprintSettings, tempUserList, selectedTeam, jiraTickets)

    if(responseRecieved.status){
        props.onNewSprintAdded(duplicateSprintID)

        var elem = document.getElementById("newSprint")
        var instance = M.Modal.getInstance(elem)
        instance.close()

    M.toast({html: `<span style="color:yellow">New Sprint ${duplicateSprintID} added successfully </span>`, classes: 'rounded'})
      }


  }

  const jiraToggled=()=>{

     var isChecked=document.getElementById("jiraTickets").checked;
     
     if(isChecked == true){
        setIsCopyusersEnabled(true)
        setIsJiraEnabled(isChecked)
     }else{
       setIsJiraEnabled(isChecked)
     }
     
  }

  


  return (
    <div className="w-100p">
      <div id="duplicateSprint" className="modal modal-fixed-footer">
          <div className="modal-content">
            
            <h5>DUPLICATE THIS SPRINT</h5>
            <p>{selectedTeam.length>0? `This will duplicate the sprint ${props.sprintId} of ${selectedTeam}`: `This will duplicate the sprint ${props.sprintId}`}</p>
            <div className="input-field col s8 m-top-30">
              <input  id="sprintDuplicate" type="text" className="validate w-100p active" value={duplicateSprintID} onChange={(e)=>{setDuplicateSprintID(e.target.value)}}/>
            <label htmlFor="sprint">SPRINT NAME</label>
            </div>
        <div className="row">
        <div className="col s6 b-right">


          <div className="d-flex m-top-30">
            <div>Copy sprint settings</div>
            <div className="switch m-left-10">
              <label>
                <input checked={isSprintSettingEnabled} disabled type="checkbox"/>
                <span className="lever"></span>
                On
              </label>
            </div>
          </div>

          <div className="d-flex m-top-30">
            <div>Copy users</div>
            <div className="switch m-left-10">
              <label>
                <input checked={isCopyusersEnabled} type="checkbox" onChange={()=>{setIsCopyusersEnabled(!isCopyusersEnabled)}}/>
                <span className="lever"></span>
                On
              </label>
            </div>
          </div>

          <div className="d-flex m-top-30">
            <div>Copy jira tickets</div>
            <div className="switch m-left-10">
              <label>
                <input id="jiraTickets" checked={isJiraEnabled} type="checkbox" onChange={()=>{ jiraToggled() }}/>
                <span className="lever"></span>
                On
              </label>
            </div>
          </div>
        </div>

          <div className="col s6">
            <div className="teal lighten-5 b-r-3" style={{padding:10}}>
              <div className="m-left-10">Existing Project settings will be added</div>
              {isCopyusersEnabled?<div className="m-left-10">{props.selectedUsers.length} users will be added</div>:null}
              {isJiraEnabled?<div className="m-left-10">{props.allJiraData.length} jira ticket will be added to the sprint</div>:null}
            </div>

          </div>
        </div>

        </div>
        <div className="modal-footer">
          <a href="#!" className=" waves-effect waves-green btn-flat" onClick={()=>{onBack()}}>BACK</a>
          <a href="#!" className=" waves-effect waves-green btn-flat m-left-10" onClick={()=>{checkSprintAlreadyPresent()}}>DUPLICATE</a>
        </div>
          
        </div>
    </div>
  );
}

export default DuplicateSprint;