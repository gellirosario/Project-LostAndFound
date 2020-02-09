import React, { Component } from 'react';
import '../../App.css';

//style={{ display: this.props.context.display }}
class MoleHole extends Component {

  render() {
    return (
      <div className="mole_hole" style={{ display: this.props.context.display }}>
        <div className={"game_mole"} style={{WebkitTransform: this.props.context[this.props.holeNumber]}}></div>
        <div className="mole_mound"></div>
      </div>
    )
  };
}

export default MoleHole;