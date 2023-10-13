import React, { Component } from 'react';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';
import TermApp from './term_app.js';
import { onTermSet } from '../actions/term.js.jsx'


const store = configureStore();

let TermContainer = React.createClass({
    componentWillMount: function() {
        store.dispatch(onTermSet(this.props.term));
    },
    render: function() {
        return (
            <div>
                <Provider store={store}>
                    <TermApp />
                </Provider>
            </div>
        );
    }
});

module.exports = TermContainer;