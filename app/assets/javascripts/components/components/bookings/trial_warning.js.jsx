const React = require('react');
const TrialWarning = React.createClass({

  propTypes: {
    isTrialAccount: React.PropTypes.bool.isRequired
  },

  displayStyle: function() {
    return this.props.isTrialAccount ? 'block' : 'none';
  },

  render: function() {
    return (
      <div className="alert alert-warning alert-dismissable m-t" style={{display: this.displayStyle()}}>
        You are currently on the trial plan (maximum 10 products/10 bookings). <a className="upgrade-link" href="/charges">Upgrade your subscription</a> to the paid plan for unlimited products and bookings.
      </div>
    );
  }
});

module.exports=TrialWarning;
