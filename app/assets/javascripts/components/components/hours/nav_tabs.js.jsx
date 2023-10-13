let React = require('react');
let NavTabs = React.createClass({

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
            minute: React.PropTypes.string.isRequired,
          }).isRequired,
          to: React.PropTypes.shape({
            hour:   React.PropTypes.string.isRequired,
            minute: React.PropTypes.string.isRequired,
          }).isRequired,
        }))
      })).isRequired,
    })).isRequired,
    nextSeasonNumber: React.PropTypes.number.isRequired,
    activeSeasonIdx:  React.PropTypes.number.isRequired,
    onAddSeason:      React.PropTypes.func.isRequired,
    stringifyDate:    React.PropTypes.func.isRequired,
    onSetActiveSeasonIdx: React.PropTypes.func.isRequired,
    onDeleteActiveSeason: React.PropTypes.func.isRequired,
  },

  handleTabAdd: function(e) {
    this.props.onAddSeason(this._createSeason());
  },

  handleTabClick: function(e) {
    this.props.onSetActiveSeasonIdx(this._getSeasonIdxFromEvent(e));
  },

  handleTabClose: function(e) {
    if (this.props.seasons.length === 1) {
      toastr.error('You can not remove last schedule');
    } else {
      // Ask for confirmation and then trigger
      // onDeleteActiveSeason if user opts for it
      $(this.refs["removeTabModal"]).modal({
        keyboard: false,   // don't close modal on ESC
        backdrop: 'static' // don't close modal on click outside of it
      });
    }
  },

  isTabActive: function(idx) {
    return this.props.activeSeasonIdx === idx;
  },

  _getSeasonIdxFromEvent: function(event) {
    return parseInt(event.target.getAttribute("data-season-array-idx"));
  },

  _createSeason: function() {
    let today     = new Date();
    let startDate = this.props.stringifyDate(new Date(today.getFullYear(), 0, 1));
    let endDate   = this.props.stringifyDate(new Date(today.getFullYear(), 11, 31));
    return {
      name:  "Season " + this.props.nextSeasonNumber,
      id:    "season-" + this.props.nextSeasonNumber,
      start:  startDate,
      finish: endDate,
      days: [
        {day: 0, hours: []},
        {day: 1, hours: []},
        {day: 2, hours: []},
        {day: 3, hours: []},
        {day: 4, hours: []},
        {day: 5, hours: []},
        {day: 6, hours: []}
      ]
    }
  },

  render: function() {
    return (
      <div>
        <ul className="nav nav-tabs" id="seasons-tabs">

          {this.props.seasons.map(function(season, idx) {
            return (
              <li className={this.isTabActive(idx) ? "season-tab active" : "season-tab"} key={idx}>
                <a
                  className="season-tab-link"
                  data-toggle="tab"
                  aria-expanded="true"
                  data-season-array-idx={idx}
                  onClick={this.handleTabClick}>
                    {season.name}
                </a>
                <span
                  className="btn-delete"
                  onClick={this.handleTabClose}>
                  x
                </span>
              </li>
            );
          }.bind(this))}

          <li>
            <a className="btn-add" onClick={this.handleTabAdd}>+</a>
          </li>
        </ul>

        <div
          className="modal fade"
          id="removeTabModal"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
          ref="removeTabModal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 className="modal-title" id="myModalLabel">Delete Season?</h4>
              </div>
              <div className="modal-body">
                This season will be permanently deleted and cannot be recovered. Are you sure?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-primary btn-remove-tab" data-dismiss="modal" onClick={this.props.onDeleteActiveSeason}>Yes</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
});

module.exports = NavTabs;
