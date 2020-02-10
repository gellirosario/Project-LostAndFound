import React, { Component } from 'react';
import '../../App.css';

class MatchCard extends Component {

  constructor(props){
    super(props);
    this.state = {
      flipped: false,
    }
  }

  render() {
    return (
      <div className={"card" + (this.state.flipped ? " flipped" : "")} onClick={() => this.setState({flipped: true})}>
        <div className="card-back"></div>
        <div className="card-front"></div>
      </div>
    );
  }


}

export default MatchCard;