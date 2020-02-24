import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';

//Color buttons that animate and are clicked on by user
const ColorButton = function (props) {
  return (
    <div id={props.id} className={props.className} onClick={props.onClick}></div>
  )
}

//Renders start/reset and strict buttons
const SettingsControls = function (props) {
  return (
    <Col sm="1.2" style={{ marginRight: 20 }}>
      <button className="start_button" id='start-reset-button'
        onClick={props.onClick}>{props.startResetText}</button>
      &nbsp;&nbsp;
    </Col>
  )
}

//Displays the game round
const DisplayCircle = function (props) {
  return (
    <h2 style={{ textAlign: "center" }}>Score: {props.gameRound}
    </h2>
  )
}

//Renders the overall model including ColorButton, SettingsControls, and DisplayCircle
//Determines color animations based on props.activeColor
const SimonCircle = function (props) {
  return (

    <div className="animated fadeIn">
      <Card>
        <CardBody>
          <Row>
            <Col>
              <CardTitle className="h1" style={{ paddingTop: 10 }}>Simon Says</CardTitle>
            </Col>
            <SettingsControls
              onClick={props.handleStartReset}
              toggleStrict={props.toggleStrictMode}
              startResetText={props.startResetText}
              className={props.className} />
          </Row>
          <hr />
          <div class="column" style={{textAlign:"center"}}>
            <ColorButton id='red-circle'
              //animate the button with active-circle class and disable its pointer-events until the user's turn
              //color-circle is default class
              className={props.activeColor === 'red' ? 'color-circle active-circle pointer-events-disabled'
                : !props.readyForUserInput ? "color-circle pointer-events-disabled"
                  : 'color-circle'}
              //pass the respective color as argument to onClick; used arrow syntax to prevent auto-running
              onClick={() => { props.handleUserInput('red') }} />
            <ColorButton id='green-circle'
              className={props.activeColor === 'green' ? 'color-circle active-circle pointer-events-disabled'
                : !props.readyForUserInput ? "color-circle pointer-events-disabled"
                  : 'color-circle'}
              onClick={() => { props.handleUserInput('green') }} />

          </div>
          <div class="column" style={{textAlign:"center"}}>
            <ColorButton id='yellow-circle'
              className={props.activeColor === 'yellow' ? 'color-circle active-circle pointer-events-disabled'
                : !props.readyForUserInput ? "color-circle pointer-events-disabled"
                  : 'color-circle'}
              onClick={() => { props.handleUserInput('yellow') }} />
            <ColorButton id='blue-circle'
              className={props.activeColor === 'blue' ? 'color-circle active-circle pointer-events-disabled'
                : !props.readyForUserInput ? "color-circle pointer-events-disabled"
                  : 'color-circle'}
              onClick={() => { props.handleUserInput('blue') }} />
          </div>
          <DisplayCircle gameRound={props.gameRound}> </DisplayCircle>
        </CardBody>
      </Card>
    </div>

  )
}

//Declared timeout/intervals outside to make global so resetGame() can access them
var intervalRepeatSequence;
var resetColor;

class SimonGame extends React.Component {



  constructor(props) {
    super(props)
    this.state = {
      colors: ['red', 'green', 'yellow', 'blue'],
      cpuMoves: [],
      userMoves: [],
      //Used to animate the button on/off
      activeColor: '',
      //Tracks current round
      gameRound: -1,
      //Used as conditional for display counter, start/reset button, and strict button
      gameInProgress: false,
      //Used to repeat last sequence without a new color when user is wrong
      userIsWrong: false,
      //Used to disable clicking color buttons until user's turn
      readyForUserInput: false,
      //Strict is off by default
      strictMode: true,
      //Indicates restarting in strict mode after incorrect input
      strictRestart: false,
      //Stores the sound fx clips
      sounds: {
        red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
        green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
        yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
        blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
      },
    }
    this.handleNewSequence = this.handleNewSequence.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.verifyUserMoves = this.verifyUserMoves.bind(this);
    this.repeatSequence = this.repeatSequence.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.toggleStrictMode = this.toggleStrictMode.bind(this);
  }

