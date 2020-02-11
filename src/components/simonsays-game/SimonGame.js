import React, { Component } from 'react';
import '../../App.css';

// console.clear();

// import { cellConvert, gameSpeeds, ui } from './config.js'
const cellConvert = [   // Convert cell quadrants to array indexes.
        'ul', // 0
        'ur', // 1
        'll', // 2
        'lr'  // 3
      ],
      gameSpeeds = {
        1: { each: 900, wait: 700 }, // Slow each; slow wait
        2: { each: 600, wait: 400 }, // Default
        3: { each: 300, wait: 200 }, // Quick each; quick wait
        //                                                     1     2     3
        // revealSimon - setInterval - every 600 buzzIt      [400 / 600 / 800]
        // buzzIt      - setTimeout  - wait 400 then buzzOff [200 / 400 / 600]
      };
    

class SimonGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      game: {
        whoClicked: 's',    // 's'|'p' (Simon or Player) - A controlled variable to be handled each click.
        hasTried: 0,        // 0|1 - Allowed 1 retry (if yolo isn't true).
        playerArray: [],    // Cells the player has clicked.
        simonArray: [],     // Cells the game has chosen (added post-click).
        winArray: [],       // [3,2,5,6,1,...] Number of successful clicks in previous games.
        gameOver: true,
        gameSpeed: 2,       // [1-3] Slow, Medium*, Fast
        gameFlipped: false, // Used in both 'scoreboard' and 'cheat' panels (which side shows).
        gameText: 'Ready',  // Main verbiage in middle of scoreboard.
      },
      buttons: ['', '', '', ''],
      buttonref0: '',
      buttonref1: '',
      buttonref2: '',
      buttonref3: '',
      insideDiv: ['inside'],
      outerDiv: ['outer'],
      cellClassName0: ['cell'],
      cellClassName1: ['cell'],
      cellClassName2: ['cell'],
      cellClassName3: ['cell'],
    };
    this.disableCells = this.disableCells.bind(this);
    // this.resetCells = this.resetCells.bind(this);
    this.setButtons = this.setButtons.bind(this);
    this.setGameSpeed = this.setGameSpeed.bind(this);
    this.setGameText = this.setGameText.bind(this);
    this.setSimonFlip = this.setSimonFlip.bind(this);
    this.setSimonYolo = this.setSimonYolo.bind(this);

    this.setCell = this.setCell.bind(this);

    this.generateNextCell = this.generateNextCell.bind(this);
    this.enableCells = this.enableCells.bind(this);
    this.revealSimon = this.revealSimon.bind(this);
    this.buzzCell = this.buzzCell.bind(this);
    this.startIt = this.startIt.bind(this);

    this.buzzIt = this.buzzIt.bind(this);
    this.buzzOn = this.buzzOn.bind(this);
    this.buzzOff = this.buzzOff.bind(this);
  }
  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyPress);

    let newButtons = this.state.buttons.slice(0);

    for (var idx = 0; idx < 4; idx++) {
      let thisAudio = <Audio key={idx} idx={idx} thisCell={this.state.buttons[idx]} setCell={this.setCell} />; // ref={'child' + idx} | this.refs.child.getAlert()
      newButtons[idx] = thisAudio;
    }

    this.setState({ buttons: newButtons }, () => {
    });
  }




  // 3 Aesthetic Functions to Highlight Cells

  buzzIt(cellId) { // cellId = [0-3]
    this.buzzOn(cellId);
    setTimeout( () => {
      this.buzzOff(cellId);
    }, gameSpeeds[this.state.game.gameSpeed].wait); // Show cell for partial second
    // gameSpeeds = { 1: { each: 400, wait: 200 },
  }
  buzzOn(cellId) {

    let whichCell = 'cellClassName' + cellId,
        buttonref = 'buttonref' + cellId,
        newClassList = this.state[whichCell].slice(0);

    newClassList.push('buzz', 'buzzed');

    this.setState({ [whichCell]: newClassList });

    // Sound /* id = simon-audio-[0-3] */
    // Pausing and setting currentTime helps fix non-playing overlaps on fast mode.
    // Thanks to: https://stackoverflow.com/a/32041746/638153

    this.state[buttonref].pause();
    this.state[buttonref].currentTime = 0;
    this.state[buttonref].play();
  }
  buzzOff(cellId) {

    let whichCell = 'cellClassName' + cellId,          // cellClassName[0-3]
        newClassList = this.state[whichCell].slice(0), // Copy of specific cell's array of class names.
        indexBuzz = newClassList.indexOf('buzz'),      // If class name 'buzz' exists, remove it.
        indexBuzzed = -1;

    if (indexBuzz >= 0) {
      newClassList.splice(indexBuzz, 1);
    }
    indexBuzzed = newClassList.indexOf('buzzed');      // If class name 'buzzed' exists, remove it.
    if (indexBuzzed >= 0) {
      newClassList.splice(indexBuzzed, 1);
    }

    this.setState({ [whichCell]: newClassList });
  }

  // Other Upper-Level Functions

  disableCells() {
    const outerDivClass = this.state.outerDiv.slice(0);
    outerDivClass.push('buzz');
    this.setState({ outerDiv: outerDivClass });
  }
  // resetCells() {
  //   this.setState({ game: {...this.state.game, playerArray: [] } }, () => {
  //     this.setState({ game: {...this.state.game, simonArray: [] } }, () => {
  //       // this.updateDisplays(); // All fields are now reactive
  //     });
  //   });
  // }
  setButtons(audioArray) {
    let tmpButtonsArray = this.state.buttons.slice(0);
    audioArray.map( (tmpBtn, idx) => {
      tmpButtonsArray[idx] = tmpBtn;
    });
    this.setState({ buttons: tmpButtonsArray });
  }
  setGameSpeed(newSpeed) {
    this.setState({ game: {...this.state.game, gameSpeed: newSpeed } });
  }
  setSimonFlip() {
    this.setState({ game: {...this.state.game, gameFlipped: !this.state.game.gameFlipped } });
  }
  setSimonYolo() {
    this.setState({ game: {...this.state.game, yolo: (this.state.game.yolo ? false : true) } }, () => {
      this.startIt();
    });
  }
  setGameText(newVal) {
    this.setState({ game: {...this.state.game, 'gameText': newVal } }, () => {
    });
  }
  startIt() {
   

    this.disableCells();
    this.setState({ game: {
        ...this.state.game,
        whoClicked: 's',        // this.setWhoClick('s')
        gameOver: false,        // this.setGameOver(false)
        hasTried: 0,            // this.setHasTried(0)
        gameText: 'In Play', // this.setGameText('In Play')
        playerArray: [],        // this.resetCells()
        simonArray: []          // this.resetCells()
      }}, () => {
        // Issue with [space/enter] startIt() resetting and starting a new game,
        // but neither 'S' nor either click ('Strict' or 'Start') would start a new game.
        // Issue was with multiple (async) setStates being done in separate function calls called from startIt().
        // Pulled each setState from their respective function calls and put directly into the startIt() function,
        // and put them all in the same setState action; as they should be (including resetCells).
        this.generateNextCell();
    });
  }
  generateNextCell() {
    // Wait 3/4 of a sec, then buzz the cell with [0-3].
    setTimeout( () => { this.buzzCell(this.getRandomCell()) }, 750);
  }
  enableCells() {
    const outerDivClass = this.state.outerDiv.slice(0);
    outerDivClass.splice(outerDivClass.indexOf('buzz'), 1);
    this.setState({ outerDiv: outerDivClass });
    // Array.from(document.getElementsByClassName('outer'))[0].classList.remove('buzz');
  }
  getRandomCell() {
    return Math.floor(Math.random() * 4);
  }
  revealSimon() {
    var i = 0,
        { playerArray } = this.state.game;

    var showThem = setInterval( () => {
            if (i < this.state.game.simonArray.length) {
              // Grab each index from the 'simonArray', and convert it to a cell ID.
              this.buzzIt(this.state.game.simonArray[i]);
            } else {
              clearInterval(showThem);
              // document.getElementById('game-over').innerText = 'Waiting...\r\n(it\'s your turn)';
              // this.state.game.playerArray = [];
              this.setState({
                  game: {
                    ...this.state.game,
                    gameOver: false,
                    gameText: 'Waiting...\r\n(it\'s your turn)',
                    playerArray: []
                  }
                }, () => {
                  this.enableCells();
              });
            }
            i++;
            // console.log('revealSimon: ', this.state.game.gameSpeed);
            // console.log('setInterval: ', gameSpeeds[this.state.game.gameSpeed].each);
          }, gameSpeeds[this.state.game.gameSpeed].each);
    // gameSpeeds = {
    //   1: { each: 400, wait: 200 },
  }
  buzzCell(cell) {
    // This is the 'brains' of the app (i.e., the Controller).

    // cell = number [0-3]

    var cellId = cellConvert[cell],          // cellId = 'ul'|'ur'|'ll'|'lr'
        turnSimon = this.state.game.whoClicked === 's',
        gameOver = this.state.game.gameOver; // && this.state.game.gameText.toLowerCase() !== 'ready'

    // console.log('buzzCell: ', cell, cellId, turnSimon, gameOver); // 3, lr, true, false

    if (gameOver) {

      this.buzzIt(cell); // Just for fun... game is over.
      setTimeout( () => this.enableCells(), 100);

    } else if (turnSimon) {

      let { simonArray, whoClicked } = this.state.game,
          simonArrayNew = this.state.game.simonArray.slice(0);

      simonArrayNew.push(cell);

      this.setState({ game: {...this.state.game, simonArray: simonArrayNew } }, () => {

        // game.simonArray.push(cell); // [0,1,2,3,0,1,2,3]
        // updatePlayCountDisplay(); // Should be run whenever simonArray is changed.

        // Show all of Simon's moves.
        this.revealSimon();

        // Swap side back to player.
        // game.whoClicked = 'p'; // Control the var!
        this.setState({ game: {...this.state.game, whoClicked: 'p' } });
      });

    } else {
      // Player's Turn

      let { playerArray, gameOver, gameText, hasTried, whoClicked, winArray } = this.state.game,
          playerArrayNew = this.state.game.playerArray.slice(0),
          winArrayNew = this.state.game.winArray.slice(0);

      // Store it.
      // game.playerArray.push(cell); // [] ... [3]
      playerArrayNew.push(cell);

      // console.log('buzzCell ELSE: ', cell, cellId, turnSimon, gameOver);

      this.setState({ game: {...this.state.game, playerArray: playerArrayNew } }, () => {

        // Buzz it.
        this.buzzIt(cell);

        let tempCheck = false;
        // Then test them all.
        for (var i = 0; i < this.state.game.playerArray.length; i++) {
          if (this.state.game.playerArray[i] !== this.state.game.simonArray[i]) {
            // Incorrect - Reset
            this.setState({ game: {...this.state.game, playerArray: [] } });
            tempCheck = true;
            // game.playerArray = [];
            break;
          }
        }

        if (tempCheck) { // this.state.game.playerArray.length === 0 // State isn't set yet (async)...
          // An incorrect cell was clicked (and playerArray was zeroed out).
          if (this.state.game.hasTried === 0 && !this.state.game.yolo) {
            // document.getElementById('game-over').innerText = '...whoops!!!';
            // game.hasTried = 1;
            this.setState({ game: {
                ...this.state.game,
                gameText: '...whoops!!!',
                hasTried: 1
              } }, () => {
                this.revealSimon();
            });
          } else {
            winArrayNew.push(this.state.game.simonArray.length);
            this.setState({ game: {
                ...this.state.game,
                gameOver: true,
                gameText: 'Lost',
                hasTried: 0,
                whoClicked: 's',
                winArray: winArrayNew,
                playerArray: [],
                simonArray: []
              } }, () => {
                this.enableCells();
                // this.resetCells();
            });
          }

        } else if (this.state.game.playerArray.length === 20) {
          winArrayNew.push(20);
          this.setState({ game: {
              ...this.state.game,
              gameOver: true,
              gameText: 'Won!!!',
              hasTried: 0,
              winArray: winArrayNew
            } }, () => {
              this.enableCells();
          });
          // game.gameOver = true;
          // document.getElementById('game-over').innerText = 'Won!!!';
          // game.hasTried = 0;
          // game.winArray.push(20);

        } else if (this.state.game.playerArray.length === this.state.game.simonArray.length) {

          // You survived another round!!!
          this.setState({ game: {
              ...this.state.game,
              gameText: 'In Play',
              hasTried: 0,
              whoClicked: 's',
              playerArray: []
            } }, () => {
              this.generateNextCell();
          });
          // document.getElementById('game-over').innerText = 'In Play';
          // game.hasTried = 0;
          // game.whoClicked = 's'; // Control the var!
          // game.playerArray = [];

        } else {
          this.enableCells();
        }
      });
    }
  }
  setCell(cellId, cellRef) {
    let newButtonRef = 'buttonref' + cellId;

    this.setState({ [newButtonRef]: cellRef });
  }
  
  render() {
    return (
	
    
	  <div className="mole_background">
	  <h1 class="display-1" className="mole_title" >SIMON SAYS</h1>
	  
	  
        <div className="hidden">
          <div>whoClicked: {this.state.game.whoClicked}</div>
          <div>hasTried: {this.state.game.hasTried}</div>
          <div>playerArray: {this.state.game.playerArray}</div>
          <div>simonArray: {this.state.game.simonArray}</div>
          <div>winArray: {this.state.game.winArray}</div>
          <div>gameOver: {this.state.game.gameOver ? 'true' : 'false'}</div>
          <div>gameSpeed: {this.state.game.gameSpeed}</div>
          <div>gameText: {this.state.game.gameText}</div>
        </div>
        
          <div className={this.state.outerDiv.toString().replace(/\,/g, ' ')}>{/* outer */}
            <img src="https://dummyimage.com/50x50/000/fff.gif&text=50x50" className="sq-setter-w" />
            {/* @TODO: Bring <img> down local */}
            <div className={this.state.insideDiv.toString().replace(/\,/g, ' ')}>{/* inside */}
              <div className="inside2">
                <Scoreboard
                  startIt={this.startIt}
                  setGameSpeed={this.setGameSpeed}
                  gameSpeed={this.state.game.gameSpeed}
                  gameText={this.state.game.gameText}
                  playCount={this.state.game.simonArray.length}
                  winArraySum={this.state.game.winArray.reduce((sum, score) => { return (score === 20) ? sum + 1 : sum; }, 0)}
                />
                <Cells
                  disableCells={this.disableCells}
                  buzzCell={this.buzzCell}
                  cellClassName0={this.state.cellClassName0}
                  cellClassName1={this.state.cellClassName1}
                  cellClassName2={this.state.cellClassName2}
                  cellClassName3={this.state.cellClassName3}
                  />
              </div>
            </div>
          </div>
          <div>{ this.state.buttons.map( (elem, idx) => {
            return elem;
           } ) }</div>
        </div>
		
     
    );
  }
}

