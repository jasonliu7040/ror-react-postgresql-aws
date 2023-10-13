import React, { Component } from 'react';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';
import BookingsApp from './new_bookings_app.js';

import {
  onSetIsTrialAccount,
  onSetShopId,
  onSetProducts,
  onSetReminderTemplates
} from '../actions/bookings.js';

let store = configureStore();

let NewBookingsContainer = React.createClass({

  propTypes: {
    shopId: React.PropTypes.number.isRequired,
    isTrialAccount: React.PropTypes.bool.isRequired,
    reminderTemplates: React.PropTypes.array.isRequired,
    products: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      product_title: React.PropTypes.string.isRequired
    })).isRequired,
  },

  componentWillMount: function() {
    store.dispatch(onSetIsTrialAccount(this.props.isTrialAccount));
    store.dispatch(onSetShopId(this.props.shopId));
    store.dispatch(onSetProducts(this.props.products));
    store.dispatch(onSetReminderTemplates(this.props.reminderTemplates))
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

module.exports = NewBookingsContainer;
