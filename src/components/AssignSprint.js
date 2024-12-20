import React, { useState, useEffect, useRef } from 'react';

import Lottie from 'lottie-react-web';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import M from "materialize-css/dist/js/materialize.min.js";
import * as Method from '../common/Methods.js';
const screenHeight = window.innerHeight


const AssignSprint=(props)=> {
  
  const [list, setlist] = useState([])
  const [rawList, setRawList] = useState([])
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedSprint, setSelectedSprint] = useState({})

  useEffect(() => {
      M.AutoInit()
      M.updateTextFields()
      if(props.projectSettings.hasOwnProperty("id")){
        getList()
      }
      
  },[props.projectSettings])


  const stateOrder = {
    ACTIVE: 0,
    FUTURE: 1,
    CLOSED: 2,
  };

  const sortedData = (a, b) => { 
    const stateComparison = stateOrder[a.state] - stateOrder[b.state];
    if (stateComparison !== 0) return stateComparison; // Primary sorting by state
    return a.sequence - b.sequence; // Secondary sorting by sequence
  }

  const getList=async()=>{
    var responseRecieved = await Method.getProjectSprintList(props.projectSettings.zs_project_Id)
    
    if(responseRecieved.status){
      var tempSortedData = responseRecieved.data.sort(sortedData)
      setlist(tempSortedData)
      setRawList(tempSortedData)
    }
  }

  const onSearch = (e)=>{
    var filteredData = rawList.filter(x=> x.name.includes(e))
    setlist(filteredData)
  }

  const onSave = () =>{
    props.onFreeze(selectedSprint)
    setSelectedSprint({})
  }

  const renderRows=()=>{
    return(
      list.map((item, index) =>
          <tr key={index}>
            <td className="" onClick={()=>{ }}>
              <div className="d-flex a-center" style={{}}>
                  {item.state == "CLOSED"?
                    <i className="grey-text hand text-lighten-2 material-icons p-10-right">block</i>
                    :
                    <div>
                      {selectedSprint.id == item.id?
                        <i className="green-text hand material-icons p-10-right"  onClick={()=>{ setSelectedSprint(item) }}>check_circle</i>
                        :
                        <i className="grey-text hand material-icons p-10-right text-lighten-2"  onClick={()=>{ setSelectedSprint(item) }}>radio_button_unchecked</i>
                      }
                    </div>
                  }
                 {item.name}
                 {item.state == "CLOSED"?
                  <div className="p-10-left f-10 grey-text">( {item.state} )</div>
                  :
                  item.state == "ACTIVE"?
                  <div className="p-10-left f-10 green-text">( {item.state} )</div>
                  :
                  item.state == "FUTURE"?
                  <div className="p-10-left f-10 blue-text">( {item.state} )</div>
                  :
                  null
                 }
                 
              </div>
            </td>
          </tr>
    ))
  }


  return (
    <div className="w-100p">
      <div id="AssignSprint" className="modal modal-fixed-footer">
          <div className="modal-content">
            
            <div className=" ">
              <div  className="col s12">
                <h5>ASSIGN SPRINT</h5>
                <p>Select and assign sprint to all the jira ticket</p>
                <div className="">
                  <div className="input-field">
                    <input id="project_id" type="text" value={searchKeyword} className="validate" onChange={(e)=>{setSearchKeyword(e.target.value); onSearch(e.target.value) }}/>
                    <label for="project_id">Search Sprint </label>
                  </div>
                </div>

              </div>
            </div>

        <div style={{height:200, overflowY:"auto"}}>
            <table className="">
            <tbody>
              {renderRows()}
            </tbody>
          </table>
        </div>

            

          </div> 
          <div className="modal-footer">
            <div className="d-flex j-end">
              {props.loader?
                <div style={{width:300, marginRight:30}}>
                  <div className="progress">
                      <div className="determinate" style={{width: "70%"}}></div>
                  </div>
                  <span className="helper-text">{props.assignSprintPercent}% updated</span>  
                </div>
              :
              <div className="d-flex j-end">
                <a href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={()=>{}}>CANCEL</a>
                  
                <a href="#!" className="waves-effect waves-green btn" onClick={()=>{onSave()}}>Save</a>
              </div>
              }
              
            </div>
          </div>
          
        </div>
    </div>
  );
}

export default AssignSprint;