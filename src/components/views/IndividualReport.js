import React, { Component } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import Select from 'react-select';
import moment from 'moment';
import {
    Card,
    CardBody,
    CardTitle,
    Col,
    Row,
} from 'reactstrap';

import { Radar, Doughnut, Line } from 'react-chartjs-2';

var __ = require('lodash');
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var now = new Date();
var thisMonth = months[now.getMonth()];
var year = new Date().getFullYear(); //Current Year

let matchid = null, simonid = null, moleid = null;

class IndividualReport extends Component {
    constructor() {
        super();
        this.state = {
            doughnutChartData: {},
            lineData: {},
            radarChartData: {},
            users: "",
            userList: [],
            simonGames: [],
            moleGames: [],
            matchGames: [],
            simonGames2: [],
            moleGames2: [],
            matchGames2: [],
            totalSimonGames: [],
            totalMatchGames: [],
            totalMoleGames: [],
            avgFlips: 0,
            avgTotalTime: 0,
            avgReactionTime: 0,
            avgSimonScore: 0,
            avgMoleScore: 0,
        }
    }

    onChange = option => {

        axios.get('users/' + option.value)
            .then(response => {
                this.setState({ users: response.data.name });
            })
            .catch((error) => {
                console.log(error);
            })


        this.getGameRecordData(option.value);
    }

    async componentDidMount() {
        moleid = await axios.get('/game/find/WhackAMole');
        simonid = await axios.get('/game/find/SimonSays');
        matchid = await axios.get('/game//find/CardMatch');

        // Get All User With User Type
        await axios.get('users/')
            .then(response => {

                var data = response.data;
                data.forEach((data) => {
                    if (data.userType === "User") {
                        let { userList } = this.state;
                        userList.push({ label: data.email, value: data._id })
                        this.setState({ userList: userList })
                    }
                });

                console.log(this.state.userList)
            })
            .catch((error) => {
                console.log(error);
            })

        // Get first user from user list
        await axios.get('users/' + this.state.userList[0].value)
            .then(response => {
                this.setState({ users: response.data.name });
            })
            .catch((error) => {
                console.log(error);
            })

        // Get all game records
        await axios.get('record/')
            .then(response => {
                var newArr = __(response.data).orderBy('score', 'desc').value();
                this.data = newArr;

                this.data.forEach((data) => {
                    if (data.gameId === moleid.data._id) {
                        let { totalMoleGames } = this.state;
                        totalMoleGames.push({ id: moleid.data._id, score: data.score, reactionTime: data.reactionTime, date: data.date })
                        this.setState({ totalMoleGames: totalMoleGames })
                    }
                    else if (data.gameId === simonid.data._id) {
                        let { totalSimonGames } = this.state;
                        totalSimonGames.push({ id: simonid.data._id, score: data.score, date: data.date })
                        this.setState({ totalSimonGames: totalSimonGames })
                    }
                    else if (data.gameId === matchid.data._id) {
                        let { totalMatchGames } = this.state;
                        totalMatchGames.push({ id: matchid.data._id, flips: data.flips, totalTime: data.totalTime, date: data.date })
                        this.setState({ totalMatchGames: totalMatchGames })
                    }
                });
            })
            .catch((error) => {
                console.log(error);
            })

        let avgFlips = 0;
        let avgTotalTime = 0;
        let avgReactionTime = 0;
        let avgSimonScore = 0;
        let avgMoleScore = 0;

        //Calculation for comparison (line graph)
        if (this.state.totalMatchGames != null) {
            for (let i = 0; i < this.state.totalMatchGames.length; i++) {
                avgFlips += this.state.totalMatchGames[i].flips;
                avgTotalTime += this.state.totalMatchGames[i].totalTime;
            }
        }

        if (this.state.totalMoleGames != null) {
            for (let i = 0; i < this.state.totalMoleGames.length; i++) {
                avgReactionTime += this.state.totalMoleGames[i].reactionTime;
                avgMoleScore += this.state.totalMoleGames[i].score;
            }
        }

        if (this.state.totalSimonGames != null) {
            for (let i = 0; i < this.state.totalSimonGames.length; i++) {
                avgSimonScore += this.state.totalSimonGames[i].score;
            }
        }
        console.log(this.state.totalMatchGames)

        avgFlips /= this.state.totalMatchGames.length;
        avgTotalTime /= this.state.totalMatchGames.length;
        avgReactionTime /= this.state.totalMoleGames.length;
        avgMoleScore /= this.state.totalMoleGames.length;
        avgSimonScore /= this.state.totalSimonGames.length;

        this.setState({
            avgFlips: avgFlips,
            avgTotalTime: avgTotalTime,
            avgReactionTime: avgReactionTime,
            avgSimonScore: avgSimonScore,
            avgMoleScore: avgMoleScore,
            totalMatchGames: [],
            totalMoleGames: [],
            totalSimonGames: [],
        })
        await this.getGameRecordData(this.state.userList[0].value);
    }

