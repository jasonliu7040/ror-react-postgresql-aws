import React, { Component } from 'react';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';
import EventsApp from './events_app.js';
import { onLatestBookingsSet, onNextBookingsSet } from '../actions/bookings.js'
import { onProductsSet } from '../actions/products.js'
import { onBookingCountByMonthSet, onBookingCountSet, onRevenueSet } from '../actions/events.js'


const store = configureStore();

let EventsContainer = React.createClass({
    componentWillMount: function() {
        store.dispatch(onLatestBookingsSet(this.props.latest_bookings));
        store.dispatch(onNextBookingsSet(this.props.next_bookings));
        store.dispatch(onProductsSet(this.props.products));
        store.dispatch(onBookingCountByMonthSet(this.props.booking_count_by_month));
        store.dispatch(onBookingCountSet(this.props.booking_count));
        store.dispatch(onRevenueSet(this.props.revenue));
    },
    render: function() {
        return (
            <div>
                <Provider store={store}>
                    <EventsApp />
                </Provider>
            </div>
        );
    }
});

module.exports = EventsContainer;