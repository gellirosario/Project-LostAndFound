import React, { Component } from 'react';
import MatchCard from "./MatchCard";

const IMAGES = ["cat", "dog", "mole", "fish", "mouse"];

class MatchGame extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cards: this.shuffleCards(IMAGES.slice().concat(IMAGES.slice())),
      selected: [], //indexes which have been selected
      correct: [], //indexes which have been guessed correctly
      score: 0,
      text: "0/" + IMAGES.length,
      flips: 0,
      isFlipDisabled: false
    };
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
          isFlipDisabled: false,
          cards: this.shuffleCards(IMAGES.slice().concat(IMAGES.slice())),
        })
      }, 1000);
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

      this.setState({ flips: this.state.flips + 1 });

      if (cards[selected[0]] === cards[clickedIndex]) { //if there is a match
        this.setState({
          correct: correct.concat([selected[0], clickedIndex]), //add the pair to correct array
          selected: [], //empty out selected array to prepare for next selections
          score: this.state.score + 1,
          text: this.state.score + 1 + "/" + IMAGES.length,
        }, function () {
          if (this.state.score === IMAGES.length) {
            this.setState({
              text: this.state.score + "/" + IMAGES.length + " All pairs found!"
            });
          }
        });
      }

      else { //not a match
        this.setState({ selected: [selected[0], clickedIndex] });
        setTimeout(() => {
          this.setState({ selected: [] })
        }, 1500);
      }
    }
  }

  renderCard(i) {
    return <MatchCard />;
  }

  render() {
    const { correct, selected, cards } = this.state;
    return (
      <div>
        <div className="mole_background">
          <h1 class="display-1" className="mole_title" >CARD MATCH</h1>
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
          <h2 style={{ textAlign: "center" }}>Current Score: {this.state.text}</h2>
          <h2 style={{ textAlign: "center" }}>Flips Made: {this.state.flips}</h2>
          <button type="button" className="start_button" onClick={this.restartGame.bind(this)}>
            Restart (board will be reshuffled)
          </button>
        </div>
      </div>
    );
  }

}

export default MatchGame;


