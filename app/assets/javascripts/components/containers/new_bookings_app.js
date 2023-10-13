import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import BookingForm from '../components/bookings/booking_form.js.jsx';
import * as BookingsActions from '../actions/bookings.js';


function mapStateToProps(state) {
  return {
    isTrialAccount: state.bookings.isTrialAccount,
    reminderTemplates: state.bookings.reminderTemplates,
    shopId: state.bookings.shopId,
    products: state.bookings.products,
    variants: state.bookings.variants,
    resources: state.bookings.resources,
    locations: state.bookings.locations,
    name: state.bookings.name,
    email: state.bookings.email,
    phone: state.bookings.phone,
    hotel: state.bookings.hotel,
    orderName: state.bookings.orderName,
    status: state.bookings.status,
    notes: state.bookings.notes,
    customers: state.bookings.customers,
    items: state.bookings.items,
    itemsValidationErrors: state.bookings.itemsValidationErrors,
    itemsEditValidationErrors: state.bookings.itemsEditValidationErrors,
    bookingNamesValidationErrors: state.bookings.bookingNamesValidationErrors,
    submissionErrors: state.bookings.submissionErrors,
    bookingIsLoading: state.bookings.bookingIsLoading,
    contactInfoValidationErrors: state.bookings.contactInfoValidationErrors,
    emailActivity: state.bookings.emailActivity

  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(BookingsActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingForm);
