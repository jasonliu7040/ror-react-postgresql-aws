export const SET_PRODUCT_FILTER = 'SET_PRODUCT_FILTER';
export const SET_BOOKINGS_FILTER = 'SET_BOOKINGS_FILTER';
export const SET_BLACKOUTS_FILTER = 'SET_BLACKOUTS_FILTER';
export const SET_MONTH_FILTER = 'SET_MONTH_FILTER';
export const SET_BOOKING_COUNT_BY_MONTH = 'SET_BOOKING_COUNT_BY_MONTH';
export const SET_BOOKING_COUNT = 'SET_BOOKING_COUNT';
export const SET_REVENUE = 'SET_REVENUE';
export const SET_EVENT_FILTER = 'SET_EVENT_FILTER';


export function onProductFilterSet(productId) {
    return {
        type: SET_PRODUCT_FILTER,
        productId
    };
}

export function onBookingsFilterSet(bookingsSelected) {
    return {
        type: SET_BOOKINGS_FILTER,
        bookingsSelected
    };
}

export function onBlackoutsFilterSet(blackoutsSelected) {
    return {
        type: SET_BLACKOUTS_FILTER,
        blackoutsSelected
    };
}

export function onMonthFilterSet(month) {
    return {
        type: SET_MONTH_FILTER,
        month
    };
}

export function onFilterSet(product, booking,blackout, month) {
    return {
        type: SET_EVENT_FILTER,
        product, booking,blackout, month
    };
}

export function onBookingCountByMonthSet(items) {
    return {
        type: SET_BOOKING_COUNT_BY_MONTH,
        items
    };
}

export function onBookingCountSet(value) {
    return {
        type: SET_BOOKING_COUNT,
        value
    };
}

export function onRevenueSet(value) {
    return {
        type: SET_REVENUE,
        value
    };
}
