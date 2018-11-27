import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import DeletedMessage from './DeletedMessage';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label
} from 'recharts';

class App extends Component {
  constructor() {
    super();
    this.state = {
      sensor1: 0,
      humid: 0,
      temperature: 0,
      sensor1alldata: [],
      errors: '',
      showDeletedMessage: false
    };
  }


  dofilter(inarray) {
    var array = [];
    var i = 0;
    inarray.forEach(obj => {
      array.push({
        seq: ++i,
        name: obj.name,
        value: obj.value,
        humid: obj.value2,
        temperature: obj.value3,
      });
    });
    this.setState({ sensor1alldata: array });
  }

  componentDidMount() {
    setInterval(() => {
      axios
        .get('/getsensor1')
        .then(result => {
          this.setState({ sensor1: result.data });
        })
        .catch(err => {
          this.setState({ errors: err.response.data });
        });
    }, 3000);

    setInterval(() => {
  axios
    .get('/gethumid')
    .then(result => {
      this.setState({ humid: result.data });
    })
    .catch(err => {
      this.setState({ errors: err.response.data });
    });
  }, 3000);

setInterval(() => {
  axios
  .get('/gettemperature')
  .then(result => {
    this.setState({ temperature: result.data });
  })
  .catch(err => {
    this.setState({ errors: err.response.data });
  });
  }, 3000);

    setInterval(() => {
      axios
        .get('/getallsensor1')
        .then(result => {
          this.dofilter(result.data);
        })
        .catch(err => {
          this.setState({ errors: err.response.data });
        });
    }, 5000);
  }



  deleteAllHandler = () => {
      axios
        .get('/deleteall')
        .then(result => {
          this.setState({ showDeletedMessage: true });
        })
        .catch(err => {
          console.log('unable to delete: ', err);
        });
    };


    alertDismissHandler = () => {
        this.setState({ showDeletedMessage: false });
      };

