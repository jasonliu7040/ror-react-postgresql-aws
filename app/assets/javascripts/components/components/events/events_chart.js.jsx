import React from 'react';
var $ = require('jquery');


const EventsChart = React.createClass({
    componentDidMount: function() {

        var month=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var labels = [];
        var data = [];
        for (var firstDay in this.props.bookingCountByMonth) {
            labels.unshift(month[moment(firstDay).toDate().getMonth()]);
            data.unshift(this.props.bookingCountByMonth[firstDay]);
        }

        var lineData = {
            labels: labels,
            datasets: [

                {
                    label: "Example dataset",
                    fillColor: "rgba(26,179,148,0.5)",
                    strokeColor: "rgba(26,179,148,0.7)",
                    pointColor: "rgba(26,179,148,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(26,179,148,1)",
                    data: data
                }
            ]
        };

        var lineOptions = {
            scaleShowGridLines: true,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineWidth: 1,
            bezierCurve: true,
            bezierCurveTension: 0.4,
            pointDot: true,
            pointDotRadius: 4,
            pointDotStrokeWidth: 1,
            pointHitDetectionRadius: 20,
            datasetStroke: true,
            datasetStrokeWidth: 2,
            datasetFill: true,
            responsive: true,
        };


        var ctx = document.getElementById("lineChart").getContext("2d");
        var myNewChart = new Chart(ctx).Line(lineData, lineOptions);
    },
    render: function() {
        var totalCount = 0;
        var monthCount = 0;
        for (var firstDay in this.props.bookingCountByMonth) {
            totalCount += this.props.bookingCountByMonth[firstDay];
            monthCount += 1;
        }
        return (
        <div className="ibox float-e-margins">
            <div className="ibox-content">
                <div>
                    <span className="pull-right text-right">
                        All booknigs for last {monthCount} months: {totalCount}
                    </span>
                    <h3 className="font-bold no-margins">
                        Booking count for last {monthCount} months
                    </h3>
                </div>
                <div className="m-t-sm">
                    <div className="row">
                        <div className="col-md-12">
                            <div>
                                <canvas id="lineChart" height="114"></canvas>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
        )
    }
});

export default EventsChart;