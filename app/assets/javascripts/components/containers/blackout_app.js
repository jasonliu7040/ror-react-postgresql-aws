import { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Blackout from '../components/blackout/blackout.js.jsx';
import * as BlackoutActions from '../actions/blackout.js';
import * as ProductsActions from '../actions/products.js';

function mapStateToProps(state) {
    return {
        blackout: state.blackout.blackout,
        blackoutIsLoading: state.blackout.blackoutIsLoading,
        variants: (state.products.variants[state.blackout.blackout.product_id] || []),
        products: state.products.products
    };
}

function mapDispatchToProps(dispatch) {
    return { blackoutActions: bindActionCreators(BlackoutActions, dispatch), productActions: bindActionCreators(ProductsActions, dispatch) };
}


export default connect(mapStateToProps, mapDispatchToProps)(Blackout);