// Modules
import React, { Component, PropTypes } from 'react';
import Chart from 'chart.js';

// Wrappers
import CSSModules from 'wrappers/css-modules';

// Utils
import { formatDate } from 'utils/format';

// Styles
import styles from '../styles.less';

class ExpensesPerWeek extends Component {
    componentDidMount()  {
        Chart.defaults.global.defaultFontColor = '#404040';
        Chart.defaults.global.defaultFontFamily = 'Montserrat, sans-serif';
        Chart.defaults.global.defaultFontSize = 16;

        new Chart(this.canvasElement, {
            type: 'line',
            data: this.chartData(),
            options: {
                scales: {
                    xAxes: [{
                        gridLines: {
                            color: '#dae4ed',
                            lineWidth: 1,
                            zeroLineColor: 'transparent',
                            zeroLineWidth: 0
                        },
                        scaleLabel: {
                            fontSize: 16
                        },
                        ticks: {
                            padding: 100
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            color: '#dae4ed',
                            drawTicks: false,
                            lineWidth: 2,
                            zeroLineColor: 'transparent',
                            zeroLineWidth: 0
                        },
                        ticks: {
                            padding: 20,
                            callback: (value, index, values) => {
                                if (index !== values.length - 1) {
                                    return '$' + value;
                                }
                            }
                        }
                    }],
                }
            }
        });
    }

    chartData = () => {
        function oneWeekEarlier(timestamp) {
            let newTimestamp = new Date(timestamp);
            newTimestamp.setDate(newTimestamp.getDate() - 7);
            return newTimestamp.getTime();
        }

        let {
            latestTransaction: endRange,
            transactions
        } = this.props;

        // Set start range to 12 weeks ago
        let startRange = oneWeekEarlier(endRange);

        let timeline = {};

        for (let i = 0; i < 12; i++) {
            endRange = startRange;
            startRange = oneWeekEarlier(endRange);

            timeline[endRange] = {
                expenses: 0,
                income: 0
            };

            transactions.forEach(({amount, date}) => {
                if (date > startRange && date <= endRange) {
                    if (amount < 0) {
                        timeline[endRange].expenses += Math.abs(amount);
                        timeline[endRange].expenses = parseFloat(timeline[endRange].expenses.toFixed(2));
                    } else {
                        timeline[endRange].income += amount;
                        timeline[endRange].income = parseFloat(timeline[endRange].income.toFixed(2));
                    }
                }
            });
        }

        let timelineArray = [];
        Object.entries(timeline).forEach(([date, {expenses, income}]) => {
            timelineArray.push({
                date: parseInt(date),
                expenses,
                income
            });
        });
        timeline = timelineArray;

        // Sort by date
        timeline.sort((a, b) => {
            return a.date - b.date;
        });

        let data = {
            labels: [],
            datasets: [
                {
                    label: 'Expenses',
                    lineTension: 0.2,
                    backgroundColor: 'rgba(229, 46, 46, 0.2)',
                    borderColor: 'rgb(229, 46, 46)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgb(229, 46, 46)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1,
                    pointRadius: 5,
                    pointHoverBackgroundColor: 'rgb(229, 46, 46)',
                    pointHoverBorderColor: '#fff',
                    pointHoverRadius: 5,
                    data: []
                }, {
                    label: 'Income',
                    lineTension: 0.2,
                    backgroundColor: 'rgba(25, 166, 79, 0.2)',
                    borderColor: 'rgb(25, 166, 79)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgb(25, 166, 79)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1,
                    pointRadius: 5,
                    pointHoverBackgroundColor: 'rgb(25, 166, 79)',
                    pointHoverBorderColor: '#fff',
                    pointHoverRadius: 5,
                    data: []
                }
            ]
        };

        timeline.forEach(({date, expenses, income}) => {
            data.labels.push(formatDate(date, true));
            data.datasets[0].data.push(expenses);
            data.datasets[1].data.push(income);
        });

        return data;
    }

    render() {
        return (
            <div styleName="expenses-vs-income">
                <h2>Expenses / Income Timeline</h2>
                <div styleName="sub-heading">Expenses vs income over the last 12 weeks</div>
                <canvas ref={element => this.canvasElement = element} />
            </div>
        );
    }
}

ExpensesPerWeek.propTypes = {
    latestTransaction: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number
    ]).isRequired,
    transactions: PropTypes.arrayOf(
        PropTypes.shape({
            amount: PropTypes.number.isRequired,
            categories: PropTypes.arrayOf(
                PropTypes.shape({
                    colour: PropTypes.string.isRequired,
                    name: PropTypes.string.isRequired
                })
            ),
            date: PropTypes.number.isRequired,
            vendor: PropTypes.shape({
                name: PropTypes.string.isRequired,
            })
        })
    ).isRequired,
};

ExpensesPerWeek = CSSModules(ExpensesPerWeek, styles);

export default ExpensesPerWeek;
