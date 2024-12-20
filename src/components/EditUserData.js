import React, { useState, useEffect } from 'react';

import Lottie from 'lottie-react-web';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import M from "materialize-css/dist/js/materialize.min.js";
import * as Method from '../common/Methods.js';

const screenHeight = window.innerHeight


const EditUserData=(props)=> {
  const [leave, setLeave] = useState("")
  const [buffer, setBuffer] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("dev")
  const [meetings, setMeetings] = useState(0)

  const navigate = useNavigate();


  useEffect(() => {
      M.AutoInit()
      M.updateTextFields();
      if(props.selectedUserForEdit.hasOwnProperty("buffer"))
      {
        setLeave(props.selectedUserForEdit.leave)
        setBuffer(props.selectedUserForEdit.buffer)
        setName(props.selectedUserForEdit.userDetail.displayName)
        setRole(props.selectedUserForEdit.role)
        setMeetings(props.selectedUserForEdit.meetings)


      }

      

      var elems = document.querySelectorAll('select');
      var instances = M.FormSelect.init(elems, {})
      
  },[props.selectedUserForEdit])


  const onSave=()=>{

    if(buffer == 0){
     M.toast({html: '<span style="color:yellow">Add buffer</span>', classes: 'rounded'})
    }else{
      props.onUserDataSave(buffer,leave,role, meetings)
      
    }
  }

  const onDelete=()=>{
    props.onUserRemoved()
    var elem = document.getElementById("editUserData")
    var instance = M.Modal.getInstance(elem)
    instance.close()
  }


  return (
    <div className="">
      <div id="editUserData" className="modal bottom-sheet">
          <div className="modal-content">
            <h4>Edit User</h4>
            <p>Update leave and buffer for {props.selectedUserForEdit.hasOwnProperty("userDetail")? props.selectedUserForEdit.userDetail.displayName:null}</p>

            <div className="d-flex a-center">
                

                <div className="input-field col s6 m-left-10">
                  <input id="buffer" type="number" value={buffer} className="validate data-error" onChange={(e)=>{setBuffer(e.target.value)}}/>
                  <label htmlFor="buffer">Buffer (%tage)</label>
                </div>

                <div className="input-field col s6 m-left-10">
                  <input id="leave" type="number" value={leave}  className="validate"  onChange={(e)=>{setLeave(e.target.value)}}/>
                  <label htmlFor="leave">Leave</label>
                </div>

                <div className="input-field col s6 m-left-10">
                  <input id="meetings" type="number" value={meetings}  className="validate"  onChange={(e)=>{setMeetings(e.target.value)}}/>
                  <label htmlFor="meetings">Meetings / Training</label>
                </div>

                {props.isFreez?
                  null
                  :
                  <div>
                    <a className='dropdown-trigger btn-flat orange lighten-3 m-left-10' href='#' data-target='role'>{role}</a>
                    <ul id='role' className='dropdown-content'>
                      <li><a href="#!" onClick={()=>{setRole("dev")}}>DEV</a></li>
                      <li><a href="#!" onClick={()=>{setRole("qa")}}>QA</a></li>  
                    </ul>

                    <a className="waves-effect waves-light btn m-left-10" onClick={()=>{onSave()}}>UPDATE</a>

                    <a className=" grey waves-effect waves-light btn-flat m-left-10" onClick={()=>{onDelete()}}><i className="material-icons white-text">remove_circle_outline</i></a>
                  </div>
                }
            </div>
          </div>
          
        </div>
    </div>
  );
}

export default EditUserData;