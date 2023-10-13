import React from 'react';

const FormCheckbox = React.createClass({
    propTypes: {
        name: React.PropTypes.string,
        value: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number,
            React.PropTypes.bool
        ]).isRequired,
        onChange: React.PropTypes.func.isRequired
    },
    onChange: function(event) {
        let value = false;
        switch (typeof this.props.value) {
            case 'boolean':
                value = event.target.checked;
                break;
            case 'number':
                value = (event.target.checked) ? 1 : 0;
                break;
            case 'string':
                value = (event.target.checked) ? '1' : '0';
                break;
            default:
                value = false;
        }
        this.props.onChange(value);
    },
    getValue: function() {
        switch (typeof this.props.value) {
            case 'boolean':
                return this.props.value;
            case 'number':
                return (this.props.value == 1);
            case 'string':
                return this.props.value == '1';
            default:
                return false;
        }
    },
    render: function () {
        return (
            <input checked={this.getValue()} onChange={this.onChange} ref='checkbox' name={this.props.name} type="checkbox"/>
        );
    }
});

export default FormCheckbox;