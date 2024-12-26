import React, { useState, useEffect } from 'react';
import logo from '../assets/ZS_logo.png'
import logoSP from '../assets/sp_logo.png'
import '../App.css';
import HomeAnimation from "../animations/home.json";
import Lottie from 'lottie-react-web';
import SelectSprint from '../components/SelectSprint.js'
import PinPopup from '../components/PinPopup.js';
import SprintPinPopup from '../components/SprintPinPopup.js'
import CreateProject from '../components/CreateProject.js';
import NewSprintModal from '../components/NewSprintModal.js';
import DeleteConfirmation from '../components/DeleteConfirmation.js'
import UpdateProject from '../components/UpdateProject.js'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import M from "materialize-css/dist/js/materialize.min.js";
import * as Method from '../common/Methods.js';
import moment from 'moment'

const screenHeight = window.innerHeight


const Landing=()=> {
  const [projectId, setProjectId] = useState("");
  const [sprintList, setSprintList] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState({});
  const [selectedTeam, setSelectedTeam] = useState("");
  const [isSelectSprintEnabled, setIsSelectSprintEnabled] = useState(false);
  const [allProjects, setAllProjects] = useState([]);

  const [selectedProject,setSelectedProject] = useState({})
  const [loader,setLoader] = useState(true)

  const [selectedProjectToManage, setSelectedProjectToManage] = useState({})

  const navigate = useNavigate();

  useEffect(() => {
    M.AutoInit()
      M.updateTextFields();

      if(loader){
        getAllProjects()
      }
      


    if(localStorage.getItem("sprints") !== null && localStorage.getItem("project") !== null && localStorage.getItem("selectedSprint") !== null){
        navigate('/dashboard')
      }else{
        if(localStorage.getItem("project") !== null){
          setProjectId( JSON.parse(localStorage.getItem("project") ).id )
        }
      }

  },[allProjects])

  const getAllProjects=async()=>{
    setLoader(true)
    var responseRecieved = await Method.getProjectAllAvailable()
    if (responseRecieved.status) {
      setAllProjects(responseRecieved.data)
    }
    setLoader(false)
    document.addEventListener('DOMContentLoaded', function() {
      var elems = document.getElementById("myProjects")
      var instances = M.FormSelect.init(elems, []);
    })
  }


  const onClickCreateProject=(e)=>{
    var elem = document.getElementById("PinPopup")
    var instance = M.Modal.getInstance(elem)
    instance.open()
  }

  const onClickCreateSprint=(e)=>{
    var elem = document.getElementById("SprintPinPopup")
    var instance = M.Modal.getInstance(elem)
    instance.open()
  }



  const checkSprintsAvailable=async()=>{
    var responseRecieved  = await Method.getSprintList(projectId)

    if (responseRecieved.status) {
      if (responseRecieved.data.length > 0) {
          
          // localStorage.setItem("project", projectId);
          localStorage.setItem("sprints", JSON.stringify(responseRecieved.data));
          setSprintList(responseRecieved.data)
          // navigate('/dashboard')
          
      }else{
         M.toast({html: `<span style="color:yellow">${selectedProject.zs_project_name} has no sprint available</span>`, classes: 'rounded'})

      }
      setIsSelectSprintEnabled(true)
    }
  }


  const onNewSprintAdded=(selectedSprint)=>{
    checkSprintsAvailable()
    // updateSavedData( projectId , selectedSprint)
  }


  const onProjectSelect=(e)=>{

    // setSelectedTeam(selectedValue)
    setProjectId(allProjects[Number(e)].id)
    setSelectedProject( allProjects[Number(e)] )

  }

  const renderProjects=()=>{
    return(
      allProjects.map((item, index) =>
          <option key={index} value={index} index={index}>{item.zs_project_name}</option>
        )
  )}

  const onProceedToDashboard=(selectedSprintFromSelectSprint, selectedTeamFromSelectTeam)=>{

    setSelectedSprint(selectedSprintFromSelectSprint)
    localStorage.setItem("selectedSprint", selectedSprintFromSelectSprint);

    setSelectedTeam(selectedTeamFromSelectTeam)
    localStorage.setItem("selectedTeam", selectedTeamFromSelectTeam);
    
    navigate('/dashboard')
  }

  const onProceed=()=>{
    // if(projectId.length == 0){
    //   M.toast({html: '<span style="color:yellow">PROJECT ID cannot be blank</span>', classes: 'rounded'})
    // }else{

    if(selectedProject.hasOwnProperty("id")){
      localStorage.setItem("project", JSON.stringify(selectedProject));
      // getSelectedProjectSettings()

      
      checkSprintsAvailable()
    }else{
      M.toast({html: `<span style="color:yellow">Select Project</span>`, classes: 'rounded'})
    }
      
      
    // }
    
  }


  const confirmationDone=()=>{
    var elem = document.getElementById("PinPopup")
    var instance = M.Modal.getInstance(elem)
    instance.close()

    var elem = document.getElementById("CreateProject")
    var instance = M.Modal.init(elem,{dismissible:false})
    instance.open()

  }


  const confirmationSprintPin=()=>{
    var elem = document.getElementById("SprintPinPopup")
    var instance = M.Modal.getInstance(elem)
    instance.close()


    var elem = document.getElementById("newSprint")
    var instance = M.Modal.getInstance(elem)
    instance.open()

  }


  const onCreateComplete=()=>{
    getAllProjects()
  }

  const updateSelectedProjectToManage=(e)=>{
      setSelectedProjectToManage(e)
      // var responseRecieved = await Method.deleteProject()
  }

  const onDeleteConfirmation=async()=>{
    var responseRecieved = await Method.deleteProject(selectedProjectToManage.id)
    if(responseRecieved.status){
      M.toast({html: `<span style="color:yellow">${selectedProjectToManage.zs_project_name} deleted successfully</span>`, classes: 'rounded'})
      var elem = document.getElementById("DeleteConfirmation")
      var instance = M.Modal.getInstance(elem)
      instance.close()
      getAllProjects()
    }
  }

  return (
    <div className="">
      <nav>
        <div className="nav-wrapper white">
          <div className="d-flex j-between">
            <a href="#">
              <img className="h-50p" src={logo} alt="Logo" style={{marginTop:7, padding:5, paddingLeft:20}}/>
            </a>
          </div>
          
        </div>
      </nav>

      
      <div className="d-flex a-center j-center">
        <div className="row w-100p">
            <div className="col hide-on-med-and-down l6 b-right d-flex j-center a-center" style={{height: screenHeight-120, marginTop:15}}>
              <div className="p-100">
                <Lottie
                options={{
                  animationData: HomeAnimation,
                  loop:true
                }}
              />
              <div className="d-flex">
                <p className="flow-text center-align">Welcome to SprintDraft</p>
                <img className="h-50p" src={logoSP} alt="logoSP" style={{marginTop:7, padding:5, paddingLeft:20}}/>
              </div>
            </div>
            </div>

            <div className="col s12 m12 l6 d-flex j-center a-center" style={{height: screenHeight-120}}>
               {isSelectSprintEnabled?

                <div className="w-100p d-flex flex-column j-center a-center ">

                <a className="btn-flat create-project-btn b-thin" onClick={()=>{onClickCreateSprint()}}>+ SPRINTS</a>

                  <SelectSprint projectName={selectedProject.zs_project_name
} projectId={projectId} sprintList={sprintList} teams={JSON.parse( JSON.parse(localStorage.getItem("project")) .project_settings).teams}  onProceedToDashboard={onProceedToDashboard} isheaderVisible={true} label={"Proceed"}/>
                </div>
                :
              <div className="w-100p">
                <div className="w-100p d-flex flex-column j-center a-center">
                  <a className="btn-flat create-project-btn b-thin" onClick={()=>{onClickCreateProject()}}>+ PROJECT</a>
                  <div className="row w-100p">
                  <div className="col s2"/> 
                  <div className="input-field col s8 w-100p">
                    <select id="myProjects"  onChange={(e)=>{onProjectSelect(e.target.value)}}>
                      <option value="" disabled selected>Choose Project</option>
                      {renderProjects()}
                    </select>
                    <label>Project</label>
                  </div>
                  <div className="col s2"/>
                  </div>
                  <div className="row w-100p">
                    <div className="col s2 "/>
                    <div>
                      <div onClick={()=>{onProceed()}} className="col s8 waves-effect waves-light btn">Proceed</div>
                    </div>
                    <div className="col s2 "/>
                  </div>
                </div>

              </div>
            }
            </div>
      </div>

      </div>

      <PinPopup confirmationDone={confirmationDone}/>
      <CreateProject onCreateComplete={onCreateComplete} allProjects={allProjects} updateSelectedProjectToManage={updateSelectedProjectToManage}/>
      <DeleteConfirmation onDeleteConfirmation={onDeleteConfirmation}/>
      <UpdateProject onCreateComplete={onCreateComplete} selectedProjectToManage={selectedProjectToManage}/>

      <NewSprintModal projectId={selectedProject.id} onNewSprintAdded={onNewSprintAdded} selectedTeam={selectedTeam} teamList={ localStorage.getItem("project") !== null? JSON.parse( JSON.parse(localStorage.getItem("project")).project_settings).teams: []} page={'landing'}/>

      <SprintPinPopup confirmationSprintPin={confirmationSprintPin} selectedProject={selectedProject}/>

    </div>
  );
}

export default Landing;