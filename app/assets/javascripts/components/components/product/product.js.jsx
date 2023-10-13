import { Component, PropTypes } from 'react';
import ProductForm  from './product_form.js.jsx';

export default class Product extends Component {
    render () {
        const { product,
            duration_enabled,
            legacy_variant_times,
            variant_options,
            term_events,
            actions,
            productIsLoading,
            profileOptions,
            resourceOptions,
            colorOptions,
            durationUnitOptions,
            locationOptions,
            rangeCountBasisOptions,
            capacityOptions,
            variantOptionNameOptions,
            } = this.props;
        return (
            <div>
                <ProductForm product={product}
                    duration_enabled={duration_enabled}
                    legacy_variant_times={legacy_variant_times}
                    variant_options={variant_options}
                    term_events={term_events}
                    productIsLoading={productIsLoading}
                    profileOptions={profileOptions}
                    resourceOptions={resourceOptions}
                    locationOptions={locationOptions}
                    colorOptions={colorOptions}
                    durationUnitOptions={durationUnitOptions}
                    rangeCountBasisOptions={rangeCountBasisOptions}
                    capacityOptions={capacityOptions}
                    variantOptionNameOptions={variantOptionNameOptions}
                    actions={actions} />
            </div>
        );
    }
}

