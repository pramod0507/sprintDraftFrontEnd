import React, { useState, useEffect, useRef } from 'react';

import Lottie from 'lottie-react-web';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import M from "materialize-css/dist/js/materialize.min.js";
import * as Method from '../common/Methods.js';
import TableAnimation from "../animations/404.json";
import logo from '../assets/ZS_logo.png'
import {helpData} from '../common/HelpData.js'

const Help=(props)=> {

   useEffect(() => {
      M.AutoInit()
      M.updateTextFields()
  },[])

  const rowData=()=>{
    var tempData = []
    for (var i = 0; i < helpData.length; i++) {
      var eachElement = <li>
                          <div className="collapsible-header f-bold"><i className="material-icons">keyboard_arrow_right</i>{helpData[i].question}</div>
                          <div className="collapsible-body"><span>{helpData[i].answer}</span></div>
                        </li>
      tempData.push(eachElement)
    }
    return tempData;
  }

  return (
    <div className="">
      <nav className="p-fixed top-0 z-100">
        <div className="nav-wrapper white">
          <div className="d-flex j-between">
                <div className="d-flex">
                  <a href="#">
                    <img className="h-50p" src={logo} alt="Logo" style={{marginTop:7, padding:5, paddingLeft:20}}/>
                  </a>

                  <div className="teal-text text-lighten-1 p-left-5 f-17 hide-on-small-only"> | SPRINT DRAFT</div>
                </div>
            </div>
          </div>
        </nav>      
      <div className="row">
        <div className="col s3"></div>
        <div className="col s6">
          <div className="m-top-20" style={{marginTop: 150}}>
            
            <ul className="collapsible">
              {rowData()}
            </ul>
          

          </div>
          
        </div>
        <div className="col s3"></div>
      </div>
    </div>
  );
}

export default Help;