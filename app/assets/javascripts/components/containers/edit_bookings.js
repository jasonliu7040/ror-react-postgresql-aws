import React, { Component } from 'react';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';
import BookingsApp from './edit_bookings_app.js';

import {
  onSetIsTrialAccount,
  onSetShopId,
  onSetProducts,
  onSetId,
  onSetName,
  onSetEmail,
  onSetPhone,
  onSetHotel,
  onSetOrderName,
  onSetStatus,
  onSetNotes,
  onSetCustomers,
  onSetItems,
  onSetReminderTemplates,
  onBookingUpdatedDateSet,
  onBookingCreatedDateSet,
  onBookingProductSummarySet,
  onEmailActivityLoad
} from '../actions/bookings.js';

let store = configureStore();

let EditBookingsContainer = React.createClass({

  propTypes: {
    shopId: React.PropTypes.number.isRequired,
    isTrialAccount: React.PropTypes.bool.isRequired,
    booking: React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      name: React.PropTypes.string.isRequired,
      email: React.PropTypes.string.isRequired,
      phone: React.PropTypes.string,
      hotel: React.PropTypes.string,
      order_name: React.PropTypes.string.isRequired,
      status: React.PropTypes.number.isRequired,
      notes: React.PropTypes.string.isRequired,
      customers: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        name: React.PropTypes.string.isRequired,
        email: React.PropTypes.string.isRequired,
        phone: React.PropTypes.string
      })).isRequired,
      items: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        shop_id: React.PropTypes.number.isRequired,

        start:  React.PropTypes.string.isRequired,
        finish: React.PropTypes.string.isRequired,
        quantity: React.PropTypes.number.isRequired,
        product_id: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.number
        ]),
        variant_id: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.number
        ]),
        location_id: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.number
        ]),
        resource_allocations: React.PropTypes.object
      })).isRequired
    }).isRequired,
    reminderTemplates: React.PropTypes.array.isRequired,
    products: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      product_title: React.PropTypes.string.isRequired
    })).isRequired
  },

  componentWillMount: function() {
    store.dispatch(onSetIsTrialAccount(this.props.isTrialAccount));
    store.dispatch(onSetShopId(this.props.shopId));
    store.dispatch(onSetProducts(this.props.products));
    store.dispatch(onSetId(this.props.booking.id));
    store.dispatch(onSetName(this.props.booking.name));
    store.dispatch(onSetEmail(this.props.booking.email));
    store.dispatch(onSetPhone(this.props.booking.phone));
    store.dispatch(onSetHotel(this.props.booking.hotel));
    store.dispatch(onBookingUpdatedDateSet(this.props.booking.updated_at));
    store.dispatch(onBookingCreatedDateSet(this.props.booking.created_at));
    store.dispatch(onSetOrderName(this.props.booking.order_name));
    store.dispatch(onSetStatus(this.props.booking.status.toString()));
    store.dispatch(onSetNotes(this.props.booking.notes));
    store.dispatch(onSetCustomers(this.props.booking.customers));
    store.dispatch(onSetItems(this.props.booking.items));
    store.dispatch(onBookingProductSummarySet(this.props.booking.product_summary));
    store.dispatch(onSetReminderTemplates(this.props.reminderTemplates));
    store.dispatch(onEmailActivityLoad(this.props.booking.id));
  },

  render: function() {
    return (
      <div>
        <Provider store={store}>
          <BookingsApp />
        </Provider>
      </div>
    );
  }
})

module.exports = EditBookingsContainer;
