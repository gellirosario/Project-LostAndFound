import React, { Component } from 'react';
import '../../App.css';

class MoleHole extends Component {

  render() {
    return (
      <div className="game_hole">
        <div className={"game_mole"}></div>
        <div className="game_mound"></div>
      </div>
    )
  };
}

export default MoleHole;