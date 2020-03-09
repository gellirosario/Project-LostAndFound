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

const DynamicDoughnut = React.lazy(() => import('../graphs/DynamicDoughnut'));
//const BarGraph = React.lazy(() => import('../graphs/BarGraph'));

var __ = require('lodash');
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var now = new Date();
var thisMonth = months[now.getMonth()];
var year = new Date().getFullYear(); //Current Year

let matchid = null,simonid = null,moleid = null; 
class IndividualReport extends Component {
    constructor() {
        super();
        this.state = {
            chartData: {},
            users: "",
            userList: [],
            simonGames: [],
            moleGames: [],
            matchGames: [],
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
                        userList.push({ label: data.email, value: data._id})
                        this.setState({ userList: userList })
                    }
                });

                console.log(this.state.userList)
            })
            .catch((error) => {
                console.log(error);
            })

            axios.get('users/' + this.state.userList[0].value)
            .then(response => {
                this.setState({ users: response.data.name });
            })
            .catch((error) => {
                console.log(error);
            })

        
        this.getGameRecordData(this.state.userList[0].value);
        this.getChartData();
    }

    getGameRecordData(id) {
        
        this.setState({
            simonGames: [],
            moleGames: [],
            matchGames: []
        })

        axios.get('record/' + id)
            .then(response => {
                var newArr = __(response.data).orderBy('score', 'desc').value();
                this.data = newArr;
                this.data.forEach((data) => {
                    if (data.gameId === moleid.data._id) {
                        let { moleGames } = this.state;
                        moleGames.push({ id: moleid.data._id, score: data.score, reactionTime: data.reactionTime, date: data.date })
                        this.setState({ moleGames: moleGames })
                    }
                    else if (data.gameId === simonid.data._id) {
                        let { simonGames } = this.state;
                        simonGames.push({ id: simonid.data._id, score: data.score, date: data.date })
                        this.setState({ simonGames: simonGames })
                    }
                });
            })
            .catch((error) => {
                console.log(error);
            })

        //Get Matchgame sort by fastest totalTime
        axios.get('record/' +id)
            .then(response => {
                var newArr = __(response.data).orderBy('totalTime', 'asc').value();
                this.data = newArr;
                this.data.forEach((data) => {

                    if (data.gameId === matchid.data._id) {
                        let { matchGames } = this.state;
                        matchGames.push({ id: matchid.data._id,flips:data.flips, totalTime: data.totalTime, date: data.date })
                        this.setState({ matchGames: matchGames })
                    }
                });
            })
            .catch((error) => {
                console.log(error);
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
                                            <Col><Select options={this.state.userList} onChange={this.onChange}></Select></Col>
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
                                                <h5>Memory (Match Game)</h5>
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
                                                            {this.state.matchGames.map((game, index) => {
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
                                                <h5>Reaction Time (Mole Game)</h5>
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
                                                <h5>Perception (Simon Says)</h5>
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
                                                                        <tr key={game.id}>
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