    async getGameRecordData(id) {

        this.setState({
            simonGames: [],
            moleGames: [],
            matchGames: [],
            doughnutChartData: [],
            radarChartData: [],
            mixData: [],
            lineData: [],
            matchGames2:[],
            moleGames2:[],
            simonGames2:[],
        })

        await axios.get('record/' + id)
            .then(response => {
                var newArr = __(response.data).orderBy('score', 'desc').value();
                this.data = newArr;

                this.data.forEach((data) => {
                    if (data.gameId === moleid.data._id) {
                        let { moleGames } = this.state;
                        let { moleGames2 } = this.state;
                        moleGames.push({ id: moleid.data._id, score: data.score, reactionTime: data.reactionTime, date: data.date })
                        moleGames2.push({ id: moleid.data._id, score: data.score, reactionTime: data.reactionTime, date: data.date })
                        this.setState({ moleGames: moleGames, moleGames2: moleGames2 })
                    }
                    else if (data.gameId === simonid.data._id) {
                        let { simonGames } = this.state;
                        let { simonGames2 } = this.state;
                        simonGames.push({ id: simonid.data._id, score: data.score, date: data.date })
                        simonGames2.push({ id: simonid.data._id, score: data.score, date: data.date })
                        this.setState({ simonGames: simonGames, simonGames2: simonGames2 })
                    }
                });
            })

            .catch((error) => {
                console.log(error);
            })

        //Get Matchgame sort by fastest totalTime
        await axios.get('record/' + id)
            .then(response => {
                var newArr = __(response.data).orderBy('totalTime', 'asc').value();
                this.data = newArr;
                this.data.forEach((data) => {

                    if (data.gameId === matchid.data._id) {
                        let { matchGames } = this.state;
                        let { matchGames2 } = this.state;
                        matchGames.push({ id: matchid.data._id, flips: data.flips, totalTime: data.totalTime, date: data.date })
                        matchGames2.push({ id: matchid.data._id, flips: data.flips, totalTime: data.totalTime, date: data.date })
                        this.setState({ matchGames: matchGames, matchGames2: matchGames2 })
                    }
                });
            })
            .catch((error) => {
                console.log(error);
            })
        console.log(this.state.matchGames.length);
        this.getChartData();
    }

