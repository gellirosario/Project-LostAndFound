import React, { Component } from 'react';
import axios from 'axios';
import MoleHole from "./MoleHole";
import {
  Badge,
  Button,
  ButtonDropdown,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Progress,
  Row,
  Table,
} from 'reactstrap';

class MoleGame extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      // Mole Hole Number 1-10
      1: 'translate(0, 150%)',
      2: 'translate(0, 150%)',
      3: 'translate(0, 150%)',
      4: 'translate(0, 150%)',
      5: 'translate(0, 150%)',
      6: 'translate(0, 150%)',
      7: 'translate(0, 150%)',
      8: 'translate(0, 150%)',
      9: 'translate(0, 150%)',
      10: 'translate(0, 150%)',
      score: 0,
      started: false,
      moleWhacked: false,
      lastMole: '',
      buttonMessage: 'Start Game',
      gameOver: 'none',
      display: '',
      scoreDisplay: 'block',
      buttonDisplay: 'inline-block',
      restart: false,
    }

  }

  timeOut(num) {
    if (this.state.started) {
      this.setState({
        restart: true,
      })
      return;
    };

    this.setState({
      display: 'block',
      scoreDisplay: 'block',
      gameOver: 'none',
      buttonDisplay: 'none',
      buttonMessage: 'Restart Game'
    });

    window.setTimeout(() => {
      this.startGame();
    }, num);
  }

  startGame() {
    if (this.state.started) { return; }

    this.setState({
      started: true,
      score: 0
    });

    let x = 0;
    const intervalID = setInterval(() => {
      this.displayMoles();

      if (this.state.restart) {
        window.clearInterval(intervalID);
        this.clearMoles();
        this.setState({ started: false });

        window.setTimeout(() => {
          this.setState({
            restart: false,
            buttonMessage: 'Restart Game',
            buttonDisplay: 'inline-block',
            score: 0,
          });

          this.startGame();
        })

      }

      //Max Points == 20
      if (++x === 21) {
        window.clearInterval(intervalID);
        this.clearMoles();
        this.setState({ started: false });

        window.setTimeout(() => {
          this.setState({
            display: 'none',
            scoreDisplay: 'none',
            gameOver: 'block',
            buttonMessage: 'Play again',
            buttonDisplay: 'inline-block',
            restart: false,
            started: false,
          });

          // Game Over
          this.saveRecord();
        }, 850)
      }
    }, 1000);
  }

  clearMoles() {
    for (let value in this.state) {
      if (!isNaN(value)) {
        this.setState({
          [value]: 'translate(0, 150%)' // Mole gone
        });
      }
    }
  }

  displayMoles() {
    let activeMole = Math.ceil(Math.random() * 10);

    if (this.state.lastMole[0] === activeMole) {
      this.displayMoles();
      return;
    }

    this.clearMoles();

    this.setState({
      lastMole: [activeMole],
      [activeMole]: 'translate(0, 50%)' // Mole pop up
    });
  }

  resetMole() {
    window.setTimeout(() => {
      this.setState({ moleWhacked: false }) // Reset mole state
    }, 550)
  }

  onMoleClick(event) {
    // Mole whacked == true; no need to do anything
    if (this.state.moleWhacked) { return; }

    let target = event.target;
    target.parentNode.classList.add('game_whacked');
    target.classList.add('no_bg');

    this.resetMole();

    this.setState({
      moleWhacked: true,
      score: this.state.score + 1
    });

    window.setTimeout(function () {
      target.classList.remove('no_bg');
      target.parentNode.classList.remove('game_whacked');
    }, 450)
  }

  createMoleHoles() {
    var mole_holes = [];

    for (let i = 1; i <= 10; i++) {
      mole_holes.push(<MoleHole key={i} context={this.state} onClick={this.onMoleClick.bind(this)} holeNumber={i} />);
    }

    return (
      <div className="mole_board">
        {mole_holes}
      </div>
    );
  }

  saveRecord() {

    const gameRecord = {
      gameType: 2, //Whack A Mole
      userId: "test", //testdata
      score: this.state.score
    }

    console.log(gameRecord);

    axios.post('http://localhost:5000/record/add', gameRecord)
      .then(res => console.log(res.data));

  }

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardBody>
            <Row>
              <Col>
                <CardTitle className="h1" style={{ paddingTop: 10 }}>Whack A Mole</CardTitle>
              </Col>
              <Col sm="1.2" style={{ marginRight: 20 }}>
                <button type="button" className="start_button orange" onClick={this.timeOut.bind(this)}>
                  {this.state.buttonMessage}
                </button>
              </Col>
            </Row>
            <hr />
            <div style={{ display: this.state.gameOver }}>
              <h1>GAME OVER!</h1>
              <p>You scored {this.state.score}/20</p>
            </div>

            <div style={{ display: this.state.display }}>
              {this.createMoleHoles()}
            </div>
            <br/>
            <div style={{ display: this.state.scoreDisplay }}>
              <h2 style={{ textAlign: "center" }}> Score: {this.state.score}</h2>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default MoleGame;
