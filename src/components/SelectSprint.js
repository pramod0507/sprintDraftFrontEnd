import React, { useState, useEffect } from 'react';

import Lottie from 'lottie-react-web';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import M from "materialize-css/dist/js/materialize.min.js";
import * as Method from '../common/Methods.js';

const screenHeight = window.innerHeight


const SelectSprint=(props)=> {
  const [selectedSprint, setSelectedSprint] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("")
  const [holiday, setHoliday] = useState("")
  const [buffer, setBuffer] = useState("")
  const [allTeam, setTeam] = useState([])
  const [selectedSprintTeam, setSelectedSprintTeam] = useState("")

  const navigate = useNavigate();
  useEffect(() => {
      M.AutoInit()
      M.updateTextFields()
     setTeam(props.teams)

  },[props.sprintList])


  const onRowSelect = ()=>{
   let selectElement = document.getElementById('myselect');
   let selectedValue = selectElement.options[selectElement.selectedIndex].value;
   setSelectedSprint(selectedValue)
    
  }

  const onTeamSelect=()=>{
    let selectElement = document.getElementById('myselectTeam');
    let selectedValue = selectElement.options[selectElement.selectedIndex].value;
    setSelectedTeam(selectedValue)

  }

  const renderRows=()=>{
    return(
      props.sprintList.map((item, index) =>
          <option key ={"select_sprint_"+index}  value={item.sprint_id}>{item.sprint_id}</option>
        )
  )}

  const renderTeams=(e)=>{
    return(
      e.map((item, index) =>
          <option key ={"select_team_"+index}  value={item}>{item}</option>
        )
  )}

  const onProceed=()=>{
    if(selectedSprint.length === 0){
       M.toast({html: `<span style="color:yellow">Select sprint </span>`, classes: 'rounded'})
    }else if(selectedTeam.length === 0){
      M.toast({html: `<span style="color:yellow">Select team </span>`, classes: 'rounded'})
      
    }else{
      checkSprintAlreadyPresent()
    }
    

  }


  const checkSprintAlreadyPresent=async()=>{
      var responseRecieved = await Method.getSprintAvailibility(selectedSprint, selectedTeam)
      if(responseRecieved.status){
        if(responseRecieved.data !== 0){
          props.onProceedToDashboard(selectedSprint, selectedTeam)
        }else{
          M.toast({html: `<span style="color:yellow">Sprint ${selectedSprint} is not present for ${selectedTeam}</span>`, classes: 'rounded'})
        }
         
      }
  }


  return (
    <div className="w-100p">
      <div id="selectSprint">
          <div className="modal-content">
            {props.isheaderVisible?
            <div>
              <h4 className="center-align">{props.projectName}</h4>
              <p className="center-align">Select sprint from dropdown </p>
            </div>
            :null
            }

            <div className="d-flex flex-column a-center">
                
                <div className="row w-100p ">
                <div className="col s3"/>
                <div className="input-field col s6">
                  <div className="input-field col s12">
                    <select id="myselect" onChange={()=>{onRowSelect()}}>
                      <option value="" disabled selected>Choose sprint</option>
                      {renderRows()}
                    </select>
                    <label>Select sprint</label>
                  </div>
                </div>
                <div className="col s3"/>
                </div>

                <div className="row w-100p ">
                <div className="col s3"/>
                <div className="input-field col s6">
                  <div className="input-field col s12">
                    <select id="myselectTeam" onChange={()=>{onTeamSelect()}}>
                      <option value="" disabled selected>Choose team</option>
                      {renderTeams(props.teams)}
                    </select>
                    <label>Select team</label>
                  </div>
                </div>
                <div className="col s3"/>
                </div>

                <div className=" row w-100p ">
                  <div className="col s3"/>
                  <div onClick={()=>{onProceed()}} className="btn w-100p waves-effect waves-light w-100p col s6">{props.label}</div>
                  <div className="col s3"/>
                </div>

            </div>
          </div>

          
          
        </div>
    </div>
  );
}

export default SelectSprint;