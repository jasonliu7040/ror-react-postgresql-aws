import {
    SET_PRODUCT_FILTER,
    SET_BOOKINGS_FILTER,
    SET_BLACKOUTS_FILTER,
    SET_MONTH_FILTER,
    SET_BOOKING_COUNT_BY_MONTH,
    SET_BOOKING_COUNT,
    SET_REVENUE,
    SET_EVENT_FILTER
    } from '../actions/events.js';


const initialState = {
    filter: {
        productId: '',
        blackoutsSelected: false,
        bookingsSelected: false,
        month: new Date().getMonth()
    },
    bookingCountByMonth: {},
    bookingCount: 0,
    revenue: 0
};

const immutableUpdate = require('react-addons-update');

export default function events(state = initialState, action) {
    switch (action.type) {
        case SET_PRODUCT_FILTER:
            return immutableUpdate(state, {
                filter: {
                    productId: {$set: action.productId}
                }
            });
        case SET_BOOKINGS_FILTER:
            return immutableUpdate(state, {
                filter: {
                    bookingsSelected: {$set: action.bookingsSelected}
                }
            });
        case SET_BLACKOUTS_FILTER:
            return immutableUpdate(state, {
                filter: {
                    blackoutsSelected: {$set: action.blackoutsSelected}
                }
            });
        case SET_MONTH_FILTER:
            return immutableUpdate(state, {
                filter: {
                    month: {$set: action.month}
                }
            });
        case SET_BOOKING_COUNT_BY_MONTH:
            return immutableUpdate(state, {
                bookingCountByMonth: {$set: action.items}
            });
        case SET_BOOKING_COUNT:
            return immutableUpdate(state, {
                bookingCount: {$set: action.value}
            });
        case SET_REVENUE:
            return immutableUpdate(state, {
                revenue: {$set: action.value}
            });
        case SET_EVENT_FILTER:
            return immutableUpdate(state, {
                filter: {
                    productId: {$set: action.product},
                    blackoutsSelected: {$set: action.booking},
                    bookingsSelected: {$set: action.blackout},
                    month: {$set: action.month}
                }
            });
        default:
            return state;
    }
};