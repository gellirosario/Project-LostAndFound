import React, { Component } from 'react';
import axios from 'axios';
import MatchCard from "./MatchCard";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';
import { connect } from "react-redux";
import SecondsTohhmmss from '../../utils/SecondsTohhmmss'

let IMAGES = ["cat", "cooky", "tata", "chimmy", "shooky", "mang", "koya", "rj", "van"];
var CARDS = [];

let offset = null, interval = null
var totalScore = null
class MatchGame extends Component {

  constructor(props) {
    super(props);

    IMAGES = ["cooky", "tata", "chimmy", "shooky"];

    CARDS = this.shuffleCards(IMAGES.slice().concat(IMAGES.slice()));

    this.state = {
      cards: CARDS,
      selected: [],
      correct: [], //indexes which have been guessed correctly
      score: 0,
      text: "0/" + IMAGES.length,
      flips: 0,
      isFlipDisabled: true,
      buttonMessage: 'Start Game',
      gameOver: 'none',
      display: '',
      scoreDisplay: 'none',
      time: '',
      clock: 0,
      totalTime: 0,
      round: 1,
      nextRound: false,
    };



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
  restartGame() {

    if (this.state.nextRound === false)
    {
      IMAGES = [];
    }

    if (this.state.nextRound === false) {

      IMAGES = ["cooky", "tata", "chimmy", "shooky"];
      CARDS = this.shuffleCards(IMAGES.slice().concat(IMAGES.slice()));

      //Pause Timer
      this.pause();

      this.setState({
        selected: [],
        correct: [],
        score: 0,
        text: "0/" + IMAGES.length,
        flips: 0,
        isFlipDisabled: true,
        buttonMessage: "Restart Game",
        display: '',
        gameOver: 'none',
        scoreDisplay: '',
        round: 1
      }, function () {
        setTimeout(() => {
          this.setState({
            selected: Array.from(Array(CARDS.length).keys()),
            isFlipDisabled: false,
            cards: this.shuffleCards(IMAGES.slice().concat(IMAGES.slice())),
          });
          setTimeout(() => {
            this.setState({
              selected: []
            });

            //Reset Timer
            this.reset();

            //Start Timer
            this.play();

          }, 5000);
        }, 1500);

      });
    }
    else {

      //Pause Timer
      this.pause();

      this.setState({
        selected: [],
        correct: [],
        text: "0/" + IMAGES.length,
        isFlipDisabled: true,
        buttonMessage: "Restart Game",
        display: '',
        gameOver: 'none',
        scoreDisplay: '',
        nextRound: false
      }, function () {
        setTimeout(() => {
          this.setState({
            selected: Array.from(Array(CARDS.length).keys()),
            isFlipDisabled: false,
            cards: this.shuffleCards(IMAGES.slice().concat(IMAGES.slice())),
          });
          setTimeout(() => {
            this.setState({
              selected: []
            });

            //Start Timer
            this.play();

          }, 5000);
        }, 1500);
      });
    }
  }

  shuffleCards(array) {
    return array.sort(() => 0.5 - Math.random());
  }

  onCardClick(clickedIndex) {
    const { correct, selected, cards } = this.state;

    if (selected.length === 0) { //selecting first card
      this.setState({ selected: [clickedIndex] });
    }
    else if (selected.length === 1) { //selecting second card

      this.setState({
        flips: this.state.flips + 1,
        isFlipDisabled: true
      });

      if (cards[selected[0]] === cards[clickedIndex]) { //if there is a match
        this.setState({
          correct: correct.concat([selected[0], clickedIndex]), //add the pair to correct array
          selected: [], //empty out selected array to prepare for next selections
          score: this.state.score + 1,
          text: this.state.score + 1 + "/" + IMAGES.length,
          isFlipDisabled: false
        }, function () {

          totalScore = IMAGES.length;

          if (this.state.score === totalScore) {

            if (this.state.round === 3) {
              this.setState({
                text: this.state.score + "/" + IMAGES.length + " All pairs found!",
                gameOver: 'block',
                display: 'none',
                scoreDisplay: 'none',
                buttonMessage: 'Start Game',
                totalTime: (this.state.clock / 1000)
              });

              //Pause Timer
              this.pause();
              this.saveRecord();
              IMAGES = [];
    
            }
            else {
              //Pause Timer
              this.pause();

              this.nextRound();
            }




          }
        });
      }
      else { //not a match
        this.setState({ selected: [selected[0], clickedIndex] });
        setTimeout(() => {
          this.setState({
            selected: [],
            isFlipDisabled: false
          })
        }, 1500);
      }
    }
  }

  nextRound() {
    if (this.state.round === 1) {
      IMAGES.push("cat");
      IMAGES.push("mang");

      this.setState({
        round: 2
      })
    }
    else if (this.state.round === 2) {
      IMAGES.push("koya");
      IMAGES.push("rj");
      IMAGES.push("van");

      this.setState({
        round: 3
      })
    }

    console.log("images : " + IMAGES)


    CARDS = this.shuffleCards(IMAGES.slice().concat(IMAGES.slice()));

    console.log(CARDS);
    this.setState({
      nextRound: true,
      cards: CARDS,
      selected: [],
      correct: [],
      score: 0,
    })

    window.setTimeout(() => {
      this.restartGame();
    }, 100);
  }

  async saveRecord() {

    let res = await axios.get('/game/find/CardMatch');

    console.log(this.state.clock);

    const gameRecord = {
      gameId: res.data._id,
      userId: this.props.auth.user.id,
      flips: this.state.flips,
      totalTime: (this.state.clock / 1000) // stored in seconds
    }

    console.log(gameRecord);

    axios.post('/record/add', gameRecord)
      .then(res => console.log(res.data));

  }

  renderCard(i) {
    return <MatchCard />;
  }

  render() {
    const { correct, selected, cards } = this.state;
    return (

      <div className="animated fadeIn">
        <Card>
          <CardBody>
            <Row>
              <Col>
                <CardTitle className="h1" style={{ paddingTop: 10 }}>Card Match</CardTitle>
              </Col>
              <Col sm="1.2" style={{ marginRight: 20 }}>
                <button type="button" className="start_button" onClick={this.restartGame.bind(this)}>
                  {this.state.buttonMessage}
                </button>
              </Col>
            </Row>
            <hr />
            <div style={{ display: this.state.gameOver, textAlign: "center" }}>
              <h1>GAME OVER!</h1>
              <p>Flips Made: {this.state.flips}</p>
              <p>Total Time Taken: {this.state.totalTime}s</p>
            </div>
            <h2 style={{ display: this.state.scoreDisplay, textAlign: "center" }}>Round {this.state.round}</h2>
            <div style={{ display: this.state.display, gridTemplateColumns: this.state.round === 1 ? 'repeat(4, auto)' : 'repeat(6,auto)' }} className="card-container">
              {cards.map((image, i) => (
                <MatchCard
                  key={i}
                  image={image}
                  isCorrect={correct.includes(i)}
                  isSelected={selected.includes(i)}
                  onSelect={() => this.onCardClick(i)}
                  disabled={this.state.isFlipDisabled}
                />
              ))
              }
            </div>
            <div style={{ display: this.state.scoreDisplay }}>
              <h2 style={{ textAlign: "center" }}>Flips Made: {this.state.flips}</h2>
              <h2 style={{ textAlign: "center" }}>Timer: {this.state.time}</h2>
              <br />
              <p style={{ textAlign: "center" }}>Cards will be shown for few seconds for you to remember.</p>
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
)(MatchGame);


