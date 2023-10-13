export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const CHANGE_PRODUCT = 'CHANGE_PRODUCT';
export const SET_PRODUCT = 'SET_PRODUCT';
export const SET_PRODUCT_SCHEDULES = 'SET_PRODUCT_SCHEDULES';
export const SET_DURATION_ENABLED_FLAG = 'SET_DURATION_ENABLED_FLAG';
export const SET_LEGACY_VARIANT_TIMES_FLAG = 'SET_LEGACY_VARIANT_TIMES_FLAG';
export const SET_VARIANT_OPTIONS = 'SET_VARIANT_OPTIONS';
export const SET_PRODUCT_TERM_EVENTS = 'SET_PRODUCT_TERM_EVENTS';
export const SET_PRODUCT_LOADING = 'SET_PRODUCT_LOADING';
export const SET_PRODUCT_TERM = 'SET_PRODUCT_TERM';
export const ADD_TERM = 'ADD_TERM';
export const SET_PROFILE_OPTIONS = 'SET_PROFILE_OPTIONS';
export const SET_RESOURCE_OPTIONS = 'SET_RESOURCE_OPTIONS';
export const SET_LOCATION_OPTIONS = 'SET_LOCATION_OPTIONS';
export const SET_COLOR_OPTIONS = 'SET_COLOR_OPTIONS';
export const SET_DURATION_UNIT_OPTIONS = 'SET_DURATION_UNIT_OPTIONS';
export const SET_RANGE_COUNT_BASIS_OPTIONS = 'SET_RANGE_COUNT_BASIS_OPTIONS';
export const SET_CAPACITY_OPTIONS = 'SET_CAPACITY_OPTIONS';
export const SET_VARIANT_NAMES_OPTIONS = 'SET_VARIANT_NAMES_OPTIONS';

export function onProfileOptionsSet(options) {
    return {
        type: SET_PROFILE_OPTIONS,
        options
    };
}
export function onResourceOptionsSet(options) {
    return {
        type: SET_RESOURCE_OPTIONS,
        options
    };
}
export function onLocationOptionsSet(options) {
    return {
        type: SET_LOCATION_OPTIONS,
        options
    };
}
export function onColorOptionsSet(options) {
    return {
        type: SET_COLOR_OPTIONS,
        options
    };
}
export function onDurationUnitOptionsSet(options) {
    return {
        type: SET_DURATION_UNIT_OPTIONS,
        options
    };
}
export function onRangeCountBasisOptionsSet(options) {
    return {
        type: SET_RANGE_COUNT_BASIS_OPTIONS,
        options
    };
}
export function onCapacityOptionsSet(options) {
    return {
        type: SET_CAPACITY_OPTIONS,
        options
    };
}
export function onVariantNameOptionSet(options) {
    return {
        type: SET_VARIANT_NAMES_OPTIONS,
        options
    };
}
export function onProfileSet(profile) {
    return dispatch => {
        dispatch({type: CHANGE_PRODUCT, name:'profile', value: profile});
    }
}


export function onRangeCountBasisSet(count) {
    return dispatch => {
        dispatch({type: CHANGE_PRODUCT, name:'count', value: count});
    }
}

export function onTextColorSet(color) {
    return dispatch => {
        dispatch({type: CHANGE_PRODUCT, name:'text_color', value: color});
    }
}

export function onBackgroundColorSet(color) {
    return dispatch => {
        dispatch({type: CHANGE_PRODUCT, name:'background_color', value: color});
    }
}

export function onBorderColorSet(color) {
    return dispatch => {
        dispatch({type: CHANGE_PRODUCT, name:'border_color', value: color});
    }
}
export function onTitleSet(title) {
    return dispatch => {
        dispatch({type: CHANGE_PRODUCT, name:'product_title', value: title});
    }
}
export function onHandleSet(handle) {
    return dispatch => {
        dispatch({type: CHANGE_PRODUCT, name:'product_handle', value: handle});
    }
}
export function onMindateSet(mindate) {
    return dispatch => {
        dispatch({type: CHANGE_PRODUCT, name:'mindate', value: mindate});
    }
}
export function onLeadTimeSet(lead_time) {
    return dispatch => {
        dispatch({type: CHANGE_PRODUCT, name:'lead_time', value: lead_time});
    }
}
export function onLagTimeSet(lag_time) {
    return dispatch => {
        dispatch({type: CHANGE_PRODUCT, name:'lag_time', value: lag_time});
    }
}
export function onMinDurationSet(min_duration) {
    return dispatch => {
        dispatch({type: CHANGE_PRODUCT, name:'min_duration', value: min_duration});
    }
}

