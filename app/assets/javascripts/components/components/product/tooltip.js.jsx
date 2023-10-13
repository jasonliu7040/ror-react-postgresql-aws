import React from 'react';

const Tooltip = React.createClass({
    componentDidMount: function() {
        $('.tooltip-info').tooltip({
            selector: "[data-toggle=tooltip]",
            container: "body"
        });
    },
    render: function () {
        return (
            <span className="tooltip-info" style={{margin: '5px 0px 5px 5px'}}>
                <i className="fa fa-question-circle" style={{fontSize: '16px'}}
                    data-toggle="tooltip" data-placement="top" title={this.props.title}>
                </i>
            </span>
        );
    }
});

export default Tooltip;