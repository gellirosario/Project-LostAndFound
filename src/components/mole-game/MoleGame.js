import React, { Component } from 'react';

/*Components*/
import MoleHole from "./MoleHole";

class MoleGame extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      started: false,
    }
  }

  createMoleHoles() {
    var holes = [];
    for (let i = 1; i <= 9; i++) {
      holes.push(<MoleHole key={i} holeNumber={i} />);
    }
    return (
      <div className='board'>
        {holes}
      </div>
    );
  }


  render() {
    return (
      <div>
        {this.createMoleHoles()}
      </div>
    );
  }
}

export default MoleGame;
