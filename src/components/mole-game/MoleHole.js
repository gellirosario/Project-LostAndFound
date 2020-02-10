import React, { Component } from 'react';
import '../../App.css';

class MoleHole extends Component {

  render() {
    return (
      <div className="mole_hole" style={{ display: this.props.context.display }}>
        <div className="mole_whacked">
          <div className={"game_mole"} onClick={ this.props.onClick } style={{ WebkitTransform: this.props.context[this.props.holeNumber] }}/>
          <div className="mole_mound"/>
        </div>
      </div>
    )
  };
}

export default MoleHole;