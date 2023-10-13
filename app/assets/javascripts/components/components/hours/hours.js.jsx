import NavTabs from './nav_tabs.js.jsx';
import SeasonNameInput from './season_name_input.js.jsx';
import SeasonDateRangeSelectors from './season_date_range_selectors.js.jsx';
import TimeSlotsConfiguration from './time_slots_configuration.js.jsx';
import Schedule from './schedule.js.jsx';
import EnforcedCheckbox from './enforced_checkbox.js.jsx';
import SubmitButton from './submit_button.js.jsx';

let React = require('react');
let moment = require('moment');
let Hours = React.createClass({

  propTypes: {
    actions: React.PropTypes.object.isRequired,
    activeSeasonIdx: React.PropTypes.number.isRequired,
    enabledRemoveHourButtons: React.PropTypes.object.isRequired,
    enforced: React.PropTypes.bool,
    nextSeasonNumber: React.PropTypes.number.isRequired,
    seasonRangeWarning: React.PropTypes.bool.isRequired,
    seasons: React.PropTypes.arrayOf(React.PropTypes.shape({
      name:  React.PropTypes.string.isRequired,
      start: React.PropTypes.string.isRequired,
      id:    React.PropTypes.string.isRequired,
      days:  React.PropTypes.arrayOf(React.PropTypes.shape({
        day:    React.PropTypes.number.isRequired,
        hours:  React.PropTypes.arrayOf(React.PropTypes.shape({
          from: React.PropTypes.shape({
            hour:   React.PropTypes.string.isRequired,
            minute: React.PropTypes.string.isRequired,
          }).isRequired,
          to: React.PropTypes.shape({
            hour:   React.PropTypes.string.isRequired,
            minute: React.PropTypes.string.isRequired,
          }).isRequired,
        }))
      })).isRequired,
    })).isRequired,
    shopId: React.PropTypes.number.isRequired,
    timeConfigErrors: React.PropTypes.arrayOf(React.PropTypes.string)
  },

  componentDidMount: function() {
    this._manageSeasonDateRangeWarning();
  },

  componentDidUpdate: function() {
    this._manageSeasonDateRangeWarning();
  },

  _manageSeasonDateRangeWarning: function() {
    if (!this.props.enforced) {
      this.props.actions.onSetSeasonRangeWarning(false);
      return;
    }

    let min = moment(this.getActiveSeason().start);
    let max = moment(this.getActiveSeason().finish);

    if (min.date() == 1 && min.month() == 0 && max.date() == 31 && max.month() == 11) {
      this.props.actions.onSetSeasonRangeWarning(false);
    } else {
      this.props.actions.onSetSeasonRangeWarning(true);
    }
  },

  // General helpers

  getActiveSeason: function() {
    return this.props.seasons[this.props.activeSeasonIdx];
  },

  _stringifyDate: function(dateObject) {
    return moment(dateObject).format("YYYY-MM-DD");
  },

  _getWeekday: function(dayNum) {
    let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekdays[dayNum];
  },

  render: function() {
    return (
      <div>
        <div id="hours-wrap" style={{marginBottom: "100px"}}>
          <div id="seasons" className="custom">
            <div className="tabs-container">

              <NavTabs
                seasons={this.props.seasons}
                nextSeasonNumber={this.props.nextSeasonNumber}
                activeSeasonIdx={this.props.activeSeasonIdx}
                onAddSeason={this.props.actions.onAddSeason}
                onSetActiveSeasonIdx={this.props.actions.onSetActiveSeasonIdx}
                onDeleteActiveSeason={this.props.actions.onDeleteActiveSeason}
                stringifyDate={this._stringifyDate} />

              <div className="tab-content" id="seasons-tabs-content">
                <div className="season tab-pane active">
                  <div className="panel-body form-horizontal">

                    <div className="season-details">

                      <SeasonNameInput
                        season={this.getActiveSeason()}
                        onUpdateActiveSeasonName={this.props.actions.onUpdateActiveSeasonName} />

                      <SeasonDateRangeSelectors
                        season={this.getActiveSeason()}
                        onUpdateActiveSeasonStart={this.props.actions.onUpdateActiveSeasonStart}
                        onUpdateActiveSeasonFinish={this.props.actions.onUpdateActiveSeasonFinish}
                        seasonRangeWarning={this.props.seasonRangeWarning}
                        stringifyDate={this._stringifyDate} />

                      <TimeSlotsConfiguration
                        season={this.getActiveSeason()}
                        timeConfigErrors={this.props.timeConfigErrors}
                        getWeekday={this._getWeekday}
                        onSetTimeConfigErrors={this.props.actions.onSetTimeConfigErrors}
                        onReplaceActiveSeasonTimeSlots={this.props.actions.onReplaceActiveSeasonTimeSlots}
                        onUpdateActiveSeasonTimeSlots={this.props.actions.onUpdateActiveSeasonTimeSlots} />

                      <Schedule
                        seasons={this.props.seasons}
                        activeSeasonIdx={this.props.activeSeasonIdx}
                        getWeekday={this._getWeekday}
                        enabledRemoveHourButtons={this.props.enabledRemoveHourButtons}
                        onUpadateEnabledRemoveHoursButtons={this.props.actions.onUpadateEnabledRemoveHoursButtons}
                        onRemoveTimeSlot={this.props.actions.onRemoveTimeSlot} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <EnforcedCheckbox
            enforced={this.props.enforced}
            onSetEnforced={this.props.actions.onSetEnforced} />

          <SubmitButton
            shopId={this.props.shopId}
            enforced={this.props.enforced}
            seasons={this.props.seasons} />
        </div>
      </div>
    );
  }
});

module.exports = Hours;
