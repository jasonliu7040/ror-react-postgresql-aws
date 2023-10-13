import { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Events from '../components/events/events.js.jsx';
import * as EventsActions from '../actions/events.js';

function mapStateToProps(state) {
    return {
        latestBookings: state.bookings.latestBookings,
        nextBookings: state.bookings.nextBookings,
        products: state.products.products,
        filter: state.events.filter,
        bookingCountByMonth: state.events.bookingCountByMonth,
        bookingCount: state.events.bookingCount,
        revenue: state.events.revenue
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(EventsActions, dispatch) };
}


export default connect(mapStateToProps, mapDispatchToProps)(Events);