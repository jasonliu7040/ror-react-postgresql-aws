import { Component, PropTypes } from 'react';
import BlackoutForm  from './blackout_form.js.jsx';

export default class Blackout extends Component {
    render () {
        const { blackout,
            products,
            blackoutIsLoading,
            variants,
            blackoutActions,
            productActions,
            } = this.props;
        return (
            <div>
                <BlackoutForm blackout={blackout}
                    products={products}
                    blackoutIsLoading={blackoutIsLoading}
                    variants={variants}
                    blackoutActions={blackoutActions}
                    productActions={productActions} />
            </div>
        );
    }
}

