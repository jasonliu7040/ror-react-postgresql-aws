const React = require('react');
const BookingDetails = React.createClass({

  propTypes: {
    orderName: React.PropTypes.string.isRequired,
    status: React.PropTypes.string.isRequired,
    notes: React.PropTypes.string.isRequired,
    onSetOrderName: React.PropTypes.func.isRequired,
    onSetStatus: React.PropTypes.func.isRequired,
    onSetNotes: React.PropTypes.func.isRequired,
  },

  handleOrderNameChange: function(e) {
    this.props.onSetOrderName(e.target.value);
  },

  handleStatusChange: function(e) {
    this.props.onSetStatus(e.target.value);
  },

  handleNotesChange: function(e) {
    this.props.onSetNotes(e.target.value);
  },

  render: function() {
    return (
      <div className="col-lg-4">
        <div className="panel panel-default">
          <div className="panel-heading">
            Booking details
          </div>
          <div className="panel-body">
            <form role="form">
              <div className="form-group">
                <label>Order</label>
                <input
                  value={this.props.orderName}
                  onChange={this.handleOrderNameChange}
                  ref="orderInput"
                  placeholder="Enter order"
                  className="form-control"
                  type="text" />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={this.props.status}
                  onChange={this.handleStatusChange}
                  ref="statusInput"
                  className="form-control m-b">
                  <option value="1">Reserved</option>
                  <option value="2">Confirmed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={this.props.notes}
                  onChange={this.handleNotesChange}
                  ref="notesInput"
                  className="form-control"
                  rows="15" cols="50">
                </textarea>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

module.exports=BookingDetails;
