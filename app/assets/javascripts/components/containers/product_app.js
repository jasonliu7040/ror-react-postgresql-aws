import { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Product from '../components/product/product.js.jsx';
import * as ProductActions from '../actions/product.js.jsx';

function mapStateToProps(state) {
    return {
        product: state.product.product,
        legacy_variant_times: state.product.legacy_variant_times,
        duration_enabled: state.product.duration_enabled,
        configuration_options: state.product.configuration_options,
        variant_options: state.product.variant_options,
        term_events: state.product.term_events,
        productIsLoading: state.product.productIsLoading,
        profileOptions: state.product.profileOptions,
        resourceOptions: state.product.resourceOptions,
        locationOptions: state.product.locationOptions,
        colorOptions: state.product.colorOptions,
        durationUnitOptions: state.product.durationUnitOptions,
        rangeCountBasisOptions: state.product.rangeCountBasisOptions,
        capacityOptions: state.product.capacityOptions,
        variantOptionNameOptions: state.product.variantOptionNameOptions
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(ProductActions, dispatch) };
}


export default connect(mapStateToProps, mapDispatchToProps)(Product);