import React from 'react';
import TouchspinHelper from '../common/touchspin_helper.js.jsx';

const MINUTES = 'minutes';
const HOURS = 'hours';
const DAYS = 'days';

const FormInputWithTime = React.createClass({
    mixins: [TouchspinHelper],
    propTypes: {
        name: React.PropTypes.string,
        value: React.PropTypes.number.isRequired,
        onChange: React.PropTypes.func.isRequired
    },
    componentDidMount: function() {
        var self = this;
        this.touchspinDidMount(function(){self.onChangeTime()});
        this.setTimeAndUnits();
        this.onChangeTimeLimits();
    },
    onChangeTime: function() {
        const units = this.refs.units.value;
        var value = this.refs.time.value;

        if (units == MINUTES) {
            value = value * 1;
        }
        if (units == HOURS) {
            value = value * 60;
        }
        if (units == DAYS) {
            value = value * 60 * 24;
        }
        this.props.onChange(value);
    },
    setTimeAndUnits: function() {
        var value = this.props.value;
        if (value < 60) {
            this.refs.time.value = value;
            this.refs.units.value = MINUTES;
        } else if (value < (60 * 24)) {
            this.refs.time.value = value / 60;
            this.refs.units.value = HOURS;
        } else {
            this.refs.time.value = value / 60 / 24;
            this.refs.units.value = DAYS;
        }
    },
    onChangeTimeLimits: function() {
        const units = this.refs.units.value;
        var max = 59;
        switch (units) {
            case 'hours':
                max = 23;
                break;
            case 'days':
                max = 14;
                break;
        }
        this.setTouchspinInterval(1, 0, max);
    },
    onChangeTimeUnits: function() {
        this.onChangeTimeLimits();
        this.onChangeTime();
    },
    render: function () {
        return (
            <div id={this.props.name}>
                <div className='col-sm-3'>
                    <input id="time" ref="time" type='text' className='touchspin' onChange={this.onChangeTime}/>
                </div>
                <div className='col-sm-3'>
                    <select id="input-units" ref="units" className='form-control' onChange={this.onChangeTimeUnits}>
                        <option value={MINUTES}>Minutes</option>
                        <option value={HOURS} >Hours</option>
                        <option value={DAYS} >Days</option>
                    </select>
                </div>
            </div>
        );
    }
});

export default FormInputWithTime;