  //Runs when user clicks start and when CPU adds a new color to a sequence
  handleNewSequence() {
    //Used 4 cause picking from 4 colors
    let randomColor = this.state.colors[Math.floor(Math.random() * 4)];
    //When game starts, gameRound will be set to 1, otherwise, it remains the same value
    const currentRound = this.state.gameInProgress ? this.state.gameRound : this.state.gameRound + 1;
    this.setState({
      //Record the color CPU chose
      cpuMoves: [...this.state.cpuMoves, randomColor],
      //Animate the color 'on'
      activeColor: randomColor,
      gameRound: currentRound,
      //Changes start to reset and disables strict button once game begins
      gameInProgress: true,
      strictRestart: false,
    });
    this.state.sounds[randomColor].play();
    //Turn the animation off after a delay using timeout, also allow user to input once sequence is finished
    resetColor = setTimeout(() => {
      this.setState({
        activeColor: '',
        readyForUserInput: true,
      });
    }, 500);
  }

  //Runs when user clicks a color; color argument is passed from SimonCircle's onClick prop
  handleUserInput(color) {
    //  const {readyForUserInput, sounds, userMoves, cpuMoves, strictMode, strictRestart} = this.state;
    //User can only click when it's their turn (sequence is not running)
    if (this.state.readyForUserInput) {
      //Prevent overlapping sounds if user clicks quickly
      this.state.sounds[color].pause();
      this.state.sounds[color].currentTime = 0;
      //Record the user's move and animate the clicked button
      let inputtedColor = color;
      this.setState({
        userMoves: [...this.state.userMoves, inputtedColor],
        activeColor: color
      });
      this.state.sounds[color].play();
      //Reset the color style ('turn off')
      //Needs to be same time as checkIfUserTurn so user can't input too early
      let resetColor = setTimeout(() => {
        this.setState({
          activeColor: '',
          readyForUserInput: true,
        });
      }, 100);
      //Runs after each user click to check if user's turn is over (when length of userMoves = length of cpuMoves)
      let checkIfUserTurnIsOver = setTimeout(() => {
        //check if current move is oorrect or not
        let index = this.state.userMoves.length - 1;
        if (this.state.userMoves[index] !== this.state.cpuMoves[index] && !this.state.strictMode) {
          this.setState({
            readyForUserInput: false,
          })
          this.verifyUserMoves()
        }
        //Used !strictRestart to prevent from running when the user is wrong in strict mode (since game must restart from 0) 
        if (this.state.userMoves.length === this.state.cpuMoves.length && !this.state.strictRestart) {
          this.verifyUserMoves()
          //disable buttons when user finishes turn
          this.setState({
            readyForUserInput: false,
          });
        }
      }, 100)

      //Checks if user's move is correct after each click when strict mode is on (non-strict only checks at end of turn)
      if (this.state.strictMode) {
        //This timeout needs to run faster than checkIfUserTurnIsOver to give it priority
        let strictTimeout = setTimeout(() => {
          let index = this.state.userMoves.length - 1;
          //If the user's current move is incorrect
          if (this.state.userMoves[index] !== this.state.cpuMoves[index]) {
            //Disable buttons and indicate game is restarting
            this.setState({
              readyForUserInput: false,
              strictRestart: true,
            });
            //Clear to prevent it from allowing user input; resetGame() resets color anyway
            clearTimeout(resetColor);
            //Reset game to 0 and default values
            this.resetGame();
            //Start a new game
            //Needed to use timeout to have delay between restarting and starting new game
            let timeoutNewSequence = setTimeout(() => {
              this.handleNewSequence()
            }, 500)
          }
        }, 75)
      }
    }
  }

  //Runs when user's turn is over
  verifyUserMoves() {
    //Checks for exact match between userMoves and cpuMoves, used join bc values are in arrays
    if (this.state.userMoves.join() === this.state.cpuMoves.join()) {
      this.repeatSequence();
      //Update the gameRound counter to show advancing to next round
      this.setState({
        gameRound: this.state.gameRound + 1,
        //Ensure userIsWrong is set to false so repeatSequence() will run createNewSequence(runs handleNewSequence to add a new color)
        userIsWrong: false,
      })
    }
    //If user is incorrect while not strict mode bc in strict mode, an incorrect answer does not run verifyUserMoves
    else if (!this.state.strictMode) {
      //Empty userMoves so user can re-input
      this.setState({
        userMoves: [],
        //This ensures repeatSequence() won't run createNewSequence bc should not add a new color if user is wrong
        userIsWrong: true,
      })
      //Replay the previous sequence so user can re-try
      this.repeatSequence();
    }
  }

