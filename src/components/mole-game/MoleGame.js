import React, { Component } from 'react';
import axios from 'axios';
import MoleHole from "./MoleHole";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';
import SecondsTohhmmss from '../../utils/SecondsTohhmmss'
import { connect } from "react-redux";

let offset = null, interval = null
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
      scoreDisplay: 'none',
      buttonDisplay: 'inline-block',
      restart: false,
      time: '',
      clock: 0,
      reactionTime: 0,
      avgReactionTime: 0,
    }

  }

  //******** TIMER  */

  componentWillUnmount() {
    this.pause()
  }

  pause() {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  play() {
    if (!interval) {
      offset = Date.now()
      interval = setInterval(this.update.bind(this), 0)
    }
  }

  reset() {
    let clockReset = 0
    this.setState({ clock: clockReset })
    let time = SecondsTohhmmss(clockReset / 1000)
    this.setState({ time: time })
  }

  update() {
    let clock = this.state.clock
    clock += this.calculateOffset()
    this.setState({ clock: clock })
    let time = SecondsTohhmmss(clock / 1000)
    this.setState({ time: time })
  }

  calculateOffset() {
    let now = Date.now()
    let newOffset = now - offset
    offset = now
    return newOffset
  }

  //******** GAME  */
  timeOut(num) {
    if (this.state.started) {
      this.setState({
        restart: true,
        time: '',
            clock: 0,
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

  // Start Mole Game
  startGame() {
    if (this.state.started) { return; }

    this.setState({
      started: true,
      score: 0,
      reactionTime: 0,
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
            time: '',
            clock: 0,
            reactionTime: 0,
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
            time: '',
            clock: 0,
          });

          // Game Over
          // Pause Time
          this.pause();
          this.saveRecord();
        }, 850)
      }
    }, 1000);
  }

  // Clear Moles after pop up
  clearMoles() {
    for (let value in this.state) {
      if (!isNaN(value)) {
        this.setState({
          [value]: 'translate(0, 150%)' // Mole gone
        });
      }
    }
  }

  // Display Moles for mole pop up
  displayMoles() {

    // Start Time
    this.play();

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

  // Reset Mole state
  resetMole() {
    window.setTimeout(() => {
      this.setState({ moleWhacked: false })
    }, 550)
  }

  // Mole Clicked -- Add score
  onMoleClick(event) {
    if (this.state.moleWhacked) { return; }

    // Reset Time
    this.setState({
      reactionTime: this.state.reactionTime + (this.state.clock / 1000)
    })
    this.reset();

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

  // Create Mole Holes
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

  // Save to Database
  async saveRecord() {

    // Get Game Data
    let res = await axios.get('/game/Whack A Mole');

    this.setState({
      avgReactionTime: Math.round((this.state.reactionTime / this.state.score) * 1000) / 1000
    })

    const gameRecord = {
      gameId: res.data._id,
      userId: this.props.auth.user.id,
      score: this.state.score,
      reactionTime: this.state.avgReactionTime
    }

    console.log(gameRecord);

    // Add To Game Record
    axios.post('/record/add', gameRecord)
      .then(res => console.log(res.data));

    this.setState({
      reactionTime: 0
    })
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
              <p>Average Reaction Time: {this.state.avgReactionTime}</p>
            </div>

            <div style={{ display: this.state.display }}>
              {this.createMoleHoles()}
            </div>
            <br />
            <div style={{ display: this.state.scoreDisplay }}>
              <h2 style={{ textAlign: "center" }}> Score: {this.state.score}</h2>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps
)(MoleGame);