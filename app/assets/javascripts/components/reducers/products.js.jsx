import {
    SET_PRODUCTS,
    SET_VARIANTS
    } from '../actions/products.js';

const initialState = {
    products: [],
    variants: { '': '' }
};

const immutableUpdate = require('react-addons-update');

export default function products(state = initialState, action) {
    switch (action.type) {
        case SET_PRODUCTS:
            return immutableUpdate(state, {
                products: {$set: action.products}
            });
        case SET_VARIANTS:
            return immutableUpdate(state, {
                variants: {
                    [action.productId]: {$set: action.items}
                }
            });
        default:
            return state;
    }
}
