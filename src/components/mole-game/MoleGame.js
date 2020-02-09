import React, { Component } from 'react';

/*Components*/
import StartMoleGameButton from "./StartMoleGameButton";
import MoleHole from "./MoleHole";

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

      started: false,
      moleWhacked: false,
      level: 0,
      highscore: 0,
      score: 0,
      lastMole: '',
      buttonMessage: 'Start Game',
      display: 'none',
      gameOver: 'none',
    }
  }

  timeOut(num) {
    if (this.state.started) { return };
    this.setState({
      display: 'block',
      gameOver: 'none',
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

      //Max Points == 20
      if (++x === 21) {
        window.clearInterval(intervalID);
        this.clearMoles();
        this.setState({ started: false });

        window.setTimeout(() => {
          this.setState({
            display: 'none',
            gameOver: 'block',
            buttonMessage: 'Play again'
          });
          //this.animate(this.refs.gameOver);
        }, 800)
      }
    }, 500);
  }

  clearMoles() {
    for (let value in this.state) {
      if (!isNaN(value)) {
        this.setState({
          [value]: 'translate(0, 150%)'
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
      [activeMole]: 'translate(0, 50%)',
      lastMole: [activeMole]
    });
  }

  createMoleHoles() {
    var mole_holes = [];
    for (let i = 1; i <= 10; i++) {
      mole_holes.push(<MoleHole key={i} holeNumber={i} context={ this.state }/>);
    }
    return (
      <div className="mole_board">
        {mole_holes}
      </div>
    );
  }

  render() {
    return (
      <div >
        <div className="mole_background">
          <h1 class="display-1" className="mole_title" >WHACK-A-MOLE</h1>
          <div className="mole_buttons"><p class="lead"> Level: {this.state.level} | Highscore: {this.state.highscore}</p>
            <button type="button" class="btn btn-info" style={{ marginRight: "15px", color: "white" }}>Instructions</button>
            <StartMoleGameButton context={this.state} onClick={this.timeOut.bind(this)} />
          </div>
          {this.createMoleHoles()}
        </div>
      </div>
    );
  }
}

export default MoleGame;
