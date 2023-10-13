import {
    SET_BLACKOUT,
    SET_BLACKOUT_PRODUCT,
    SET_BLACKOUT_VARIANT,
    SET_BLACKOUT_ALL_DAY,
    SET_BLACKOUT_FINISH_DATE,
    SET_BLACKOUT_START_DATE,
    SET_BLACKOUT_LOADING,
    SET_BLACKOUT_VARIANTS
} from '../actions/blackout.js';

const initialState = {
    blackout: {},
    blackoutIsLoading: false,
    variants: []
};

const immutableUpdate = require('react-addons-update');

export default function blackout(state = initialState, action) {
    switch (action.type) {
        case SET_BLACKOUT:
            return immutableUpdate(state, {
                blackout: {$set: action.value}
            });
        case SET_BLACKOUT_VARIANTS:
            return immutableUpdate(state, {
                variants: {$set: action.items}
            });
        case SET_BLACKOUT_PRODUCT:
            return immutableUpdate(state, {
                blackout: {
                    product_id: {$set: action.value}
                }
            });
        case SET_BLACKOUT_VARIANT:
            return immutableUpdate(state, {
                blackout: {
                    variant_id: {$set: action.value}
                }
            });
        case SET_BLACKOUT_ALL_DAY:
            return immutableUpdate(state, {
                blackout: {
                    all_day: {$set: action.value}
                }
            });
        case SET_BLACKOUT_FINISH_DATE:
            return immutableUpdate(state, {
                blackout: {
                    finish: {$set: action.value}
                }
            });
        case SET_BLACKOUT_START_DATE:
            return immutableUpdate(state, {
                blackout: {
                    start: {$set: action.value}
                }
            });
        case SET_BLACKOUT_LOADING:
            return immutableUpdate(state, {
                blackoutIsLoading: {$set: action.value}
            });
        default:
            return state;
    }
}