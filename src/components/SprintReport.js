import React, { useState, useEffect, useRef } from 'react';

import Lottie from 'lottie-react-web';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import M from "materialize-css/dist/js/materialize.min.js";
import * as Method from '../common/Methods.js';
import jsPDF from 'jspdf';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale,
  BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.piecelabel.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
// ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale,
  BarElement,);


const screenHeight = window.innerHeight


const SprintReport=(props)=> {
  
  const [list, setlist] = useState([])
  const [rawList, setRawList] = useState([])
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedSprint, setSelectedSprint] = useState({})
  const [dataSetForAllocation, setDataSetForAllocation] = useState([0,0,0]);
  const [dataSetForDevAllocation, setDataSetForDevAllocation] = useState([0,0,0]);
  const [dataSetForQaAllocation, setDataSetForQaAllocation] = useState([0,0,0]);
  const reportTemplateRef = useRef(null);

  useEffect(() => {
      addDataForGraph()
      
  },[props.totalDevBusinessHrFromJira])

  const addDataForGraph = ()=>{
    var tempAllocation = []
    tempAllocation.push(props.totalDevBusinessHrFromJira + props.totalQABusinessHrFromJira)
    tempAllocation.push(props.totalDevTechHrFromJira + props.totalQATechHrFromJira)
    tempAllocation.push(props.totalDevSpilloverHrFromJira + props.totalQASpilloverHrFromJira)
    setDataSetForAllocation(tempAllocation)

    var tempDevAllocation = []
    tempDevAllocation.push(props.totalDevHrFromJira)
    tempDevAllocation.push(props.totalDevResourceHr)
    tempDevAllocation.push((props.totalDevResourceHr -  props.totalDevHrFromJira - ((props.totalDevResourceHr - props.totalDevTechHrFromJira)*(Number(props.sprintSettings.sprintBuffer)/100) )).toFixed(2))
    setDataSetForDevAllocation(tempDevAllocation)


    var tempQaAllocation = []
    tempQaAllocation.push(props.totalQAHrFromJira)
    tempQaAllocation.push(props.totalQAResourceHr)
    tempQaAllocation.push(props.totalQAResourceHr -  props.totalQAHrFromJira - ((props.totalQAResourceHr - props.totalQATechHrFromJira)*(Number(props.sprintSettings.sprintBuffer)/100) )).toFixed(2)
    setDataSetForQaAllocation(tempQaAllocation)

  }

  const data = {
    datasets: [
      {
        data: dataSetForAllocation,
        backgroundColor: [
          'rgba(66, 135, 245,0.5)', //blue
          'rgba(250, 52, 118,0.5)', //orange
          'rgba(24, 186, 113,0.5)', //green
        ],
        borderColor: [
          'transparent',
          'transparent',
          'transparent'
        ],
        borderWidth: 1,
      },

    ]
  }


  const dataDevAllocation = {
    datasets: [
      {
        data: dataSetForDevAllocation,
        backgroundColor: [
          'rgba(66, 135, 245,0.5)', //blue
          'rgba(250, 52, 118,0.5)', //orange
          'rgba(24, 186, 113,0.5)', //green
        ],
        borderColor: [
          'transparent',
          'transparent',
          'transparent'
        ],
        borderWidth: 1,
      },

    ]
  }


  const dataQaAllocation = {
    datasets: [
      {
        data: dataSetForQaAllocation,
        backgroundColor: [
          'rgba(66, 135, 245,0.5)', //blue
          'rgba(250, 52, 118,0.5)', //orange
          'rgba(24, 186, 113,0.5)', //green
        ],
        borderColor: [
          'transparent',
          'transparent',
          'transparent'
        ],
        borderWidth: 1,
      },

    ]
  }




  const renderUsersRows=()=>{
    return(
      props.selectedUsers.map((item, index) =>
        <tr key={index}>
          <td>
              <div className="d-flex">
                 {item.userDetail.displayName}
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
                 ( ( (props.totalSprintHrsFoeEachuser - ((Number(item.leave)  + Number(item.meetings)) * props.sprintSettings.perDay)) - (props.totalSprintHrsFoeEachuser - ((Number(item.leave)  + Number(item.meetings)) * props.sprintSettings.perDay))*(item.buffer/100) )  ).toFixed(2)   : item.buffer >= 100 || item.buffer < 0 ? "-": null
                } hrs
              </div>
            </td>
          <td>{item.allocatedHrs === 0?"-":item.allocatedHrs}  {item.allocatedHrs >0?"hrs":null}</td>
          <td style={{}}>
            {item.buffer >= 100?
              <div>
                        <div>- </div>
                </div>
              :
              <div>
                <div className="">{ (( (props.totalSprintHrsFoeEachuser - (props.totalSprintHrsFoeEachuser)*(item.buffer/100)) - ((Number(item.leave)  + Number(item.meetings)) * props.sprintSettings.perDay) ).toFixed(2) - (item.allocatedHrs).toFixed(2)).toFixed(2)  } hrs</div>

              </div>
            }
              
            </td>
        </tr>
      )
    )
  }

