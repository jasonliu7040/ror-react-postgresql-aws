import React, { Component } from 'react';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';
import BlackoutApp from './blackout_app.js';
import { onBlackoutSet, onBlackoutVariantsSet } from '../actions/blackout.js'
import { onProductsSet, onVariantsSet } from '../actions/products.js'


const store = configureStore();

let BlackoutContainer = React.createClass({
    componentWillMount: function() {
        store.dispatch(onBlackoutSet(this.props.blackout));
        store.dispatch(onProductsSet(this.props.products));
        store.dispatch(onVariantsSet(this.props.blackout.product_id, this.props.variants));
    },
    render: function() {
        return (
            <div>
                <Provider store={store}>
                    <BlackoutApp />
                </Provider>
            </div>
        );
    }
});

module.exports = BlackoutContainer;