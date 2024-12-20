import React, { useState, useEffect } from 'react';

import Lottie from 'lottie-react-web';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import M from "materialize-css/dist/js/materialize.min.js";

const screenHeight = window.innerHeight


const JiraConfigureModal=(props)=> {
  const [projectId, setProjectId] = useState("");
  const [selectedJira, setSelectedJira] = useState("")
  
  const navigate = useNavigate();

  const [selectedDropdown, setSelectedDropDown] = useState("SPILLOVERS")


  const onSave=()=>{
    props.onSaveFromModalSetData(selectedJira, selectedDropdown, false)
    var elem = document.getElementById("jiraConfigModal")
      var instance = M.Modal.getInstance(elem)
      instance.close()
  }


  const onDropdownSelect=(e)=>{
      setSelectedDropDown(e)
   }


  return (
    <div className="">
      <div id="jiraConfigModal" className="modal modal-fixed-footer">
        <div className="modal-content">
          <h5>CONFIGURE</h5>
          <p>Add the JIRA ID's that need to be picked in the sprint. Add multiple JIRA IDs by comma seperated.</p>

          <a className='dropdown-trigger btn' href='#' data-target='dropdownCategory'>{selectedDropdown}</a>

          <ul id='dropdownCategory' className='dropdown-content'>
            <li onClick={()=>{onDropdownSelect('SPILLOVERS')}}><a href="#!">SPILLOVERS</a></li>
            <li onClick={()=>{onDropdownSelect('TECH TASKS')}}><a href="#!">TECH TASKS</a></li>
            <li onClick={()=>{onDropdownSelect('BUSINESS')}}><a href="#!">BUSINESS</a></li>
            <li className="divider" tabIndex="-1"></li>
            <li onClick={()=>{onDropdownSelect('QA AUTOMATION')}}><a href="#!">QA AUTOMATION</a></li>
          </ul>

          <div className="row m-top-30">
            <form className="col s12">
              <div className="row">
                <div className="input-field col s12">
                  <textarea id="textarea1" value={selectedJira} className="materialize-textarea" onChange={(e)=>{setSelectedJira(e.target.value)}}></textarea>
                  <label htmlFor="textarea1">JIRA IDs</label>
                </div>
              </div>
            </form>
          </div>


        </div>
        <div className="modal-footer">
          <a href="#!" className=" waves-effect waves-green btn-flat" onClick={()=>{onSave()}}>ADD</a>
        </div>
      </div>

    </div>
  );
}

export default JiraConfigureModal;