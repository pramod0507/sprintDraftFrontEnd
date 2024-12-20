import React, { useState, useEffect } from 'react';

import Lottie from 'lottie-react-web';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import M from "materialize-css/dist/js/materialize.min.js";
import * as Method from '../common/Methods.js';

const screenHeight = window.innerHeight


const NewSprintModal=(props)=> {
  const [sprintID, setSprintID] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("")

  useEffect(() => {
  },[props.teamList])


  const checkSprintAlreadyPresent=async()=>{
    if(sprintID.length === 0 ){
      M.toast({html: '<span style="color:yellow">Sprint name cannot be blank</span>', classes: 'rounded'})
    }else if(selectedTeam.length === 0){
      M.toast({html: '<span style="color:yellow">Select Team</span>', classes: 'rounded'})
    }else{
      var responseRecieved = await Method.getSprintAvailibility(sprintID, selectedTeam)
      if(responseRecieved.status){
        
        if(responseRecieved.data !== 0){
          M.toast({html: `<span style="color:yellow">Sprint with this name already present for ${selectedTeam}</span>`, classes: 'rounded'})
        }else{
          onSave()
        }
         
      }
    }
    
  }

  const onSave=async()=>{
      var responseRecieved = await Method.creatSprintData(sprintID, props.projectId, {days:10, perDay:8, holiday:0,sprintBuffer:10, isFreez:false, selectedSprint:{}}, [],selectedTeam,[])

      if(responseRecieved.status){
        props.onNewSprintAdded(sprintID)

        var elem = document.getElementById("newSprint")
        var instance = M.Modal.getInstance(elem)
        instance.close()

    M.toast({html: `<span style="color:yellow">New Sprint ${sprintID} added successfully </span>`, classes: 'rounded'})
      }
    
  }

  const onBack=async()=>{
    if(props.page ==='landing'){
      var elem = document.getElementById("newSprint")
        var instance = M.Modal.getInstance(elem)
        instance.close()
    }

    if(props.page ==='dashboard'){
      var elem = document.getElementById("newSprint")
        var instance = M.Modal.getInstance(elem)
        instance.close()

    var elem = document.getElementById("selectSprintPopup")
        var instance = M.Modal.getInstance(elem)
        instance.open()
    }
    
  }


  const renderTeams=(e)=>{
    return(
      e.map((item, index) =>
          <option  value={item}>{item}</option>
        )
  )}


   const onTeamSelectForNewSprint=()=>{
    let selectElement = document.getElementById('myselectTeamForNewSprint');
    let selectedValue = selectElement.options[selectElement.selectedIndex].value;
    setSelectedTeam(selectedValue)

  }

  return (
    <div className="">
      <div id="newSprint" className="modal modal-fixed-footer">
        <div className="modal-content">
          <h5>ADD NEW SPRINT</h5>
          <p>Add name of new sprint and click on save to create new sprint.</p>

          <div className="input-field col s8 m-top-30">
            <input  id="sprint" type="text" className="validate w-100p active" value={sprintID} onChange={(e)=>{setSprintID(e.target.value)}}/>
          <label htmlFor="sprint">SPRINT NAME</label>
          </div>


       

          <div className="input-field col s6 m-left-10 m-top-30">
            <div className="input-field col s12">
              <select id="myselectTeamForNewSprint" onChange={()=>{onTeamSelectForNewSprint()}}>
                <option value="" disabled selected>Choose team</option>
                {renderTeams(props.teamList)}
              </select>
              <label>Select team</label>
            </div>
          </div>

        </div>
        <div className="modal-footer">
          <a href="#!" className=" waves-effect waves-green btn-flat" onClick={()=>{onBack()}}>BACK</a>
          <a href="#!" className=" waves-effect waves-green btn-flat m-left-10" onClick={()=>{checkSprintAlreadyPresent()}}>SAVE</a>
        </div>
      </div>

    </div>
  );
}

export default NewSprintModal;