import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';

export default class LineGraph extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chartData: props.chartData
    }
  }

  render() {
    return (
      <div>
        <Bar data={this.state}/>
      </div>
    )
  }
}