    async getChartData() {

        // Sort by date
        this.state.matchGames2.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
        this.state.moleGames2.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
        this.state.simonGames2.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))

        // Set Chat Data
            this.setState({
                doughnutChartData: {
                    labels: ['Memory', 'Reaction Time', 'Perception'],
                    datasets: [
                        {
                            label: 'No. of Plays',
                            data: [
                                this.state.matchGames.length, this.state.moleGames.length, this.state.simonGames.length
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
                },
                radarChartData: {
                    labels: ['Flips', 'Timing', 'Reaction Time', 'Mole Whacked', 'Simon Says Round'],
                    datasets: [
                        {
                            label: 'First Game',
                            backgroundColor: 'rgba(179,181,198,0.2)',
                            borderColor: 'rgba(179,181,198,1)',
                            pointBackgroundColor: 'rgba(179,181,198,1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(179,181,198,1)',
                            data: [this.state.matchGames2!=""?this.state.matchGames2[0].flips:0, 
                            this.state.matchGames2!=""?this.state.matchGames2[0].totalTime:0,
                            this.state.moleGames2!=""?this.state.moleGames2[0].reactionTime:0, 
                            this.state.moleGames2!=""?this.state.moleGames2[0].score:0, 
                            this.state.simonGames2!=""?this.state.simonGames2[0].score:0]
                        },
                        {
                            label: 'Latest Game',
                            backgroundColor: 'rgba(255,99,132,0.2)',
                            borderColor: 'rgba(255,99,132,1)',
                            pointBackgroundColor: 'rgba(255,99,132,1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(255,99,132,1)',
                            data: [this.state.matchGames2!=""?this.state.matchGames2[this.state.matchGames2.length - 1].flips:0, 
                            this.state.matchGames2!=""?this.state.matchGames2[this.state.matchGames2.length - 1].totalTime:0,
                            this.state.moleGames2!=""?this.state.moleGames2[this.state.moleGames2.length - 1].reactionTime:0, 
                            this.state.moleGames2!=""?this.state.moleGames2[this.state.moleGames2.length - 1].score:0, 
                            this.state.simonGames2!=""?this.state.simonGames2[this.state.simonGames2.length - 1].score:0]
                        }
                    ]
                },
                lineData: {
                    labels: ['Flips', 'Timing', 'Reaction Time', 'Mole Whacked', 'Simon Says Round'],
                    datasets: [
                        {
                            label: 'My Data',
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: 'rgba(75,192,192,0.4)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(75,192,192,1)',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                            pointHoverBorderColor: 'rgba(220,220,220,1)',
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: [this.state.matchGames!=""?this.state.matchGames[0].flips : 0, 
                            this.state.matchGames!=""?this.state.matchGames[0].totalTime:0,
                            this.state.moleGames!=""?this.state.moleGames[0].reactionTime:0, 
                            this.state.moleGames!=""?this.state.moleGames[0].score:0, 
                            this.state.simonGames!=""?this.state.simonGames[0].score:0]
                        },
                        {
                            label: 'Average Data',
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: 'rgba(255, 99, 132, 0.4)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(255, 99, 132, 1)',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(255, 99, 132, 1)',
                            pointHoverBorderColor: 'rgba(220,220,220,1)',
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: [this.state.avgFlips!= ""?this.state.avgFlips:0,
                            this.state.avgTotalTime!= ""?this.state.avgTotalTime:0,
                                this.state.avgReactionTime!= ""?this.state.avgReactionTime:0, 
                                this.state.avgMoleScore!= ""?this.state.avgMoleScore:0, 
                                this.state.avgSimonScore!= ""?this.state.avgSimonScore:0]
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
                                            <Col sm="3" style={{ marginTop: '10px' }}><Select options={this.state.userList} onChange={this.onChange}></Select></Col>
                                            <Col sm="1.2" style={{ marginRight: 20 }}>
                                                <button type="button" className="start_button orange" onClick={() => window.print()}>Print Report</button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm="5">
                                                <h4>Brain Areas Exercised</h4>
                                                <hr />
                                                <Doughnut data={this.state.doughnutChartData} />
                                            </Col>
                                            <Col sm="5">
                                                <h4>Improvement Since Start</h4>
                                                <hr />
                                                <Radar data={this.state.radarChartData} />
                                            </Col>
                                        </Row>
                                        <br />
                                        <Row>
                                            <Col sm="5">
                                                <h4>User's Average</h4>
                                                <hr />
                                                <Line data={this.state.lineData} />
                                            </Col>
                                        </Row>
                                        <br></br>
                                        <Row>
                                            <Col>
                                                <h4>Personal Best</h4>
                                                <hr />
                                                <h5>Match Game</h5>
                                                <div>
                                                    <table class="table">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">#</th>
                                                                <th scope="col">No. Of Flips</th>
                                                                <th scope="col">Total Time</th>
                                                                <th scope="col">Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.state.matchGames.slice(0, 3).map((game, index) => {
                                                                return (
                                                                    <tr >
                                                                        <th scope="col">{index + 1}</th>
                                                                        <td scope="col">{game.flips}</td>
                                                                        <td scope="col">{game.totalTime}s</td>
                                                                        <td scope="col">{moment(game.date).format("YYYY-MM-DD HH:MM:SS")}</td>
                                                                    </tr>
                                                                );
                                                            })}

                                                        </tbody>
                                                    </table>
                                                </div>
                                                <br></br>
                                                <h5>Mole Game</h5>
                                                <div>
                                                    <table class="table">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">#</th>
                                                                <th scope="col">Score</th>
                                                                <th scope="col">Reaction Time</th>
                                                                <th scope="col">Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.state.moleGames.slice(0, 3).map((game, index) => {
                                                                return (
                                                                    <tr >
                                                                        <th scope="col">{index + 1}</th>
                                                                        <td scope="col">{game.score}</td>
                                                                        <td scope="col">{game.reactionTime}s</td>
                                                                        <td scope="col">{moment(game.date).format("YYYY-MM-DD HH:MM:SS")}</td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <br></br>
                                                <h5>Simon Says</h5>
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
                                                            {this.state.simonGames.slice(0, 3).map((game, index) => {
                                                                return (
                                                                    <tr >
                                                                        <th scope="col">{index + 1}</th>
                                                                        <td scope="col">{game.score}</td>
                                                                        <td scope="col">{moment(game.date).format("YYYY-MM-DD HH:MM:SS")}</td>
                                                                    </tr>
                                                                );
                                                            })}
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
)(IndividualReport);
