let React = require('react');
let DateTimeField = require('react-bootstrap-datetimepicker-noicon');
let SeasonDateRangeSelectors = React.createClass({

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
            minute: React.PropTypes.string.isRequired,
          }).isRequired,
          to: React.PropTypes.shape({
            hour:   React.PropTypes.string.isRequired,
            minute: React.PropTypes.string.isRequired,
          }).isRequired,
        }))
      })).isRequired,
    }).isRequired,
    onUpdateActiveSeasonStart:  React.PropTypes.func.isRequired,
    onUpdateActiveSeasonFinish: React.PropTypes.func.isRequired,
    seasonRangeWarning: React.PropTypes.bool.isRequired,
    stringifyDate: React.PropTypes.func.isRequired
  },

  handleSeasonStartChanged: function(date) {
    this.props.onUpdateActiveSeasonStart(this.props.stringifyDate(date));
  },

  handleSeasonFinishChanged: function(date) {
    this.props.onUpdateActiveSeasonFinish(this.props.stringifyDate(date));
  },

  render: function() {
    return (
      <div className="form-group">
        <label htmlFor="all-year-season-start" className="col-sm-2 control-label">Dates</label>
        <div className="col-sm-10" style={{zIndex: 1000}}>
          <div className="input-daterange input-group">
            <DateTimeField
              showYearInToolbar={false}
              format="YYYY-MM-DD"
              dateTime={this.props.season.start}
              inputFormat="MMM D"
              mode="date"
              onChange={this.handleSeasonStartChanged}
              required={true} />
            <span className="input-group-addon">to</span>
            <DateTimeField
              showYearInToolbar={false}
              format="YYYY-MM-DD"
              dateTime={this.props.season.finish}
              inputFormat="MMM D"
              mode="date"
              onChange={this.handleSeasonFinishChanged}
              required={true} />
          </div>
          <div
            ref="seasonRangeWarning"
            className={ this.props.seasonRangeWarning ? "season-range-warning" : "season-range-warning hidden"}
            style={{marginTop: "10px", display: this.props.seasonRangeWarning ? "" : "none"}}>
            <div className="notification note-attention">
              <span className="icon"></span>
              <p>
                <strong>Note:</strong> Dates that fall outside of the seasonal date ranges will not be available.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SeasonDateRangeSelectors
