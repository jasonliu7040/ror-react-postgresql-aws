let React = require('react');
let SeasonNameInput = React.createClass({

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
    onUpdateActiveSeasonName: React.PropTypes.func.isRequired,
  },

  handleSeasonNameChange: function(e) {
    let name = e.target.value;
    let handle = this._handleize(name);
    this.props.onUpdateActiveSeasonName(name, handle);
  },

  _handleize: function(s) {
    return s.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
  },

  render: function() {
    return (
      <div className="form-group">
        <label htmlFor="season-name" className="col-sm-2 control-label">Season</label>
        <div className="col-sm-10">
          <input
            name="season-name"
            type="text"
            value={this.props.season.name}
            onChange={this.handleSeasonNameChange}
            className="form-control season-name"
            required="required">
          </input>
        </div>
      </div>
    );
  }
});

module.exports = SeasonNameInput;
