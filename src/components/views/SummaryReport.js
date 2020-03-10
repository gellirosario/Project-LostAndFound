import React, { Component } from 'react';
import {
    Card,
    CardBody,
    CardTitle,
    Col,
    Row,
} from 'reactstrap';
import moment from 'moment';
import { connect } from "react-redux";
import axios from 'axios';
import { Doughnut, Line } from 'react-chartjs-2';
import Swal from 'sweetalert2'

const Toast = Swal.mixin({
    toast: true,
    position: 'center',
    padding: '50px',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

var __ = require('lodash');
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var now = new Date();
var thisMonth = months[now.getMonth()];
var year = new Date().getFullYear(); //Current Year
class SummaryReport extends Component {
    constructor() {
        super();
        this.state = {
            doughnutChartData: [],
            simonGamesCount: 0,
            moleGamesCount: 0,
            matchGamesCount: 0,
            simonAvgScore: 0,
            moleAvgScore: 0,
            matchAvgFlips: 0,
            avgTotalTime: 0,
            avgReactionTime: 0,
            simonGames: [],
            moleGames: [],
            matchGames: [],
        }
    }

    async componentWillMount() {
        // Loading
        Toast.fire({
            icon: 'info',
            title: 'Loading...'
        })

        // Get Game ID
        let moleid = axios.get('/game/find/WhackAMole');
        let simonid = axios.get('/game/find/SimonSays');
        let matchid = axios.get('/game/find/CardMatch');
        console.log(moleid.data)

        await axios.get('summary/' + String((await moleid).data._id) + '/count')
            .then(res => {
                this.setState({ moleGamesCount: res.data })
                console.log(this.state.moleGamesCount)
            })
            .catch((error) => {
                console.log(error)
            })

        await axios.get('summary/' + String((await simonid).data._id) + '/count')
            .then(res => {
                this.setState({ simonGamesCount: res.data })
                console.log(this.state.simonGamesCount)
            })
            .catch((error) => {
                console.log(error)
            })

        await axios.get('summary/' + String((await matchid).data._id) + '/count')
            .then(res => {
                this.setState({ matchGamesCount: (res.data) })
                console.log(this.state.matchGamesCount)
            })
            .catch((error) => {
                console.log(error)
            })

        // match sort by flips
        await axios.get('summary/' + String((await matchid).data._id))
            .then(res => {
                // var newArr = __(res.data).orderBy('score', 'desc').value();
                // this.data = newArr;
                var data = res.data;
                const sum_flips = Object.values(data).reduce((acc, current) => acc + current.flips, 0);
                const sum_totalTime = Object.values(data).reduce((acc, current) => acc + current.totalTime, 0);
                const avg_flips = sum_flips / Object.values(data).length;
                const avg_totalTime = sum_totalTime / Object.values(data).length;

                this.setState({ avgTotalTime: avg_totalTime });
                this.setState({ matchAvgFlips: avg_flips });
                // console.log(data.slice(-3,).reverse())
                this.setState({ matchGames: data.slice(-3).reverse() })
                // console.log(this.state.matchGames)
            })
            .catch((error) => {
                console.log(error)
            })

        //mole sort by score
        await axios.get('summary/' + String((await moleid).data._id))
            .then(res => {
                var data = res.data;

                const sum_score = Object.values(data).reduce((acc, current) => acc + current.score, 0);
                const sum_reactionTime = Object.values(data).reduce((acc, current) => acc + current.reactionTime, 0);
                const avg_score = sum_score / Object.values(data).length;
                const avg_reactionTime = sum_reactionTime / Object.values(data).length;

                this.setState({ moleAvgScore: avg_score });
                this.setState({ avgReactionTime: avg_reactionTime });

                this.setState({ moleGames: data.slice(-3).reverse() })
                console.log(this.state.moleGames)
            })
            .catch((error) => {
                console.log(error)
            })

        // simon sort by score
        await axios.get('summary/' + String((await simonid).data._id))
            .then(res => {
                var data = res.data;
                const sum = Object.values(data).reduce((acc, current) => acc + current.score, 0);
                const average = sum / Object.values(data).length;
                this.setState({ simonAvgScore: average })
                // console.log(data)
                // console.log(average);
                // console.log(data.slice(-3,).reverse())
                this.setState({ simonGames: data.slice(-3).reverse() })
                // console.log(this.state.simonGames)
            })
            .catch((error) => {
                console.log(error)
            })
        console.log(this.state.moleGamesCount)
        await this.getChartData()
    }

    async getChartData() {

        // Ajax calls here
        this.setState({
            doughnutChartData: {
                labels: ['Card Match', 'Whack A Mole', 'Simon Says'],
                datasets: [
                    {
                        label: 'No. of Plays',
                        data: [
                            this.state.matchGamesCount,
                            this.state.moleGamesCount,
                            this.state.simonGamesCount
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

            lineData: {
                labels: ['Flips', 'Timing', 'Reaction Time', 'Mole Whacked', 'Simon Says Round'],
                datasets: [
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
                        data: [this.state.matchAvgFlips, this.state.avgTotalTime,
                        this.state.avgReactionTime, this.state.moleAvgScore, this.state.simonAvgScore]
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
                                                <div className="small text-muted">January {year} - {thisMonth} {year}</div>
                                                <br></br>
                                            </Col>
                                            <Col sm="1.2" style={{ marginRight: 20 }}>
                                                <button type="button" className="start_button orange" onClick={() => window.print()}>Print Report</button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm="5">
                                                <h4>Total Game Plays</h4>
                                                <hr />
                                                <Doughnut data={this.state.doughnutChartData} />
                                            </Col>
                                            <Col sm="5">
                                                <h4>Users' Average</h4>
                                                <hr />
                                                <Line data={this.state.lineData} />
                                            </Col>
                                        </Row>
                                        <br></br>
                                        <Row>
                                            <Col>
                                                <h4>Top Ranking</h4>
                                                <hr />
                                                <h5>Memor(CardMatch)</h5>
                                                <div>
                                                    <table class="table">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">#</th>
                                                                <th scope="col">Score</th>
                                                                <th scope="col">Time</th>
                                                                <th scope="col">Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.state.matchGames.map((game, index) => {
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
                                                <h5>Reaction Time(WhackAMole)</h5>
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
                                                            {this.state.moleGames.map((game, index) => {
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
                                                <h5>Perception (SimonSays)</h5>
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
                                                            {this.state.simonGames.map((game, index) => {
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
)(SummaryReport);
