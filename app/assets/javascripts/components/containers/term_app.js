import { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Term from '../components/term/term.js.jsx';
import * as TermActions from '../actions/term.js.jsx';

function mapStateToProps(state) {
    return {
        term: state.term.term,
        isLoading: state.term.isLoading
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(TermActions, dispatch) };
}


export default connect(mapStateToProps, mapDispatchToProps)(Term);