  //If verifyUserMoves determined user was right, this repeats the sequence with a new color
  //If user was wrong, this repeats the sequence as is then allows user to try again
  repeatSequence() {
    // Empty userMoves for new turn
    this.setState({
      userMoves: []
    })
    //Used to access each color inside cpuMoves; start at -1 so first time = 0 bc increments by 1 each time
    var index = -1;
    //This iterates through each color in cpuMoves per second 
    intervalRepeatSequence = setInterval(() => {
      //Increment index by 1 each time in order to loop through the whole array
      index++;
      this.setState({
        //Turn off the current color
        activeColor: ''
      })
      //When sequence is on-going
      if (index <= this.state.cpuMoves.length - 1) {
        //Get the next color to repeat
        let currentColor = this.state.cpuMoves[index];
        //Animate the next color, used timeout bc need delay after clearing the previous color (in case same color)
        let timeout = setTimeout(() => {
          this.setState({
            activeColor: currentColor,
          })
          this.state.sounds[currentColor].play()
        }, 500)
      }
      //When sequence has finished (reached the final index in cpuMoves)
      else {
        //Stop the interval from running again
        clearInterval(intervalRepeatSequence);
        //If user was correct, run handleNewSequence (add a new color to the sequence)
        if (this.state.userIsWrong === false) {
          let createNewSequence = setTimeout(() => {
            this.handleNewSequence()
          }, 500)
        }
        //If the user was wrong, enable the buttons so user can try again (only occurs if not in strict mode)
        if (this.state.userIsWrong) {
          this.setState({
            readyForUserInput: true,
          })
        }
      }
    }, 1000)
  }

  //Only enabled after game begins, will stop game and reset all values
  resetGame() {
    //Turn off any running intervals/timeouts
    let stopGame = clearInterval(intervalRepeatSequence);
    let stopGame2 = clearTimeout(resetColor);
    //Restore state values to default
    this.setState({
      cpuMoves: [],
      userMoves: [],
      activeColor: '',
      gameRound: -1,
      gameInProgress: false,
      userIsWrong: false,
      readyForUserInput: false,
    });
  }

  //Runs when strict buttons is clicked while game isn't running
  toggleStrictMode() {
    const { gameInProgress, strictMode } = this.state;
    //User can only toggle if game has not begun
    if (!gameInProgress) {
      this.setState({
        strictMode: !strictMode
      });
    }
  }

  displayGameRound() {
    const { strictRestart, gameRound } = this.state;
    if (strictRestart) {
      return 'GAME-OVER';
    }
    if (gameRound <= 0) {
      return '0';
    }
    if (gameRound < 10) {
      return gameRound;
    } else
      return gameRound;
  }

  render() {
    const { gameInProgress, activeColor, readyForUserInput, strictMode } = this.state;
    return (

      <SimonCircle
        //Starts the game if it hasn't started, otherwise, it resets the game
        handleStartReset={!gameInProgress ? this.handleNewSequence : this.resetGame}
        startResetText={!gameInProgress ? 'Start Game' : 'Reset Game'}
        //Animates the button on and off using classes
        activeColor={activeColor}
        //Enables/disables color buttons
        readyForUserInput={readyForUserInput}
        //When user clicks on a color
        handleUserInput={this.handleUserInput}
        //Strict button has different styling depending if on/off and whether game has started
        //Disabled pointer-events during game bc strict button shouldn't be clickable once game starts
        className={
          strictMode && !gameInProgress ? 'strict-enabled'
            : strictMode && gameInProgress ? 'strict-enabled pointer-events-disabled'
              : !strictMode && gameInProgress ? 'strict-disabled pointer-events-disabled'
                : 'strict-disabled'}
        toggleStrictMode={this.toggleStrictMode}
        //Tracks and displays the round
        gameRound={this.displayGameRound()} />
    )
  }





}


export default SimonGame;