  render() {

//Danger- Warning User
    if(parseInt(this.state.sensor1)>=500)
    {
      return (
        <div>
          <div className="jumbotron text-center header">
            <h1>Sensor Data</h1>
            <p>Displays sensor data received from NodeMCU</p>

          </div>

          <div className="jumbotron text-center">
            <h2>WARNING! WARNING! </h2>
          <h2> OFF THE GAS NOW </h2>
            </div>


          <div className="container">
          <DeletedMessage
                    show={this.state.showDeletedMessage}
                    alertDismiss={this.alertDismissHandler}
                  />
            <div className="row">

             <div className="text-center container col-sm-4">
               <div id="sensorvalue">
                 <label>
                   <h4>Methane Gas Value</h4>
                 </label>
                 <br />
                 <label>
                   <h4>{this.state.sensor1} </h4>
                 </label>
               </div>

                      <div className="humidvalue">
                        <label>
                          <h4>Humid Value</h4>
                        </label>
                              <br />
                          <label>
                            <h4>{this.state.humid} </h4>
                          </label>
                          </div>

                                    <div className="temptvalue">
                                      <label>
                                        <h4>Temperature Value</h4>
                                      </label>
                                      <br />
                                      <label>
                                        <h4>{this.state.temperature} </h4>
                                      </label>
                                    </div>


                                     <div id="deleteall">
                                       <br />
                                       <button
                                         className="btn btn-primary"
                                         onClick={this.deleteAllHandler}
                                       >
                                         <h4>Delete All</h4>
                                       </button>
                                     </div>

                                     <div className="row">
                                      <div className="sensortable">
                                        <label>
                                          <h4>Methane Gas Value Table</h4>
                                        </label>
                                        <br />
                                        <div>
                                          <ReactTable
                                            data={this.state.sensor1alldata}
                                            columns={[
                                              {
                                                Header: 'No.',
                                                accessor: 'seq'
                                              },
                                              {
                                                Header: 'Methane Gas',
                                                accessor: 'value'
                                              },
                                              {
                                                Header: 'Humid',
                                                accessor:'humid',
                                              },
                                              {
                                                Header: 'Temperature',
                                                accessor:'temperature',
                                              }
                                            ]}
                                            defaultPageSize={5}
                                            className="-striped -highlight"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-center container col-sm-8">
                                    <div className="sensorgraph">
                                      <label>
                                        <h4>Methane Gas Value Graph</h4>
                                      </label>
                                      <br />
                                      <LineChart
                                        width={700}
                                        height={400}
                                        data={this.state.sensor1alldata}
                                      >
                                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                                        <XAxis dataKey="seq">
                                          <Label position="insideBottomRight" dy={10}>
                                            Sequence
                                          </Label>
                                        </XAxis>
                                        <YAxis dataKey="value">
                                          <Label position="insideTopLeft" dx={-10}>
                                            Value
                                          </Label>
                                        </YAxis>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Tooltip />
                                        <Legend />
                                      </LineChart>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );

    }

else {
    return (
      <div>
        <div className="jumbotron text-center header">
          <h1>Sensor Data</h1>

        </div>

        <div className="jumbotron text-center">
        <p> If LED show Blue Light with no Sound, means still fine. </p>
        <p> If LED show Green Light with Long Beep Sound, means your methane gas is flow around your house. </p>
        <p> If LED show Red Light with Beep Beep Sound, means you need close the gas now. Or IT WILL EXPLODE! </p>

        </div>
        <div className="container">
        <DeletedMessage show={this.state.showDeletedMessage} />
          <div className="row">

           <div className="text-center container col-sm-4">
             <div id="sensorvalue">
               <label>
                 <h4>Methane Gas Value</h4>
               </label>
               <br />
               <label>
                 <h4>{this.state.sensor1} </h4>
               </label>
             </div>

                    <div className="humidvalue">
                      <label>
                        <h4>Humid Value</h4>
                      </label>
                            <br />
                        <label>
                          <h4>{this.state.humid} </h4>
                        </label>
                        </div>

                                  <div className="temptvalue">
                                    <label>
                                      <h4>Temperature Value</h4>
                                    </label>
                                    <br />
                                    <label>
                                      <h4>{this.state.temperature} </h4>
                                    </label>
                                  </div>


                                   <div id="deleteall">
                                     <br />
                                     <button
                                       className="btn btn-primary"
                                       onClick={this.deleteAllHandler}
                                     >
                                       <h4>Delete All</h4>
                                     </button>
                                   </div>

                                   <div className="row">
                                    <div className="sensortable">
                                      <label>
                                        <h4>Methane Gas Value Table</h4>
                                      </label>
                                      <br />
                                      <div>
                                        <ReactTable
                                          data={this.state.sensor1alldata}
                                          columns={[
                                            {
                                              Header: 'No.',
                                              accessor: 'seq'
                                            },
                                            {
                                              Header: 'Methane Gas',
                                              accessor: 'value'
                                            },
                                            {
                                              Header: 'Humid',
                                              accessor:'humid',
                                            },
                                            {
                                              Header: 'Temperature',
                                              accessor:'temperature',
                                            }
                                          ]}
                                          defaultPageSize={5}
                                          className="-striped -highlight"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-center container col-sm-8">
                                  <div className="sensorgraph">
                                    <label>
                                      <h4>Methane Gas Value Graph</h4>
                                    </label>
                                    <br />
                                    <LineChart
                                      width={700}
                                      height={400}
                                      data={this.state.sensor1alldata}
                                    >
                                      <Line type="monotone" dataKey="value" stroke="#8884d8" />
                                      <XAxis dataKey="seq">
                                        <Label position="insideBottomRight" dy={10}>
                                          Sequence
                                        </Label>
                                      </XAxis>
                                      <YAxis dataKey="value">
                                        <Label position="insideTopLeft" dx={-10}>
                                          Value
                                        </Label>
                                      </YAxis>
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <Tooltip />
                                      <Legend />
                                    </LineChart>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                        );
}


                      }
                    }

                    export default App;
