const React = require('react');
const EmailActivity = React.createClass({

  propTypes: {
    bookingCreatedAt: React.PropTypes.string,
    emailEvents: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        occurred_at: React.PropTypes.string,
        event: React.PropTypes.string,
        response: React.PropTypes.string,
        email: React.PropTypes.string
      })
    ).isRequired
  },
  getAlert: function() {
    if (this.props.bookingCreatedAt && moment(this.props.bookingCreatedAt) < moment("2015 12 11 19:00", "YYYY MM DD HH:mm")) {
      return "Email activity is not available for bookings created prior to Dec 11, 2015";
    } else {
      return "No activity";
    }
  },
  render: function() {
    return (
      <div className="m-b m-t">
        { (this.props.emailEvents.length == 0) ?
          <div className="alert alert-info" >
            {this.getAlert()}
          </div>
          :
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Time</th>
                <th>Event</th>
                <th>Email</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
          { this.props.emailEvents.map(function (event, idx) {
            return (
              <tr className="event-row" key={idx}>
                <td>{event.occurred_at}</td>
                <td>{event.event}</td>
                <td>{event.email}</td>
                <td>{event.response}</td>
              </tr>
            )
          })
            }
            </tbody>
          </table>
        }

      </div>
    );
  }
});

module.exports=EmailActivity;
