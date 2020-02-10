import React, { Component } from 'react';
import MatchCard from "./MatchCard";

class MatchGame extends Component {

  renderCard(i){
    return <MatchCard />;
  }

  render() {
    return (
      <div>

        <h1 class="display-1" className="mole_title" >CARD MATCH</h1>

        <div className="card-container">
          {this.renderCard(0)}
          {this.renderCard(1)}
          {this.renderCard(2)}
          {this.renderCard(0)}
          {this.renderCard(1)}
          {this.renderCard(2)}
          {this.renderCard(0)}
          {this.renderCard(1)}
          {this.renderCard(2)}
          {this.renderCard(0)}
          {this.renderCard(1)}
          {this.renderCard(2)}
          {this.renderCard(0)}
          {this.renderCard(1)}
          {this.renderCard(2)}
        </div>

      </div>
    );
  }
    
}

export default MatchGame;


