import React, { Component } from 'react';
//import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import { Card, CardBody, CardColumns, CardHeader } from 'reactstrap';
//import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

const BarGraph = React.lazy(() => import('../graphs/BarGraph'));

class Statistics extends Component {
    constructor() {
        super();
        this.state = {
            chartData: {}
        }
    }

    componentWillMount() {
        this.getChartData();
    }

    getChartData() {
        // Ajax calls here
        this.setState({
            chartData: {
                labels: ['Card Match', 'Whack A Mole', 'Simon Says'],
                datasets: [
                    {
                        label: 'No. of Plays',
                        data: [
                            34,
                            45,
                            60,
                        ],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                        ],
                        borderWidth: 1,
                        hoverBackgroundColor: [
                            'rgba(255, 99, 132, 0.3)',
                            'rgba(54, 162, 235, 0.3)',
                            'rgba(255, 206, 86, 0.3)',
                        ],
                        hoverBorderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                        ],
                    }
                ]
            }
        });
    }

    render() {
        return (
            <div className="animated fadeIn">
                <CardColumns className="cols-2">
                    <Card>
                        <CardHeader>
                            Top Games
                        </CardHeader>
                        <CardBody>
                            <div className="chart-wrapper">
                                <BarGraph  chartData={this.state.chartData} legendPosition="bottom" />
                            </div>
                        </CardBody>
                    </Card>
                </CardColumns>
            </div>
        );
    }
}

export default Statistics;
