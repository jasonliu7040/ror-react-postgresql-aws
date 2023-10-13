import React from 'react';
import FormInput from '../common/form_input.js.jsx';
import ScheduleForm from '../common/schedule_form.js.jsx';
let DateTimeField = require('react-bootstrap-datetimepicker-noicon');


const TermForm = React.createClass({
    onChangeStartDate: function(date) {
        this.props.actions.onTermStartDateSet(this._stringifyDate(date));
    },
    onChangeFinishDate: function(date) {
        this.props.actions.onTermFinishDateSet(this._stringifyDate(date));
    },
    _stringifyDate: function(dateObject) {
        return moment(dateObject).format("YYYY-MM-DD HH:mm");
    },
    _validateTerm: function(item) {

        let errors = [];
        if (!item.name) {
            errors.push("Name can't be blank.");
        }
        if(!item.finish_date) {
            errors.push("Finish date can't be blank.");
        }
        if(!item.start_date) {
            errors.push("Start date can't be blank.");
        }
        if(!!item.start_date && !!item.finish_date && moment(item.start_date) > moment(item.finish_date)) {
            errors.push("Start date should be smaller than Finish date.");
        }
        return errors;
    },
    onErrorShow: function(message) {
        toastr.clear();
        if (Array.isArray(message)) {
            message.forEach(function(msg) {
                toastr.error(msg);
            });
        } else {
            toastr.error(message);
        }
    },
    onSubmit: function() {

        var errors = this._validateTerm(this.props.term);

        let self = this;
        if(errors.length == 0) {
            self.disableButton();
            this.props.actions.onTermSubmit(this.props.term, function() {
                self.enableButton();
            });
        } else {
            this.onErrorShow(errors);
        }
    },
    enableButton: function() {
        this.props.actions.onLoadingSet(false);
    },
    disableButton: function() {
        this.props.actions.onLoadingSet(true);
    },
    render: function() {

        return (
            <div className="form-horizontal m-b-xl">
                <div className="ibox">
                    <div className="ibox-content">
                        <div className='form-group' id='name'>
                            <label className='col-sm-2 control-label'>Term Name</label>
                            <div className='col-sm-10'>
                                <FormInput type='text'
                                    name='name'
                                    value={this.props.term.name}
                                    onChange={this.props.actions.onNameSet} />
                            </div>
                        </div>
                        <div className='form-group' id='start_date'>
                            <label className='col-sm-2 control-label'>Start Date</label>
                            <div className='col-sm-10'>
                                <DateTimeField
                                    format="YYYY-MM-DD HH:mm"
                                    dateTime={this.props.term.start_date}
                                    inputFormat="YYYY-MM-DD HH:mm"
                                    direction="onTop"
                                    ref='start_date'
                                    onChange={this.onChangeStartDate}
                                    required={true} />
                            </div>
                        </div>
                        <div className='form-group' id='finish_date'>
                            <label className='col-sm-2 control-label'>Finish Date</label>
                            <div className='col-sm-10'>
                                <DateTimeField
                                    format="YYYY-MM-DD HH:mm"
                                    dateTime={this.props.term.finish_date}
                                    inputFormat="YYYY-MM-DD HH:mm"
                                    direction="onTop"
                                    ref='finish_date'
                                    onChange={this.onChangeFinishDate}
                                    required={true} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ibox">
                    <div className="ibox-title">
                        Schedule
                    </div>
                    <div className="ibox-content">
                        <ScheduleForm title={this.props.term.name}
                            fromDate={this.props.term.start_date}
                            untilDate={this.props.term.finish_date}
                            schedules={this.props.term.schedule_attributes.recurring_items_attributes}
                            onSchedulesSet={this.props.actions.onTermSchedulesSet}
                            onErrorShow={this.onErrorShow}
                        />
                    </div>
                </div>
                <div className='form-group' style={{marginTop: '20px'}}>
                    <div className="col-sm-6">
                        <button className="btn btn-primary" type="submit" ref='saveButton' onClick={this.onSubmit} disabled={this.props.isLoading} style={{marginRight: '10px'}}>Save changes</button>
                        <a href='/admin/products' className="btn btn-danger">Cancel</a>
                    </div>
                </div>
            </div>
        )
    }
});

export default TermForm;