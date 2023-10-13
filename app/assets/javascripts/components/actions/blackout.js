export const SET_BLACKOUT = 'SET_BLACKOUT';
export const SET_BLACKOUT_PRODUCT = 'SET_BLACKOUT_PRODUCT';
export const SET_BLACKOUT_VARIANT = 'SET_BLACKOUT_VARIANT';
export const SET_BLACKOUT_ALL_DAY = 'SET_BLACKOUT_ALL_DAY';
export const SET_BLACKOUT_FINISH_DATE = 'SET_BLACKOUT_FINISH_DATE';
export const SET_BLACKOUT_START_DATE = 'SET_BLACKOUT_START_DATE';
export const SET_BLACKOUT_LOADING = 'SET_BLACKOUT_LOADING';
export const SET_BLACKOUT_VARIANTS = 'SET_BLACKOUT_VARIANTS';



export function onBlackoutSet(value) {
    return {
        type: SET_BLACKOUT,
        value
    };
}

export function onBlackoutProductSet(value) {
    return {
        type: SET_BLACKOUT_PRODUCT,
        value
    };
}

export function onBlackoutVariantSet(value) {
    return {
        type: SET_BLACKOUT_VARIANT,
        value
    };
}

export function onBlackoutAllDaySet(value) {
    return {
        type: SET_BLACKOUT_ALL_DAY,
        value
    };
}

export function onBlackoutStartDateSet(value) {
    return {
        type: SET_BLACKOUT_START_DATE,
        value
    };
}

export function onBlackoutFinishDateSet(value) {
    return {
        type: SET_BLACKOUT_FINISH_DATE,
        value
    };
}

export function onBlackoutSubmit(item, success, fail) {
    let url = '/admin/blackouts';
    let method = 'POST';
    if (item.id){
        url += '/' + item.id;
        method = 'PUT';
    }

    return dispatch =>
        $.ajax({
            method: method,
            url: url,
            dataType: 'json',
            data: {
                blackout: item
            }
        }).done(function(response) {
            success(response.message);
            dispatch(onBlackoutSet(response.blackout));
        }).fail(function(jqXHR, textStatus) {
            var responseText = jQuery.parseJSON(jqXHR.responseText);
            fail(responseText.message);
        });
}

export function onBlackoutDelete(item, success, fail) {
    let url = '/admin/blackouts/' + item.id;
    let method = 'DELETE';

    return dispatch =>
        $.ajax({
            method: method,
            url: url,
            dataType: 'json'
        }).done(function(response) {
            success(response.message);
            dispatch(onBlackoutSet(null));
        }).fail(function(jqXHR, textStatus) {
            var responseText = jQuery.parseJSON(jqXHR.responseText);
            fail(responseText.message);
        });
}

export function onBlackoutLoadingSet(value) {
    return {
        type: SET_BLACKOUT_LOADING,
        value
    };
}
export function onBlackoutVariantsSet(items) {
    return {
        type: SET_BLACKOUT_VARIANTS,
        items
    };
}