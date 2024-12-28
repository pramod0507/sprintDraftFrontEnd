import React, { useState, useEffect } from 'react';
import logo from '../assets/ZS_logo.png'
import '../App.css';
import TicketsConfigureModal from '../components/TicketsConfigureModal';
import UserList from '../components/UserList';
import M from "materialize-css/dist/js/materialize.min.js";
import * as Method from '../common/Methods.js';
import EditUserData from '../components/EditUserData.js'
import EditSprintSetting from '../components/EditSprintSetting.js'
import JiraConfigureModal from '../components/JiraConfigureModal'
import JiraDetailPopup from '../components/JiraDetailPopup'
import NewSprintModal from '../components/NewSprintModal'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import SelectSprint from '../components/SelectSprint.js'
import SelectSprintPopup from '../components/SelectSprintPopup.js';
import DuplicateSprint from '../components/DuplicateSprint.js';
import TableAnimation from "../animations/loadingPage.json";
import SprintPinPopup from "../components/SprintPinPopup.js";
import Lottie from 'lottie-react-web';
import AssignSprint from '../components/AssignSprint';
import WorkLogPopup from '../components/WorkLogPopup';
import SprintReport from '../components/SprintReport';
import DeleteConfirmation from '../components/DeleteConfirmation.js'


function Dashboard() {

 
  const [spilloverData, setSpilloverData] = useState([])
  const [businessData, setBusinessData] = useState([])
  const [techTaskData, setTechTaskData] = useState([])
  const [qaAutomationData, setQaAutomation] = useState([])

  const [selectedDropdown, setSelectedDropDown] = useState("ALL")

  const [totalDevHrFromJira, setTotalDevHrFromJira] = useState(0)
  const [totalQAHrFromJira, setTotalQAHrFromJira] = useState(0)

  const [totalQAResourceHr, setTotalQAResourceHr] = useState(0)
  const [totalDevResourceHr, setTotalDevResourceHr] = useState(0)

  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectedUserForEdit, setSelectedUserForEdit] = useState({})

  const [selectedTeam, setSelectedTeam] = useState("");
  const [teamList,setTeamList] = useState([]);

  const [sprintSettings,setSprintSettings] = useState({days:0, perDay:0, holiday:0,sprintBuffer:0})
  const [sprintSettingsRaw, setSprintSettingsRaw] = useState({})

  const [totalSprintHrsFoeEachuser, setTotalSprintHrsFoeEachuser] = useState(0)

  const [loader,setLoader] = useState(false)
  const [saveLoader,setSaveLoader] = useState(false)

  const [fullSiteLoader,setFullSiteLoader] = useState(false)

  const [allJiraData, setAllJiraData] = useState([])

  const [isEditEnabled, setIsEditEnabled] = useState(false)

  const [sprintId,setSprintId] = useState("")

  const [projectId,setProjectId] = useState("")
  const [projectSettings,setProjectSettings] = useState({})

  const [sprintList,setSprintList] = useState([])

  const [selectedJira,setSelectedJira] = useState({})

  const [selectedJiraCategory,setSelectedJiraCategory] = useState("")

  const [totalDevTechHrFromJira, setTotalDevTechHrFromJira] = useState(0)
  const [totalQATechHrFromJira, setTotalQATechHrFromJira] = useState(0)

  const [totalDevBusinessHrFromJira, setTotalDevBusinessHrFromJira] = useState(0)
  const [totalQABusinessHrFromJira, setTotalQABusinessHrFromJira] = useState(0)

  const [totalDevSpilloverHrFromJira, setTotalDevSpilloverHrFromJira] = useState(0)
  const [totalQASpilloverHrFromJira, setTotalQASpilloverHrFromJira] = useState(0)

  const [unsavedChanges, setUnsavedChanges] = useState(false)

  const [assignSprintLoader, setAssignSprintLoader] = useState(false)
  const [assignSprintPercent, setAssignSprintPercent] = useState(0)

  const [assignedJiraListOfUsers, setAssignedJiraListOfUsers] = useState([])

  const [id,setId] = useState("")
  const navigate = useNavigate();
  const screenHeight = window.innerHeight

   useEffect(() => {
      M.AutoInit();
      // console.log("=======sprints======="+ localStorage.getItem("sprints"))
      // console.log("========project======"+ localStorage.getItem("project") ) 
      // console.log("=======selectedSprint======="+ localStorage.getItem("selectedSprint"))
      // console.log("=======selectedTeam======="+ localStorage.getItem("selectedTeam"))
      // console.log("=======sprintSettings======="+ localStorage.getItem("sprintSettings"))

      if(localStorage.getItem("sprints") !== null || localStorage.getItem("project") !== null || localStorage.getItem("selectedSprint") !== null){
        updateProjectSettings()

        setProjectId(JSON.parse(localStorage.getItem("project")).id )
        setSelectedTeam(localStorage.getItem("selectedTeam"))
        setTeamList(JSON.parse( JSON.parse(localStorage.getItem("project")).project_settings).teams)

        setProjectSettings(JSON.parse(localStorage.getItem("project")))
        setSprintId(localStorage.getItem("selectedSprint"))

        updateSavedData(JSON.parse(localStorage.getItem("project")).id, localStorage.getItem("selectedSprint"))

        setSprintList(JSON.parse(localStorage.getItem("sprints")))
        
      }else{
        navigate('/')
      }

  },[])


   const updateProjectSettings=async()=>{

      var responseRecieved = await Method.getProjectSettings(JSON.parse(localStorage.getItem("project") ).zs_project_Id)
      if(responseRecieved.status){
        if(responseRecieved.data.length == 0){
          M.toast({html: `<span style="color:yellow">${projectSettings.zs_project_name} settings not available</span>`, classes: 'rounded'})
        }else{
          localStorage.setItem("project", JSON.stringify(responseRecieved.data[0]));
          checkSprintsAvailable()
        }
        
      }else{
         M.toast({html: '<span style="color:yellow">{projectSettings.zs_project_name} settings not available</span>', classes: 'rounded'})
      }
   }

   
   const checkSprintsAvailable=async()=>{
    var responseRecieved  = await Method.getSprintList(projectId)

    if (responseRecieved.status) {
      if (responseRecieved.data.length > 0) {
          
          localStorage.setItem("sprints", JSON.stringify(responseRecieved.data));
          setSprintList(responseRecieved.data)
        
          
      }
    }
  }


   const onSave=async(localSprintSetting)=>{
    setSaveLoader(true)
    var tempSprintTickets = []
    var tempAllJiraData = [...allJiraData]

    for (var i = 0; i < tempAllJiraData.length; i++) {
      tempSprintTickets.push({"id":tempAllJiraData[i].key,"category":tempAllJiraData[i].category, "remainingQaHr":tempAllJiraData[i].remainingQaHr, "remainingDevHr":tempAllJiraData[i].remainingDevHr,"devEnabled":tempAllJiraData[i].devEnabled, "qaEnabled":tempAllJiraData[i].qaEnabled, "comment": tempAllJiraData[i].comment
      })
    }

    var responseRecieved = await Method.updateSprintData(id, sprintId, projectId, localSprintSetting, selectedUsers, tempSprintTickets, selectedTeam)

    if(responseRecieved.status){
     M.toast({html: '<span style="color:yellow">Data saved successfully</span>', classes: 'rounded'})
      
    }

      setUnsavedChanges(false)
      setIsEditEnabled(false)
      setSaveLoader(false)

   }


   const onFreeze=async(e)=>{
      setAssignSprintLoader(true)
      if(!e.hasOwnProperty("id")){
        M.toast({html: `<span style="color:yellow">Please select a sprint</span>`, classes: 'rounded'})
      }else{
        var tempSprintSetting = sprintSettings
        tempSprintSetting.isFreez = true
        tempSprintSetting.selectedSprint = e

        for (var i = 0; i < allJiraData.length; i++) {
          await Method.assignSprintToJiraID(allJiraData[i].key, projectSettings.zs_sprint_key, e.id, allJiraData[i].category, (allJiraData[i].remainingQaHr + allJiraData[i].remainingDevHr) )

          setAssignSprintPercent( ((i+1)/allJiraData.length)*100 )
        }

        var elem = document.getElementById("AssignSprint")
        var instance = M.Modal.init(elem,{dismissible:false})
        // var instance = M.Modal.getInstance(elem)
        instance.close()

        onSave(tempSprintSetting)
      }
      setAssignSprintLoader(false)
      setAssignSprintPercent(0)
   }


   const onUnFreeze=()=>{
        var tempSprintSetting = sprintSettings
        tempSprintSetting.isFreez = false
        tempSprintSetting.selectedSprint = {}
        onSave(tempSprintSetting)
      
   }


   const onSaveSpillover=(newDevhr, newQAhr, comment)=>{
      
      var tempAllData = [...allJiraData]
      var selectedIndex = tempAllData.findIndex(x=>x.key === selectedJira.key)
      var tempUsers = []
      tempUsers.push(...selectedUsers) 
     
     //remove previous spillover added values
     if(![0,null].includes(tempAllData[selectedIndex].fields.assignee)){ 
           
        var assigneeIndex = tempUsers.findIndex(x=> x.userDetail.accountId === tempAllData[selectedIndex].fields.assignee.accountId )

        if(assigneeIndex !== -1 && tempUsers[assigneeIndex].role === "dev"){
          
          tempUsers[assigneeIndex].allocatedHrs = tempUsers[assigneeIndex].allocatedHrs - tempAllData[selectedIndex].remainingDevHr

          //add new value to users
          tempUsers[assigneeIndex].allocatedHrs = tempUsers[assigneeIndex].allocatedHrs + Number(newDevhr)
        }

        if(assigneeIndex !== -1 && tempUsers[assigneeIndex].role === "qa"){
          tempUsers[assigneeIndex].allocatedHrs = tempUsers[assigneeIndex].allocatedHrs - tempAllData[selectedIndex].remainingQaHr

          //add new value to users
          tempUsers[assigneeIndex].allocatedHrs = tempUsers[assigneeIndex].allocatedHrs + Number(newQAhr)
        }
      }  

      if( ![0,null].includes(tempAllData[selectedIndex].fields[projectSettings.qa_hr_key])){
        
        if(![0,null].includes(tempAllData[selectedIndex].fields[projectSettings.qa_user_field])){
          var qaIndex = tempUsers.findIndex(x=> x.userDetail.accountId === tempAllData[selectedIndex].fields[projectSettings.qa_user_field].accountId )

          if(qaIndex !== -1 && tempUsers[qaIndex].role === "qa"){
            tempUsers[qaIndex].allocatedHrs = tempUsers[qaIndex].allocatedHrs - tempAllData[selectedIndex].remainingQaHr
            //add new value to users
            tempUsers[qaIndex].allocatedHrs = tempUsers[qaIndex].allocatedHrs + Number(newQAhr)
          }
        }
        
      }
      

      //add new value to jira
      tempAllData[selectedIndex].remainingQaHr = Number(newQAhr)
      tempAllData[selectedIndex].remainingDevHr = Number(newDevhr)
      tempAllData[selectedIndex].comment = comment

      setAllJiraData(tempAllData)
      updateDevAndQATotalHrs(tempAllData)
      setSelectedUsers(tempUsers)
      // jiraAddedCalculateUsersAssignedHrs(tempUsers,tempAllData,true)

      setUnsavedChanges(true)
      setIsEditEnabled(true)
      

   }



   const onSaveNonSpillover=(devHrEnabled, qaHrEnabled, comment)=>{
      

      var tempAllData = []
      tempAllData.push(...allJiraData)

      var selectedIndex = tempAllData.findIndex(x=>x.key === selectedJira.key)

      var earlierDevValue = tempAllData[selectedIndex].devEnabled
      var earlierQaValue = tempAllData[selectedIndex].qaEnabled

      tempAllData[selectedIndex].devEnabled = devHrEnabled
      tempAllData[selectedIndex].qaEnabled = qaHrEnabled
      tempAllData[selectedIndex].comment = comment

      updateDevAndQATotalHrs(tempAllData)
      updateTheToggledUsersData(devHrEnabled,qaHrEnabled,earlierDevValue,earlierQaValue,tempAllData,selectedIndex)

      setUnsavedChanges(true)
      setIsEditEnabled(true)

   }

   const updateTheToggledUsersData=(newDevValue,newQaValue,oldDevValue,oldQaValue, jiraList, jiraIndex)=>{

       var tempUsers =[]
       tempUsers.push(...selectedUsers)
    
      //if user assignee is present
      if(jiraList[jiraIndex].fields.assignee !== null){

        var index = tempUsers.findIndex(x=>x.userDetail.accountId === jiraList[jiraIndex].fields.assignee.accountId)

        //check dev hrs is available
        if( ![0,null].includes(jiraList[jiraIndex].fields[projectSettings.dev_hr_key])){
         if(newDevValue !== oldDevValue ){
            var devhr = jiraList[jiraIndex].fields[projectSettings.dev_hr_key]
            if(jiraList[jiraIndex].devEnabled){
              tempUsers[index].allocatedHrs = tempUsers[index].allocatedHrs + devhr
            }else{
              tempUsers[index].allocatedHrs = tempUsers[index].allocatedHrs - devhr
            }
            
          }

        }else if( ![0,null].includes(jiraList[jiraIndex].fields[projectSettings.qa_hr_key])){
          //check qa hrs is available
          if(newQaValue !== oldQaValue){
            var qahr = jiraList[jiraIndex].fields[projectSettings.qa_hr_key]
            if(jiraList[jiraIndex].qaEnabled){
              tempUsers[index].allocatedHrs = tempUsers[index].allocatedHrs + qahr
            }else{
              tempUsers[index].allocatedHrs = tempUsers[index].allocatedHrs - qahr
            }
            
          }

        }

      }


      //if user is qa
      if(jiraList[jiraIndex].fields[projectSettings.qa_user_field] !== null){
        var index = tempUsers.findIndex(x=>x.userDetail.accountId === jiraList[jiraIndex].fields[projectSettings.qa_user_field].accountId)
         if(newQaValue !== oldQaValue){
            var qahr = jiraList[jiraIndex].fields[projectSettings.qa_hr_key]
             if(jiraList[jiraIndex].qaEnabled){
              tempUsers[index].allocatedHrs = tempUsers[index].allocatedHrs + qahr
            }else{
              tempUsers[index].allocatedHrs = tempUsers[index].allocatedHrs - qahr
            }
           
          }

      }
      setSelectedUsers(tempUsers)
      setAllJiraData(jiraList)
   }



   const updateSavedData = async(proId, sprId) =>{
    setFullSiteLoader(true)
    try{
      var responseRecieved = await Method.getSprintData(proId, sprId, localStorage.getItem("selectedTeam"))
      if(responseRecieved.status){
        setSprintSettingsRaw(responseRecieved.data[0])
        setSprintSettings( JSON.parse(responseRecieved.data[0].sprint_settings) )
        //add tickets
        var sprintTicketsTemp = JSON.parse(responseRecieved.data[0].sprint_tickets)
        var tempAllData = []
        for (var i = 0; i < sprintTicketsTemp.length; i++) {

            var responseDataRecieved = await Method.getJiraTicketsDetails(sprintTicketsTemp[i].id)
            for (var j = 0; j < responseDataRecieved.data.length ; j++) {
              var eachElement = responseDataRecieved.data[j]
              eachElement["category"] = sprintTicketsTemp[i].category
              eachElement["remainingQaHr"] = sprintTicketsTemp[i].remainingQaHr
              eachElement["remainingDevHr"] = sprintTicketsTemp[i].remainingDevHr
              eachElement["devEnabled"] = sprintTicketsTemp[i].devEnabled
              eachElement["qaEnabled"] = sprintTicketsTemp[i].qaEnabled
              eachElement["comment"] = sprintTicketsTemp[i].comment
              tempAllData.push(eachElement)
            }
          }

        setAllJiraData(tempAllData)

        updateDevAndQATotalHrs(tempAllData)

        //users
        var tempUser =  JSON.parse(responseRecieved.data[0].sprint_users) 
        var tempUserFromDatabase = []
        for (var j = 0; j < tempUser.length; j++) {
          tempUserFromDatabase.push(tempUser[j])
        }
        setSelectedUsers(tempUserFromDatabase)

         calaculateSprintHrsForEachUser( JSON.parse(responseRecieved.data[0].sprint_settings).days, JSON.parse(responseRecieved.data[0].sprint_settings).perDay, JSON.parse(responseRecieved.data[0].sprint_settings).holiday, JSON.parse(responseRecieved.data[0].sprint_settings).sprintBuffer, tempUserFromDatabase, JSON.parse(responseRecieved.data[0].sprint_settings) )

        var tempMasterData = responseRecieved.data[0]
        setSprintId(responseRecieved.data[0].sprint_id)
        setProjectId(responseRecieved.data[0].project_id)
        setId(responseRecieved.data[0].id)
        setFullSiteLoader(false)

      }

    }catch(error){
      setFullSiteLoader(false)
    }
   }


   const onDropdownSelect=(e)=>{
      setSelectedDropDown(e)
   }



   const calaculateSprintHrsForEachUser=(day,hr,holid, buff, users, sprintData)=>{
    var temp = (day * hr)-(hr * holid) 

    temp = temp
    setTotalSprintHrsFoeEachuser(temp)
    getTotalResourceHrAvailable(users, temp, sprintData)

   }


   const getTotalResourceHrAvailable=(users, foreachuserHrs, sprintData)=>{

      var tempQA = 0;
      var tempDev = 0;

      for (var i = 0; i < users.length; i++) {
        
        if(users[i].role === "qa" && users[i].buffer !==0){

        if(Number(users[i].buffer) >= 100){
            
          }else{
            var temp = 
            (foreachuserHrs - Number((Number(users[i].leave) + Number(users[i].meetings)) * sprintData.perDay)) - 
            ((foreachuserHrs - Number((Number(users[i].leave)  + Number(users[i].meetings)) * sprintData.perDay))*Number(users[i].buffer/100 )).toFixed(2)
           
            if(Number(temp) > 0){
              tempQA = tempQA + Number(temp)
            }
            

          }
        
        }

        if(users[i].role === "dev" && users[i].buffer !==0){
          if(Number(users[i].buffer) >= 100){
            
          }else{
            var temp = (foreachuserHrs - Number((Number(users[i].leave) + Number(users[i].meetings)) * sprintData.perDay)) - ((foreachuserHrs - Number((Number(users[i].leave)  + Number(users[i].meetings)) * sprintData.perDay))*Number(users[i].buffer/100 )).toFixed(2)
           
            if(Number(temp) > 0){
              tempDev = tempDev + Number(temp)
            }
            

           
          }
          
        }
      }
      setTotalQAResourceHr(tempQA )
      setTotalDevResourceHr(tempDev)
   }



  const getUncommonList=(arrayString, compareArray)=>{
    var uncommonElements =[]

    var data = arrayString.split(",")
      uncommonElements = data.filter(function(id) {
        return !compareArray.some(function(item) {
            return item.key.trim() === id.trim();
        })
    })

    
      var tempList = ""
      if(uncommonElements.length > 0){
        
        for (var i = 0; i < uncommonElements.length ; i++) {
          
          if(i == (uncommonElements.length-1)){
            tempList = tempList + uncommonElements[i]
          }else{
            tempList = tempList + uncommonElements[i]  +"," 
          }
          
        }
      }

    return tempList
  }

  const onNewSprintAdded=(selectedSprint)=>{
    checkSprintsAvailable()
    updateSavedData( projectId , selectedSprint)
  }


  const jiraAddedCalculateUsersAssignedHrs=(userList, jiraList, isSpilloverFlow)=>{
    var tempUsers =userList
    for (var i = 0; i < jiraList.length; i++) {

       //check for assigne present
        if(jiraList[i].fields.assignee !== null){
          
          var index = tempUsers.findIndex(x=>x.userDetail.accountId === jiraList[i].fields.assignee.accountId)
          
          //check for assignee
          if(index !== -1){

                 //is this coming from spillovr flow
                if (isSpilloverFlow) {
                   tempUsers[index].allocatedHrs =  tempUsers[index].allocatedHrs  + Number(jiraList[i].remainingDevHr)
                }else{
                 //is this spillover ticket
                  if(jiraList[i].category === "SPILLOVERS"){
                    tempUsers[index].allocatedHrs = 0 + tempUsers[index].allocatedHrs
                  }else{

                    //check qa assinee is also available
                    if (![0,null].includes(jiraList[i].fields[projectSettings.dev_hr_key])) {
                      
                      tempUsers[index].allocatedHrs = Number(jiraList[i].fields[projectSettings.dev_hr_key]) + tempUsers[index].allocatedHrs
                    }else if([0,null].includes(jiraList[i].fields[projectSettings.dev_hr_key]) && jiraList[i].fields[projectSettings.qa_user_field] !== null){
                      
                      tempUsers[index].allocatedHrs = Number(jiraList[i].fields[projectSettings.dev_hr_key]) + tempUsers[index].allocatedHrs

                    }else if(![0,null].includes(jiraList[i].fields[projectSettings.qa_hr_key])){
                      
                      tempUsers[index].allocatedHrs = Number(jiraList[i].fields[projectSettings.qa_hr_key]) + tempUsers[index].allocatedHrs
                    }
                    
                  }
                  
                }
          }else{
            
              if( ![0,null].includes(jiraList[i].fields[projectSettings.dev_hr_key])){
                //if assinee and dev hrs not null
                if(jiraList[i].category === "SPILLOVERS"){
                  tempUsers.push({userDetail: jiraList[i].fields.assignee, buffer:0, leave:0, role:"dev", allocatedHrs:0, meetings: 0, inTeam: true})  
                }else{
                  tempUsers.push({userDetail: jiraList[i].fields.assignee, buffer:0, leave:0, role:"dev", allocatedHrs:Number(jiraList[i].fields[projectSettings.dev_hr_key]), meetings: 0, inTeam: true})
                }
                
              }else if( ![0,null].includes(jiraList[i].fields[projectSettings.qa_hr_key])){
                 //if assignee and qa hr not null 
              if(jiraList[i].category === "SPILLOVERS"){
                  tempUsers.push({userDetail: jiraList[i].fields.assignee, buffer:0, leave:0, role:"qa", allocatedHrs:0, meetings: 0, inTeam: true})
                }else{
                  tempUsers.push({userDetail: jiraList[i].fields.assignee, buffer:0, leave:0, role:"qa", allocatedHrs:Number(jiraList[i].fields[projectSettings.qa_hr_key]), meetings: 0, inTeam: true})
                }
              }else{
                tempUsers.push({userDetail: jiraList[i].fields.assignee, buffer:0, leave:0, role:"qa", allocatedHrs:0, meetings: 0, inTeam: true})
              }
          }
        }

        //check for qa assinee present
        if(jiraList[i].fields[projectSettings.qa_user_field] !== null){
          var index = tempUsers.findIndex(x=>x.userDetail.accountId === jiraList[i].fields[projectSettings.qa_user_field].accountId)

          //check for QA assinee
          if(index !== -1){
            if (isSpilloverFlow) {
              tempUsers[index].allocatedHrs = tempUsers[index].allocatedHrs + Number(jiraList[i].remainingQaHr)
            }else{
              if(jiraList[i].category === "SPILLOVERS"){
                tempUsers[index].allocatedHrs = 0 + tempUsers[index].allocatedHrs
              }else{
                tempUsers[index].allocatedHrs = Number(jiraList[i].fields[projectSettings.qa_hr_key]) + tempUsers[index].allocatedHrs
              }
              
            }

             
          }else{
              if( jiraList[i].fields[projectSettings.qa_hr_key] !== null){   
                if(jiraList[i].category === "SPILLOVERS"){
                  tempUsers.push({userDetail: jiraList[i].fields[projectSettings.qa_user_field], buffer:0, leave:0, role:"qa", allocatedHrs:0, meetings: 0, inTeam: true})
                }else{
                  tempUsers.push({userDetail: jiraList[i].fields[projectSettings.qa_user_field], buffer:0, leave:0, role:"qa", allocatedHrs:Number(jiraList[i].fields[projectSettings.qa_hr_key]), meetings: 0, inTeam: true})
                }        
                
              }
          }
        }
    }
    setSelectedUsers(tempUsers)

  }

  const updateDevAndQATotalHrs=(tempAllData)=>{

    var spilloverJira =  tempAllData.filter(x=>x.category === "SPILLOVERS")

    var tempDev = 0
    var tempQA = 0

    var tempTechDev = 0
    var tempTechQA = 0

    var tempBusinessDev = 0
    var tempBusinessQA = 0

    var tempSpilloverDev = 0
    var tempSpilloverQA = 0

      for (var i = 0; i< tempAllData.length; i++) {

        var tempProjectSetting = JSON.parse(localStorage.getItem("project"))

        if(tempAllData[i].category === "SPILLOVERS"){
          if(tempAllData[i].devEnabled){
            tempDev = tempDev + Number(tempAllData[i].remainingDevHr)
            tempSpilloverDev = tempSpilloverDev + Number(tempAllData[i].remainingDevHr) 
          }

          if(tempAllData[i].qaEnabled){
            
            tempQA = tempQA + Number(tempAllData[i].remainingQaHr)
            tempSpilloverQA = tempSpilloverQA + Number(tempAllData[i].remainingQaHr)
          }



        }else{
          if(tempAllData[i].devEnabled){
            if(tempAllData[i].fields[tempProjectSetting.dev_hr_key] !== null){
              tempDev = tempDev + tempAllData[i].fields[tempProjectSetting.dev_hr_key]

              if(tempAllData[i].category === "TECH TASKS"){
                tempTechDev = tempTechDev + tempAllData[i].fields[tempProjectSetting.dev_hr_key]
              }

              if(tempAllData[i].category === "BUSINESS"){
                tempBusinessDev = tempBusinessDev + tempAllData[i].fields[tempProjectSetting.dev_hr_key]
              }
           }
          }
          

          if(tempAllData[i].qaEnabled){
            if(tempAllData[i].fields[tempProjectSetting.qa_hr_key] !== null){
              tempQA = tempQA + tempAllData[i].fields[tempProjectSetting.qa_hr_key]
              if(tempAllData[i].category === "TECH TASKS"){
                tempTechQA = tempTechQA + tempAllData[i].fields[tempProjectSetting.qa_hr_key]
              }

              if(tempAllData[i].category === "BUSINESS"){
                tempBusinessQA = tempBusinessQA + tempAllData[i].fields[tempProjectSetting.qa_hr_key]
              }

            }
          }

        }

      }

      setTotalDevTechHrFromJira(tempTechDev)
      setTotalQATechHrFromJira(tempTechQA)

      setTotalDevBusinessHrFromJira(tempBusinessDev)
      setTotalQABusinessHrFromJira(tempBusinessQA)

      setTotalDevSpilloverHrFromJira(tempSpilloverDev)
      setTotalQASpilloverHrFromJira(tempSpilloverQA)

      setTotalDevHrFromJira(tempDev)    
      setTotalQAHrFromJira(tempQA)
  }


  const onSaveFromModalSetData=async(jira, category, isDataLoadedFromDatabase)=>{
    setLoader(true)
    try{
      var tempAllData = []
      tempAllData = tempAllData.concat(allJiraData)

      if(jira.length > 0){
        var tempList = await getUncommonList(jira, tempAllData)
        
        if(tempList.length>0){
          var temp =[]
          var responseRecieved = await Method.getJiraTicketsDetails(tempList)
          for (var i = 0; i < responseRecieved.data.length ; i++) {
            var eachElement = responseRecieved.data[i]

            console.log("--------"+JSON.stringify(responseRecieved.data[i]))

            //check if dev and qa hrs are available
            if ( !responseRecieved.data[i].fields.hasOwnProperty([projectSettings.dev_hr_key]) && !responseRecieved.data[i].fields.hasOwnProperty([projectSettings.qa_hr_key]) ) {
              eachElement["category"] = "SPILLOVERS"
            }else{
              eachElement["category"] = category
            }
            
            eachElement["remainingQaHr"] = 0
            eachElement["remainingDevHr"] = 0
            eachElement["devEnabled"] = true
            eachElement["qaEnabled"] = true
            eachElement["comment"] = ""
            temp.push(eachElement)         
          }

          tempAllData.push(...temp)
        }
      } 

       if( isDataLoadedFromDatabase == false){
          await jiraAddedCalculateUsersAssignedHrs(selectedUsers, responseRecieved.data, false)
          setUnsavedChanges(true)
          setIsEditEnabled(true)
        }


      setAllJiraData(tempAllData)
      updateDevAndQATotalHrs(tempAllData)
      setLoader(false)
    }
    catch(error){
      setLoader(false)
    }
  }


  const checkAddedUserHasTicketAssigned=(userData,role)=>{
    var assignedHrs = 0
    if(role == "dev" ){
       var inAssignee = allJiraData.filter(x=> x.fields.assignee !== null &&  x.fields.assignee.accountId === userData.accountId )
       for (var i = 0; i < inAssignee.length; i++) {
         assignedHrs = Number(inAssignee[i].fields[projectSettings.dev_hr_key]) + assignedHrs
       }
    }

    if(role == "qa" ){
       var inAssignee = allJiraData.filter(x=> x.fields.assignee !== null && x.fields[projectSettings.qa_user_field] !== null && x.fields[projectSettings.qa_user_field].accountId === userData.accountId)
       for (var i = 0; i < inAssignee.length; i++) {
         assignedHrs = Number(inAssignee[i].fields[projectSettings.qa_hr_key]) + assignedHrs
       }
    }
    return assignedHrs
  }

  const userlistFromModal=async(e, isDev)=>{
    var role = "dev"
    if(!isDev){
      role = "qa"
    }
    
    var temp = []
    temp = temp.concat(selectedUsers)

    for (var i = 0; i < e.length; i++) {
      
      var index = temp.findIndex(x=>x.userDetail.accountId === e[i].accountId)
      if(index !== -1){
       
        temp = temp.toSpliced(index,1)
      }

      var hrs = await checkAddedUserHasTicketAssigned(e[i],role )

      var eachElement = {userDetail: e[i], buffer:0, leave:0, role: role, allocatedHrs:hrs, meetings: 0, inTeam: true}
      temp.push(eachElement)

      setUnsavedChanges(true)
      setIsEditEnabled(true)

    }
    setSelectedUsers(temp)

    var elem = document.getElementById("selectusers")
    var instance = M.Modal.getInstance(elem)
    instance.close()

    M.toast({html: '<span style="color:yellow">User added</span>', classes: 'rounded'})
  }

  const openassignModelPoupup=()=>{
    var elem = document.getElementById("AssignSprint")
    var instance = M.Modal.init(elem,{dismissible:false})
    instance.open()
  }


  const badges=(e)=>{
    var tempArray = []
    for (var i = 0; i < e.length; i++) {
      var eachElem = <span key={"badge_"+i} style={{marginTop:5}} className='teal white-text m-left-5 f-10 p-4 b-r-3' >{e[i]}</span>
      tempArray.push(eachElem)
    }
    return tempArray
  }

  const updateSprintConfig=(days, hours, holiday, buffer)=>{
    var temp = sprintSettings
    temp.days = days
    temp.perDay = hours
    temp.holiday = holiday
    temp.sprintBuffer = buffer

    setSprintSettings(temp)

    calaculateSprintHrsForEachUser(days,hours,holiday,buffer, selectedUsers, sprintSettings)

    setUnsavedChanges(true)
    setIsEditEnabled(true)

  }

  const onUserRowClick=(e)=>{
    setSelectedUserForEdit(e)
    var elem = document.getElementById("editUserData")
    var instance = M.Modal.getInstance(elem)
    instance.open()
  }


  const openReportModal=()=>{
    var elem = document.getElementById("reportModal")
    var instance = M.Modal.getInstance(elem)
    instance.open()
  }

  const onUserDataSave=(buffer,leave, role, meetings, inTeam)=>{
    
    var temp = []
    temp = temp.concat( selectedUsers )
    var index = temp.findIndex(x=> x.userDetail.accountId ===  selectedUserForEdit.userDetail.accountId)
    temp[index].buffer = buffer
    temp[index].leave = leave
    temp[index].role = role
    temp[index].meetings = Number(meetings)
    temp[index].inTeam = inTeam
    
    setSelectedUsers(temp,[getTotalResourceHrAvailable(temp,totalSprintHrsFoeEachuser, sprintSettings)])
    M.toast({html: '<span style="color:yellow">User data updated</span>', classes: 'rounded'})

    var elem = document.getElementById("editUserData")
      var instance = M.Modal.getInstance(elem)
      instance.close()

    setUnsavedChanges(true)
    setIsEditEnabled(true)

  }

  const onTeamSelected=(e)=>{
    setSelectedTeam(e)
    localStorage.setItem("selectedTeam", e);
  }

  const onProceedToDashboard=(selectedSprintFromSelectSprint, selectedTeamFromSelectTeam)=>{
    
    setSelectedTeam(selectedTeamFromSelectTeam)
    localStorage.setItem("selectedTeam", selectedTeamFromSelectTeam);

    setSprintId(selectedSprintFromSelectSprint)
    localStorage.setItem("selectedSprint", selectedSprintFromSelectSprint);

    updateSavedData( projectId , selectedSprintFromSelectSprint)

    M.toast({html: `<span style="color:yellow">Sprint ${selectedSprintFromSelectSprint} selected</span>`, classes: 'rounded'})
      var elem = document.getElementById("selectSprintPopup")
      var instance = M.Modal.getInstance(elem)
      instance.close()
  }


  const reduceHrFromSelectedUser=(user, hrsToReduce)=>{
    if(user !== null){
      var temp = []
      temp.push(...selectedUsers)

      var index = temp.findIndex(x=>x.userDetail.accountId === user.accountId)

      if(index !== -1){

        temp[index].allocatedHrs = temp[index].allocatedHrs - hrsToReduce
      }
      setSelectedUsers(temp)
    }
  }


  const onJiraRemoved=(e)=>{
    var tempAllData = []
    tempAllData.push(...allJiraData)
    var tempAllData = tempAllData.filter(x=> x.key !== e.key)
    setAllJiraData(tempAllData)

    
    if(e.fields.assignee !== null){
      var hrs = 0
      //check dev assign is present
      if( ![0,null].includes( e.fields[projectSettings.dev_hr_key] ) && e.devEnabled){
        
        if(e.category === "SPILLOVERS"){
          hrs = Number(e.remainingDevHr)
        }else{
          hrs = Number(e.fields[projectSettings.dev_hr_key])  
        }
        

        reduceHrFromSelectedUser(e.fields.assignee, hrs)
      } else if( e.fields[projectSettings.qa_user_field] !== null && [0,null].includes(e.fields[projectSettings.dev_hr_key]) && e.devEnabled){

        if(e.category === "SPILLOVERS"){
          hrs = Number(e.remainingDevHr)
        }else{
          hrs = Number(e.fields[projectSettings.dev_hr_key])  
        }

        reduceHrFromSelectedUser(e.fields.assignee, hrs)

      }
      else if([0,null].includes( e.fields[projectSettings.dev_hr_key] ) && ![0,null].includes(e.fields[projectSettings.qa_hr_key]) && e.qaEnabled){
        
        if(e.category === "SPILLOVERS"){
          hrs = Number(e.remainingQaHr)
        }else{
          hrs = e.fields[projectSettings.qa_hr_key]
        }
        reduceHrFromSelectedUser(e.fields.assignee, hrs)
      }
    }

    if(e.fields[projectSettings.qa_user_field] !== null  && e.qaEnabled){
      var hrs = 0
      if(![0,null].includes(e.fields[projectSettings.qa_hr_key])){
        if(e.category === "SPILLOVERS"){
          hrs = Number(e.remainingQaHr)
        }else{
          hrs = e.fields[projectSettings.qa_hr_key]
        }
        
      }
      
      reduceHrFromSelectedUser(e.fields[projectSettings.qa_user_field], hrs)
    }
    
      var tempDev = 0
      var tempQA = 0

      var tempTechDev = 0
      var tempTechQA = 0

      var tempBusinessDev = 0
      var tempBusinessQA = 0

      var tempSpilloverDev = 0
      var tempSpilloverQA = 0



      for (var i = 0; i< tempAllData.length; i++) {
        if(tempAllData[i].fields[projectSettings.dev_hr_key] !== null){
          
          if (tempAllData[i].category === "SPILLOVERS" && tempAllData[i].devEnabled == true) {
            tempDev = tempDev + Number(tempAllData[i].remainingDevHr)
          }else{
            tempDev = tempDev + tempAllData[i].fields[projectSettings.dev_hr_key]
          }
          
          
          if(tempAllData[i].category === "TECH TASKS"){
                tempTechDev = tempTechDev + tempAllData[i].fields[projectSettings.dev_hr_key]
              }

          if(tempAllData[i].category === "BUSINESS"){
                tempBusinessDev = tempBusinessDev + tempAllData[i].fields[projectSettings.dev_hr_key]
              }
        }

        if(tempAllData[i].fields[projectSettings.qa_hr_key] !== null){

          if (tempAllData[i].category === "SPILLOVERS" && tempAllData[i].qaEnabled == true) {
            tempQA = tempQA + Number(tempAllData[i].remainingQaHr)
          }else{
            tempQA = tempQA + tempAllData[i].fields[projectSettings.qa_hr_key]
          }
          
          
          if(tempAllData[i].category === "TECH TASKS"){
                tempTechQA = tempTechQA + tempAllData[i].fields[projectSettings.qa_hr_key]
              }

          if(tempAllData[i].category === "BUSINESS"){
                tempBusinessQA = tempBusinessQA + tempAllData[i].fields[projectSettings.qa_hr_key]
              }
        } 
      }


      setTotalDevTechHrFromJira(tempTechDev)
      setTotalQATechHrFromJira(tempTechQA)

      setTotalDevBusinessHrFromJira(tempBusinessDev)
      setTotalQABusinessHrFromJira(tempBusinessQA)

      setTotalDevSpilloverHrFromJira(tempSpilloverDev)
      setTotalQASpilloverHrFromJira(tempSpilloverQA)

      setTotalDevHrFromJira(tempDev)    
      setTotalQAHrFromJira(tempQA)

      setUnsavedChanges(true)
      setIsEditEnabled(true)
  }


  const onUserRemoved=()=>{
    var temp = []
    temp = temp.concat( selectedUsers )
    var index = temp.findIndex(x=> x.userDetail.accountId ===  selectedUserForEdit.userDetail.accountId)
    temp = temp.toSpliced(index,1)
    setSelectedUsers(temp,[getTotalResourceHrAvailable(temp, totalSprintHrsFoeEachuser, sprintSettings)])
    M.toast({html: '<span style="color:yellow">User Removed</span>', classes: 'rounded'})

    setUnsavedChanges(true)
    setIsEditEnabled(true)
    
  }


  const openSprintSetting=()=>{
    var elem = document.getElementById("sprintSettings")
    var instance = M.Modal.getInstance(elem)
    instance.open()
    
  }


  const renderUsersRows=()=>{
    return(
      selectedUsers.map((item, index) =>

        <tr key={index} className="hand" onClick={()=>{onUserRowClick(item)}}>
          <td>
              <div className="d-flex" style={{width:120}}>
                 {item.hasOwnProperty("inTeam") && item.inTeam == false?<s className="grey-text">{item.userDetail.displayName}</s>: item.userDetail.displayName}
              </div>
              <div className="grey-text f-10">
                {item.role == "qa"? "QA Resource": "Dev Resource"}
              </div>
          </td>
          <td>
              <div className="d-flex">
                 {item.buffer >0?  item.buffer+"%":"-"}
              </div>
            </td>
          <td>
              <div className="d-flex">
                {item.leave >0?  item.leave:"-"}
              </div>
            </td>
          <td>
              <div className="d-flex">
                {Number(item.meetings) >0?  item.meetings:"-"}
              </div>
            </td>

          <td>
              <div className="d-flex">
                {item.buffer > 0 && item.buffer < 100?
                 ( ( (totalSprintHrsFoeEachuser - ((Number(item.leave)  + Number(item.meetings)) * sprintSettings.perDay)) - (totalSprintHrsFoeEachuser - ((Number(item.leave)  + Number(item.meetings)) * sprintSettings.perDay))*(item.buffer/100) )  ).toFixed(2) +" hrs"   : item.buffer >= 100 || item.buffer < 0 ? "-": null
                } 
              </div>
            </td>
          <td>{item.allocatedHrs === 0?"-":item.allocatedHrs+" hrs"} </td>
          <td style={{width:75}}>
            {item.buffer >= 100?
              <div className="progress">
                        <div className= {`determinate teal} `} style={{width: 0+'%'}}>
                        </div>
                </div>
              :
              <div>
                    <div className="f-10">{ ((totalSprintHrsFoeEachuser - (totalSprintHrsFoeEachuser)*(item.buffer/100)) - 
(((Number(item.leave)  + Number(item.meetings)) * sprintSettings.perDay) - (  ((Number(item.leave)  + Number(item.meetings)) * sprintSettings.perDay) * (item.buffer/100))) - 
                    ((item.allocatedHrs).toFixed(2)) ).toFixed(2) } hrs</div>

                    <div>{}</div>

                    {
                      <div className="progress">
                        <div className= {`determinate ${(item.allocatedHrs / ( (totalSprintHrsFoeEachuser - (totalSprintHrsFoeEachuser)*(item.buffer/100)) - 
(((Number(item.leave)  + Number(item.meetings)) * sprintSettings.perDay) - (  ((Number(item.leave)  + Number(item.meetings)) * sprintSettings.perDay) * (item.buffer/100)))  )).toFixed(2)*100 > 100?"orange": "teal"} `} style={{width:  (item.allocatedHrs / ( (totalSprintHrsFoeEachuser - (totalSprintHrsFoeEachuser)*(item.buffer/100)) - 
(((Number(item.leave)  + Number(item.meetings)) * sprintSettings.perDay) - (  ((Number(item.leave)  + Number(item.meetings)) * sprintSettings.perDay) * (item.buffer/100))) )).toFixed(2)*100 > 0? (item.allocatedHrs / ( (totalSprintHrsFoeEachuser - (totalSprintHrsFoeEachuser)*(item.buffer/100)) - 
(((Number(item.leave)  + Number(item.meetings)) * sprintSettings.perDay) - (  ((Number(item.leave)  + Number(item.meetings)) * sprintSettings.perDay) * (item.buffer/100)))  )).toFixed(2)*100+'%' :  0+'%'}}></div>
                    </div>
                  }
              </div>
            }
              
            </td>
        </tr>
      )
    )
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

  const renderRows=()=>{

    var listValues = {}

    switch(selectedDropdown) {
      case "ALL":
        listValues = allJiraData
        break;
      case "SPILLOVERS":
        listValues =  allJiraData.filter(x=>x.category === "SPILLOVERS")
        break;
      case "TECH TASKS":
        listValues = allJiraData.filter(x=>x.category === "TECH TASKS")
        break;
      case "BUSINESS":
        listValues = allJiraData.filter(x=>x.category === "BUSINESS")
        break;
      case "QA AUTOMATION":
        listValues = allJiraData.filter(x=>x.category === "QA AUTOMATION")
        break; 
      default:
        
    }


  
    return(
      listValues.map((item, index) =>
          <tr key={index}>
            <td className="hand" onClick={()=>{openJiraDetails(item, item.category)}}>
              <div className="d-flex" style={{width:135}}>
                  <img src={item.fields.issuetype.iconUrl} alt="icon" className="p-10-right"/>
                  <div>
                    {item.key}
                 </div>
                  {item.comment.length> 0?
                   <i className="material-icons teal-text rotate-180 f-14 m-left-10">comment</i>
                   : null
                  }

                 
              </div>
            </td>
            <td className="hand" onClick={()=>{openJiraDetails(item, item.category)}}>
                <div>
                  {item.fields.summary}
                </div>
                <div className="d-flex a-center "   style={{marginTop:5}}>
                  <div>
                      {colorbadge(item.category)}
                  </div>
                  {item.fields.labels.length>0?
                  <div className="grey-text text-lighten-1" style={{paddingLeft:10, paddingRight:10}}>|</div>
                  :null 
                  }
                  <div className="wrapLabel">{badges(item.fields.labels)}</div>
                </div>

                <div className="m-top-10 grey-text f-10">{item.fields.assignee !== null? item.fields.assignee.displayName : "Not Assigned"  } {item.fields[projectSettings.qa_user_field] !== null? ` | ${item.fields[projectSettings.qa_user_field].displayName}`: null}</div>


                <div className="f-10 grey-text m-top-10">{(item.fields.aggregatetimespent/3600).toFixed(2)}hrs/{(item.fields.aggregatetimeoriginalestimate/3600).toFixed(2)}hrs</div>

                  {item.fields.aggregatetimeoriginalestimate == 0?null:
                  <div className="progress" style={{width:'50%'}}>
                    <div class={`determinate ${ (item.fields.aggregatetimespent/item.fields.aggregatetimeoriginalestimate) >1? "orange":"teal" }`} style={{width: (item.fields.aggregatetimespent/item.fields.aggregatetimeoriginalestimate)*100+"%"}}>
                    </div>
                  </div>
                  }
            </td>
            <td className="">
              <div className="d-flex">
                {item.category === "SPILLOVERS" || !item.qaEnabled || !item.devEnabled?
                  <div className=""><s>{item.fields.aggregatetimeoriginalestimate == 0? "-": item.fields.aggregatetimeoriginalestimate/3600}</s>
                  </div>
                  :
                  <div className="f-bold">{item.fields.aggregatetimeoriginalestimate == 0? "-": item.fields.aggregatetimeoriginalestimate/3600}
                  </div>
                }
                <div className="p-left-5">
                  {item.category === "SPILLOVERS" || !item.qaEnabled || !item.devEnabled?<s>hrs</s>:<div>hrs</div>}
                  
                </div>
              </div>

              {item.category === "SPILLOVERS"?
                <div className="d-flex">
                  <div className="f-bold">
                    {Number(item.remainingDevHr) + Number(item.remainingQaHr)}
                  </div>
                  <div className="p-left-5">hrs</div>
                </div>
                :
                !item.qaEnabled?
                <div className="d-flex">
                  <div className="f-bold">
                    {Number(item.fields[projectSettings.dev_hr_key])}
                  </div>
                  <div className="p-left-5">hrs</div>
                </div>
                :
                !item.devEnabled?
                <div className="d-flex">
                  <div className="f-bold">
                    {Number(item.fields[projectSettings.qa_hr_key])}
                  </div>
                  <div className="p-left-5">hrs</div>
                </div> 
                :
                null
              }

              
              
            </td>
            <td style={{width:70}} className="center-align">
              {item.category === "SPILLOVERS"?
              <div>
                <div className="d-flex j-center grey-text">
                <s className="p-right-5">{item.fields[projectSettings.dev_hr_key] !== null? item.fields[projectSettings.dev_hr_key]:0}</s> | <s className="p-left-5">{item.fields[projectSettings.qa_hr_key] !== null? item.fields[projectSettings.qa_hr_key]:0}
                </s>
                </div>
                <div className="m-top-10">
                  <div className="d-flex j-center">
                    <div className="p-right-5">{ item.remainingDevHr }</div>
                    |
                    <div className="p-left-5">{item.remainingQaHr}</div>
                  </div>
                </div>

              </div>
              :
            <div>
              {item.fields.aggregatetimeoriginalestimate == 0?"-":
              <div className="d-flex j-center">
                <div>
                  {item.fields[projectSettings.dev_hr_key] !== null?
                    <div>
                      {item.devEnabled?
                        <div className="p-right-5">{item.fields[projectSettings.dev_hr_key]}</div>
                        :
                        <s className="p-right-5">{item.fields[projectSettings.dev_hr_key]} </s>
                      }
                    </div>
                    :null
                  }
                </div>

                <div>
                  |
                </div>

                <div>
                  {item.fields[projectSettings.qa_hr_key] !== null?
                    <div>
                      {item.qaEnabled?
                        <div className="p-left-5">{item.fields[projectSettings.qa_hr_key]}</div>
                        :
                        <s className="p-left-5">{item.fields[projectSettings.qa_hr_key]}</s>
                      }
                    </div>
                    :null
                  }
                </div>
              </div>
              }
              </div>
              }
            </td>
            <td>
              {sprintSettings.isFreez?null:
              <i className="teal-text material-icons p-right-5 text-lighten-2 hand"  onClick={()=>{onJiraRemoved(item)}} style={{fontSize:20}}>remove_circle_outline</i>
              }
            </td>
          </tr>
      )
  )}

  const ondropDownCLick=()=>{
    var elems = document.getElementById('dropdown1');
    var instance = M.Dropdown.init(elems, {});
    instance.open()
  }

  const openJiraDetails=(e, cat)=>{
    setSelectedJira(e)
    setSelectedJiraCategory(cat)
    var elems = document.getElementById('jiraDetailPopup');
    var instance = M.Modal.init(elems, {});
    instance.open()
  }

  const confirmationSprintPin=()=>{
    setIsEditEnabled(!isEditEnabled)
  }

  const onEdit=()=>{
    var elem = document.getElementById("SprintPinPopup")
    var instance = M.Modal.getInstance(elem)
    instance.open()
  }

  const openWorkLog=()=>{
    var elem = document.getElementById('workLog');
    var instance = M.Modal.getInstance(elem)
    instance.open()
  }

  const deleteSprint=()=>{
    var elem = document.getElementById("DeleteConfirmation")
    var instance = M.Modal.getInstance(elem)
    instance.open()
    
  }

  const onDeleteConfirmation=async()=>{
    var responseRecieved = await Method.deleteSprint(sprintSettingsRaw.id)
    if (responseRecieved.status) {
      localStorage.removeItem("project")
      localStorage.removeItem("sprints")
      localStorage.removeItem("selectedSprint")
      navigate('/')
    }
  }
  


  return (
    <div className="" id="dash">
      <nav className="p-fixed top-0 z-100">
        <div className="nav-wrapper white">
          <div className="d-flex j-between">
            <div className="d-flex">
              <a href="#">
                <img className="h-50p" src={logo} alt="Logo" style={{marginTop:7, padding:5, paddingLeft:20}}/>
              </a>

              <div className="teal-text text-lighten-1 p-left-5 f-17 hide-on-small-only"> | SPRINT DRAFT</div>

              <div className="d-flex m-bottom-20">
                <div className="black-text m-left-50 hide-on-small-only">{projectSettings.zs_project_name} > {sprintId} > {selectedTeam}</div>
                <div href="#selectSprintPopup" className="a-center black-text c-button d-flex j-center m-left-10 b-thin b-r-3 hand modal-trigger m-top-20"><i className="material-icons">swap_horiz</i></div>
              </div>

            </div>
          {saveLoader?
          <div className="preloader-wrapper small active" style={{marginTop:20, marginRight:30}}>
            <div className="spinner-layer spinner-green-only">
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div><div className="gap-patch">
                <div className="circle"></div>
              </div><div className="circle-clipper right">
                <div className="circle"></div>
              </div>
            </div>
          </div>
          :
          <div className="d-flex">
            {!fullSiteLoader && !isEditEnabled?
              <i className="material-icons orange-text p-20-right hand"  onClick={()=>{openReportModal()}} style={{fontSize:40, marginTop:2}}>picture_as_pdf</i>
              :null
            }
            {unsavedChanges?
              <div className="red-text m-right-10 d-flex">
                 <i className="material-icons " style={{marginRight:5, fontSize:14}}>warning</i>
                <div>UNSAVED CHANGES</div>
              </div>
              :null
            }
            {isEditEnabled?
            <div className="d-flex">
              
              
              <div className="d-flex">
                {sprintSettings.isFreez?null:
                  <div>
                    <a className="waves-effect waves-light btn m-right-10 m-left-10" onClick={()=>{onSave(sprintSettings)}}>Save</a>
                  </div>
                }

                <div>
                  {sprintSettings.isFreez?
                    <a className=" purple waves-effect waves-light btn m-right-10 m-left-10" onClick={()=>{ onUnFreeze() }}>Unfreez</a>
                    :
                    <a className=" orange waves-effect waves-light btn m-right-10 m-left-10" onClick={()=>{ openassignModelPoupup() }}>Freez</a>
                  }
                  
                </div>

                <div>
                  <a className="red b-r-3 btn m-right-10 waves-effect waves-light"  onClick={()=>{deleteSprint()}}>Delete</a>
                </div>

                <div>
                {unsavedChanges?null:
                  <a className="b-r-3 b-thin btn-flat m-right-10 waves-effect waves-light"  onClick={()=>{setIsEditEnabled(false)}}>Cancel</a>
                }

                
              </div>

              </div>
            </div>
            :
            <div>
              {!fullSiteLoader?
                <a className="waves-effect waves-light btn m-right-10"  onClick={()=>{onEdit()}}>edit</a>
                :null
              }
            </div>
            }
          </div>
          }

          </div>
          
        </div>
      </nav>

      
        <div className={`m-top-50 col s12 m6 l6 d-flex a-center j-center flex-column ${fullSiteLoader? "show": "hide"}`}>
              <div className="" style={{width:'50%'}}>
                      <Lottie
                      options={{
                        animationData: TableAnimation,
                        loop:true
                      }}
                    />
              </div>
              <h5>Loading please wait ...</h5>
            </div>
      
      
      <div className={`${fullSiteLoader? "hide m-top-50": "show row m-top-50"}`}>

        <div className="col s12 m12 l6 p-30">

          <div className="h-200p">
          <div className="row">
            
            <div className="col s12 m6 l6">
              <div className="grey-text">DEV</div>
              <div  style={{maxWidth:225}}>
                <div className="d-flex a-center p-10 grey lighten-3 b-r-3" >
                      <div>
                        <div className="a-center d-flex flex-column f-10">ALLOCATED</div>
                        <div className="d-flex j-center a-center teal f-bold white-text b-r-3" style={{height:30,width:60}}>{totalDevHrFromJira.toFixed(2)}</div>
                      </div>

                      <div className="a-center d-flex flex-column m-left-10 ">
                        <div className="f-10">AVAILABLE</div>
                        <div className="d-flex j-center a-center teal f-bold white-text b-r-3" style={{height:30,width:60}}>{totalDevResourceHr.toFixed(2)}</div>
                      </div>

                      <div className="a-center d-flex flex-column m-left-10 ">
                        <div className="f-10">REMAINING</div>
                        <div className="d-flex j-center a-center teal f-bold white-text b-r-3" style={{height:30,width:60}}>{(totalDevResourceHr -  totalDevHrFromJira - ((totalDevResourceHr - totalDevTechHrFromJira)*(Number(sprintSettings.sprintBuffer)/100) )).toFixed(2)}</div>
                      </div>
                </div>
                <div className="right-align  f-10 grey-text">Above stats are in hrs</div>
              </div>
            </div>

            <div  className="col  s12 m6 l6">
            <div className="grey-text">QA</div>
            <div  style={{maxWidth:225}}>
              <div className="d-flex a-center p-10 grey lighten-3 b-r-3">
                    <div>
                      <div className="a-center d-flex flex-column f-10">ALLOCATED</div>
                      <div className="d-flex j-center a-center teal f-bold white-text b-r-3" style={{height:30,width:60}}>{totalQAHrFromJira.toFixed(2)}</div>
                    </div>

                    <div className="a-center d-flex flex-column m-left-10">
                      <div className="f-10">AVAILABLE</div>
                      <div className="d-flex j-center a-center teal f-bold white-text b-r-3" style={{height:30,width:60}}>{totalQAResourceHr.toFixed(2)}</div>
                    </div>

                    <div className="a-center d-flex flex-column m-left-10">
                      <div className="f-10">REMAINING</div>
                      <div className="d-flex j-center a-center teal f-bold white-text b-r-3" style={{height:30,width:60}}>{(totalQAResourceHr -  totalQAHrFromJira - ((totalQAResourceHr - totalQATechHrFromJira)*(Number(sprintSettings.sprintBuffer)/100) )).toFixed(2)}</div>
                    </div>
              </div>
              <div className="right-align  f-10 grey-text">Above stats are in hrs</div>

            </div>
            </div>

          </div>

          <div className="row">
            <div className="col s12 m6 l6">
              <div className="grey-text">DEV TICKETS</div>
                <div  style={{maxWidth:225}}>
                  <div className="d-flex a-center p-10 grey lighten-3 b-r-3">
                        <div>
                          <div className="a-center d-flex flex-column f-10">TECH</div>
                          <div className="d-flex j-center a-center white f-bold black-text b-r-3 b-thin" style={{height:30,width:60}}>{totalDevTechHrFromJira.toFixed(2)}</div>
                        </div>

                        <div className="a-center d-flex flex-column m-left-10">
                          <div className="f-10">BUSINESS</div>
                          <div className="d-flex j-center a-center white f-bold black-text b-r-3 b-thin" style={{height:30,width:60}}>{totalDevBusinessHrFromJira.toFixed(2)}</div>
                        </div>

                        <div className="a-center d-flex flex-column m-left-10">
                          <div className="f-10">SPILLOVER</div>
                          <div className="d-flex j-center a-center white f-bold black-text b-r-3 b-thin" style={{height:30,width:60}}>{totalDevSpilloverHrFromJira.toFixed(2)}</div>
                        </div>
                  </div>
                  <div className="right-align  f-10 grey-text">Above stats are in hrs</div>
              </div>

            </div>

             <div className="col s12 m6 l6">
              <div className="grey-text">QA TICKETS</div>
                <div  style={{maxWidth:225}}>
                  <div className="d-flex a-center p-10 grey lighten-3 b-r-3">
                        <div>
                          <div className="a-center d-flex flex-column f-10">TECH</div>
                          <div className="d-flex j-center a-center white f-bold black-text b-r-3 b-thin" style={{height:30,width:60}}>{totalQATechHrFromJira.toFixed(2)}</div>
                        </div>

                        <div className="a-center d-flex flex-column m-left-10">
                          <div className="f-10">BUSINESS</div>
                          <div className="d-flex j-center a-center white f-bold black-text b-r-3 b-thin" style={{height:30,width:60}}>{totalQABusinessHrFromJira.toFixed(2)}</div>
                        </div>

                        <div className="a-center d-flex flex-column m-left-10">
                          <div className="f-10">SPILLOVER</div>
                          <div className="d-flex j-center a-center white f-bold black-text b-r-3 b-thin" style={{height:30,width:60}}>{totalQASpilloverHrFromJira.toFixed(2)}</div>
                        </div>
                  </div>
                  <div className="right-align  f-10 grey-text">Above stats are in hrs</div>
              </div>

            </div>
             
           </div>

          </div>

          <h5 className="grey-text text-lighten-1 m-top-30">JIRA TICKETS</h5>
          {/*Tickets list*/}
          <div>
          <table className="">
            <thead>
              <tr>
                  <th>
                    <a className='dropdown-trigger btn-flat' href='#' data-target='dropdown1' style={{width:125}}>{selectedDropdown.length > 7? selectedDropdown.substring(0, 7)+"..":selectedDropdown} <i className="material-icons">arrow_drop_down</i></a>
                      <ul id='dropdown1' className='dropdown-content'>
                        <li onClick={()=>{onDropdownSelect('ALL')}}><a href="#!">ALL</a></li>
                        <li onClick={()=>{onDropdownSelect('SPILLOVERS')}}><a href="#!">SPILLOVERS</a></li>
                        <li onClick={()=>{onDropdownSelect('TECH TASKS')}}><a href="#!">TECH TASKS</a></li>
                        <li onClick={()=>{onDropdownSelect('BUSINESS')}}><a href="#!">BUSINESS</a></li>
                        <li className="divider" tabIndex="-1"></li>
                        <li onClick={()=>{onDropdownSelect('QA AUTOMATION')}}><a href="#!">QA AUTOMATION</a></li>
                      </ul>

                  </th>
                  <th>Description</th>
                  <th>HRS</th>
                  <th>DEV | QA</th>
                  <th>
                    {isEditEnabled && !sprintSettings.isFreez ?
                    <div>
                      {loader?
                      <div className="preloader-wrapper small active">
                        <div className="spinner-layer spinner-green-only">
                          <div className="circle-clipper left">
                            <div className="circle"></div>
                          </div><div className="gap-patch">
                            <div className="circle"></div>
                          </div><div className="circle-clipper right">
                            <div className="circle"></div>
                          </div>
                        </div>
                      </div>
                      :
                      <a href="#jiraConfigModal" className="d-flex j-center a-center teal lighten-2 f-bold white-text b-r-3 modal-trigger" style={{height:30,width:30}}> <i className="material-icons white-text" style={{fontSize:14}}>edit</i></a>
                      }
                    </div>
                    :null
                    }
                  </th>
              </tr>
            </thead>

            <tbody>
              {renderRows()}
            </tbody>
          </table>
          </div>
          {/*Tickets list end*/}

          
        </div>

        <div className="col s12 m12 l6 p-30">
          <div className="h-200p">
            
            <div className="d-flex j-end">
              <div>
                <div className="d-flex j-between a-end">
                  <div className="grey-text">SPRINT</div>
                 
                </div>
                <div className="d-flex a-center p-10 grey lighten-3 b-r-3">
                  <div>
                    <div className="a-center d-flex flex-column f-10">DAYS</div>
                    <div className="d-flex j-center a-center teal f-bold white-text b-r-3" style={{height:30,width:30}}>{sprintSettings.days}</div>
                  </div>

                  <div className="a-center d-flex flex-column m-left-10  f-10">
                    <div>HR/DAY</div>
                    <div className="d-flex j-center a-center teal f-bold white-text b-r-3" style={{height:30,width:30}}>{sprintSettings.perDay}</div>
                  </div>

                  <div className="a-center d-flex flex-column m-left-10  f-10">
                    <div>HOLIDAYS</div>
                    <div className="d-flex j-center a-center teal f-bold white-text b-r-3" style={{height:30,width:30}}>{sprintSettings.holiday}</div>
                  </div>

                  <div className="a-center d-flex flex-column m-left-10  f-10 ">
                    <div>BUFFER</div>
                    <div className="d-flex j-center a-center teal f-bold white-text b-r-3" style={{height:30,width:30}}>{sprintSettings.sprintBuffer}</div>
                  </div>

                  {isEditEnabled && !sprintSettings.isFreez?
                  <div className="a-center d-flex flex-column m-left-10 hand f-10 " onClick={()=>{openSprintSetting()}}>
                    <div style={{color:'transparent'}}>BUFFER</div>
                    <div className="d-flex j-center a-center white lighten-2 f-bold white-text b-r-3" style={{height:30,width:30}}> <i className="material-icons teal-text" style={{fontSize:14}}>edit</i></div>
                  </div>
                  :null
                  }

                </div>
                <div className="right-align f-10">{totalSprintHrsFoeEachuser}hr per user</div>
                 {sprintSettings.isFreez?
                    <div className="right-align f-10">{sprintSettings.selectedSprint.name}</div>
                    :
                    null
                  }
              </div>
            </div>


          </div>

          <div>
            <h5 className="grey-text text-lighten-1 m-top-30">RESOURCE ALLOCATION</h5>
            <div/>
          </div>
           {/*Users list*/}
          <div>
          <table className="m-top-20">
            <thead>
              <tr>
                  <th>User</th>
                  <th>Buffer</th>
                  <th>Leave</th>
                  <th>
                    <div>Reserved</div>
                    <div className="f-10 grey-text lighten-3 f-normal">Meetings | Training | Scrum</div>
                  </th>
                  <th>AVAILABLE</th>
                  <th>ASSIGNED</th>
                  <th className="d-flex j-end">
                    {isEditEnabled && !sprintSettings.isFreez?
                    <a href="#selectusers" className="d-flex j-center a-center teal lighten-2 f-bold white-text b-r-3 modal-trigger" style={{height:30,width:30}}> <i className="material-icons white-text" style={{fontSize:14}}>edit</i></a>
                    :null
                    }
                  </th>

              </tr>
            </thead>

            <tbody>
              {renderUsersRows()}
            </tbody>
          </table>
          </div>
          {/*Users list end*/}


        </div>

      </div>
      
      

      
      <UserList userlistFromModal={userlistFromModal}/>
      <EditUserData selectedUserForEdit={selectedUserForEdit} onUserDataSave={onUserDataSave} onUserRemoved={onUserRemoved} isFreez={sprintSettings.isFreez}/>
      <EditSprintSetting updateSprintConfig={updateSprintConfig} sprintSettings={sprintSettings}/>
      <JiraConfigureModal onSaveFromModalSetData={onSaveFromModalSetData } />

      <SelectSprintPopup projectId={projectId} sprintList={sprintList} onProceedToDashboard={onProceedToDashboard}   isheaderVisible={false} label={"Change"}/>

      <NewSprintModal projectId={projectId} onNewSprintAdded={onNewSprintAdded} selectedTeam={selectedTeam} teamList={teamList} page={'dashboard'}/>

      <DuplicateSprint  sprintId={sprintId} projectId={projectId} sprintSettings={sprintSettings}  selectedUsers={selectedUsers} selectedTeam={selectedTeam} sprintList={sprintList} allJiraData={allJiraData} onNewSprintAdded={onNewSprintAdded} />
      <JiraDetailPopup selectedJira={selectedJira} selectedJiraCategory={selectedJiraCategory} projectSettings={projectSettings} onSaveSpillover={onSaveSpillover} isEditEnabled={isEditEnabled} onSaveNonSpillover={onSaveNonSpillover} isFreez={sprintSettings.isFreez} openWorkLog={openWorkLog}/>

      <SprintPinPopup  confirmationSprintPin={confirmationSprintPin} selectedProject={projectSettings}/>

      <AssignSprint onFreeze={onFreeze} loader={assignSprintLoader} assignSprintPercent={assignSprintPercent} projectSettings={projectSettings}/>

      <WorkLogPopup selectedJira={selectedJira} selectedUsers={selectedUsers}/>

      <SprintReport selectedUsers={selectedUsers} totalSprintHrsFoeEachuser={totalSprintHrsFoeEachuser} sprintSettings={sprintSettings} projectSettings={projectSettings} totalDevHrFromJira={totalDevHrFromJira} totalDevResourceHr={totalDevResourceHr} totalDevTechHrFromJira={totalDevTechHrFromJira} totalQAResourceHr={totalQAResourceHr} totalDevBusinessHrFromJira={totalDevBusinessHrFromJira} totalDevSpilloverHrFromJira={totalDevSpilloverHrFromJira} totalQAHrFromJira={totalQAHrFromJira} totalQATechHrFromJira={totalQATechHrFromJira} totalQABusinessHrFromJira={totalQABusinessHrFromJira} totalQASpilloverHrFromJira={totalQASpilloverHrFromJira}
        sprintId={sprintId}
      />

      <DeleteConfirmation onDeleteConfirmation={onDeleteConfirmation}/>
    </div>
  );
}

export default Dashboard;