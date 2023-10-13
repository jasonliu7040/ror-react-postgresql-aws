export const SET_PRODUCTS = 'SET_PRODUCTS';
export const SET_VARIANTS = 'SET_VARIANTS';

export function onProductsSet(products) {
    return {
        type: SET_PRODUCTS,
        products
    };
}

export function onVariantsSet(productId, items) {
    return {
        type: SET_VARIANTS,
        productId, items
    };
}

export function onVariantsLoad(productId, callback) {
    return (dispatch, getState) => {
        const state = getState();
        if (state.products.variants[productId] == undefined) {
            $.getJSON("/chooser/variant_options", {product_id: productId}, function (data) {
                dispatch(onVariantsSet(productId, data.variants));
                callback();
            });
        } else {
            callback();
            return state;
        }
    }

}

