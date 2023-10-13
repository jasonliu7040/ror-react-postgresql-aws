import BasicContactInfo from './basic_contact_info.js.jsx';
import Customers from './customers.js.jsx';
import ContactInfoErrorsContainer from './contact_info_errors_container.js.jsx';

const React = require('react');
const ContactInfo = React.createClass({

  propTypes: {
    name: React.PropTypes.string.isRequired,
    email: React.PropTypes.string.isRequired,
    phone: React.PropTypes.string,
    hotel: React.PropTypes.string,
    onSetName:  React.PropTypes.func.isRequired,
    onSetEmail: React.PropTypes.func.isRequired,
    onSetPhone: React.PropTypes.func.isRequired,
    onSetHotel: React.PropTypes.func.isRequired,
    customers: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        id:    React.PropTypes.number,
        name:  React.PropTypes.string.isRequired,
        email: React.PropTypes.string.isRequired,
        phone: React.PropTypes.string
      })
    ),
    bookingNamesValidationErrors: React.PropTypes.arrayOf(
      React.PropTypes.string).isRequired,
    onSetBookingNamesValidationErrors: React.PropTypes.func.isRequired,
    onAddCustomer: React.PropTypes.func.isRequired,
    onDeleteCustomer: React.PropTypes.func.isRequired,
    contactInfoValidationErrors: React.PropTypes.object.isRequired,
  },

  render: function() {
    return (
      <div className="col-lg-8">
        <div className="panel panel-default">
          <div className="panel-heading">
            Contact Info/Names
          </div>
          <div className="panel-body">

            <ContactInfoErrorsContainer
              message='Contact info is invalid:'
              errors={this.props.contactInfoValidationErrors} />

            <BasicContactInfo
              name={this.props.name}
              email={this.props.email}
              phone={this.props.phone}
              hotel={this.props.hotel}
              errors={this.props.contactInfoValidationErrors}
              onSetName={this.props.onSetName}
              onSetEmail={this.props.onSetEmail}
              onSetPhone={this.props.onSetPhone}
              onSetHotel={this.props.onSetHotel} />

            <div className="hr-line-dashed"></div>

            <h5>Add customer</h5>

            <Customers
              customers={this.props.customers}
              bookingNamesValidationErrors={this.props.bookingNamesValidationErrors}
              onAddCustomer={this.props.onAddCustomer}
              onDeleteCustomer={this.props.onDeleteCustomer}
              onSetBookingNamesValidationErrors={this.props.onSetBookingNamesValidationErrors} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports=ContactInfo;
