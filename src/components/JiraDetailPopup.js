import React, { useState, useEffect } from 'react';

import Lottie from 'lottie-react-web';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import M from "materialize-css/dist/js/materialize.min.js";
import * as Method from '../common/Methods.js';
import SelectSprint from './SelectSprint.js'

const screenHeight = window.innerHeight


const JiraDetailPopup=(props)=> {
  const [remainingDevHrs, setRemainingDevHrs] = useState(0)
  const [remainingQAHrs, setRemainingQAHrs] = useState(0)
  const [isDevHrEnabled, setIsDevHrEnabled] = useState(false)
  const [isQaHrEnabled, setIsQaHrEnabled] = useState(false)
  const [comment, setComment] = useState("")

  const navigate = useNavigate();

  useEffect(() => {
      M.AutoInit()
      M.updateTextFields();
      if(props.selectedJira.hasOwnProperty("fields")){
        setRemainingDevHrs(props.selectedJira.remainingDevHr)
        setRemainingQAHrs(props.selectedJira.remainingQaHr)
        setIsDevHrEnabled(props.selectedJira.devEnabled)
        setIsQaHrEnabled(props.selectedJira.qaEnabled)
        setComment(props.selectedJira.comment)

      }
  },[props.selectedJira, props.isEditEnabled])

  const badges=(e)=>{
    var tempArray = []
    for (var i = 0; i < e.length; i++) {
      var eachElem = <span key={"badge_"+i} className='teal white-text m-left-5 f-10 p-4 b-r-3' >{e[i]}</span>
      tempArray.push(eachElem)
    }
    return tempArray
  }

  const close=()=>{
    var elem = document.getElementById("jiraDetailPopup")
    var instance = M.Modal.getInstance(elem)
    instance.close()
  }


  const onSaveSpillover=()=>{
    props.onSaveSpillover(remainingDevHrs,remainingQAHrs, comment)
    close()
  }

  const onSaveToggles=()=>{
    props.onSaveNonSpillover(isDevHrEnabled, isQaHrEnabled, comment)
     close()
  }

  const colorbadge=(item)=>{
      var color = "teal"
      switch(item) {
      case "SPILLOVERS":
        color = "orange"
        break;
      case "TECH TASKS":
        color = "green"
        break;
      case "BUSINESS":
        color = "blue"
        break;
      case "QA AUTOMATION":
        color = "brown"
        break; 
      default:
        
    }
      return(
            <span className={`${color} white-text m-left-5 f-10 p-4 b-r-3`}>{item} </span>
      )
    }

  return (
    <div className="w-100p">
      <div id="jiraDetailPopup" className="modal bottom-sheet modal-fixed-footer">
        {props.selectedJira.hasOwnProperty("fields")?
        <div className="modal-content p-bottom-0">
          <div className="d-flex b-bottom">
            <img src={props.selectedJira.fields.issuetype.iconUrl} alt="icon" className="p-10-right"/>
            <h5>{props.selectedJira.key}</h5>
          </div>
          <div className="row m-bottom-0" style={{height:'75%'}}>
            <div className="col s12 m4 l4">
              <p>{props.selectedJira.fields.parent.fields.summary}</p>
              <div className="d-flex a-center" style={{marginTop:5}}>
                <div>
                  <span className='white-text m-left-5 f-10 p-4 b-r-3' >{colorbadge(props.selectedJiraCategory) } </span>
                  </div>
                  {props.selectedJira.fields.labels.length>0?
                  <div className="grey-text text-lighten-1" style={{paddingLeft:10, paddingRight:10}}>|</div>
                  :null 
                  }
                  <div className="">{badges(props.selectedJira.fields.labels)}</div>
                </div>
                <div className="d-flex a-center p-right-5 m-top-20">

                    <i className="material-icons p-right-5 teal-text" style={{fontSize:14}}>person</i>
                    <span className="">{props.selectedJira.fields.reporter.displayName}</span>
                    <div className="f-10 grey-text m-left-5">(REPORTER)</div>
                </div>

                <div className="w-100p">
                  <div className="d-flex j-between">
                    <div className="m-top-20  w-100p">Time Log</div>
                    <div className="m-top-20  w-100p right-align grey-text f-10">Click to get time log details</div>
                  </div>

                  <div className=" w-100p  purple lighten-5 hand b-r-3" style={{padding:5, marginBottom:10, paddingLeft:30}} onClick={()=>{props.openWorkLog()}}>
                  <div className="f-10 m-top-10">{(props.selectedJira.fields.aggregatetimespent/3600).toFixed(2)}hrs/{(props.selectedJira.fields.aggregatetimeoriginalestimate/3600).toFixed(2)}hrs</div>
                  {props.selectedJira.fields.aggregatetimeoriginalestimate == 0?null:
                    <div className="progress" style={{width:'50%'}}>
                      <div class={`determinate ${ (props.selectedJira.fields.aggregatetimespent/props.selectedJira.fields.aggregatetimeoriginalestimate) >1? "orange":"teal" }`} style={{width: (props.selectedJira.fields.aggregatetimespent/props.selectedJira.fields.aggregatetimeoriginalestimate)*100+"%"}}>
                      </div>
                    </div>
                    }
                  </div>
                </div>
            </div>

            <div className="col s12 m4 l4 b-left" style={{height:'100%'}}>
              <div>
                <div className="d-flex">
                  <div className="d-flex a-center m-top-10 p-right-5 ">
                    <i className="material-icons p-right-5 teal-text" style={{fontSize:14}}>person</i>
                    <span>Assigned: {props.selectedJira.fields.assignee.displayName}</span>
                  </div>
                  
                  {props.selectedJira.fields[props.projectSettings.qa_user_field] !== null?
                  <div className="d-flex a-center m-top-10 p-right-5 m-left-5 b-left p-10-left">
                    <i className="material-icons p-right-5 teal-text" style={{fontSize:14}}>person</i>
                    <span>{props.selectedJira.fields[props.projectSettings.qa_user_field].displayName}</span>
                  </div>
                  :null}

                </div>
              </div>

              <div className="m-top-10">
                <div className="d-flex">
                <span>Add Dev hrs : </span>
                <div className="switch">
                  <label>
                    <input type="checkbox" disabled={props.isFreez} checked={isDevHrEnabled} onChange={()=>{setIsDevHrEnabled(!isDevHrEnabled)}}/>
                    <span className="lever"></span>
                  </label>
                </div>
                </div>
                <div className="d-flex m-top-20">
                <span>Add Qa hrs : </span>
                <div className="switch">
                  <label>
                    <input type="checkbox" disabled={props.isFreez} checked={isQaHrEnabled}  onChange={()=>{setIsQaHrEnabled(!isQaHrEnabled)}}/>
                    <span className="lever"></span>
                  </label>
                </div>
                </div>

                <div className="f-10 grey-text m-top-20">(After toggle need to click on update to reflect the changes)</div>
              </div>

              
              
            </div>

            <div className="col s12 m4 l4 b-left" style={{height:'100%'}}>
              <div className="d-flex m-top-20 grey-text">
                {isDevHrEnabled?
                  <div>DEV HRS : {props.selectedJira.fields[props.projectSettings.dev_hr_key]}</div>
                  :
                  <div><s>DEV HRS : {props.selectedJira.fields[props.projectSettings.dev_hr_key]}</s></div>
                }
                {isQaHrEnabled?
                  <div className="m-left-10">QA HRS : {props.selectedJira.fields[props.projectSettings.qa_hr_key]}</div>
                  :
                  <div className="m-left-10"><s>QA HRS : {props.selectedJira.fields[props.projectSettings.qa_hr_key]}</s></div>
                }
                
              </div>

              {props.selectedJiraCategory == 'SPILLOVERS' ?

              <div>
                {!props.isEditEnabled?
                <div className="d-flex m-top-20">
                  Remianing Dev: {props.selectedJira.remainingDevHr}hr | Remaining QA: {props.selectedJira.remainingQaHr}hr
                </div>
                :
                <div className="col s12 m-top-20">
                  <div className="row">
                    <div className="input-field col s6">
                      <input id="remainingDevHr" value={remainingDevHrs} type="text" className="active" onChange={(e)=>{setRemainingDevHrs(e.target.value)}}/>
                      <label for="remainingDevHr">Remaining DEV Hrs</label>
                    </div>
                    <div className="input-field col s6">
                      <input id="remainingQAHr" value={remainingQAHrs} type="text" className="active" onChange={(e)=>{setRemainingQAHrs(e.target.value)}}/>
                      <label for="remainingQAHr">Remaining QA Hrs</label>
                    </div>
                  </div>

                  <div className="f-10 grey-text m-top-20">(After updating data need to click on update to reflect the changes)</div>
                </div>
                }

              </div>

              :null
              }
              <div>
              {props.isFreez?
                <div className="m-top-20">
                    <div>{comment.length>0?"Comment":null}</div>
                    <div className={`${comment.length>0?'grey':'transparent'} lighten-3 b-r-3 m-top-10 `} style={{padding:10, color: comment.length>0?"black":'grey' }}>{comment.length> 0?comment:"No comments available"}</div>

               </div>
               :
                <div className="m-top-20">
                    <div className="input-field col s12">
                      <textarea id="textarea02" value={comment} className="materialize-textarea" onChange={(e)=>{setComment(e.target.value)}} maxlength="100"></textarea>
                      <label htmlFor="textarea1">Comments</label>
                      <span className="helper-text" data-error="wrong" data-success="right">Max 100 characters</span>
                    </div>
                  </div>
                 }
              </div>
             
              

            </div>
          </div>
        </div>
        :null
        }

        
        <div className="modal-footer d-flex j-end">
          <a href="#!" className=" waves-effect waves-green btn-flat" onClick={()=>{close()}}>BACK</a>
          {props.isFreez?null:
            <div>
            {props.isEditEnabled && props.selectedJiraCategory == "SPILLOVERS"?
              <a href="#!" className=" waves-effect waves-green btn-flat m-left-10" onClick={()=>{onSaveSpillover()}}>UPDATE SPILLOVER</a>
              :
              <a href="#!" className=" waves-effect waves-green btn-flat m-left-10" onClick={()=>{onSaveToggles()}}>UPDATE</a>
            }
            </div>
          }
        </div>
        
      </div>

    </div>
  );
}

export default JiraDetailPopup;