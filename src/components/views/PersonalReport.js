import React, { Component } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import {
    Card,
    CardBody,
    CardTitle,
    Col,
    Row,
} from 'reactstrap';

const DynamicDoughnut = React.lazy(() => import('../graphs/DynamicDoughnut'));
//const BarGraph = React.lazy(() => import('../graphs/BarGraph'));




var months    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var now       = new Date();
var thisMonth = months[now.getMonth()];
var year = new Date().getFullYear(); //Current Year

console.log(thisMonth);
console.log(year);
class PersonalReport extends Component {
    constructor() {
        super();
        this.state = {
            chartData: {},

            users:"",
            games:[],
            SimonSaysId:""
        }
    }
    
  
  async componentDidMount() {


    let res = await axios.get('/game/Whack A Mole');
    console.log(res.data._id);
      axios.get('users/'+ this.props.auth.user.id)
       .then(response => {
         this.setState({ users: response.data.name });
       })
       .catch((error) => {
         console.log(error);
       })
       
      

     
        this.getChartData();
    }

    getChartData() {
        // Ajax calls here
        this.setState({
            chartData: {
                labels: ['Card Match', 'Whack A Mole', 'Simon Says'],
                datasets: [
                    {
                        label: 'No. of Plays',
                        data: [
                            34,
                            45,
                            60,
                        ],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                        ],
                        borderWidth: 1,
                        hoverBackgroundColor: [
                            'rgba(255, 99, 132, 0.3)',
                            'rgba(54, 162, 235, 0.3)',
                            'rgba(255, 206, 86, 0.3)',
                        ],
                        hoverBorderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                        ],
                    }
                ]
            }
        });
    }

    render() {
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col>
                                        <Row>
                                            <Col>
                                                <CardTitle className="h3"> {this.state.users}'s Report</CardTitle>
                                                <div className="small text-muted">January {year} - {thisMonth} {year}</div>
                                                <br></br>
                                            </Col>
                                            <Col sm="1.2" style={{ marginRight: 20 }}>
                                                <button type="button" className="start_button orange">Print Report</button>
                                            </Col>
                                        </Row>
                                        <Row>   
                                            <Col>
                                                <h4>Brain Areas Exercised</h4>
                                                <hr />
                                                <DynamicDoughnut />
                                            </Col>
                                            <Col>
                                                <h4>Overview</h4>
                                                <hr />
                                            </Col>
                                        </Row>
                                        <br></br>
                                        <Row>
                                            <Col>
                                                <h4>Personal Best</h4>
                                                <hr />
                                                <h5>Memory</h5>
                                                <div>
                                                    <table class="table">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">#</th>
                                                                <th scope="col">Score</th>
                                                                <th scope="col">Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <th scope="row">1</th>
                                                                <td>Mark</td>
                                                                <td>Otto</td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row">2</th>
                                                                <td>Mark</td>
                                                                <td>Otto</td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row">3</th>
                                                                <td>Mark</td>
                                                                <td>Otto</td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row">4</th>
                                                                <td>Mark</td>
                                                                <td>Otto</td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row">5</th>
                                                                <td>Mark</td>
                                                                <td>Otto</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <br></br>
                                                <h5>Reaction Time</h5>
                                                <div>
                                                    <table class="table">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">#</th>
                                                                <th scope="col">Score</th>
                                                                <th scope="col">Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <th scope="row">1</th>
                                                                <td>Mark</td>
                                                                <td>Otto</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <br></br>
                                                <h5>Perception</h5>
                                                <div>
                                                    <table class="table">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">#</th>
                                                                <th scope="col">Score</th>
                                                                <th scope="col">Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <th scope="row">1</th>
                                                                <td>Mark</td>
                                                                <td>Otto</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <br></br>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
  });

  export default connect(
    mapStateToProps
  )(PersonalReport);
