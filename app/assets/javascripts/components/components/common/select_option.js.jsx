import React from 'react';
const SelectOption = React.createClass({
    propTypes: {
        value:React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]).isRequired,
        data: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]).isRequired
    },
    render: function () {
        return (
            <option value={this.props.value}>{this.props.data}</option>
        );
    }
});

export default SelectOption;