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

const IMAGES = ["cat", "dog", "mole", "fish", "mouse"];
var CARDS = [];

class MatchGame extends Component {

  constructor(props) {
    super(props);

    CARDS = this.shuffleCards(IMAGES.slice().concat(IMAGES.slice()));

    this.state = {
      cards: CARDS,
      selected: Array.from(Array(CARDS.length).keys()), //indexes which have been selected (show all initially)
      correct: [], //indexes which have been guessed correctly
      score: 0,
      text: "0/" + IMAGES.length,
      flips: 0,
      isFlipDisabled: false
    };

    setTimeout(() => { //flip over all after a few seconds
      this.setState({
        selected: []
      })
    }, 5000);
  }

  restartGame() {
    this.setState({
      selected: [],
      correct: [],
      score: 0,
      text: "0/" + IMAGES.length,
      flips: 0,
      isFlipDisabled: true
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
        }, 5000);
      }, 1500);
    });
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
          if (this.state.score === IMAGES.length) {
            this.setState({
              text: this.state.score + "/" + IMAGES.length + " All pairs found!"
            });
            this.saveRecord();
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

  saveRecord() {

    const gameRecord = {
      gameType: 1, //Card Match
      userId: "test", //testdata
      score: this.state.score
    }

    console.log(gameRecord);

    axios.post('http://localhost:5000/record/add', gameRecord)
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
                  Restart Game
          </button>
              </Col>
            </Row>
            <hr/>
            <div className="card-container">
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

          <h2 style={{ textAlign: "center" }}>Score: {this.state.text}</h2>
          <h2 style={{ textAlign: "center" }}>Flips Made: {this.state.flips}</h2>
          </CardBody>
        </Card>
        </div>
    );
  }

}

export default MatchGame;


