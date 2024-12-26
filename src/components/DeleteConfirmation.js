import React, { useState, useEffect, useRef } from 'react';

import Lottie from 'lottie-react-web';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import M from "materialize-css/dist/js/materialize.min.js";
import * as Method from '../common/Methods.js';

const screenHeight = window.innerHeight


const DeleteConfirmation=(props)=> {
  
 
  const inputRefs = useRef([]);

  const navigate = useNavigate();

  useEffect(() => {
      M.AutoInit()
      M.updateTextFields()

    

  },[])


  const onCancel=()=>{
    var elem = document.getElementById("DeleteConfirmation")
    var instance = M.Modal.getInstance(elem)
    instance.close()

    var elem = document.getElementById("CreateProject")
    var instance = M.Modal.init(elem,{dismissible:false})
    instance.open()

  }


  return (
    <div className="w-100p">
      <div id="DeleteConfirmation" className="modal">
          <div className="modal-content">
            
            <h5>DELETE CONFIRMATION</h5>

            <div className="m-top-50 f-17">
              Are you sure want to delete this ? This is cannot be undone once procceded.
            </div>
            <div className="f-14 m-top-10">
              All associated data will be permanently deleted as well.
            </div>

            <div className="d-flex m-top-50">
              <div className="p-20-right">
                  <a href="#!" className="waves-effect waves-green btn m-left-10 w-100p" onClick={()=>{props.onDeleteConfirmation()}}>Delete</a>
                </div>

              <div className="">
                  <a href="#!" className="waves-effect waves-green btn-flat w-100p b-thin" onClick={()=>{onCancel()}}>Cancel</a>
                </div>
            </div>
            
          </div> 
       
          
        </div>
    </div>
  );
}

export default DeleteConfirmation;