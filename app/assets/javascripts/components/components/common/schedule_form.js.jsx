import React from 'react';
import Schedule from './schedule.js.jsx';
import ScheduledCalendar from './scheduled_calendar.js.jsx';
import moment from 'moment';
var RRule = require('rrule').RRule;

const ScheduleForm = React.createClass({
    propTypes: {
        title: React.PropTypes.string.isRequired,
        schedules: React.PropTypes.array.isRequired,
        onSchedulesSet: React.PropTypes.func.isRequired,
        onErrorShow: React.PropTypes.func,
        fromDate: React.PropTypes.string,
        untilDate: React.PropTypes.string
    },
    selectedIndex: null,
    onScheduleItemCreate: function(item) {
        var rule = this._getRule(item);
        this._validate(rule);
        var title = this._getTitle(rule);
        if (this.selectedIndex != null) {
            this._onScheduleItemChange(this.selectedIndex, item, title);
        } else {
            let schedules = this.props.schedules;
            schedules.push({schedule_ical: item, title: title});
            this.props.onSchedulesSet(schedules);
        }
        this.selectedIndex = null;
    },
    onScheduleItemChange: function(i, event) {
        this._onScheduleItemChange(i, JSON.parse(event.target.value));
    },
    onScheduleItemDelete: function(i) {
        let schedules = this.props.schedules;
        schedules[i]._destroy = true;
        this.props.onSchedulesSet(schedules);
    },
    onScheduleItemEdit: function(i) {
        this.selectedIndex = i;
        let schedule_ical = this.props.schedules[i].schedule_ical;
        this.refs.schedule.onConfigureScheduleOpen(schedule_ical);
    },
    _onScheduleItemChange: function(i, value, title) {
        let schedules = this.props.schedules;
        schedules[i].schedule_ical = value;
        schedules[i].title = title;
        this.props.onSchedulesSet(schedules);
    },
    _validate: function(rule) {
        if (!!this.props.fromDate && !!this.props.untilDate && !!rule) {
            var fromDate = moment(this.props.fromDate).subtract(1, "days").toDate();
            var untilDate = moment(this.props.untilDate).add(1, "days").toDate();

            let startDate = rule.options.dtstart;
           
            let dateAfterFinishDate = rule.after(untilDate);


            if( fromDate > startDate || !!dateAfterFinishDate ) {
                this.props.onErrorShow("Check your schedule, it doesn't fit to date range");
            }
        }
    },
    _getRule: function(schedule_ical) {
        let date = moment(schedule_ical.startDateTime).toDate();
        let options = RRule.parseString(schedule_ical.recurrencePattern);
        let rule = null;
        if (options) {
            options.dtstart = date;
            rule = new RRule(options);
        }
        return rule;
    },
    _getTitle: function(rule) {
        let title = 'Schedule';
        if (!!rule) {
            title = rule.toText();
        }
        return title;
    },
    _stringifyDate: function(dateObject) {
        return moment(dateObject).format("YYYY-MM-DD HH:mm");
    },
    nonDeletedItems: function() {
        return this.props.schedules.filter(function(item){
            return !item._destroy;
        });
    },
    render: function() {
        let styleForSchedule = {marginBottom: '10px'};
        let self = this;
        return (
            <div className="row">
                <div className="col-sm-6">
                    <Schedule onCreate={this.onScheduleItemCreate}
                        style={styleForSchedule}
                        ref='schedule'/>
                    <div>
                        { this.nonDeletedItems().map(function (option, i) {
                            let value = (option.schedule_ical) ? JSON.stringify(option.schedule_ical, null, '\t'): '';
                            return <div className="panel-group" id="accordion" key={i}>
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h5 className="panel-title">
                                            <a className="collapsed" aria-expanded="false" data-toggle="collapse" href={'#scheduleItem' + i}>{option.title}</a>
                                            <button
                                                style={{marginLeft: '5px', marginTop: '-4px'}}
                                                onClick={self.onScheduleItemEdit.bind(null, i)}
                                                type="button"
                                                className="btn btn-xs btn-info pull-right edit-item">
                                                <i className="fa fa-edit"></i>
                                            </button>
                                            <button
                                                style={{marginTop: '-4px'}}
                                                type="button"
                                                onClick={self.onScheduleItemDelete.bind(null, i)}
                                                className="btn btn-xs btn-danger pull-right delete-item">
                                                <i className="fa fa-trash-o"></i>
                                            </button>
                                        </h5>
                                    </div>
                                    <div style={{height: "0px"}} aria-expanded="false" id={'scheduleItem' + i} className="panel-collapse collapse">
                                        <div className="panel-body">
                                            <textarea
                                                className="form-control"
                                                rows="10"
                                                value={value}
                                                onChange={self.onScheduleItemChange.bind(null, i)}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}

                    </div>

                </div>
                <div className="col-sm-6">
                    <ScheduledCalendar
                        schedules = {this.props.schedules}
                        title = {this.props.title}
                    />
                </div>
            </div>
        )
    }
})

export default ScheduleForm;