import React, { useState, useEffect, useRef } from 'react';

import Lottie from 'lottie-react-web';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import M from "materialize-css/dist/js/materialize.min.js";
import * as Method from '../common/Methods.js';

const screenHeight = window.innerHeight


const PinPopup=(props)=> {
  
  const [actualPin, setActualPin] = useState("332211")

 
  const inputRefs = useRef([]);
  const [pin, setPin] = useState(new Array(6).fill('')); // Store pin values

  const navigate = useNavigate();

  useEffect(() => {
      M.AutoInit()
      M.updateTextFields()
  },[])


  const handleInputChange = (e, index) => {
    const value = e.target.value;

    if (/^\d$/.test(value)) { // Ensure only digits are entered
      const newPin = [...pin];
      newPin[index] = value; // Update the corresponding index with the digit
      setPin(newPin);

      if (index < 5) {
        inputRefs.current[index + 1].focus(); // Move focus to the next input
      }
    }
    
    // If value is a digit and not empty
    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus(); // Move focus to the next input
    }
    
    // Clear input if the user tries to type more than one digit
    if (value.length > 1) {
      e.target.value = value[0];
    }
  }

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace" && index > 0 && !e.target.value) {
      inputRefs.current[index - 1].focus();
    }
  }


  const onProceed=()=>{
     const enteredPin = pin.join('');
     if(actualPin === enteredPin){
      props.confirmationDone()
     }else{
         M.toast({html: `<span style="color:yellow">Invalid PIN</span>`, classes: 'rounded'})
     }
  }





  return (
    <div className="w-100p">
      <div id="PinPopup" className="modal">
          <div className="modal-content">
            
            <h5>ACCESS CONFIRMATION</h5>
            <p>Enter PIN to proceed</p>

            <div className="row">
              <div className="col s2"/>
              
                {Array.from({ length: 6 }).map((_, index) => (
                  <div className="col s1" key={"pinpopup_"+index}>
                  <input className="b-thin center-align f-20" style={{borderRadius:5}}
                    placeholder = "*"
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="password"
                    maxLength="1"
                    onChange={(e) => handleInputChange(e, index)}
                  />
                  </div>
                ))}

              <div className="col s2" style={{marginTop:5}}>
                <div onClick={()=>{onProceed()}} className="col s8 waves-effect waves-light btn"> <i className="material-icons">arrow_forward</i></div>
              </div>
              
              <div className="col s2"/>
            </div>
          </div> 
       
          
        </div>
    </div>
  );
}

export default PinPopup;