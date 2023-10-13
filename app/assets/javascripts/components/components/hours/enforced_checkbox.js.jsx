let React = require('react'); // Needs for testing
let EnforcedCheckbox = React.createClass({

  propTypes: {
    enforced: React.PropTypes.bool,
    onSetEnforced: React.PropTypes.func.isRequired
  },

  hanldeEnforced: function(e) {
    this.props.onSetEnforced(e.target.checked);
  },

  render: function() {
    return (
      <div className="row"  style={{marginBottom: "10px", marginTop: "10px"}}>
        <div className="col-sm-1">
          <input
            name="enforced"
            id="enforced"
            type="checkbox"
            defaultChecked={this.props.enforced}
            onChange={this.hanldeEnforced} />
        </div>
        <label htmlFor="enforced" className="col-sm-5 control-label">Restrict datepickers and timepickers to opening hours?</label>
      </div>
    );
  }
});

module.exports=EnforcedCheckbox;
