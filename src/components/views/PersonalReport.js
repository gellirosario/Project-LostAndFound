import React, { Component } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import moment from 'moment';
import { Radar, Doughnut, Line } from 'react-chartjs-2';

import {
    Card,
    CardBody,
    CardTitle,
    Col,
    Row,
} from 'reactstrap';



var __ = require('lodash');
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var now = new Date();
var thisMonth = months[now.getMonth()];
var year = new Date().getFullYear(); //Current Year


class PersonalReport extends Component {
    constructor() {
        super();
        this.state = {
            chartData: {},
            users: "",
            simonGames: [],
            moleGames: [],
            matchGames: [],
            doughnutChartData: {},
            radarChartData: {},
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
        let moleid = await axios.get('/game/find/WhackAMole');
        let simonid = await axios.get('/game/find/SimonSays');
        let matchid = await axios.get('/game//find/CardMatch');

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
     if(this.state.totalMatchGames != null)
     {
         for (let i = 0; i < this.state.totalMatchGames.length; i++) {
             avgFlips += this.state.totalMatchGames[i].flips;
             avgTotalTime += this.state.totalMatchGames[i].totalTime;
         }
     }

     if(this.state.totalMoleGames != null)
     {
         for (let i = 0; i < this.state.totalMoleGames.length; i++) {
             avgReactionTime += this.state.totalMoleGames[i].reactionTime;
             avgMoleScore += this.state.totalMoleGames[i].score;
         }
     }

     if(this.state.totalSimonGames != null)
     {
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
         avgFlips:avgFlips,
         avgTotalTime:avgTotalTime,
         avgReactionTime:avgReactionTime,
         avgSimonScore:avgSimonScore,
         avgMoleScore:avgMoleScore,
         totalMatchGames: [],
         totalMoleGames: [],
         totalSimonGames: [],
     })


        //Get simongame & molegame sort by highest score first
        axios.get('users/' + this.props.auth.user.id)
            .then(response => {
                this.setState({ users: response.data.name });
            })
            .catch((error) => {
                console.log(error);
            })

        axios.get('record/' + this.props.auth.user.id)
            .then(response => {
                var newArr = __(response.data).orderBy('score', 'desc').value();
                this.data = newArr;
                this.data.forEach((data) => {
                    if (data.gameId === moleid.data._id) {
                        //moleGames = { id: moleid.data._id, score: data.score, date: data.date };

                        let { moleGames } = this.state;
                        moleGames.push({ id: moleid.data._id, score: data.score, reactionTime: data.reactionTime, date: data.date })
                        this.setState({ moleGames: moleGames })




                    }
                    else if (data.gameId === simonid.data._id) {
                        let { simonGames } = this.state;
                        simonGames.push({ id: simonid.data._id, score: data.score, date: data.date });
                        this.setState({ simonGames: simonGames });

                    }
                });


            })
            .catch((error) => {
                console.log(error);
            })





        //Get Matchgame sort by fastest totalTime
        await axios.get('record/' + this.props.auth.user.id)
            .then(response => {
                var newArr = __(response.data).orderBy('totalTime', 'asc').value();
                this.data = newArr;
                this.data.forEach((data) => {

                    if (data.gameId === matchid.data._id) {
                        let { matchGames } = this.state;

                        matchGames.push({ id: matchid.data._id, flips: data.flips, totalTime: data.totalTime, date: data.date });
                        this.setState({ matchGames: matchGames });

                    }
                });
            })
            .catch((error) => {
                console.log(error);
            })

         this.getChartData();
    }




    getChartData() {

        this.state.matchGames2.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
        this.state.moleGames2.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
        this.state.simonGames2.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))


        // Ajax calls here
        this.setState({
            doughnutChartData: {
                labels: ['Card Match', 'Whack A Mole', 'Simon Says'],
                datasets: [
                    {
                        label: 'No. of Plays',
                        data: [
                            this.state.matchGames.length,
                            this.state.moleGames.length,
                            this.state.simonGames.length,
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
                        data: [this.state.matchGames[0].flips, this.state.matchGames[0].totalTime,
                        this.state.moleGames[0].reactionTime, this.state.moleGames[0].score, this.state.simonGames[0].score]
                    },
                    {
                        label: 'Latest Game',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        pointBackgroundColor: 'rgba(255,99,132,1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(255,99,132,1)',
                        data: [this.state.matchGames[this.state.matchGames.length - 1].flips, this.state.matchGames[this.state.matchGames.length - 1].totalTime,
                        this.state.moleGames[this.state.matchGames.length - 1].reactionTime, this.state.moleGames[this.state.matchGames.length - 1].score, this.state.simonGames[this.state.matchGames.length - 1].score]
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
                        data: [this.state.matchGames[0].flips, this.state.matchGames[0].totalTime,
                        this.state.moleGames[0].reactionTime, this.state.moleGames[0].score, this.state.simonGames[0].score]
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
                        data: [this.state.avgFlips, this.state.avgTotalTime,
                        this.state.avgReactionTime, this.state.avgMoleScore, this.state.avgSimonScore]
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
                                                <button type="button" className="start_button orange" onClick={() => window.print()}>Print Report</button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm='4'>
                                                <h4>Brain Areas Exercised</h4>
                                                <hr />
                                                <Doughnut data={this.state.doughnutChartData} />
                                            </Col>
                                            <Col sm="6">
                                                <h4>Improvements</h4>
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
                                                            {
                                                                this.state.matchGames.slice(0, 3).map((game, index) => {
                                                                    return (
                                                                        <tr key={game.id}>
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
                                                            {

                                                                this.state.moleGames.slice(0, 3).map((game, index) => {
                                                                    //   console.log(this.state.moleGames);
                                                                    //  console.log("here" + game.score);

                                                                    return (
                                                                        <tr key={game.id}>
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
                                                <h5>Simon Game</h5>
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
                                                            {

                                                                this.state.simonGames.slice(0, 3).map((game, index) => {
                                                                    //   console.log(this.state.moleGames);
                                                                    //  console.log("here" + game.score);

                                                                    return (
                                                                        <tr key={game.id}>
                                                                            <th scope="col">{index + 1}</th>
                                                                            <td scope="col">{game.score === "" ? "null" : game.score}</td>
                                                                            <td scope="col">{moment(game.date).format("DD-MMM-YYYY")}</td>
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
)(PersonalReport);
