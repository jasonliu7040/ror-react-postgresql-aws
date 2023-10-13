const React = require('react');
const BasicContactInfo = React.createClass({

  propTypes: {
    name:  React.PropTypes.string.isRequired,
    email: React.PropTypes.string.isRequired,
    phone: React.PropTypes.string,
    hotel: React.PropTypes.string,
    onSetName:  React.PropTypes.func.isRequired,
    onSetEmail: React.PropTypes.func.isRequired,
    onSetPhone: React.PropTypes.func.isRequired,
    onSetHotel: React.PropTypes.func.isRequired,
    errors: React.PropTypes.object.isRequired
  },

  handleNameChange: function(e) {
    this.props.onSetName(e.target.value);
  },

  handleEmailChange: function(e) {
    this.props.onSetEmail(e.target.value);
  },

  handlePhoneChange: function(e) {
    this.props.onSetPhone(e.target.value);
  },

  handleHotelChange: function(e) {
    this.props.onSetHotel(e.target.value);
  },
  errorClass: function(field) {
    var styleClass = null;
    if (this.props.errors[field]) {
      styleClass = 'error';
    }
    return styleClass;
  },
  render: function() {
    return (
      <form role="form" id='contact_info' >
        <div className="form-group">
          <label>Name</label>
          <input
            value={this.props.name}
            onChange={this.handleNameChange}
            ref="bookingContactName"
            placeholder="Enter name"
            className={"form-control " + this.errorClass('name')}
            required="true"
            type="text" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            value={this.props.email}
            onChange={this.handleEmailChange}
            ref="bookingContactEmail"
            placeholder="Enter email"
            name="email"
            className={"form-control " + this.errorClass('email')}
            type="email" />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <div className="input-group m-b">
            <input
              value={this.props.phone}
              onChange={this.handlePhoneChange}
              ref="bookingContactPhone"
              placeholder="Phone"
              className="form-control"
              type="tel" />
            <span
              className="input-group-addon"
              data-toggle="tooltip"
              data-placement="left"
              title="Country code required when sending SMS messages outside of North America.">
              <i className="fa fa-question-circle"></i>
            </span>
          </div>
        </div>
        <div className="form-group">
          <label>Hotel</label>
          <input
            value={this.props.hotel}
            onChange={this.handleHotelChange}
            ref="bookingContactHotel"
            placeholder="Hotel"
            className="form-control"
            type="text" />
        </div>
      </form>
    );
  }
});

module.exports=BasicContactInfo;