const plugin = {
    beforeDraw: (chart, args, options) => {
      const {ctx} = chart;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, chart.width+10, chart.height+10);
      ctx.restore();
    },
      datalabels: {
        display: true,
        color: 'white'
   },
   ChartDataLabels
}

  useEffect(() => {

  },[])

  const handleGeneratePdf = () => {
    


    const doc = new jsPDF("p","px",[reportTemplateRef.current.offsetWidth,Number(reportTemplateRef.current.offsetWidth)*3]);

    // Adding the fonts.
    doc.setFont('Inter-Regular', 'normal');
    doc.internal.write(0, "Tw")

    doc.html(reportTemplateRef.current, {
      async callback(doc) {
        await doc.save('document');
      },
    });
  };

  

  return (
      <div id="reportModal" class="modal modal-fixed-footer">
        <div class="modal-content white" ref={reportTemplateRef} style={{letterSpacing: 0.02, padding:20}}>

        <div className="d-flex j-between">
              <div className="">
                <h5 className="">{props.projectSettings.zs_project_name}</h5>
                <div className="f-14">{props.sprintId}</div>
              </div>
              <div className="d-flex a-center p-10 grey lighten-3 b-r-3">
                  <div>
                    <div className="a-center d-flex flex-column f-10">DAYS</div>
                    <div className="d-flex j-center a-center teal f-bold white-text b-r-3" style={{height:30,width:30}}>{props.sprintSettings.days}</div>
                  </div>

                  <div className="a-center d-flex flex-column m-left-10  f-10">
                    <div>HR/DAY</div>
                    <div className="d-flex j-center a-center teal f-bold white-text b-r-3" style={{height:30,width:30}}>{props.sprintSettings.perDay}</div>
                  </div>

                  <div className="a-center d-flex flex-column m-left-10  f-10">
                    <div>HOLIDAYS</div>
                    <div className="d-flex j-center a-center teal f-bold white-text b-r-3" style={{height:30,width:30}}>{props.sprintSettings.holiday}</div>
                  </div>

                  <div className="a-center d-flex flex-column m-left-10  f-10 ">
                    <div>BUFFER</div>
                    <div className="d-flex j-center a-center teal f-bold white-text b-r-3" style={{height:30,width:30}}>{props.sprintSettings.sprintBuffer}</div>
                  </div>

                </div>

        </div>
          
          <table>
            {/*distriution ticket*/}
            <tr style={{border:0}}>
              <td style={{height:200}}>
                <Pie data={data} plugins={[plugin]} />
              </td>
              <td style={{width:'75%'}}>
                <ul style={{borderRadius:10}} className="d-flex flex-column lighten-5 p-30 red">
                  <li className="f-bold">TICKETS DISTRIBUTION</li> 
                  <li>
                  <table>
                    <tr className="b-bottom">
                      <td className="d-flex a-center">
                        <div style={{height:10, width:30, backgroundColor:'rgba(66, 135, 245,0.5)', opacity:0.5}}/>
                        <div className="m-left-5">BUSINESS</div>
                      </td>
                      <td>{props.totalDevBusinessHrFromJira + props.totalQABusinessHrFromJira} hrs</td>
                      <td>{(((props.totalDevBusinessHrFromJira + props.totalQABusinessHrFromJira)/(props.totalDevBusinessHrFromJira + props.totalQABusinessHrFromJira + props.totalDevTechHrFromJira + props.totalQATechHrFromJira + props.totalDevSpilloverHrFromJira + props.totalQASpilloverHrFromJira))*100).toFixed(2)}%</td>
                    </tr>
                    <tr className="b-bottom">
                      <td className="d-flex a-center">
                        <div style={{height:10, width:30, backgroundColor:'rgba(24, 186, 113,0.5)'}}/>
                        <div className="m-left-5">TECH TASKS</div>
                      </td>
                      <td>{props.totalDevTechHrFromJira + props.totalQATechHrFromJira} hrs</td>
                      <td>{(((props.totalDevTechHrFromJira + props.totalQATechHrFromJira)/(props.totalDevBusinessHrFromJira + props.totalQABusinessHrFromJira + props.totalDevTechHrFromJira + props.totalQATechHrFromJira + props.totalDevSpilloverHrFromJira + props.totalQASpilloverHrFromJira))*100).toFixed(2)}%</td>
                    </tr>
                    <tr className="b-bottom">
                      <td className="d-flex a-center">
                        <div style={{height:10, width:30, backgroundColor:'rgba(250, 52, 118,0.5)'}}/>
                        <div className="m-left-5">SPILLOVERS</div>
                      </td>
                      <td>{props.totalDevSpilloverHrFromJira + props.totalQASpilloverHrFromJira} hrs</td>
                      <td>{(((props.totalDevSpilloverHrFromJira + props.totalQASpilloverHrFromJira)/(props.totalDevBusinessHrFromJira + props.totalQABusinessHrFromJira + props.totalDevTechHrFromJira + props.totalQATechHrFromJira + props.totalDevSpilloverHrFromJira + props.totalQASpilloverHrFromJira))*100).toFixed(2)}%</td>
                    </tr>
                  </table>
                  </li>
                  
                </ul>
              </td>
            </tr>

            {/*distriution Dev*/}

            <tr style={{border:0}}>
              <td style={{height:200, width:'50%'}}>
                <div  className="b-thin b-r-3" style={{padding:30}}>
                <div className="f-bold grey-text text-lighten-1">DEV ALLOCATIONS</div>
                <Pie data={dataDevAllocation} plugins={[plugin]} />
                <table>
                    <tr className="b-bottom">
                      <td className="d-flex a-center">
                        <div style={{height:10, width:30, backgroundColor:'rgba(66, 135, 245,0.5)', opacity:0.5}}/>
                        <div className="m-left-5">ALLOCATED</div>
                      </td>
                      <td>{props.totalDevHrFromJira} hrs</td>
                    </tr>
                    <tr className="b-bottom">
                      <td className="d-flex a-center">
                        <div style={{height:10, width:30, backgroundColor:'rgba(24, 186, 113,0.5)'}}/>
                        <div className="m-left-5">AVAILABLE</div>
                      </td>
                      <td>{props.totalDevResourceHr} hrs</td>
                    </tr>
                    <tr className="b-bottom">
                      <td className="d-flex a-center">
                        <div style={{height:10, width:30, backgroundColor:'rgba(250, 52, 118,0.5)'}}/>
                        <div className="m-left-5">REMAINING</div>
                      </td>
                      <td>{(props.totalDevResourceHr -  props.totalDevHrFromJira - ((props.totalDevResourceHr - props.totalDevTechHrFromJira)*(Number(props.sprintSettings.sprintBuffer)/100) )).toFixed(2)} hrs</td>
                    </tr>
                  </table>
                </div>
              </td>

              {/*distriution Qa*/}
              <td style={{height:200, width:'50%'}}>
                <div  className="b-thin b-r-3" style={{padding:30}}>
                <div className="f-bold grey-text text-lighten-1">QA ALLOCATIONS</div>
                <Pie data={dataQaAllocation} plugins={[plugin]} />
                <table>
                    <tr className="b-bottom">
                      <td className="d-flex a-center">
                        <div style={{height:10, width:30, backgroundColor:'rgba(66, 135, 245,0.5)', opacity:0.5}}/>
                        <div className="m-left-5">ALLOCATED</div>
                      </td>
                      <td>{props.totalQAHrFromJira.toFixed(2)} hrs</td>
                    </tr>
                    <tr className="b-bottom">
                      <td className="d-flex a-center">
                        <div style={{height:10, width:30, backgroundColor:'rgba(24, 186, 113,0.5)'}}/>
                        <div className="m-left-5">AVAILABLE</div>
                      </td>
                      <td>{props.totalQAResourceHr.toFixed(2)} hrs</td>
                    </tr>
                    <tr className="b-bottom">
                      <td className="d-flex a-center">
                        <div style={{height:10, width:30, backgroundColor:'rgba(250, 52, 118,0.5)'}}/>
                        <div className="m-left-5">REMAINING</div>
                      </td>
                      <td>{(props.totalQAResourceHr -  props.totalQAHrFromJira - ((props.totalQAResourceHr - props.totalQATechHrFromJira)*(Number(props.sprintSettings.sprintBuffer)/100) )).toFixed(2)} hrs</td>
                    </tr>
                  </table>
                </div>
              </td>
              
            </tr>
          </table>

          <div style={{marginTop:0}}>
          <table>
            {/*User List*/}

            <tr>
              <td>
                <table className="m-top-20">
                  <thead>
                    <tr>
                        <th>User</th>
                        <th>BUFFER</th>
                        <th>LEAVE</th>
                        <th>
                          <div>Reserved</div>
                          <div className="f-10 grey-text lighten-3 f-normal">Meetings | Training | Scrum</div>
                        </th>
                        <th>AVAILABLE</th>
                        <th>ASSIGNED</th>
                        <th>REMAINING</th>

                    </tr>
                  </thead>

                  <tbody>
                    {renderUsersRows()}
                  </tbody>
                </table>
              </td>
          </tr>

          </table>
          </div>

        </div>
        <div class="modal-footer">
          <a href="#!" class="waves-effect waves-green btn-flat" onClick={()=>{handleGeneratePdf()}}>GENERATE PDF</a>
          <a href="#!" class="modal-close waves-effect waves-green btn-flat">CLOSE</a>
        </div>
      </div>
  );
}


const styles = {
  page: {
    marginLeft: '1rem',
    marginRight: '1rem',
    color: 'black',
    backgroundColor: 'white',
  },

  columnLayout: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '3rem 0 5rem 0',
    gap: '2rem',
  },

  column: {
    display: 'flex',
    flexDirection: 'column',
  },

  spacer2: {
    height: '2rem',
  },

  fullWidth: {
    width: '100%',
  },

  marginb0: {
    marginBottom: 0,
  },
};

export default SprintReport;