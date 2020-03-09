import React, { Component } from 'react';
import {
    Card,
    CardBody,
    CardTitle,
    Col,
    Row,
} from 'reactstrap';
//import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from 'axios';

const DynamicDoughnut = React.lazy(() => import('../graphs/DynamicDoughnut'));
//const BarGraph = React.lazy(() => import('../graphs/BarGraph'));

class SummaryReport extends Component {
    constructor() {
        super();
        this.state = {
            chartData: {},
            simonGameCount:1,
            moleGamesCount:1,
            matchGamesCount:1,
            simonGames: [],
            moleGames: [],
            matchGames: [],
        }
    }

    async componentWillMount() {
        this.getChartData();
        
        let moleid = axios.get('/game/find/WhackAMole');
        let simonid = axios.get('/game/find/SimonSays');
        let matchid = axios.get('/game/find/CardMatch');
        console.log(moleid.data)

        

        axios.get('summary/'+String((await moleid).data._id) + '/count')
            .then(res =>{
                this.setState({moleGamesCount: res.data})
                console.log(this.state.moleGamesCount)
            })
            .catch((error)=>{
                console.log(error)
            })

        axios.get('summary/'+String((await simonid).data._id) + '/count')
            .then(res =>{
                this.setState({simonGamesCount: res.data})
                console.log(this.state.simonGamesCount)
            })
            .catch((error)=>{
                console.log(error)
            })

        axios.get('summary/'+String((await matchid).data._id) + '/count')
            .then(res =>{
                this.setState({matchGamesCount: (res.data._id)})
                console.log(this.state.matchGamesCount)
            })
            .catch((error)=>{
                console.log(error)
            })

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
                            10,10,10
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
                                                <CardTitle className="h3">Summary Report</CardTitle>
                                                <div className="small text-muted">January 2020 - December 2020</div>
                                                <br></br>
                                            </Col>
                                            <Col sm="1.2" style={{marginRight:20}}>
                                                <button type="button" className="start_button orange" onClick={() => window.print()}>Print Report</button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <h4>Total Game Plays</h4>
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
                                                <h4>Top Ranking</h4>
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
  )(SummaryReport);
