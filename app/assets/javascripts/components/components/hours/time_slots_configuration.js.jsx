let React = require('react');
let moment = require('moment');
let TimeSlotsConfiguration = React.createClass({

  propTypes: {
    season: React.PropTypes.shape({
      name:  React.PropTypes.string.isRequired,
      start: React.PropTypes.string.isRequired,
      id:    React.PropTypes.string.isRequired,
      days:  React.PropTypes.arrayOf(React.PropTypes.shape({
        day:    React.PropTypes.number.isRequired,
        hours:  React.PropTypes.arrayOf(React.PropTypes.shape({
          from: React.PropTypes.shape({
            hour:   React.PropTypes.string.isRequired,
            minute: React.PropTypes.string.isRequired
          }).isRequired,
          to: React.PropTypes.shape({
            hour:   React.PropTypes.string.isRequired,
            minute: React.PropTypes.string.isRequired
          }).isRequired
        }))
      })).isRequired
    }).isRequired,
    timeConfigErrors: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    getWeekday: React.PropTypes.func.isRequired,
    onSetTimeConfigErrors: React.PropTypes.func.isRequired,
    onUpdateActiveSeasonTimeSlots: React.PropTypes.func.isRequired,
    onReplaceActiveSeasonTimeSlots: React.PropTypes.func.isRequired
  },

  handleConfigureTimes: function() {
    $(this.refs.timesConfigureModal).modal({
      keyboard: false,   // don't close modal on ESC
      backdrop: 'static' // don't close modal on click outside of it
    });
  },

  _getOpeningDate: function() {
    let openingHour   = parseInt(this.refs.slotOpeningHour.value);
    let openingMinute = parseInt(this.refs.slotOpeningMinute.value);
    let openingAmpm   = this.refs.slotOpeneingAmpm.value;
    let openingDate = this._hoursMinutesAmpmToDate(openingHour, openingMinute, openingAmpm);
    return openingDate;
  },
  _getClosingDate: function() {
    let closingHour   = parseInt(this.refs.slotClosingHour.value);
    let closingMinute = parseInt(this.refs.slotClosingMinute.value);
    let closingAmpm   = this.refs.slotClosingAmpm.value;
    let closingDate = this._hoursMinutesAmpmToDate(closingHour, closingMinute, closingAmpm);
    return closingDate;
  },
  onTimeSlotsCreate: function() {
    // Parse hours and minutes

    $(this.refs.replaceModal).modal({
      keyboard: false,   // don't close modal on ESC
      backdrop: 'static' // don't close modal on click outside of it
    });

  },
  addHours: function(shouldReplace) {

    $(this.refs.replaceModal).modal('toggle');
    let openingDate = this._getOpeningDate();
    let closingDate = this._getClosingDate();
    let newTimeSlots = this._getNewTimeSlotsForSelectedDays(openingDate, closingDate);


    if (shouldReplace) {
      this.props.onReplaceActiveSeasonTimeSlots(newTimeSlots);

    } else {
      let errors = this._validateTimeSlots(openingDate, closingDate, newTimeSlots);

      if (errors.length > 0) {
        this.props.onSetTimeConfigErrors(errors);
        return;
      }
      this.props.onUpdateActiveSeasonTimeSlots(newTimeSlots);

    }
    this.props.onSetTimeConfigErrors([]);
  },
  getOptionsRange: function(from, to) {
    if (to === undefined) {
      to = from;
      from = 0;
    }

    let range = [];
    for (let i = from; i <= to; i++) {
      range.push(
        <option value={i} key={i}>{this.pad(i)}</option>
      );
    }
    return range
  },

  pad: function(n) {
    return ('0' + n).slice(-2) // works for one or two digit nums
  },
  _getNewTimeSlotsForSelectedDays: function(openingDate, closingDate) {
    let newTimeSlots = [];

    for (let i = 0; i < 7; i++) {
      let cbox = this.refs["times-config-dow-" + i];

      let newTimeSlot = {
        day:  i,
        from: {
          hour:   openingDate.hour().toString(),
          minute: openingDate.minute().toString()
        },
        to: {
          hour:   closingDate.hour().toString(),
          minute: closingDate.minute().toString()
        }
      };

      if (cbox.checked) {
        newTimeSlots.push(newTimeSlot);
      }
    }
    return newTimeSlots;
  },

  _validateTimeSlots: function(openingDate, closingDate, newSlots) {
    let errors = [];

    for (let i = 0; i < newSlots.length; i++) {
      this._validateTimeSlot(newSlots[i], errors);
    }
    this._validateSelectedTimes(openingDate, closingDate, errors);

    return errors;
  },

  _validateTimeSlot: function(timeSlot, errors) {
    // Check is there an overlap with existing hours

    let existingSlots = this.props.season.days[timeSlot.day].hours;

    let from = this._hoursMinutesToDate(timeSlot.from.hour, timeSlot.from.minute);
    let to   = this._hoursMinutesToDate(timeSlot.to.hour, timeSlot.to.minute);

    for (let i = 0; i < existingSlots.length; i++) {
      let existingFrom = this._hoursMinutesToDate(existingSlots[i].from.hour, existingSlots[i].from.minute);
      let existingTo   = this._hoursMinutesToDate(existingSlots[i].to.hour, existingSlots[i].to.minute);

      if (from.valueOf() <= existingTo.valueOf() && to.valueOf() >= existingFrom.valueOf()) {
        errors.push(
          'New time conflicts with existing timeslot ' +
          this.props.getWeekday(timeSlot.day) + ' ' +
          this._24ToAmpm(existingSlots[i].from) + ' - ' +
          this._24ToAmpm(existingSlots[i].to)
        );
      }
    }
  },

  _validateSelectedTimes: function(openingDate, closingDate, errors) {
    if (openingDate.valueOf() == closingDate.valueOf()) {
      errors.push('Time stands still for nobody. Your opening and closing times need to be different.');
    }
    if (openingDate.valueOf() > closingDate.valueOf()) {
      errors.push('Closing time is before opening time');
    }
  },

  _hoursMinutesAmpmToDate: function(hours, minutes, ampm) {
    return moment(hours + " " + minutes + " " + ampm, "hh mm a");
  },

  _hoursMinutesToDate: function(hours, minutes) {
    return moment(hours + " " + minutes, "HH mm");
  },

  _24ToAmpm: function(hhmm) {
    return this._hoursMinutesToDate(hhmm.hour, hhmm.minute).format("hh:mm A");
  },
  componentDidMount: function() {
    $(document).on('show.bs.modal', '.modal', function () {
      var zIndex = 2050 + (10 * $('.modal:visible').length);
      let zIndexText = 'z-index: '+ zIndex + ' !important';
      $(this).css('cssText', zIndexText);
      setTimeout(function() {
        $('.modal-backdrop').not('.modal-stack').css('cssText', 'z-index: '+ (zIndex -1) + ' !important').addClass('modal-stack');
      }, 0);
    });

    $(document).on('hidden.bs.modal', '.modal', function () {
      $('.modal:visible').length && $(document.body).addClass('modal-open');
    });
  },
  render: function() {
    return (
      <div>
        <div className="form-group">
          <label className="col-sm-2 control-label">Times</label>
          <div className="col-xs-10">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">Configure</a>
                </h4>
              </div>
              <div id="collapseTwo" className="panel-collapse collapse">
                <div className="panel-body">
                  <div className="col-xs-12">
                  <div className="add-slots">
                    <div className="row errors" style={{ display: this.props.timeConfigErrors.length > 0 ? "" : "none" }}>
                      <div className="alert alert-danger">
                        <p>Could not create times:</p>
                        <ul className="add-slots-errors">
                              {this.props.timeConfigErrors.map(function(err, idx) {
                                return <li key={idx}>{err}</li>;
                              })}
                        </ul>
                      </div>
                    </div>
                    <div className="form-group dow">
                      <p>Select days of the week:</p>
                      <ul className="todo-list dow-list m-t small-list">
                        <li>
                          <input type="checkbox" ref="times-config-dow-0" className="i-checks" id="sunday"/>
                          <label htmlFor="sunday" className="m-l-xs">Sunday</label>
                        </li>
                        <li>
                          <input type="checkbox" ref="times-config-dow-1" className="i-checks" id="monday" defaultChecked="checked" />
                          <label htmlFor="monday" className="m-l-xs">Monday</label>
                        </li>
                        <li>
                          <input type="checkbox" ref="times-config-dow-2" className="i-checks" id="tuesday" defaultChecked="checked" />
                          <label htmlFor="tuesday" className="m-l-xs">Tuesday</label>
                        </li>
                        <li>
                          <input type="checkbox" ref="times-config-dow-3" className="-checks" id="wednesday" defaultChecked="checked" />
                          <label htmlFor="wednesday" className="m-l-xs">Wednesday</label>
                        </li>
                        <li>
                          <input type="checkbox" ref="times-config-dow-4" className="-checks" id="thursday" defaultChecked="checked" />
                          <label htmlFor="thursday" className="m-l-xs">Thursday</label>
                        </li>
                        <li>
                          <input type="checkbox" ref="times-config-dow-5" className="-checks" id="friday" defaultChecked="checked" />
                          <label htmlFor="friday" className="m-l-xs">Friday</label>
                        </li>
                        <li>
                          <input type="checkbox" ref="times-config-dow-6" className="-checks" id="saturday"/>
                          <label htmlFor="saturday" className="m-l-xs">Saturday</label>
                        </li>
                      </ul>
                    </div>
                    <div className="add-slot-start-time">
                      <div className="form-inline">
                        <div className="form-group open-time-config">
                          <span className="label label-default">Open</span>
                          <select
                            data-min="0"
                            data-max="13"
                            data-default="9"
                            className="slot-opening-hours dyno form-control"
                            defaultValue="9"
                            ref="slotOpeningHour">
                                {this.getOptionsRange(12)}
                          </select>
                          <select
                            data-min="0"
                            data-max="60"
                            className="slot-minutes dyno form-control"
                            defaultValue="0"
                            ref="slotOpeningMinute">
                                {this.getOptionsRange(59)}
                          </select>
                          <select className="slot-ampm form-control" defaultValue="AM" ref="slotOpeneingAmpm">
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="add-slot-finish-time">
                      <div className="form-inline">
                        <div className="form-group close-time-config">
                          <span className="label label-default">Close</span>
                          <select
                            data-min="1"
                            data-max="13"
                            data-default="5"
                            className="slot-hours dyno form-control"
                            defaultValue="5"
                            ref="slotClosingHour">
                                {this.getOptionsRange(1, 12)}
                          </select>
                          <select
                            data-min="0"
                            data-max="60"
                            className="slot-minutes dyno form-control"
                            defaultValue="0"
                            ref="slotClosingMinute">
                                {this.getOptionsRange(59)}
                          </select>
                          <select className="slot-ampm form-control" defaultValue="PM" ref="slotClosingAmpm">
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-sm-4 col-sm-offset-8">
                      <button
                        type="button"
                        className="btn btn-primary btn-create-slots"
                        onClick={this.onTimeSlotsCreate}>
                        Create Timeslots
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal question-modal fade"
          id="question"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myModalLabel"
          ref="replaceModal">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                <h4 className="modal-title" id="myModalLabel">Times</h4>
              </div>
              <div className="modal-body">Replace Current Hours?</div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={this.addHours.bind(this, false)}>No, add hours to existing schedule</button>
                <button
                  type="button" onClick={this.addHours.bind(this, true)}
                  className="btn btn-warning">
                  Yes, create new schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> );
  }
});

module.exports=TimeSlotsConfiguration;