export function onMaxDurationSet(value) {
    return dispatch => {
        dispatch({type: CHANGE_PRODUCT, name:'max_duration', value: value});
    }
}

export function onTermsSet(terms) {
    return dispatch => {
        dispatch({type: CHANGE_PRODUCT, name:'terms_attributes', value: terms});
    }
}

export function onTermSet(index, term) {
    return {
        type: SET_PRODUCT_TERM,
        index, term
    };
}

export function onTermAdd(term) {
    return {
        type: ADD_TERM,
        term
    };
}


export function onCapacityOptionSet(index, value) {
    let key = 'capacity_option' + index;
    return dispatch => {
        dispatch({type: CHANGE_PRODUCT, name:key, value: value});
    }
}

export function onOptionCapacitiesSet(values) {
    return dispatch => {
        dispatch({type: CHANGE_PRODUCT, name: 'option_capacities_attributes', value: values});
    }
}

export function onCapacitySet(value) {
    return dispatch => {
        dispatch({type: CHANGE_PRODUCT, name: 'capacity', value: value});
    }
}

export function onCapacityTypeSet(value) {
    return dispatch => {
        dispatch({type: CHANGE_PRODUCT, name: 'capacity_type', value: value});
    }
}

export function onScheduledSet(value) {
    return dispatch => {
        dispatch({type: CHANGE_PRODUCT, name: 'scheduled', value: value});
    }
}

export function onProductSchedulesSet(value) {
    return {
        type: SET_PRODUCT_SCHEDULES,
        value
    };
}

export function onVariantsSet(values) {
    return dispatch => {
        dispatch({type: CHANGE_PRODUCT, name: 'variants_attributes', value: values});
    }
}

export function onResourcesSet(values) {
    return dispatch => {
        dispatch({type: CHANGE_PRODUCT, name: 'resource_constraints_attributes', value: values});
    }
}

export function onLocationsSet(values) {
    return dispatch => {
        dispatch({type: CHANGE_PRODUCT, name: 'product_locations_attributes', value: values});
    }
}

export function onProductSet(product) {
    return {
        type: SET_PRODUCT,
        product
    };
}

export function onDurationEnabledFlagSet(duration_enabled) {
    return {
        type: SET_DURATION_ENABLED_FLAG,
        duration_enabled
    };
}

export function onLegacyVariantTimesFlagSet(legacy_variant_times) {
    return {
        type: SET_LEGACY_VARIANT_TIMES_FLAG,
        legacy_variant_times
    };
}

export function onProductAdd(name) {
    return {
        type: ADD_PRODUCT,
        name
    };
}

export function onProductUpdate(id) {
    return {
        type: UPDATE_PRODUCT,
        id
    };
}

export function onProductChange(name, value) {
    return {
        type: CHANGE_PRODUCT,
        name,
        value
    };
}


export function onVariantOptionsSet(options) {
    return {
        type: SET_VARIANT_OPTIONS,
        options
    };
}

export function onTermEventsSet(events) {
    return {
        type: SET_PRODUCT_TERM_EVENTS,
        events
    };
}

export function onProductUpdatedSuccessfully(response) {
    return dispatch => {
        dispatch({ response, type: UPDATED_PRODUCT_SUCCESSFULLY });
    };
}

export function onProductSubmit(product, callback) {
    let url = '/admin/products';
    let method = 'POST';
    if (product.id){
        url += '/' + product.id;
        method = 'PUT';
    }

    return dispatch =>
        $.ajax({
            method: method,
            url: url,
            dataType: 'json',
            data: {
                product: product
            }
        }).done(function(response) {
            callback();
            dispatch(onProductSuccessfullyUpdated(response));
        }).fail(function(jqXHR, textStatus) {
            callback();
            dispatch(onProductFailUpdated(jqXHR));
        });
}

export function onProductSuccessfullyUpdated(response) {
    return dispatch => {
        toastr.success(response.message);
        dispatch({type: SET_PRODUCT, product: response.product});
    }
}

export function onProductFailUpdated(response) {
    var responseText = jQuery.parseJSON(response.responseText);
    toastr.clear();
    toastr.error(responseText.message);
}

export function onProductLoadingSet(flag) {
    return {
        type: SET_PRODUCT_LOADING,
        flag
    };
}
