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
    id: state.bookings.id,
    name: state.bookings.name,
    email: state.bookings.email,
    phone: state.bookings.phone,
    hotel: state.bookings.hotel,
    productSummary: state.bookings.productSummary,
    createdDate: state.bookings.createdAt,
    updatedDate: state.bookings.updatedAt,
    orderName: state.bookings.orderName,
    status: state.bookings.status,
    notes: state.bookings.notes,
    customers: state.bookings.customers,
    items: state.bookings.items,
    bookingIsLoading: state.bookings.bookingIsLoading,
    itemsValidationErrors: state.bookings.itemsValidationErrors,
    itemsEditValidationErrors: state.bookings.itemsEditValidationErrors,
    bookingNamesValidationErrors: state.bookings.bookingNamesValidationErrors,
    submissionErrors: state.bookings.submissionErrors,
    contactInfoValidationErrors: state.bookings.contactInfoValidationErrors,
    emailActivity: state.bookings.emailActivity
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(BookingsActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingForm);
