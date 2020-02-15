import React, { Component } from 'react';
import SimonButtons from "./SimonButtons";

class SimonGame extends React.Component {
 




  render() {
    return (
	 <div className="mole_background">
		<h1 class="display-1" className="mole_title" >SIMON SAYS</h1>
			<div class="column">
				<div type="button" id="green" className="btn green"></div>
				<div type="button" id="red" className="btn red"></div>
			</div>
			<div class="column">
				<div type="button" id="yellow" className="btn yellow"></div>
				<div type="button" id="blue" className="btn blue"></div>
			</div>
			 <h2 type="button"className='start' onClick={() => this.handleStart()}>Start/Restart </h2>
			<h2 id="score">Score: 0</h2>

	  </div>
    );
  }
}


export default SimonGame;