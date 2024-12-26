import React, { useState, useEffect, useRef } from 'react';

import Lottie from 'lottie-react-web';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import M from "materialize-css/dist/js/materialize.min.js";
import * as Method from '../common/Methods.js';
import TableAnimation from "../animations/404.json";

const NoPageFound=(props)=> {
  
  



  useEffect(() => {
      
  },[])



  return (
    <div className="">
      <div className="row">
        <div className="col s3"></div>
        <div className="col s6">
        <div className="m-top-20">
        <Lottie
          options={{
            animationData: TableAnimation,
            loop:true
          }}
        />
        </div>
        <h5 className="center-align">The page you are looking for is unavailable</h5>
        </div>
        <div className="col s3"></div>
      </div>
    </div>
  );
}

export default NoPageFound;