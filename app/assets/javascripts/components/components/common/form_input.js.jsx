import React from 'react';
import TouchspinHelper from './touchspin_helper.js.jsx';

const FormInput = React.createClass({
    mixins: [TouchspinHelper],
    propTypes: {
        name: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        classStyle: React.PropTypes.string,
        value:React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]).isRequired,
        onChange: React.PropTypes.func.isRequired
    },
    onChange: function() {
        this.props.onChange(this.refs[this.props.name].value);
    },
    componentDidMount: function() {
        const self = this;
        this.touchspinDidMount(function(){self.onChange()});
        this.setTouchspinInterval(this.props.step, this.props.min, this.props.max);
        if (this.props.min) {
            this.refs[this.props.name].min = this.props.min;
        }
        if (this.props.max) {
            this.refs[this.props.name].max = this.props.max;
        }
    },
    render: function () {
        var classStyle = this.props.classStyle ? this.props.classStyle : 'form-control';
        return (
            <div id={this.props.name}>
                <input type={this.props.type}
                    className={classStyle}
                    name={this.props.name}
                    value={this.props.value}
                    ref={this.props.name}
                    onChange={this.onChange}/>
            </div>
        );
    }
});

export default FormInput;