// END OF MAIN SIMON COMPONENT CLASS

class Scoreboard extends React.Component {
  constructor(props) {
    super(props);

    let currentGameSpeed = this.props.gameSpeed;

    this.state = {
      gameSpeed: currentGameSpeed,
    };

    this.simonSpeed = this.simonSpeed.bind(this);
    this.propStartIt = this.propStartIt.bind(this);
  }
  componentDidMount() {
    
  }
  propStartIt(e) {
    this.props.startIt();
  }
  simonSpeed(e) {
    let newSpeed = (e.target.value === "1") ? 1 : (e.target.value === "3") ? 3 : 2;
    this.setState({ gameSpeed: newSpeed }, () => {
      this.props.setGameSpeed(this.state.gameSpeed);
    });
  }
  render() {
    return (
      <div className={'scoreboard' + (this.props.simonFlip ? ' flip' : '')}>
        <div className="scoreboard-top">
          <div className="div-start">Start: <div id="start" tabIndex="0" onClick={this.propStartIt} ref="autoFocus"></div></div>
          <div className="clearb"></div>
          
          <div className="clearb"></div>
          <div>Speed <small>(1-3)</small>: <input id="simon-speed" type="number" min="1" max="3" onChange={this.simonSpeed} value={this.state.gameSpeed} /></div>
        </div>
        <div className="scoreboard-middle">
          <div><div className="game-is"><span>Game is: <span id="game-over">{this.props.gameText}</span></span></div></div>
        </div>
        <div className="scoreboard-bottom">
          <div>Play Count: <span id="play-count">{this.props.playCount}</span></div>
          <div className="clearb"></div>
          <div>Wins: <span id="game-wins">{this.props.winArraySum}</span></div>
        </div>
      </div>
    )
  }
}

