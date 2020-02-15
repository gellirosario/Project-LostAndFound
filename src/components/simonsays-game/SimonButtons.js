// JavaScript source code
import React, { Component } from 'react';
import '../../App.css';

class SimonButton extends Component {
	
	_handleMouseDown(e) {
    this.props.mousedown(e.target.id);
  }
  render() {
    return (
      <div
        onMouseDown={this._handleMouseDown.bind(this)}
        id={this.props.buttonId}
        className={this.props.classType}
      />
    );
  }

	
  
}

export default SimonButton;