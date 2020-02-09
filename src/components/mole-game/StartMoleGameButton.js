import React, { Component } from 'react';
import '../../App.css';

class StartMoleGame extends Component {

  render() {
    return (
        <button type="button" class="btn btn-dark" onClick={ this.props.onClick }>
        {this.props.context.buttonMessage}
      </button>
    )
  };
}

export default StartMoleGame;