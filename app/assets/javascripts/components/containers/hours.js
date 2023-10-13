import React, { Component } from 'react';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';
import HoursApp from './hours_app.js';

import {
  onSetShopId,
  onSetSeasons,
  onSetEnforced,
  onSetActiveSeasonIdx,
  onSetNextSeasonNumber,
  onSetTimeConfigErrors,
  onSetSeasonRangeWarning,
  onSetEnabledRemoveHoursButtons} from '../actions/hours.js.jsx'

let store = configureStore();

let HoursContainer = React.createClass({

  propTypes: {
    shopId: React.PropTypes.number.isRequired,
    hours: React.PropTypes.shape({
      enforced: React.PropTypes.bool.isRequired,
      seasons: React.PropTypes.arrayOf(React.PropTypes.shape({
        name:  React.PropTypes.string.isRequired,
        start: React.PropTypes.string.isRequired,
        id:    React.PropTypes.string.isRequired,
        days:  React.PropTypes.arrayOf(React.PropTypes.shape({
          day:    React.PropTypes.number.isRequired,
          hours:  React.PropTypes.arrayOf(React.PropTypes.shape({
            from: React.PropTypes.shape({
              hour:   React.PropTypes.string.isRequired,
              minute: React.PropTypes.string.isRequired,
            }).isRequired,
            to: React.PropTypes.shape({
              hour:   React.PropTypes.string.isRequired,
              minute: React.PropTypes.string.isRequired,
            }).isRequired,
          }))
        })).isRequired,
      })).isRequired
    })
  },

  componentWillMount: function() {
    // Initial values
    store.dispatch(onSetShopId(this.props.shopId));
    store.dispatch(onSetEnforced(this.props.hours.enforced));
    store.dispatch(onSetSeasons(this.props.hours.seasons));
    store.dispatch(onSetActiveSeasonIdx(0));
    store.dispatch(onSetNextSeasonNumber(1));
    store.dispatch(onSetTimeConfigErrors([]));
    store.dispatch(onSetSeasonRangeWarning(false));
    store.dispatch(onSetEnabledRemoveHoursButtons({}));
  },

  render: function() {
    return (
      <div>
        <Provider store={store}>
          <HoursApp />
        </Provider>
      </div>
    );
  }
})

module.exports = HoursContainer;
