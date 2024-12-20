import React, { useState, useEffect } from 'react';

import Lottie from 'lottie-react-web';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import M from "materialize-css/dist/js/materialize.min.js";
import * as Method from '../common/Methods.js';

const screenHeight = window.innerHeight


const UserList=(props)=> {
  const [projectId, setProjectId] = useState("")
  const [userList, setUserList] = useState([])
  const [allUserList, setAllUserList] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [isDevEnabled, setIsDevEnabled] = useState(true)


  const navigate = useNavigate();


  useEffect(() => {
      M.AutoInit();
      getUsersList()
  },[])


  const searchUser=(e)=>{
    var result = allUserList.filter(x=>x.displayName.toLowerCase().includes(e.toLowerCase().toLowerCase()))
    setUserList(result)
  }

  

  const getUsersList=async()=>{
    var responseRecieved = await Method.getAllUsersOfProject("15360")
    if(responseRecieved.status){
      setUserList(responseRecieved.data)
      setAllUserList(responseRecieved.data)
    }
  }



  const onRowCLick=(e)=>{

    var index = selectedUsers.findIndex(x=>x.accountId === e.accountId)

    var temp = []

    if(index !== -1){
      temp = temp.concat(selectedUsers)
      temp = temp.toSpliced(index,1)
    }else{

      temp = temp.concat(selectedUsers)
      temp.push(e)


      //remove duplicate
      temp = temp.filter((value, index, array) => 
        array.indexOf(value) === index
      )
    }

    setSelectedUsers(temp)
  }

  const onSave=()=>{
    setSelectedUsers([])
    props.userlistFromModal(selectedUsers, isDevEnabled)
  }



  const renderRows=()=>{
    return(
      userList.map((item, index) =>
          <div key={index} className=" d-flex a-center h-40p hand" onClick={()=>{onRowCLick(item)}}>
            <div>{ selectedUsers.findIndex(x=>x.accountId === item.accountId) !== -1?  <i className="material-icons p-right-5 teal-text f-17">check_circle</i>: <i className="f-17 grey-text material-icons text-lighten-1 p-right-5 ">panorama_fish_eye</i> }</div>
            <i className="material-icons p-right-5 teal-text" style={{fontSize:14}}>person</i>
            <span className="f-14">{item.displayName}</span>

            
          </div>  
        )
      )}

  return (
    <div className="">
      <div id="selectusers" className="modal modal-fixed-footer">
        <div className="modal-content">
          
          <div className="d-flex a-center">
              <div className="col grey input-field lighten-5 s6" style={{}}>
                <input id="search" type="text" className="validate" onChange={(e)=>{searchUser(e.target.value)}}/>
                <label htmlFor="search">Search</label>
              </div>

              <div className="switch">
                <label>
                  <input type="checkbox" checked={isDevEnabled} onChange={()=>{setIsDevEnabled(!isDevEnabled)}}/>
                  <span className="lever"></span>
                   User will be added as {isDevEnabled? "dev": "qa" }
                </label>
              </div>
            </div>
          <div>
          {renderRows()}
          </div>
        </div>

        <div className="modal-footer">
          <a href="#!" className={`waves-effect waves-green btn ${selectedUsers.length > 0?null:'disabled'}`} onClick={()=>{onSave()}}>ADD</a>
        </div>
    </div>

  </div>
  );
}

export default UserList;