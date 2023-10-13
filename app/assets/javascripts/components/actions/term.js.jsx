export const SET_TERM = 'SET_TERM';
export const SET_TERM_SCHEDULES = 'SET_TERM_SCHEDULES';
export const CHANGE_TERM = 'CHANGE_TERM';
export const SET_TERM_LOADING = 'SET_TERM_LOADING';

export function onTermSet(term) {
    return {
        type: SET_TERM,
        term
    };
}

export function onNameSet(value) {
    return dispatch => {
        dispatch({type: CHANGE_TERM, key: 'name', value: value});
    }
}

export function onTermFinishDateSet(value) {
    return dispatch => {
        dispatch({type: CHANGE_TERM, key: 'finish_date', value: value});
    }
}

export function onTermStartDateSet(value) {
    return dispatch => {
        dispatch({type: CHANGE_TERM, key: 'start_date', value: value});
    }
}

export function onTermChange(key, value) {
    return {
        type: CHANGE_TERM,
        key,
        value
    };
}

export function onTermSchedulesSet(value) {
    return {
        type: SET_TERM_SCHEDULES,
        value
    };
}

export function onTermSubmit(term, callback) {
    let url = '/admin/products/' + term.product_id + '/terms';
    let method = 'POST';
    if (term.id){
        url += '/' + term.id;
        method = 'PUT';
    }

    return dispatch =>
        $.ajax({
            method: method,
            url: url,
            dataType: 'json',
            data: {
                term: term
            }
        }).done(function(response) {
            callback();
            dispatch(onTermSuccessfullyUpdated(response));
        }).fail(function(jqXHR, textStatus) {
            callback();
            dispatch(onTermtFailUpdated(jqXHR));
        });
}

export function onTermSuccessfullyUpdated(response) {
    return dispatch => {
        toastr.success(response.message);
        dispatch({type: SET_TERM, term: response.term});
    }
}

export function onTermtFailUpdated(response) {
    var responseText = jQuery.parseJSON(response.responseText);
    toastr.clear();
    toastr.error(responseText.message);
}

export function onLoadingSet(flag) {
    return {
        type: SET_TERM_LOADING,
        flag
    };
}
