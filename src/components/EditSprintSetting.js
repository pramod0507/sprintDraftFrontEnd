import React, { useState, useEffect } from 'react';

import Lottie from 'lottie-react-web';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import M from "materialize-css/dist/js/materialize.min.js";
import * as Method from '../common/Methods.js';

const screenHeight = window.innerHeight


const EditSprintSetting=(props)=> {
  const [days, setDays] = useState("")
  const [hours, setHours] = useState("")
  const [holiday, setHoliday] = useState("")
  const [buffer, setBuffer] = useState("")

  const navigate = useNavigate();


  useEffect(() => {
      M.AutoInit()
      M.updateTextFields();
      
      setDays(props.sprintSettings.days)
      setHours(props.sprintSettings.perDay)
      setHoliday(props.sprintSettings.holiday)
      setBuffer(props.sprintSettings.sprintBuffer)
      
  },[props.sprintSettings])


  const onSave=()=>{
    if(days == 0){
      M.toast({html: '<span style="color:yellow">Add days</span>', classes: 'rounded'})
    }else if(hours == 0){
      M.toast({html: '<span style="color:yellow">Add hours per day</span>', classes: 'rounded'})
    }else{
      props.updateSprintConfig(days, hours, holiday, buffer)
      var elem = document.getElementById("sprintSettings")
      var instance = M.Modal.getInstance(elem)
      instance.close()
    }

    
  }


  return (
    <div className="">
      <div id="sprintSettings" className="modal bottom-sheet">
          <div className="modal-content">
            <h4>Edit Sprint</h4>
            <p>Update sprint settings</p>

            <div className="d-flex a-center">
                
                <div className="input-field col s6 m-left-10">
                  <input id="days" type="number" value={days} className="validate data-error" onChange={(e)=>{setDays(e.target.value)}}/>
                  <label className="active" htmlFor="days">Days</label>
                </div>

                <div className="input-field col s6 m-left-10">
                  <input id="hr" type="number" value={hours}  className="validate"  onChange={(e)=>{setHours(e.target.value)}}/>
                  <label className="active" htmlFor="hr">Hours</label>
                </div>

                <div className="input-field col s6 m-left-10">
                  <input id="holiday" type="number" value={holiday}  className="validate"  onChange={(e)=>{setHoliday(e.target.value)}}/>
                  <label className="active" htmlFor="holiday">Holidays</label>
                </div>

                <div className="input-field col s6 m-left-10">
                  <input id="buffer" type="number" value={buffer}  className="validate"  onChange={(e)=>{setBuffer(e.target.value)}}/>
                  <label className="active" htmlFor="buffer">Buffer</label>
                </div>

                <a className="waves-effect waves-light btn m-left-10" onClick={()=>{onSave()}}>SAVE</a>

            </div>
          </div>
          
        </div>
    </div>
  );
}

export default EditSprintSetting;