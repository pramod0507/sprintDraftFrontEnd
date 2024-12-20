const user =  "pramod.g.kumar@zs.com"
const pass = ""


// get jira ticket details
export const getJiraTicketsDetails=async(list)=>{
	var result= {data:{}, status: false }
  var userName = user;
  var passWord = pass;

    var jqlQuery = 'project = EDGE AND id IN ('+list+') ORDER BY created DESC'.replaceAll(' ','%20').replaceAll('"','%22')

    var token = "Basic " + btoa(userName + ":" + passWord)

      var result = {data:{}, status: false }  
      await fetch("jiraQueryCount/"+token+":"+jqlQuery, 
        {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'User-Agent': 'PostmanRuntime/7.32.3'
          }
        })
        .then((response) => response.json())
        .then((responseJson) =>{
          result.data = responseJson.issues
          result.status = true
        })
        .catch(error => {
          console.log(error)
          result.status = false
        })

        return result
  }


  // get all users list
export const getAllUsersOfProject=async(projectID)=>{
  var result= {data:{}, status: false }
  var userName = user;
  var passWord = pass;

    var jqlQuery = 'project='+projectID+'&maxResults=1000' 

    var token = "Basic " + btoa(userName + ":" + passWord)

      var result = {data:{}, status: false }  
      await fetch("jiraUserList/"+token+":"+jqlQuery, 
        {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'User-Agent': 'PostmanRuntime/7.32.3'
          }
        })
        .then((response) => response.json())
        .then((responseJson) =>{
          result.data = responseJson
          result.status = true
        })
        .catch(error => {
          console.log(error)
          result.status = false
        })

        return result
  }



