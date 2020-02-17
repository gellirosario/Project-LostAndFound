import React from 'react';
//import SimonButtons from "./SimonButtons";

class SimonGame extends React.Component {
 
  render() {
    return (
	 <div className="mole_background">
		<h1 class="display-1" className="mole_title" >SIMON SAYS</h1>
			<div class="column">
				<div type="button" id="green" className="btn_ green"></div>
				<div type="button" id="red" className="btn_ red"></div>
			</div>
			<div class="column">
				<div type="button" id="yellow" className="btn_ yellow"></div>
				<div type="button" id="blue" className="btn_ blue"></div>
			</div>
			 <button type="button"className='start_button orange' onClick={() => this.handleStart()}>Start/Restart </button>
			<h2 id="score">Score: 0</h2>

	  </div>
    );
  }





}


export default SimonGame;