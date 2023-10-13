import { Component } from 'react';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';
import ProductApp from './product_app.js';
import {onProductSet,
    onDurationEnabledFlagSet,
    onTermEventsSet,
    onLegacyVariantTimesFlagSet,
    onProfileOptionsSet,
    onVariantOptionsSet,
    onResourceOptionsSet,
    onLocationOptionsSet,
    onColorOptionsSet,
    onDurationUnitOptionsSet,
    onRangeCountBasisOptionsSet,
    onCapacityOptionsSet,
    onVariantNameOptionSet
    } from '../actions/product.js.jsx'


const store = configureStore();

export default class App extends Component {
    componentWillMount() {
        store.dispatch(onProductSet(this.props.product));
        store.dispatch(onDurationEnabledFlagSet(this.props.duration_enabled));
        store.dispatch(onLegacyVariantTimesFlagSet(this.props.legacy_variant_times));
        store.dispatch(onVariantOptionsSet(this.props.variant_options));
        store.dispatch(onTermEventsSet(this.props.term_events));
        store.dispatch(onProfileOptionsSet(this.props.profileOptions));
        store.dispatch(onResourceOptionsSet(this.props.resourceOptions));
        store.dispatch(onLocationOptionsSet(this.props.locationOptions));
        store.dispatch(onColorOptionsSet(this.props.colorOptions));
        store.dispatch(onDurationUnitOptionsSet(this.props.durationUnitOptions));
        store.dispatch(onRangeCountBasisOptionsSet(this.props.rangeCountBasisOptions));
        store.dispatch(onCapacityOptionsSet(this.props.capacityOptions));
        store.dispatch(onVariantNameOptionSet(this.props.variantOptionNameOptions));
    }
    render() {
        return (
            <div>
                <Provider store={store}>
                    <ProductApp />
                </Provider>
            </div>
        );
    }
}