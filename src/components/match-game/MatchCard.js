import React, { Component } from 'react';
import '../../App.css';

class MatchCard extends Component {

  validateClick(){
    if(!this.props.isCorrect && !this.props.isSelected) { //only clickable under these conditions
      this.props.onSelect();
    }
  }
  
  render() {
    return (
      <div className={"card-box" + ((this.props.isCorrect || this.props.isSelected) ? " flipped" : "")} onClick={() => this.validateClick()}>
        <div className="card-back"></div>
        <div className="card-front">
          <img className="card-img" src={require("../../assets/images/"+ this.props.image +".png")} alt="card"></img>
        </div>
      </div>
    );
  }

}

export default MatchCard;