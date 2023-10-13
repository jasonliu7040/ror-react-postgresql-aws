import React from 'react';
import SelectOption from './select_option.js.jsx';

const FormSelect = React.createClass({
    propTypes: {
        name: React.PropTypes.string,
        value: React.PropTypes.any.isRequired,
        onChange: React.PropTypes.func.isRequired,
        includeBlank: React.PropTypes.bool,
        options: React.PropTypes.array.isRequired,
        classStyle: React.PropTypes.string,
        blankText: React.PropTypes.string
    },
    onChange: function(event) {
        this.props.onChange(event.target.value);
    },
    render: function () {
        var includeBlank = false;
        if (this.props.includeBlank) {
            includeBlank = this.props.includeBlank;
        }
        var classStyle = this.props.classStyle ? this.props.classStyle : 'form-control';
        return (
            <select className={classStyle} name={this.props.name} value={this.props.value} ref='select' onChange={this.onChange}>
                { includeBlank ? <SelectOption key='' value='' data={this.props.blankText ? this.props.blankText : '' } /> : null}
                { this.props.options.map(function(option, i){
                    return <SelectOption key={option[1]} value={option[1]} data={option[0]} />;
                })}
            </select>
        );
    }
});

export default FormSelect;