import React, { useState, useEffect } from 'react';

import Lottie from 'lottie-react-web';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import M from "materialize-css/dist/js/materialize.min.js";
import * as Method from '../common/Methods.js';
import SelectSprint from './SelectSprint.js'

const screenHeight = window.innerHeight


const WorkLogPopup=(props)=> {
  const [workLogData, setWorkLogData] = useState([])
  const [devHrWorkLog, setDevHrWorkLog] = useState(0)
  const [qaHrWorkLog, setQaHrWorkLog] = useState(0)
  const [unknownWorkLog, setUnknownWorkLog] = useState(0)
  

  const navigate = useNavigate();

  useEffect(() => {
      M.AutoInit()
      M.updateTextFields();
      if (props.selectedJira.hasOwnProperty("key")) {
        getWorkLog()
      }
      
      
  },[props.selectedJira])


  const updateRoleHrs=(workLog)=>{
      var tempQaHrWorkLog = 0
      var tempDevHrWorkLog = 0
      var tempUnknownHrWorkLog = 0

      for (var i = 0; i < workLog.length; i++) {
        var userIndex = props.selectedUsers.findIndex(x=>x.userDetail.accountId === workLog[i].updateAuthor.accountId)
        
        if (userIndex !== -1) {
            if (props.selectedUsers[userIndex].role == "qa") {
              tempQaHrWorkLog = tempQaHrWorkLog + Number((workLog[i].timeSpentSeconds/3600).toFixed(2)) 
            }

            if (props.selectedUsers[userIndex].role == "dev") {
              tempDevHrWorkLog = tempDevHrWorkLog + Number((workLog[i].timeSpentSeconds/3600).toFixed(2)) 
            }
            
        }
      }

      setDevHrWorkLog(tempDevHrWorkLog)
      setQaHrWorkLog(tempQaHrWorkLog)
      setUnknownWorkLog(tempUnknownHrWorkLog)

      
  }


  const resourceIdentity=(role)=>{
    if (role == "qa") {
      
      return(<div className="f-10">QA Resource</div>)
    }

    if(role == "dev"){
      
      return(<div className="f-10">Dev Resource</div>)
    }
  }

  const getWorkLog = async()=>{
    var responseRecieved = await Method.workLogOfJiraID(props.selectedJira.key)
      if(responseRecieved.status){
        console.log("work log recieved>>>>>>>>>>>>>>>>>>"+JSON.stringify(responseRecieved.data))
        setWorkLogData(responseRecieved.data)
        updateRoleHrs(responseRecieved.data)
      }
  }

  const renderWorkLogRows=()=>{
    return(
    workLogData.map((item, index) =>
        <div  style={{marginTop:20}} className="d-flex j-between">
          <div>
            <div>{item.updateAuthor.displayName}</div>
            <div className=" grey-text">{props.selectedUsers.findIndex(x=>x.userDetail.accountId === item.updateAuthor.accountId) !== -1? resourceIdentity(props.selectedUsers[props.selectedUsers.findIndex(x=>x.userDetail.accountId === item.updateAuthor.accountId)].role): "Unknown" }</div>
            {item.hasOwnProperty("comment")?
              <div className="f-10  m-top-10">{item.comment}</div>
              :
              <div className="f-10 grey-text  m-top-10">No comment available</div>
            }
            
          </div>
          <div className="hr-container teal lighten-3">
            <div className="f-bold">
              {(item.timeSpentSeconds/3600).toFixed(2)}
            </div>
            <div className="f-10">
              Hours
            </div>
          </div>
        </div>

      )

  )}

 

  return (
    <div className="w-100p">
      <div id="workLog" className="modal modal-fixed-footer">
        <div className="modal-content">
          <h4>Work Log</h4>
          {props.selectedJira.hasOwnProperty("id")?
          <div>
              <div className="d-flex w-100p p-10 b-thin b-r-3 purple lighten-5">
              <div className="w-100p">
                <div className="f-10 m-top-10">{(props.selectedJira.fields.aggregatetimespent/3600).toFixed(2)}hrs/{(props.selectedJira.fields.aggregatetimeoriginalestimate/3600).toFixed(2)}hrs
            </div>
              {props.selectedJira.fields.aggregatetimeoriginalestimate == 0?null:
                <div className="progress" style={{width:'50%'}}>
                  <div class={`determinate ${ (props.selectedJira.fields.aggregatetimespent/props.selectedJira.fields.aggregatetimeoriginalestimate) >1? "orange":"teal" }`} style={{width: (props.selectedJira.fields.aggregatetimespent/props.selectedJira.fields.aggregatetimeoriginalestimate)*100+"%"}}>
                  </div>
                </div>
                }
                </div>
                <div className="d-flex">
                  {devHrWorkLog > 0?
                    <div>
                    <div className="f-10 p-left-5  f-bold">DEV</div>
                    <div className="hr-container blue lighten-3">
                      <div className="f-bold  f-14">{devHrWorkLog.toFixed(2)}</div>
                      <div className="f-10">Hours</div>
                    </div>
                  </div>
                  :null
                  }
                  
                  {devHrWorkLog > 0?
                  <div className=" m-left-10">
                    <div className="f-10 p-left-5 f-bold">QA</div>
                    <div className="hr-container orange lighten-3">
                      <div className="f-bold f-14">{qaHrWorkLog.toFixed(2)}</div>
                      <div className="f-10">Hours</div>
                    </div>
                  </div>
                  :null
                  }

                  {unknownWorkLog > 0?
                  <div className=" m-left-10">
                    <div className="f-10 p-left-5 f-bold">QA</div>
                    <div className="hr-container orange lighten-3">
                      <div className="f-bold f-14">{unknownWorkLog.toFixed(2)}</div>
                      <div className="f-10">Hours</div>
                    </div>
                  </div>
                  :null
                  }
                </div>
              </div>
              
              {renderWorkLogRows()}
            </div>
            :null
          }

          </div>



        <div className="modal-footer">
          <a href="#!" className="modal-close waves-effect waves-green btn-flat">CLOSE</a>
        </div>
      </div>

    </div>
  );
}

export default WorkLogPopup;