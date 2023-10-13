let React = require('react');
import ScheduleBox from './schedule_box.js.jsx';

let Schedule = React.createClass({

  propTypes: {
    seasons: React.PropTypes.arrayOf(React.PropTypes.shape({
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
    })).isRequired,
    activeSeasonIdx: React.PropTypes.number.isRequired,
    getWeekday: React.PropTypes.func.isRequired,
    enabledRemoveHourButtons: React.PropTypes.object.isRequired,
    onUpadateEnabledRemoveHoursButtons: React.PropTypes.func.isRequired,
    onRemoveTimeSlot: React.PropTypes.func.isRequired
  },

  isActiveSeason: function(idx) {
    return idx === this.props.activeSeasonIdx;
  },

  render: function() {
    return (
      <div className="form-group">
        <label className="col-sm-2 control-label">Schedule</label>
          <div className="col-sm-10">
            <div className="opening-hours">
              {this.props.seasons.map(function(season, seasonIdx) {
                return (
                  <div
                    key={seasonIdx}
                    className="season-container"
                    style={{display: !this.isActiveSeason(seasonIdx) ? "none" : "block"}} >
                      {season.days.map(function(dayObject, dayIdx) {
                        return (
                          <ScheduleBox
                            key={dayIdx}
                            seasonIdx={seasonIdx}
                            dayObject={dayObject}
                            getWeekday={this.props.getWeekday}
                            enabledRemoveHourButtons={this.props.enabledRemoveHourButtons}
                            onUpadateEnabledRemoveHoursButtons={this.props.onUpadateEnabledRemoveHoursButtons}
                            onRemoveTimeSlot={this.props.onRemoveTimeSlot} />
                        );
                      }.bind(this))}
                  </div>
                );
              }.bind(this))}
            </div>
          </div>
      </div>
    );
  }
});

module.exports = Schedule;
