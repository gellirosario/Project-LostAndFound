import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';

import React from 'react';
import '../../App.css';

//Color buttons that animate and are clicked on by user
const ColorButton = function (props) {
  return (
    <div id={props.id} className={props.className} onClick={props.onClick}></div>
  )
}

//Renders start/reset
const SettingsControls = function (props) {
  return (
    <Col sm="1.2" style={{ marginRight: 20 }}>
      <button className="start_button" id='start-reset-button'
        onClick={props.onClick}>{props.startResetText}</button>
    </Col>
  )
}

//Renders the overall model including ColorButton, SettingsControls, and DisplayCircle
//Determines color animations based on props.activeColor
const SimonButtons = function (props) {
  return (
    <div className="animated fadeIn">
      <Card>
        <CardBody>
          <Row>
            <Col>
              <CardTitle className="h1" style={{ paddingTop: 10 }}>Simon Says</CardTitle>
            </Col>
            <SettingsControls
              onClick={props.handleStartReset}
              startResetText={props.startResetText}
              buttonDisabled={props.buttonDisabled} />
          </Row>
          <hr />
          <div style={{ display: props.gameOver, textAlign: "center" }}>
            <h1>GAME OVER!</h1>
            <p>You scored {props.score}</p>
          </div>

          <div style={{ display: props.display }}>
            <div className="column" style={{ textAlign: "center" }}>
              <ColorButton id='red-button'
                //animate the button with active-button class and disable its pointer-events until the user's turn
                //color-button is default class
                className={props.activeColor === 'red' ? 'color-button active-button pointer-events-disabled'
                  : !props.readyForUserInput ? "color-button pointer-events-disabled"
                    : 'color-button'}
                //pass the respective color as argument to onClick; used arrow syntax to prevent auto-running
                onClick={() => { props.handleUserInput('red') }} />
              <ColorButton id='green-button'
                className={props.activeColor === 'green' ? 'color-button active-button pointer-events-disabled'
                  : !props.readyForUserInput ? "color-button pointer-events-disabled"
                    : 'color-button'}
                onClick={() => { props.handleUserInput('green') }} />

            </div>
            <div className="column" style={{ textAlign: "center" }}>
              <ColorButton id='yellow-button'
                className={props.activeColor === 'yellow' ? 'color-button active-button pointer-events-disabled'
                  : !props.readyForUserInput ? "color-button pointer-events-disabled"
                    : 'color-button'}
                onClick={() => { props.handleUserInput('yellow') }} />
              <ColorButton id='blue-button'
                className={props.activeColor === 'blue' ? 'color-button active-button pointer-events-disabled'
                  : !props.readyForUserInput ? "color-button pointer-events-disabled"
                    : 'color-button'}
                onClick={() => { props.handleUserInput('blue') }} />
            </div>
          </div>

          <div style={{ display: props.scoreDisplay }}>
            <h2 style={{ textAlign: "center" }}> Score: {props.score}</h2>
            <h2 style={{ textAlign: "center" }}>Tries Left: {props.tries} </h2>
          </div>

        </CardBody>
      </Card>
    </div>
  )
}
export default SimonButtons;