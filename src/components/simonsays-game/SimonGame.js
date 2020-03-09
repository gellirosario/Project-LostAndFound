import React from 'react';
import axios from 'axios';
import SimonButtons from './SimonButtons';
import simonSound1 from './../../assets/sounds/simonSound1.mp3'
import simonSound2 from './../../assets/sounds/simonSound2.mp3'
import simonSound3 from './../../assets/sounds/simonSound3.mp3'
import simonSound4 from './../../assets/sounds/simonSound4.mp3'
import { connect } from "react-redux";

var intervalRepeatSequence;
var resetColor;

class SimonGame extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      colors: ['red', 'green', 'yellow', 'blue'],
      cpuMoves: [],
      userMoves: [],
      //Used to animate flash the button color
      activeColor: '',
      //Tracks current round
      gameRound: 0,
      //Used as conditional for display counter, start/reset button
      gameInProgress: false,
      //Used to repeat last sequence without a new color when user is wrong
      userIsWrong: false,
      //Used to disable clicking color buttons until user's turn
      readyForUserInput: false,
      //Stores the sound fx clips
      sounds: {
        red: new Audio(simonSound1),
        green: new Audio(simonSound2),
        yellow: new Audio(simonSound3),
        blue: new Audio(simonSound4),
      },
      display: 'block',
      gameOver: 'none',
      scoreDisplay: 'none',
      score: 0,
      tries: 3,
    }
    this.handleNewSequence = this.handleNewSequence.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.verifyUserMoves = this.verifyUserMoves.bind(this);
    this.repeatSequence = this.repeatSequence.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.endGame = this.endGame.bind(this);
  }

  //Runs when user clicks start and when CPU adds a new color to a sequence
  handleNewSequence() {

    if(!this.state.gameInProgress)
    {
      this.setState({
        score: 0,
        tries: 3
      })
    }

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
      // strictRestart: false,
      scoreDisplay: 'block',
      gameOver: 'none',
      display: 'block',
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
    //User can only click when it's their turn (sequence is not running)
    if (this.state.readyForUserInput) {

      //Prevent overlapping sounds if user clicks quickly
      this.state.sounds[color].pause();
      //this.state.sounds[color].currentTime = 0;

      //Record the user's move and animate the clicked button
      let inputtedColor = color;
      this.setState({
        userMoves: [...this.state.userMoves, inputtedColor],
        activeColor: color
      });
      this.state.sounds[color].play();
      //Reset the color style ('turn off')
      //Needs to be same time as checkIfUserTurn so user can't input too early
      resetColor = setTimeout(() => {
        this.setState({
          activeColor: '',
          readyForUserInput: true,
        });
      }, 100);

      //Runs after each user click to check if user's turn is over (when length of userMoves = length of cpuMoves)
      setTimeout(() => {
        //check if current move is correct or not
        let index = this.state.userMoves.length - 1;
        if (this.state.userMoves[index] !== this.state.cpuMoves[index]) {
          this.setState({
            readyForUserInput: false,
          })
          this.verifyUserMoves()
        }
        //Used !strictRestart to prevent from running when the user is wrong in strict mode (since game must restart from 0) 
        if (this.state.userMoves.length === this.state.cpuMoves.length) {
          this.verifyUserMoves()
          //disable buttons when user finishes turn
          this.setState({
            readyForUserInput: false,
          });
        }
      }, 100)
    }
  }

  //Runs when user's turn is over
  verifyUserMoves() {
    //Checks for exact match between userMoves and cpuMoves, used join bc values are in arrays
    if (((this.state.userMoves.join() === this.state.cpuMoves.join()) && this.state.userMoves.length !== 0 && this.state.cpuMoves.length !== 0)) {

      this.repeatSequence();
      //Update the gameRound counter to show advancing to next round

      this.setState({
        gameRound: this.state.gameRound + 1,
        score: this.state.score+1,
        //Ensure userIsWrong is set to false so repeatSequence() will run createNewSequence(runs handleNewSequence to add a new color)
        userIsWrong: false,
      })
    }

    else if (this.state.userMoves.length !== 0 && this.state.cpuMoves.length !== 0) {
      //Turn off any running intervals/timeouts
      this.setState({
        userMoves: [],
        tries: this.state.tries-1,
        //This ensures repeatSequence() won't run createNewSequence bc should not add a new color if user is wrong
        userIsWrong: true,
      })

      //Replay the previous sequence so user can re-try

      if (this.state.tries === 0) {
        this.endGame();
        //this.resetGame();  
      }
      else {
        this.repeatSequence();
      }
    }


    //  }

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
        setTimeout(() => {
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
          setTimeout(() => {
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
    clearInterval(intervalRepeatSequence);
    clearTimeout(resetColor);

    //Restore state values to default
    this.setState({
      cpuMoves: [],
      userMoves: [],
      activeColor: '',
      gameRound: 0,
      gameInProgress: false,
      userIsWrong: false,
      readyForUserInput: false,
      gameOver: 'none',
      display: 'block',
      scoreDisplay: 'block',
      score: 0,
      tries: 3,
    });

    setTimeout(() => {
      this.handleNewSequence()
    }, 500)
  }

  endGame() {
    
    this.saveRecord();
    
    //Turn off any running intervals/timeouts
    clearInterval(intervalRepeatSequence);
    clearTimeout(resetColor);

    this.setState({
      gameOver: 'block',
      display: 'none',
      scoreDisplay: 'none',
      gameInProgress: false,
      cpuMoves: [],
      userMoves: [],
      activeColor: '',
      gameRound: 0,
      userIsWrong: false,
      readyForUserInput: false,
    })
  }

  // Save to Database
  async saveRecord() {

    // Get Game Data
    let res = await axios.get('/game/find/SimonSays');

    const gameRecord = {
      gameId: res.data._id,
      userId: this.props.auth.user.id,
      score: this.state.score
    }

    console.log(gameRecord);

    // Add To Game Record
    axios.post('/record/add', gameRecord)
      .then(res => console.log(res.data));

  }

  render() {
    const { gameInProgress, activeColor, readyForUserInput, display, scoreDisplay, gameOver, tries, score } = this.state;
    return (
      <SimonButtons
        //Starts the game if it hasn't started, otherwise, it resets the game
        handleStartReset={!gameInProgress ? this.handleNewSequence : this.resetGame}
        startResetText={!gameInProgress ? 'Start Game' : 'Reset Game'}
        //Animates the button on and off using classes
        activeColor={activeColor}
        //Enables/disables color buttons
        readyForUserInput={readyForUserInput}
        //When user clicks on a color
        handleUserInput={this.handleUserInput}
        //Tracks and displays the score & tries 
        score={score}
        tries={tries}
        display={display}
        scoreDisplay={scoreDisplay}
        gameOver={gameOver}
      />
    )
  }

}
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps
)(SimonGame);