import {
    UPDATE_PRODUCT,
    ADD_PRODUCT,
    ADD_TERM,
    CHANGE_PRODUCT,
    SET_PRODUCT_SCHEDULES,
    SET_PRODUCT,
    SET_DURATION_ENABLED_FLAG,
    SET_LEGACY_VARIANT_TIMES_FLAG,
    SET_PRODUCT_TERM_EVENTS,
    SET_PRODUCT_LOADING,
    SET_PRODUCT_TERM,
    SET_PROFILE_OPTIONS,
    SET_RESOURCE_OPTIONS,
    SET_LOCATION_OPTIONS,
    SET_COLOR_OPTIONS,
    SET_DURATION_UNIT_OPTIONS,
    SET_RANGE_COUNT_BASIS_OPTIONS,
    SET_CAPACITY_OPTIONS,
    SET_VARIANT_NAMES_OPTIONS,
    SET_VARIANT_OPTIONS} from '../actions/product.js.jsx';

const initialState = {
    product: {},
    productIsLoading: false,
    legacy_variant_times: false,
    duration_enabled: false,
    variant_options: {},
    term_events: [],
    profileOptions: [],
    resourceOptions: [],
    locationOptions: [],
    colorOptions: [],
    durationUnitOptions: [],
    rangeCountBasisOptions: [],
    capacityOptions: [],
    variantOptionNameOptions: []
};


const immutableUpdate = require('react-addons-update');

export default function product(state = initialState, action) {
    switch (action.type) {
        case SET_PROFILE_OPTIONS:
            return Object.assign({}, state, { profileOptions: action.options });
        case SET_RESOURCE_OPTIONS:
            return Object.assign({}, state, { resourceOptions: action.options });
        case SET_LOCATION_OPTIONS:
            return Object.assign({}, state, { locationOptions: action.options });
        case SET_COLOR_OPTIONS:
            return Object.assign({}, state, { colorOptions: action.options });
        case SET_DURATION_UNIT_OPTIONS:
            return Object.assign({}, state, { durationUnitOptions: action.options });
        case SET_RANGE_COUNT_BASIS_OPTIONS:
            return Object.assign({}, state, { rangeCountBasisOptions: action.options });
        case SET_CAPACITY_OPTIONS:
            return Object.assign({}, state, { capacityOptions: action.options });
        case SET_VARIANT_NAMES_OPTIONS:
            return Object.assign({}, state, { variantOptionNameOptions: action.options });
        case CHANGE_PRODUCT:
            return Object.assign({}, state, {
                product: Object.assign({}, state.product,
                    {
                        [action.name]: action.value
                    })});
        case SET_PRODUCT_SCHEDULES:
            return immutableUpdate(state, {
                product: {
                    schedule_attributes: {
                        recurring_items_attributes: {$set: action.value}
                    }
                }
            });
        case SET_PRODUCT:
            return Object.assign({}, state, { product: action.product });
        case SET_DURATION_ENABLED_FLAG:
            return Object.assign({}, state, { duration_enabled: action.duration_enabled });
        case SET_LEGACY_VARIANT_TIMES_FLAG:
            return Object.assign({}, state, { legacy_variant_times: action.legacy_variant_times });
        case SET_VARIANT_OPTIONS:
            return Object.assign({}, state, { variant_options: action.options });
        case SET_PRODUCT_TERM_EVENTS:
            return Object.assign({}, state, { term_events: action.events });
        case SET_PRODUCT_LOADING:
            return Object.assign({}, state, { productIsLoading: action.flag });
        case SET_PRODUCT_TERM:
            return immutableUpdate(state, {
                product: {
                    terms_attributes: {
                        [action.index]: {$set: action.term}
                    }
                }
            });
        case ADD_TERM:
            return immutableUpdate(state, {
                product: { terms_attributes: { $push: [action.term] } }
            });
        default:
            return state;
    }
}
