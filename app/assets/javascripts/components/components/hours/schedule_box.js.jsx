let React = require('react');
let moment = require('moment');

let ScheduleBox = React.createClass({

  propTypes: {
    seasonIdx: React.PropTypes.number.isRequired,
    dayObject: React.PropTypes.shape({
      day:   React.PropTypes.number.isRequired,
      hours: React.PropTypes.arrayOf(React.PropTypes.shape({
        from: React.PropTypes.shape({
          hour:   React.PropTypes.string.isRequired,
          minute: React.PropTypes.string.isRequired,
        }).isRequired,
        to: React.PropTypes.shape({
          hour:   React.PropTypes.string.isRequired,
          minute: React.PropTypes.string.isRequired,
        }).isRequired,
      })).isRequired
    }).isRequired,
    getWeekday: React.PropTypes.func.isRequired,
    enabledRemoveHourButtons: React.PropTypes.object.isRequired,
    onUpadateEnabledRemoveHoursButtons: React.PropTypes.func.isRequired,
    onRemoveTimeSlot: React.PropTypes.func.isRequired,
  },

  handleHourOptionSelected: function(e) {
    e.target.selected = true;
    let seasonIdx = e.target.getAttribute("data-season-idx");
    let dayIdx    = e.target.getAttribute("data-day-idx");
    let buttonId  = this._getRemoveButtonId(seasonIdx, dayIdx);

    this.props.onUpadateEnabledRemoveHoursButtons(buttonId);
  },

  handleRemoveHourBtn: function(e) {
    let seasonIdx = e.target.getAttribute("data-season-idx");
    let dayIdx    = e.target.getAttribute("data-day-idx");
    let selectRef = "selectForSeason" + seasonIdx + "day" + dayIdx;
    let selectBox = this.refs[selectRef];

    let selectedHour = null;

    for (let i = 0; i < selectBox.children.length; i++) {
      if (selectBox.children[i].selected)
        selectedHour = selectBox.children[i];
    }

    if (selectedHour === null) return;

    let hourIdx = selectedHour.getAttribute("data-hour-idx");

    this.props.onRemoveTimeSlot(seasonIdx, dayIdx, hourIdx);
  },

  isRemoveHourBtnDisabled: function(seasonIdx, dayIdx) {
    let buttonId = this._getRemoveButtonId(seasonIdx, dayIdx);
    return this.props.enabledRemoveHourButtons[buttonId] !== true;
  },

  stringifyHourObjectAsAmpm: function(ho) {
    return this._hhmmToAmpm(ho.from) + "-" + this._hhmmToAmpm(ho.to);
  },

  _hhmmToAmpm: function(hhmm) {
    return moment(hhmm.hour + " " + hhmm.minute, "HH mm").format("hh:mm A");
  },

  _getRemoveButtonId: function(seasonIdx, dayIdx) {
    return seasonIdx + "-" + dayIdx;
  },

  render: function() {
    return (
      <div>
        <div className="label day-label">
          {this.props.getWeekday(this.props.dayObject.day)}
        </div>
        <div style={{position: "relative"}}>
          <select
            ref={"selectForSeason" + this.props.seasonIdx + "day" + this.props.dayObject.day}
            className={"hours-select hours-select-season-" + this.props.seasonIdx + "-day-" + this.props.dayObject.day}
            multiple="multiple"
            style={{width: "150px"}}>

            {this.props.dayObject.hours.map(function(hourObject, hourIdx) {
              return (
                <option
                  className="hour-option"
                  data-season-idx={this.props.seasonIdx}
                  data-day-idx={this.props.dayObject.day}
                  data-hour-idx={hourIdx}
                  onClick={this.handleHourOptionSelected}
                  key={hourIdx}>
                  {this.stringifyHourObjectAsAmpm(hourObject)}
                </option>
              );
            }.bind(this))}
          </select>
          <button
            className="remove-btn"
            data-season-idx={this.props.seasonIdx}
            data-day-idx={this.props.dayObject.day}
            disabled={this.isRemoveHourBtnDisabled(this.props.seasonIdx, this.props.dayObject.day)}
            style={{position: "absolute", top: "0"}}
            onClick={this.handleRemoveHourBtn}>
            x
          </button>
        </div>
      </div>
    );
  }
});

module.exports=ScheduleBox
