const React = require('react');
const ErrorsContainer = React.createClass({

  propTypes: {
    message: React.PropTypes.string.isRequired,
    errors: React.PropTypes.object.isRequired
  },
  getErrorsMessages: function() {
    var fieldKeys = Object.keys(this.props.errors);
    var errors = this.props.errors;
    var messages = [];
    fieldKeys.forEach(function(field, idx) {
        messages.push(errors[field]);
    });
    return messages;
  },
  render: function() {
    const errors = this.getErrorsMessages();
    const display = errors.length > 0 ? "" : "none";
    return (
      <div className="errors" style={{ display: display }}>
        <div className="alert alert-danger">
          <p ref="message">{this.props.message}:</p>
          <ul ref="errors">
            {errors.map(function(msg, idx) {
                return <li key={idx}>{msg}</li>;
            })}
          </ul>
        </div>
      </div>
    );
  }
});

module.exports=ErrorsContainer;