//get sprint data
  export const getSprintData=async(projectID, sprintId, team)=>{

      var result = {data:{}, status: false }  
      await fetch("/sprint?sprintId="+sprintId+"&projectId="+projectID+"&team="+team, 
        {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'User-Agent': 'PostmanRuntime/7.32.3'
          }
        })
        .then((response) => response.json())
        .then((responseJson) =>{
          result.data = responseJson
          result.status = true
        })
        .catch(error => {
          console.log(error)
          result.status = false
        })

        return result
  }

  //create Sprint
  export const creatSprintData=async(sprintName, projectId, sprintSettings, sprintUsers, team, jiraTickets)=>{
    const data = {
    "sprintId":sprintName,
    "projectId": projectId,
    "sprintSettings": JSON.stringify(sprintSettings),
    "sprintUsers":JSON.stringify(sprintUsers), 
    "sprintTickets":JSON.stringify(jiraTickets),
    "team":team
}

      var result = {data:{}, status: false }  
      await fetch("/sprint", 
        {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'User-Agent': 'PostmanRuntime/7.32.3'
          },
          body: JSON.stringify(data) 
        })
        .then((response) => response.json())
        .then((responseJson) =>{
          result.data = responseJson
          result.status = true
        })
        .catch(error => {
          console.log(error)
          result.status = false
        })

        return result
  }


  //update Sprint
  export const updateSprintData=async(id, sprintId, projectId, sprintSettings, sprintUsers, sprintTickets, team)=>{

    const data = {
    "sprintId":sprintId,
    "projectId": projectId,
    "sprintSettings": JSON.stringify(sprintSettings),
    "sprintUsers":JSON.stringify(sprintUsers), 
    "sprintTickets":JSON.stringify(sprintTickets),
    "team": team
    }

      var result = {data:{}, status: false }  
      await fetch("/sprint:"+id, 
        {
          method: "PUT",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'User-Agent': 'PostmanRuntime/7.32.3'
          },
          body: JSON.stringify(data) 
        })
        .then((response) => response.json())
        .then((responseJson) =>{
          result.data = responseJson
          result.status = true
        })
        .catch(error => {
          console.log(error)
          result.status = false
        })
        return result
  }


  //get Sprint list
  export const getSprintList=async(projectId)=>{
    const data = {
    "projectId": projectId
    }

      var result = {data:{}, status: false }  
      await fetch("/sprintList?id="+projectId, 
        {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'User-Agent': 'PostmanRuntime/7.32.3'
          }
        })
        .then((response) => response.json())
        .then((responseJson) =>{
          result.data = responseJson
          result.status = true
        })
        .catch(error => {
          console.log(error)
          result.status = false
        })
        return result
  }


  //check project available
  export const getProjectList=async(projectId)=>{
    const data = {
    "projectId": projectId
    }

      var result = {data:{}, status: false }  
      await fetch("/projectList?id="+projectId, 
        {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'User-Agent': 'PostmanRuntime/7.32.3'
          }
        })
        .then((response) => response.json())
        .then((responseJson) =>{
          result.data = responseJson
          result.status = true
        })
        .catch(error => {
          console.log(error)
          result.status = false
        })
        return result
  }


  //check sprint available
  export const getSprintAvailibility=async(sprintId, team)=>{


      var result = {data:{}, status: false }  
      await fetch("/sprintExists?id="+sprintId+"&team="+team, 
        {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'User-Agent': 'PostmanRuntime/7.32.3'
          }
        })
        .then((response) => response.json())
        .then((responseJson) =>{
          result.data = responseJson
          result.status = true
        })
        .catch(error => {
          console.log(error)
          result.status = false
        })
        return result
  }


  //check project settings
  export const getProjectSettings=async(projectId)=>{
      var result = {data:{}, status: false }  
      await fetch("/settings?projectId="+projectId, 
        {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'User-Agent': 'PostmanRuntime/7.32.3'
          }
        })
        .then((response) => response.json())
        .then((responseJson) =>{
          result.data = responseJson
          result.status = true
        })
        .catch(error => {
          console.log(error)
          result.status = false
        })
        return result
  }


   //update Settings
  export const updateSettingsData=async(id, projectId, zsProjectId, projectSettings, qaHrKey, devHrKey, qaUserField)=>{

    const data = {
    "projectId":"15360",
    "zsProjectId":"9904PD0071", 
    "projectSettings":JSON.stringify({teams:['Team A','Team B','Team C']}), 
    "qaHrKey":"customfield_13532",
    "devHrKey":"customfield_13531",
    "qaUserField":"customfield_10061"
    }

      var result = {data:{}, status: false }  
      await fetch("/settings?id="+2, 
        {
          method: "PUT",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'User-Agent': 'PostmanRuntime/7.32.3'
          },
          body: JSON.stringify(data) 
        })
        .then((response) => response.json())
        .then((responseJson) =>{
          result.data = responseJson
          result.status = true
        })
        .catch(error => {
          console.log(error)
          result.status = false
        })
        return result
  }


  //create Settings
  export const addNewSettingsData=async(projectId, zsProjectId, projectSettings, qaHrKey, devHrKey, qaUserField, projectName, pin, sprintKey)=>{

    const data = 
    {"projectId":projectId,
    "zsProjectId": zsProjectId,
    "projectSettings": projectSettings,
    "zsProjectName":projectName,
    "qaHrKey":qaHrKey, 
    "devHrKey":devHrKey,
    "qaUserField":qaUserField,
    "zsPassKey":window.btoa(pin),
    "zsSprintKey": sprintKey
    }
      var result = {data:{}, status: false }  
      await fetch("/settings", 
        {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'User-Agent': 'PostmanRuntime/7.32.3'
          },
          body: JSON.stringify(data) 
        })
        .then((response) => response.json())
        .then((responseJson) =>{
          result.data = responseJson
          result.status = true
        })
        .catch(error => {
          console.log(error)
          result.status = false
        })
        return result
  }


  //edit Settings
  export const editNewSettingsData=async(projectId, zsProjectId, projectSettings, qaHrKey, devHrKey, qaUserField, projectName, pin, id, sprintKey)=>{

    const data = 
      {"projectId":projectId,
      "zsProjectId": zsProjectId,
      "projectSettings": projectSettings,
      "zsProjectName":projectName,
      "qaHrKey":qaHrKey, 
      "devHrKey":devHrKey,
      "qaUserField":qaUserField,
      "zsPassKey":window.btoa(pin),
      "zsSprintKey": sprintKey
      }
      var result = {data:{}, status: false }  
      await fetch("/settings?id="+id, 
        {
          method: "PUT",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'User-Agent': 'PostmanRuntime/7.32.3'
          },
          body: JSON.stringify(data) 
        })
        .then((response) => response.json())
        .then((responseJson) =>{
          result.data = responseJson
          result.status = true
        })
        .catch(error => {
          console.log(error)
          result.status = false
        })
        return result
  }


