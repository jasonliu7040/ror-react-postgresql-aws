const React = require('react');
const ReminderButton = React.createClass({

  propTypes: {
    reminderTemplates: React.PropTypes.array.isRequired
  },

  handleReminder: function() {
    const payload = {
      reminders: {
        booking_ids: [this.props.id],
        template_id: this.refs.reminderTemplate.value
      }
    }
    $.ajax({
      type: "POST",
      url: "/bookings/send_reminders",
      data: payload,
      success: function(resp) {
        toastr.success(resp.message)
      }.bind(this),
      error: function(jqXHR, textStatus, errorThrown) {
        toastr.error(jqXHR.responseJSON.message);
      },
      dataType: "json"
    });
  },

  render: function() {
    return (
      <div>
        <div className="form-group" style={{display: "inline-block"}}>
          <select
            ref="reminderTemplate"
            className="form-control m-b">
            {this.props.reminderTemplates.map(function(template, idx) {
              return <option key={idx} value={template[1]}>{template[0]}</option>;
            })}
          </select>
        </div>
        <button
          onClick={this.handleReminder}
          type="button"
          className="btn btn-success"
          style={{marginLeft: '5px'}}>Send reminder</button>
      </div>
    );
  }
});

module.exports = ReminderButton;
