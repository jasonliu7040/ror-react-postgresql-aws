import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Hours from '../components/hours/hours.js.jsx';
import * as HoursActions from '../actions/hours.js.jsx';


function mapStateToProps(state) {
  return {
    shopId: state.hours.shopId,
    seasons: state.hours.seasons,
    activeSeasonIdx: state.hours.activeSeasonIdx,
    enforced: state.hours.enforced,
    nextSeasonNumber: state.hours.nextSeasonNumber,
    timeConfigErrors: state.hours.timeConfigErrors,
    seasonRangeWarning: state.hours.seasonRangeWarning,
    enabledRemoveHourButtons: state.hours.enabledRemoveHourButtons
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(HoursActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Hours);
