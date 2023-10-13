import TrialWarning from './trial_warning.js.jsx';
import ContactInfo from './contact_info.js.jsx';
import BookingDetails from './booking_details.js.jsx';
import BookingItems from './booking_items.js.jsx';
import ErrorsContainer from './errors_container.js.jsx';
import CloseButton from './close_button.js.jsx';
import ReminderButton from './reminder_button.js.jsx';
import EmailActivity from './email_activity.js.jsx';

const React = require('react');
const BookingForm = React.createClass({

  propTypes: {
    reminderTemplates: React.PropTypes.array.isRequired,
    shopId: React.PropTypes.number.isRequired,
    editingItemIdx: React.PropTypes.number,
    isTrialAccount: React.PropTypes.bool.isRequired,
    products: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      product_title: React.PropTypes.string.isRequired
    })).isRequired,
    id: React.PropTypes.number,
    name: React.PropTypes.string.isRequired,
    email: React.PropTypes.string.isRequired,
    phone: React.PropTypes.string,
    hotel: React.PropTypes.string,
    orderName: React.PropTypes.string.isRequired,
    status: React.PropTypes.string.isRequired,
    notes: React.PropTypes.string.isRequired,
    customers: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        id:    React.PropTypes.number,
        name:  React.PropTypes.string.isRequired,
        email: React.PropTypes.string.isRequired,
        phone: React.PropTypes.string
      })
    ),
    items: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.number,
      shop_id: React.PropTypes.number.isRequired,
      product_id: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ]),
      variant_id: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ]),
      start:  React.PropTypes.string.isRequired,
      finish: React.PropTypes.string.isRequired,
      quantity: React.PropTypes.number.isRequired,
      location_id: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ]),
      resource_allocations: React.PropTypes.object
    })).isRequired,
    itemsValidationErrors: React.PropTypes.object.isRequired,
    contactInfoValidationErrors: React.PropTypes.object.isRequired,
    bookingNamesValidationErrors: React.PropTypes.arrayOf(
      React.PropTypes.string).isRequired,
    submissionErrors: React.PropTypes.arrayOf(
      React.PropTypes.string).isRequired,
    bookingIsLoading: React.PropTypes.bool.isRequired,
    productSummary: React.PropTypes.string,
    createdDate: React.PropTypes.string,
    updatedDate: React.PropTypes.string,
    emailActivity: React.PropTypes.array.isRequired

  },
  _validateBooking: function() {
    var itemErrors = {};
    let self = this;
    let isValid = true;
    this.props.items.forEach(function(item, index) {
        self._validateBookingItem(item, index, itemErrors);
      }
    );

    var contactErrors = {};
    this._validateContactInfo(contactErrors);

    if (Object.keys(itemErrors).length > 0 || Object.keys(contactErrors).length > 0) {
      isValid = false;
    }

    this.props.actions.onSetItemsValidationErrors(itemErrors);
    this.props.actions.onSetContactInfoErrors(contactErrors);

    return isValid;
  },
  _setItemError: function(index, field, message, errors){
    if (!errors[index]) {
      errors[index] = {};
    }
    errors[index][field] = message;
    return errors;
  },
  _setContactError: function(field, message, errors){
    errors[field] = message;
    return errors;
  },
  _validateContactInfo: function(errors) {
    if (!this.props.name) {
      this._setContactError('name', "Name can't be blank.", errors);
    }
    if(!this.props.email) {
      this._setContactError('email', "Email can't be blank.", errors);
    }
    return errors;
  },
  _validateBookingItem: function(item, index, errors) {
    if (item._destroy) {
      return errors;
    }
    if (!item.start) {
      this._setItemError(index, 'start', "Start can't be blank.", errors);
    }
    if(!item.finish) {
      this._setItemError(index, 'finish', "Finish can't be blank.", errors);
    }
    if(!item.product_id) {
      this._setItemError(index, 'product_id', "Product can't be blank.", errors);
    }
    if(!item.variant_id) {
      this._setItemError(index, 'variant_id', "Variant can't be blank.", errors);
    }

    if(item.quantity === null || item.quantity === '') {
      this._setItemError(index, 'quantity', "Quantity can't be blank.", errors);
    }
    else if(item.quantity < 1) {
      this._setItemError(index, 'quantity', "Quantity must be bigger than 0.", errors);
    }

    const start  = moment(item.start,  'YYYY-MM-DD HH:mm:ss').unix();
    const finish = moment(item.finish, 'YYYY-MM-DD HH:mm:ss').unix();

    if (start >= finish) {
      this._setItemError(index, 'finish',"Finish time has to be after start time.", errors);
    }

    return errors;
  },
  _getBookingPayload: function() {
    let bookingItems = this.props.items.map(function(item) {
      return {
        id: (item.id ? item.id : ''),
        shop_id: item.shop_id,
        product_id: item.product_id,
        variant_id: item.variant_id ? item.variant_id : null,
        start: item.start,
        finish: item.finish,
        quantity: item.quantity,
        resource_allocations_attributes: (item.resource_allocations ? [ {id: item.resource_allocations.id, resource_id: item.resource_allocations.resource_id} ] : []),
        location_id: item.location_id ? item.location_id : null,
        _destroy: item._destroy || false
      }
    });

    let booking = {
      id: this.props.id,
      name:  this.props.name,
      email: this.props.email,
      phone: this.props.phone,
      hotel: this.props.hotel,

      order_name: this.props.orderName,
      status: this.props.status,
      notes:  this.props.notes,

      booking_names_attributes: this.props.customers || [],
      booking_items_attributes: bookingItems
    };

    return booking;
  },
  onBookingSave: function() {
    if(this._validateBooking()) {
      var booking = this._getBookingPayload();
      this.props.actions.onBookingSubmit(booking, function () {
      });
    }
  },
  _stringifyDate: function(date) {
    return moment(date).format('lll');
  },
  getBookingInfo: function() {
    var info = 'ID:' + this.props.id + ' / Created: ' + this._stringifyDate(this.props.createdDate);
    if (this.props.createdDate != this.props.updatedDate) {
      info += ' / Updated: ' + this._stringifyDate(this.props.updatedDate);
    }
    return info;
  },
  getBookingSummary: function() {
    return this.props.productSummary;
  },
  componentDidMount: function() {
    $('input').keyup(function(){
      $(this).removeClass('error');
    });
    $( "select" ).change(function() {
      $(this).removeClass('error');
    });

  },
  render: function() {
    return (
      <div className="row">

        <div className="ibox float-e-margins">
          {(this.props.id) ?
            <div className="ibox-title">
              <div className="pull-left">
              {this.getBookingSummary()}
              </div>
              <div className="pull-right">
                {this.getBookingInfo()}
              </div>
            </div> : null
            }
          <div className="ibox-content">

            <div className="tabs-container">
              {(this.props.id) ?
                <ul className="nav nav-tabs" id='product_tabs'>
                  <li className="active">
                    <a data-toggle="tab" href="#booking">Booking</a>
                  </li>
                  <li className="">
                    <a data-toggle="tab" href="#email">Email Activity</a>
                  </li>
                </ul> : null
               }
              <div className="tab-content">
                <div id="booking" className="tab-pane active">
                  <TrialWarning isTrialAccount={this.props.isTrialAccount} />

                  <ErrorsContainer
                    message="Failed to save booking"
                    errors={this.props.submissionErrors} />

                  <div className="row">

                    <ContactInfo
                      name={this.props.name}
                      email={this.props.email}
                      phone={this.props.phone}
                      hotel={this.props.hotel}
                      customers={this.props.customers}
                      bookingNamesValidationErrors={this.props.bookingNamesValidationErrors}
                      onSetName={this.props.actions.onSetName}
                      onSetEmail={this.props.actions.onSetEmail}
                      onSetPhone={this.props.actions.onSetPhone}
                      onSetHotel={this.props.actions.onSetHotel}
                      onSetBookingNamesValidationErrors={this.props.actions.onSetBookingNamesValidationErrors}
                      onAddCustomer={this.props.actions.onAddCustomer}
                      contactInfoValidationErrors={this.props.contactInfoValidationErrors}
                      onDeleteCustomer={this.props.actions.onDeleteCustomer} />

                    <BookingDetails
                      orderName={this.props.orderName}
                      status={this.props.status}
                      notes={this.props.notes}
                      onSetOrderName={this.props.actions.onSetOrderName}
                      onSetStatus={this.props.actions.onSetStatus}
                      onSetNotes={this.props.actions.onSetNotes} />

                  </div>

                  <div className="row">

                    <BookingItems
                      shopId={this.props.shopId}
                      editingItemIdx={this.props.editingItemIdx}
                      items={this.props.items}
                      itemsValidationErrors={this.props.itemsValidationErrors}
                      products={this.props.products}
                      onSetVariantsResourcesLocations={this.props.actions.onSetVariantsResourcesLocations}
                      onAddItem={this.props.actions.onAddItem}
                      onDeleteItem={this.props.actions.onDeleteItem}
                      onSetEditingItemProduct={this.props.actions.onSetEditingItemProduct}
                      onSetEditingItemVariant={this.props.actions.onSetEditingItemVariant}
                      onSetEditingItemStart={this.props.actions.onSetEditingItemStart}
                      onSetEditingItemFinish={this.props.actions.onSetEditingItemFinish}
                      onSetEditingItemQuantity={this.props.actions.onSetEditingItemQuantity}
                      onSetEditingItemResource={this.props.actions.onSetEditingItemResource}
                      onSetEditingItemLocation={this.props.actions.onSetEditingItemLocation} />
                  </div>
                </div>
                {(this.props.id) ?
                  <div id="email" className="tab-pane">
                    <EmailActivity
                      bookingCreatedAt={this.props.createdDate}
                      emailEvents={this.props.emailActivity}/>
                  </div> : null
                }
              </div>
            </div>


            <div className="ibox-footer">

              <button
                ref="saveBtn"
                onClick={this.onBookingSave}
                type="button"
                disabled={this.props.bookingIsLoading}
                className="btn btn-primary">Save</button>

              <CloseButton />

              <div className="pull-right">
                <ReminderButton
                  id={this.props.id}
                  reminderTemplates={this.props.reminderTemplates} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports=BookingForm;
