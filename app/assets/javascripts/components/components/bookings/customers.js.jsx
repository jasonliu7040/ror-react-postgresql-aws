import ErrorsContainer from './errors_container.js.jsx';

const React = require('react');
const Customers = React.createClass({

  propTypes: {
    customers: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        id:    React.PropTypes.number,
        name:  React.PropTypes.string.isRequired,
        email: React.PropTypes.string.isRequired,
        phone: React.PropTypes.string
      })
    ).isRequired,
    bookingNamesValidationErrors: React.PropTypes.arrayOf(
      React.PropTypes.string
    ).isRequired,
    onAddCustomer: React.PropTypes.func.isRequired,
    onDeleteCustomer: React.PropTypes.func.isRequired,
    onSetBookingNamesValidationErrors: React.PropTypes.func.isRequired
  },

  handleAddBookingName: function() {
    const bookingName = this._parseBookingName();
    let errors = [];

    if(this._validateBookingName(bookingName, errors)) {
      this._clearBookingName();
      this.props.onAddCustomer(bookingName);
    }
    this.props.onSetBookingNamesValidationErrors(errors);
  },

  nonDeletedCustomers: function() {
    return this.props.customers.filter(function(customer) {
      return customer._destroy !== true;
    });
  },

  _validateBookingName: function(bookingName, errors) {
    if(!bookingName.name) {
      errors.push("Name can't be blank.");
    }
    return errors.length === 0;
  },

  handleBookingNameDelete: function(e) {
    const rowToDelte = e.currentTarget.getAttribute('data-customer-row');
    this.props.onDeleteCustomer(parseInt(rowToDelte));
  },

  _parseBookingName: function() {
    return {
      id: this.refs.bookingNamesId.value || null,
      name:  this.refs.bookingNamesName.value,
      email: this.refs.bookingNamesEmail.value,
      phone: this.refs.bookingNamesPhone.value
    }
  },

  _clearBookingName: function() {
    this.refs.bookingNamesId.value    = '';
    this.refs.bookingNamesName.value  = '';
    this.refs.bookingNamesEmail.value = '';
    this.refs.bookingNamesPhone.value = '';
  },

  render: function() {
    return (
      <div className="table-responsive">

        <ErrorsContainer
          message='Could not create customer'
          errors={this.props.bookingNamesValidationErrors} />

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input ref="bookingNamesId" className="form-control" type="hidden" />
                <input ref="bookingNamesName" className="form-control" type="text" />
              </td>
              <td><input ref="bookingNamesEmail" className="form-control" type="text" /></td>
              <td><input ref="bookingNamesPhone" className="form-control" type="text" /></td>
              <td>
                <button
                  ref="addBookingName"
                  onClick={this.handleAddBookingName}
                  type="button"
                  className="btn btn-block btn-xs btn-primary">
                  Add
                </button>
              </td>
            </tr>
            {this.nonDeletedCustomers().map(function(customer, idx) {
              return (
                <tr className="customer-row" key={idx}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>
                    <button
                      type="button"
                      className={"btn btn-block btn-xs btn-danger delete-btn-customer-row-" + idx}
                      data-customer-row={idx}
                      onClick={this.handleBookingNameDelete} >
                      <i className="fa fa-trash-o"></i>
                    </button>
                  </td>
                </tr>
              );
            }.bind(this))}
          </tbody>
        </table>
      </div>
    );
  }
});

module.exports=Customers;
