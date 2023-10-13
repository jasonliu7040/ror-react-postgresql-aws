import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
var RRule = require('rrule').RRule;

BigCalendar.setLocalizer(
    BigCalendar.momentLocalizer(moment)
);

const ScheduledCalendar = React.createClass({
    propTypes: {
        schedules: React.PropTypes.arrayOf(React.PropTypes.shape({
            id: React.PropTypes.number,
            schedule_ical: React.PropTypes.shape({
                recurrencePattern: React.PropTypes.string.isRequired,
                startDateTime: React.PropTypes.string.isRequired,
                timeZone: React.PropTypes.object
            }).isRequired
        })).isRequired,
        title: React.PropTypes.string.isRequired,
    },
    events: [],
    currentDate: new Date(),
    _calculateOccurrences: function(fromDate, toDate) {
        let occurrences = [];
        this.props.schedules.forEach(function(schedule, i) {
            if (!schedule._destroy && schedule.schedule_ical && !!schedule.schedule_ical.startDateTime) {
                let date = moment(schedule.schedule_ical.startDateTime).toDate();
                let options = RRule.parseString(schedule.schedule_ical.recurrencePattern);
                if (options && date) {
                    options.dtstart = date;
                    let rule = new RRule(options);
                    let ruleOccurences = rule.between(fromDate, toDate);
                    occurrences = occurrences.concat(ruleOccurences);
                }
            }
        });
        return occurrences;
    },
    calculateEvents: function() {
        let date = this.currentDate;
        let month = date.getMonth();
        let year = date.getFullYear();
        let fromDate = new Date(year, month - 1, 15);
        let toDate = new Date(year, month + 1, 15);

        let occurrences = this._calculateOccurrences(fromDate, toDate);
        let title = this.props.title;
        this.events = occurrences.map(function(occurrence) {
            let event = { title: moment(occurrence).format("HH:mm") + ' ' + title };
            event['start'] = moment(occurrence).format("YYYY-MM-DD HH:mm");
            event['end'] = moment(occurrence).format("YYYY-MM-DD HH:mm");
            return event;
        });

    },
    onNavigate: function(date) {
        this.currentDate = date;
        this.forceUpdate();
    },
    render: function() {
        this.calculateEvents();
        return (
            <BigCalendar
                style={{height: "400px"}}
                views={['month']}
                events={this.events}
                onNavigate={this.onNavigate}
            />
        )
    }
});


export default ScheduledCalendar;