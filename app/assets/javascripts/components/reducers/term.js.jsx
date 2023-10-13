import {
    SET_TERM,
    CHANGE_TERM,
    SET_TERM_SCHEDULES,
    SET_TERM_LOADING
    } from '../actions/term.js.jsx';

const initialState = {
    term: {},
    isLoading: false
};
const immutableUpdate = require('react-addons-update');

export default function term(state = initialState, action) {
    switch (action.type) {
        case SET_TERM:
            return immutableUpdate(state, {
                term: {$set: action.term}
            });
        case CHANGE_TERM:
            return immutableUpdate(state, {
                term: {
                        [action.key]: {$set: action.value}
                }
            });
        case SET_TERM_SCHEDULES:
            return immutableUpdate(state, {
                term: {
                    schedule_attributes: {
                        recurring_items_attributes: {$set: action.value}
                    }
                }
            });
        case SET_TERM_LOADING:
            return immutableUpdate(state, {
                isLoading: {$set: action.flag}
            });
        default:
            return state;
    }
}