import React from 'react';
import SelectOption from '../common/select_option.js.jsx';

const FormNested = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        options: React.PropTypes.array,
        nestedName: React.PropTypes.string.isRequired,
        values: React.PropTypes.array,
        onChange: React.PropTypes.func.isRequired
    },
    componentDidMount: function() {
        var self = this;
        var vals = [];
        let name = this.props.nestedName;

        this.props.values.forEach(function(entry) {
            vals.push(entry[name]);
        });

        $('#' + this.props.name +' .chosen-select').chosen().change(function(){
            self.onSelect();
        }).val(vals).trigger('chosen:updated');

    },
    onSelect: function() {
        let selectedVals = $('#' + this.props.name +' .chosen-select').chosen().val();
        if (selectedVals == null) {
            selectedVals = [];
        }
        let objectValues = this.props.values;
        let result = [];
        let name = this.props.nestedName;

        objectValues.forEach(function(entry) {
            var e = entry[name];
            if (selectedVals.includes(e.toString())) {
                entry['_destroy'] = false;
            } else {
                entry['_destroy'] = true;
            }
            result.push(entry);
        });

        var objIds = objectValues.map(function(entry) { return entry[name].toString(); });
        var newIds = selectedVals.filter(function(entry) {
            return objIds.indexOf(entry) < 0;
        });

        newIds.forEach(function(entry) {
            var e =  {'_destroy': false, 'id': ''};
            e[name] = entry;
            result.push(e);
        });

        this.props.onChange(result);
    },
    render: function () {
        var divStyle = {width: '500px'};
        return (

            <div className="input-group"  id={this.props.name}>
                <select data-placeholder="" className="chosen-select" style={divStyle} multiple>
                { this.props.options.map(function(option, i){
                    return <SelectOption
                        key={option[1]}
                        value={option[1]}
                        data={option[0]} />;
                })}
                </select>
            </div>

        );
    }
});

export default FormNested;

