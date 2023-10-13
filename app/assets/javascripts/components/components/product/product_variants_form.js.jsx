import TouchspinHelper from '../common/touchspin_helper.js.jsx';
import FormSelect from '../common/form_select.js.jsx';
import FormInput from '../common/form_input.js.jsx';
import FormCheckbox from '../common/form_checkbox.js.jsx';
import Tooltip from './tooltip.js.jsx';
import moment from 'moment';

let DateTimeField = require('react-bootstrap-datetimepicker-noicon');

import { PRODUCT_PROFILE, ACTIVITY_PROFILE, COURSE_PROFILE, APPT_PROFILE, GENERAL_PROFILE, CLASS_PROFILE } from './product_form.js.jsx';


const Variant = React.createClass({
    onChange: function(key, value) {
        let data = this.props.data;
        data[key] = value;
        this.props.onChange(data);
    },
    hoursOptions: [],
    minutesOptions: [],
    componentDidMount: function() {
        this.hoursOptions = this._getNumberOptions(24);
        this.minutesOptions = this._getNumberOptions(60);
    },
    onIgnoreChange: function(value) {
        this.onChange('ignore', value);
    },
    onDurationUnitsChange: function(value) {
        this.onChange('duration_units', value);
    },
    onDurationChange: function(value) {
        this.onChange('duration', value);
    },
    onAllDayChange: function(value) {
        this.onChange('all_day', value);
    },
    onStartTimeChange: function(time) {
        this.onChange('start_time', this.stringifyTime(time));
    },
    onFinishTimeChange: function(time) {
        this.onChange('finish_time', this.stringifyTime(time));
    },
    onPartySizeChange: function(value) {
        this.onChange('party_size', value);
    },
    stringifyTime: function(dateObject) {
       return moment(dateObject).format("YYYY-MM-DD HH:mm");
    },
    _getNumberOptions: function(max) {
        let options = [];
        for(let i = 0; i < max; i++) {
            options.push([padDigits(i,2), i]);
        }
        return options;
    },
    render: function() {
        return (
                <tr key={this.props.data.id} id={this.props.name} >
                    <td>{this.props.data.title}</td>
                    {
                        this.props.showDuration ?
                            <td>

                                <div className="time-cell">
                                    <div className='variant-time'>
                                        <FormCheckbox
                                            value={this.props.data.all_day}
                                            ref='all_day' name='all_day'
                                            onChange={this.onAllDayChange} />
                                        <span className="m-l-sm">All day?</span>
                                    </div>
                                    { (!this.props.data.all_day) ?
                                        <div className='variant-time' style={{width: '100px'}}>
                                            <FormInput type='number'
                                                name='duration'
                                                min='1'
                                                value={this.props.data.duration}
                                                onChange={this.onDurationChange} />
                                        </div> : null }
                                    { (!this.props.data.all_day) ?
                                        <div className='variant-time'>
                                        <FormSelect name='duration_units'
                                            value={this.props.data.duration_units}
                                            onChange={this.onDurationUnitsChange}
                                            options={this.props.durationUnitsOptions}/>
                                        </div> : null }
                                </div>

                            </td>
                        : null
                    }
                    {
                        this.props.showHoursAvailable ?
                        <td>
                            <div className="time-cell">
                                <label className='variant-time variant-time-label'>Start</label>
                                <div className='variant-time'>
                                    <DateTimeField
                                        format="YYYY-MM-DD HH:mm"
                                        dateTime={this.stringifyTime(this.props.data.start_time)}
                                        inputFormat="HH:mm"
                                        onChange={this.onStartTimeChange}
                                        mode="time"
                                        ref='start_time'
                                        required={true} />
                                </div>
                            </div>
                            <div className="time-cell">

                                <label className='variant-time variant-time-label'>Finish</label>
                                <div className='variant-time'>
                                    <DateTimeField
                                        format="YYYY-MM-DD HH:mm"
                                        dateTime={this.stringifyTime(this.props.data.finish_time)}
                                        inputFormat="HH:mm"
                                        onChange={this.onFinishTimeChange}
                                        mode="time"
                                        ref='finish_time'
                                        required={true} />
                                </div>

                            </div>
                        </td>
                        : null
                    }
                    { this.props.showUnits ? <td>
                        <FormInput type='number'
                            name='party_size'
                            min='0'
                            value={this.props.data.party_size}
                            onChange={this.onPartySizeChange} />
                    </td> : null }
                    <td>
                        <FormCheckbox name='ignore'
                            value={this.props.data.ignore}
                            ref='ignore'
                            onChange={this.onIgnoreChange}
                        />
                    </td>
                </tr>

            );
    }
});

const ProductVariantsForm = React.createClass({
    propTypes: {
        variants: React.PropTypes.array.isRequired,
        durationUnitsOptions: React.PropTypes.array.isRequired,
        onVariantsSet: React.PropTypes.func.isRequired,
        durationEnabled: React.PropTypes.bool,
        legacyVariantTimes: React.PropTypes.bool,
        isNew: React.PropTypes.bool
    },
    onVariantChange: function(i, data) {
        let variants = this.props.variants;
        variants[i] = data;
        this.props.onVariantsSet(variants);
    },
    render: function() {
        let showHoursAvailable = (this.props.legacyVariantTimes && !this.props.isNew && this.props.displayForProfiles([ACTIVITY_PROFILE, APPT_PROFILE, GENERAL_PROFILE]));
        let showUnits = this.props.displayForProfiles([ACTIVITY_PROFILE, CLASS_PROFILE, GENERAL_PROFILE]);
        let showDuration = this.props.durationEnabled;
        let self = this;
        return (
            <table id="variants" className="variants-attributes table table-striped">
                <thead><tr>
                    <th style={{width:'10%'}}>Title</th>
                    { showDuration ? <th style={{width:'30%'}} >Duration</th> : null }
                    { showHoursAvailable ? <th style={{width:'20%'}}>Hours Available</th> : null }
                    { showUnits ?
                        <th style={{width:'10%'}}>Units
                            <Tooltip title="Party Size"/>
                        </th>
                        : null }
                    <th style={{width:'10%'}}>Ignore
                        <Tooltip title="Hides the booking form when the variant is chosen on the product page."/>
                    </th>
                </tr>
                </thead>
                <tbody>
                    { this.props.variants.map(function(option, i){
                        return <Variant onChange={self.onVariantChange.bind(null, i)}
                            key={'variant_attr'+i}
                            data={option}
                            showHoursAvailable={showHoursAvailable}
                            showDuration={showDuration}
                            showUnits={showUnits}
                            durationUnitsOptions={self.props.durationUnitsOptions}
                            name={'variant_' + option.id}
                        />;
                    })}
                </tbody>
            </table>
        );
    }
});

function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

export default ProductVariantsForm;

