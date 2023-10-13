import React from 'react';
import FormInput from '../common/form_input.js.jsx';
import FormSelect from '../common/form_select.js.jsx';
import TouchspinHelper from '../common/touchspin_helper.js.jsx';
import Tooltip from './tooltip.js.jsx';

import {
    PRODUCT_PROFILE,
    ACTIVITY_PROFILE,
    COURSE_PROFILE,
    APPT_PROFILE,
    GENERAL_PROFILE,
    CLASS_PROFILE } from './product_form.js.jsx';



const ProductCapacitiesForm = React.createClass({
    propTypes: {
        capacities: React.PropTypes.array.isRequired,
        variantOptionNamesOptions: React.PropTypes.array.isRequired,
        capacitiesOptions: React.PropTypes.array.isRequired,
        variantOptions: React.PropTypes.object.isRequired,
        capacityType: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]).isRequired,
        onCapacityOptionSet: React.PropTypes.func.isRequired,
        onCapacityTypeSet: React.PropTypes.func.isRequired,
        onOptionCapacitiesSet: React.PropTypes.func.isRequired,
        capacity: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]).isRequired,
        onCapacitySet:  React.PropTypes.func.isRequired
    },
    configuration_options: [],
    capacities_option: [],
    componentWillMount: function() {
        this.configuration_options = [
            { name: this._getOptionName(1), value: this._getCapacityOptionBoolValue(1) },
            { name: this._getOptionName(2), value: this._getCapacityOptionBoolValue(2) },
            { name: this._getOptionName(3), value: this._getCapacityOptionBoolValue(3) }
        ];
        this._rebuildOptionsTable();
    },
    onConfigurationOptionChange: function(i, event) {
        this.configuration_options[i].value = event.target.checked;
        this._onConfigurationOptionChange(i);
        this._rebuildOptionsTable();
    },
    onCapacityChange: function(i, event) {
        this.capacities_option[i].capacity = event.target.value;
        this._rebuildOptionsTable();
    },
    _getOptionName: function(index) {
        let option = this._getCapacityOptionValue(index);
        return option ? option : this.props.variantOptionNamesOptions[index - 1];
    },
    _getCapacityOptionValue: function(index) {
        let name = 'capacity_option' + index;

        return this.props[name];
    },
    _getCapacityOptionBoolValue: function(index) {
        let option = this._getCapacityOptionValue(index);
        return !isNullOrUndefined(option);
    },
    _onConfigurationOptionChange: function(i) {
        let value = this.configuration_options[i].value ? this.configuration_options[i].name : '';
        this.props.onCapacityOptionSet((i+1), value);
    },
    _onOptionCapacitiesChange: function(option_capacities) {
        this.props.onOptionCapacitiesSet(option_capacities);
    },
    _calculateOptionsValues: function(configuration_options, options) {
        return cartesianProductOf(
            configuration_options[0].value ? options.options1 : [""],
            configuration_options[1].value ? options.options2 : [""],
            configuration_options[2].value ? options.options3 : [""]
        );
    },
    _rebuildOptionsTable: function() {

        let options = this.props.variantOptions,
            optionCapacities = this.props.capacities,
            newOptionCapacities = [],
            rows = this._calculateOptionsValues(this.configuration_options, options);

        for (var row = 0; row < rows.length; row++) {
            var optionRowCols = rows[row];
            // show option capacity value in each col
            var option = {};
            for (var col = 0; col < 3; col++) {
                var option_name = 'option' + (col + 1);
                if (this.configuration_options[col].value) {
                    option[option_name] = optionRowCols[col];
                } else {
                    option[option_name] = null;
                }
            }
            // show capacity setting for this combination of options
            var optionCapacity = $.grep(optionCapacities, function (optionCapacityConfig) {
                return (optionMatch(optionCapacityConfig.option1, optionRowCols[0])
                && optionMatch(optionCapacityConfig.option2, optionRowCols[1])
                && optionMatch(optionCapacityConfig.option3, optionRowCols[2]));
            });
            option['capacity'] = optionCapacity.length > 0 ? optionCapacity[0].capacity : 1;
            newOptionCapacities.push(option);
        }

        this.capacities_option = newOptionCapacities;
        this._onOptionCapacitiesChange(this.capacities_option);
    },
    render: function() {
        let self=this;
        let showCapacity = this.props.capacityType == 0;

        return (
            <div>
                <div className='form-group'>
                    <label className='col-sm-3 control-label'>Base capacity on
                        <Tooltip title="Capacity is used to limit how many bookings can be made at any one time. Product is typically used for courses, equipment or services, while Variant Options can be used for dress rentals with different size/colors or hotel rooms with different bed sizes for example."/>
                    </label>
                    <div className='col-sm-9'>
                        <FormSelect
                            value={this.props.capacity_type}
                            onChange={this.props.onCapacityTypeSet}
                            options={this.props.capacitiesOptions}/>
                    </div>
                </div>

                { showCapacity ?
                    <div className='form-group'>
                        <label className='col-sm-3 control-label'>Capacity</label>
                        <div className='col-sm-9'>
                            <FormInput type='text'
                                name='capacity'
                                max={9999} min={0} step={5}
                                classStyle='touchspin'
                                value={this.props.capacity}
                                onChange={this.props.onCapacitySet} />
                        </div>
                    </div> :
                    <div className='col-sm-9 col-sm-offset-3'>
                        <table id="option-capacity-table" className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                { this.configuration_options.map(function (option, i) {
                                    return <th className="capacity-option" key={'capacity_option'+i}>
                                        <label>
                                            { (option.name != null && option.name != '') ?
                                                <span><input checked={option.value}
                                                    onChange={self.onConfigurationOptionChange.bind(null, i)}
                                                    type="checkbox"/> {option.name}</span>
                                                : null
                                            }
                                        </label>
                                    </th>
                                })}
                                    <th>Capacity</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.capacities_option.map(function (option, i) {
                                    return <tr key={'capacity'+i}>
                                        <td className='option1'>
                                            { option.option1 ? option.option1 : '-'}
                                        </td>
                                        <td className='option2'>
                                            { option.option2 ? option.option2 : '-'}
                                        </td>
                                        <td className='option3'>
                                            { option.option3 ? option.option3 : '-'}
                                        </td>
                                        <td className='capacity'>
                                            <input max="9999" min="0" type="number" value={option.capacity} onChange={self.onCapacityChange.bind(null, i)}/>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        );
    }
});

function isNullOrUndefined(variable) {
    return variable === null || variable === undefined || variable == '';
}

function cartesianProductOf() {
    return Array.prototype.reduce.call(arguments, function (a, b) {
        var ret = [];
        a.forEach(function (a) {
            b.forEach(function (b) {
                ret.push(a.concat([b]));
            });
        });
        return ret;
    }, [
        []
    ]);
}

function optionMatch(optionValue, value) {
    if (optionValue == null) return true;
    return optionValue === value;
}

export default ProductCapacitiesForm;

