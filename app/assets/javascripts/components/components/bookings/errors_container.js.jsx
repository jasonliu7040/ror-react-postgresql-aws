const React = require('react');
const ErrorsContainer = React.createClass({

  propTypes: {
    message: React.PropTypes.string.isRequired,
    errors: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  },

  render: function() {
    const display = this.props.errors.length > 0 ? "" : "none";
    return (
      <div className="errors" style={{ display: display }}>
        <div className="alert alert-danger">
          <p ref="message">{this.props.message}:</p>
          <ul ref="errors">
            {this.props.errors.map(function(err, idx) {
              return <li key={idx}>{err}</li>;
            })}
          </ul>
        </div>
      </div>
    );
  }
});

module.exports=ErrorsContainer