//get all projects list
  export const getProjectAllAvailable=async()=>{
    
      var result = {data:{}, status: false }  
      await fetch("/allSettings", 
        {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'User-Agent': 'PostmanRuntime/7.32.3'
          }
        })
        .then((response) => response.json())
        .then((responseJson) =>{
          result.data = responseJson
          result.status = true
        })
        .catch(error => {
          console.log(error)
          result.status = false
        })
        return result
  }

//delete project
  export const deleteProject=async(id)=>{
    
      var result = {data:{}, status: false }  
      await fetch("/settings?id="+id, 
        {
          method: "DELETE",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'User-Agent': 'PostmanRuntime/7.32.3'
          }
        })
        .then((response) => response.json())
        .then((responseJson) =>{
          result.status = true
        })
        .catch(error => {
          console.log(error)
          result.status = false
        })
        return result
  }


  //authenticate sprint edit
  export const confirmSprintEdit=async(id, pass)=>{
      var passEncoded = window.btoa(pass)
      var result = {data:{}, status: false }  
      await fetch("/settings/sprint/auth?id="+id+"&pass="+passEncoded, 
        {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'User-Agent': 'PostmanRuntime/7.32.3'
          }
        })
        .then((response) => response.json())
        .then((responseJson) =>{
          if(responseJson.status === 200){
            result.status = true
          }
          
        })
        .catch(error => {
          console.log(error)
          result.status = false
        })
        return result
  }

  // get project sprint list
export const getProjectSprintList=async(projectId)=>{
  var result= {data:{}, status: false }
  var userName = user;
  var passWord = pass;

  var token = "Basic " + btoa(userName + ":" + passWord)

      var result = {data:{}, status: false }  
      await fetch("/projectSprintList/"+token+":"+Number(projectId), 
        {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'User-Agent': 'PostmanRuntime/7.32.3'
          }
        })
        .then((response) => response.json())
        .then((responseJson) =>{
          result.data = responseJson.sprints
          result.status = true
        })
        .catch(error => {
          result.status = false
        })

        return result
  }


// Assign sprint to jira ID
export const assignSprintToJiraID=async(jiraID, customField, sprintId, category, spillHours)=>{
  var result= {data:{}, status: false }
  var userName = user;
  var passWord = pass;

  var token = "Basic " + btoa(userName + ":" + passWord)

      var result = {data:{}, status: false }  
      await fetch("/assignSprint/"+token+":"+jiraID+":"+customField+":"+sprintId+":"+category+":"+spillHours, 
        {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'User-Agent': 'PostmanRuntime/7.32.3'
          }
        })
        .then((response) => response.json())
        .then((responseJson) =>{
          result.data = responseJson.sprints
          result.status = true
        })
        .catch(error => {
          result.status = false
        })

        return result
  }


  // get Work log
export const workLogOfJiraID=async(jiraID)=>{
  var result= {data:{}, status: false }
  var userName = user;
  var passWord = pass;

  var token = "Basic " + btoa(userName + ":" + passWord)

      var result = {data:{}, status: false }  
      await fetch("/worklog/"+token+":"+jiraID, 
        {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'User-Agent': 'PostmanRuntime/7.32.3'
          }
        })
        .then((response) => response.json())
        .then((responseJson) =>{
          result.data = responseJson.worklogs
          result.status = true
        })
        .catch(error => {
          result.status = false
        })

        return result
  }