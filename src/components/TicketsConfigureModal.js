import React, { useState, useEffect } from 'react';

import Lottie from 'lottie-react-web';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import M from "materialize-css/dist/js/materialize.min.js";

const screenHeight = window.innerHeight


const TicketsConfigureModal=(props)=> {
  const [projectId, setProjectId] = useState("");
  const [spillover, setSpillover] = useState("")
  const [business, setBusiness] = useState("")
  const [techTasks, setTechTasks] = useState("")
  const [qaAutomation, setQaAutomation] = useState("")

  const navigate = useNavigate();


  const onSave=()=>{

    var data = {spillover:spillover,business:business,techTask:techTasks, qaAutomation:qaAutomation}
    props.onSaveFromModalSetData(data)
    setProjectId("")
    setSpillover("")
    setBusiness("")
    setTechTasks("")
    setQaAutomation("")
  }


  return (
    <div className="">
      <div id="configureJira" className="modal modal-fixed-footer">
        <div className="modal-content">
          <h5>CONFIGURE</h5>
          <p>Add the JIRA ID's that need to be picked in the sprint. Add multiple JIRA IDs by comma seperated.</p>

          <div className="row">
            <form className="col s12">
              <div className="row">
                <div className="input-field col s12">
                  <textarea id="textarea1" value={spillover} className="materialize-textarea" onChange={(e)=>{setSpillover(e.target.value)}}></textarea>
                  <label htmlFor="textarea1">SPILLOVERS</label>
                </div>
              </div>
            </form>
          </div>

          <div className="row">
          <form className="col s12">
            <div className="row">
              <div className="input-field col s12">
                <textarea id="textarea2" value={business} className="materialize-textarea"  onChange={(e)=>{setBusiness(e.target.value)}}></textarea>
                <label htmlFor="textarea2">BUSINESS</label>
              </div>
            </div>
          </form>
        </div>

        <div className="row">
          <form className="col s12">
            <div className="row">
              <div className="input-field col s12">
                <textarea id="textarea3" value={techTasks} className="materialize-textarea"  onChange={(e)=>{setTechTasks(e.target.value)}}></textarea>
                <label htmlFor="textarea3">TECH TASKS</label>
              </div>
            </div>
          </form>
        </div>

        <div className="row">
          <form className="col s12">
            <div className="row">
              <div className="input-field col s12">
                <textarea id="textarea4" value={qaAutomation} className="materialize-textarea"  onChange={(e)=>{setQaAutomation(e.target.value)}}></textarea>
                <label htmlFor="textarea4">QA AUTOMATION</label>
              </div>
            </div>
          </form>
        </div>


        </div>
        <div className="modal-footer">
          <a href="#!" className=" waves-effect waves-green btn-flat" onClick={()=>{onSave()}}>SAVE</a>
        </div>
      </div>

    </div>
  );
}

export default TicketsConfigureModal;