class Cells extends React.Component {
  constructor(props) {
    super(props);
    this.registerClick = this.registerClick.bind(this);
  }
  registerClick(e) {
    this.props.disableCells();

    // [cellConvert] Maps the cell ID ('ul') to its index [0-3].
    this.props.buzzCell(cellConvert.indexOf(e.target.id));
  }
  render() {
    return (
      <div className="cells">
        <div id="ul" className={this.props.cellClassName0.toString().replace(/\,/g, ' ')} tabIndex="0" onClick={this.registerClick}></div>
        <div id="ur" className={this.props.cellClassName1.toString().replace(/\,/g, ' ')} tabIndex="0" onClick={this.registerClick}></div>
        <div id="ll" className={this.props.cellClassName2.toString().replace(/\,/g, ' ')} tabIndex="0" onClick={this.registerClick}></div>
        <div id="lr" className={this.props.cellClassName3.toString().replace(/\,/g, ' ')} tabIndex="0" onClick={this.registerClick}></div>
      </div>
    )
  }
}

class Audio extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // AUDIO HANDLING

    // each 'thisCell' (buttons[] array entry) begins empty with ''
    if (this.props.thisCell !== this.refs['child' + this.props.idx]) { // this.props.thisCell.length > 0 &&
      this.props.setCell(this.props.idx, this.refs['child' + this.props.idx]);
    }
  }
  render() {
    let tmpAudio = {},
        { idx } = this.props; // idx = [0-3]

    tmpAudio.id = 'simon-audio-' + idx;
    tmpAudio.src = 'https://s3.amazonaws.com/freecodecamp/simonSound' + (idx + 1) + '.mp3';

    return (
      <audio id={tmpAudio.id} src={tmpAudio.src} preload="auto" autoPlay={false} type="audio/mpeg" ref={'child' + idx}></audio>
    )
  }
}


 

export default SimonGame;