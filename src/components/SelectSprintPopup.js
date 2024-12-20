import React, { useState, useEffect } from 'react';

import Lottie from 'lottie-react-web';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import M from "materialize-css/dist/js/materialize.min.js";
import * as Method from '../common/Methods.js';
import SelectSprint from './SelectSprint.js'

const screenHeight = window.innerHeight


const SelectSprintPopup=(props)=> {
  const [leave, setLeave] = useState("")
  const [buffer, setBuffer] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("dev")

  const navigate = useNavigate();

  useEffect(() => {
      M.AutoInit()
      M.updateTextFields();
      
      
  },[props.sprintList])

  const onChangeProject=()=>{
    localStorage.removeItem("project")
    localStorage.removeItem("sprints")
    localStorage.removeItem("selectedSprint")
    navigate('/')
  }

  const onClickNewSprint=()=>{
    var elem = document.getElementById("selectSprintPopup")
    var instance = M.Modal.getInstance(elem)
    instance.close()

    var elem = document.getElementById("newSprint")
    var instance = M.Modal.getInstance(elem)
    instance.open()
  }

  const onProceedToDashboard=(selectedSprint, selectedTeam)=>{
    props.onProceedToDashboard(selectedSprint, selectedTeam)
  }

  const duplicateScreen=()=>{
    var elem = document.getElementById("selectSprintPopup")
    var instance = M.Modal.getInstance(elem)
    instance.close()

    var elem02 = document.getElementById("duplicateSprint")
    var instance02 = M.Modal.getInstance(elem02)
    instance02.open()
  }


  return (
    <div className="">
      <div id="selectSprintPopup" className="modal ">
          <div className="">
              <SelectSprint projectId={props.projectId} sprintList={props.sprintList}  teams={localStorage.getItem("project") !== null? JSON.parse( JSON.parse(localStorage.getItem("project")) .project_settings).teams: []}  onProceedToDashboard={onProceedToDashboard}  isheaderVisible={false} label={"Change"}/>
          </div>
          <div className="modal-footer">
            <div className="d-flex j-between">
              <div>
                <a href="#!" className="b-thin btn-flat modal-close waves-effect waves-green" onClick={()=>{duplicateScreen()}}>DUPLICATE SPRINT</a>

                <a href="#!" className="b-thin btn-flat modal-close waves-effect waves-green m-left-10" onClick={()=>{onClickNewSprint()}}>+ NEW SPRINT</a>
              </div>
              <div>
               <a href="#!" className="b-thin btn-flat modal-close waves-effect waves-green m-left-10" onClick={()=>{onChangeProject()}}>CHANGE PROJECT</a>
              </div>
            </div>
          </div>
          
        </div>
    </div>
  );
}

export default SelectSprintPopup;