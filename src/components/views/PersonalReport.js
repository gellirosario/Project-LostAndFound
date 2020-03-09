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



var __ = require('lodash');
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var now = new Date();
var thisMonth = months[now.getMonth()];
var year = new Date().getFullYear(); //Current Year
let simongames = [
    {
        score: "",
        date: ""
    }
];
let molegames = [
    {
        id: 0,
        score: "",
        date: ""
    }
];
let matchgames = [
    {
        totalTime: "",
        date: ""
    }
];


class PersonalReport extends Component {
    constructor() {
        super();
        this.state = {
            chartData: {},
            users: "",
            simonGames: [],
            moleGames: [],
            moleRecord: {},
            matchGames: [],
        }
    }

    async componentDidMount() {
        let i = 0;
        let j = 0;
        let k = 0;
        let moleid = await axios.get('/game/find/WhackAMole');
        let simonid = await axios.get('/game/find/SimonSays');
        let matchid = await axios.get('/game//find/CardMatch');


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
                        moleGames.push({ id: moleid.data._id, score: data.score, date: data.date })
                        this.setState({ moleGames: moleGames })
                        i++;
                    }
                    else if (data.gameId === simonid.data._id) {
                        simongames[j] = ({ id: simonid.data._id, score: data.score, date: data.date });
                        j++;
                    }
                });
            })
            .catch((error) => {
                console.log(error);
            })

        //Get Matchgame sort by fastest totalTime
        axios.get('record/' + this.props.auth.user.id)
            .then(response => {
                var newArr = __(response.data).orderBy('totalTime', 'asc').value();
                this.data = newArr;
                this.data.forEach((data) => {

                    if (data.gameId === matchid.data._id) {
                        matchgames[k] = ({ totalTime: data.totalTime, date: data.date });
                        k++;
                    }
                });
            })
            .catch((error) => {
                console.log(error);
            })

        //console.log("simongames");
        //console.log(simongames);

        console.log("molegames");
        console.log(molegames);

        console.log("here111111");
        console.log(this.state.moleGames);


        //console.log("matchgames");
        //console.log(matchgames);

        //var scoreee = simongames[0]["score"].value();
        var scoreee = parseInt(this.state.moleGames.score)
        console.log(scoreee);


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
                                                <button type="button" className="start_button orange" onClick={() => window.print()}>Print Report</button>
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

                                                        </tbody>
                                                    </table>
                                                </div>
                                                <br></br>
                                                <h5>Reaction Time (Mole Game)</h5>
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

                                                                this.state.moleGames.map((game, index) => {
                                                                    console.log(this.state.moleGames);
                                                                    console.log("here" + game.score);

                                                                    return (
                                                                        <tr key={game.id}>
                                                                            <th scope="col">{index + 1}</th>
                                                                            <td scope="col">{game.score === "" ? "null" : game.score}</td>
                                                                            <td scope="col">{game.date}</td>
                                                                        </tr>
                                                                    );
                                                                })}
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
