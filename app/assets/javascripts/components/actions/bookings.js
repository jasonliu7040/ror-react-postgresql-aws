export const SET_IS_TRIAL_ACCOUNT = 'IS TRIAL ACCOUNT';
export const SET_REMINDER_TEMPLATES = 'REMINDER_TEMPLATES';
export const SET_SHOP_ID = 'SET_SHOP_ID';
export const SET_BOOKING_PRODUCTS = 'SET_BOOKING_PRODUCTS';
export const SET_BOOKING_VARIANTS = 'SET_BOOKING_VARIANTS';
export const SET_RESOURCES = 'SET_RESOURCES';
export const SET_LOCATIONS = 'SET_LOCATIONS';
export const SET_EDIT_VARIANTS  = 'SET_EDIT_VARIANTS';
export const SET_EDIT_RESOURCES = 'SET_EDIT_RESOURCES';
export const SET_EDIT_LOCATIONS = 'SET_EDIT_LOCATIONS';
export const SET_VARIANTS_RESOURCES_LOCATIONS =
  'SET_VARIANTS_RESOURCES_LOCATIONS';
export const SET_EDITING_ITEM_IDX = 'SET_EDITING_ITEM_IDX';
export const SET_EDITING_ITEM_PRODUCT = 'SET_EDITING_ITEM_PRODUCT';
export const SET_EDITING_ITEM_VARIANT = 'SET_EDITING_ITEM_VARIANT';
export const SET_EDITING_ITEM_START = 'SET_EDITING_ITEM_START';
export const SET_EDITING_ITEM_FINISH = 'SET_EDITING_ITEM_FINISH';
export const SET_EDITING_ITEM_QUANTITY = 'SET_EDITING_ITEM_QUANTITY';
export const SET_EDITING_ITEM_RESOURCE = 'SET_EDITING_ITEM_RESOURCE';
export const SET_EDITING_ITEM_LOCATION = 'SET_EDITING_ITEM_LOCATION';
export const DELETE_EDITING_ITEM_RESOURCE = 'DELETE_EDITING_ITEM_RESOURCE';
export const DELETE_EDITING_ITEM_LOCATION = 'DELETE_EDITING_ITEM_LOCATION';
export const SET_ID = 'SET_ID';
export const SET_NAME  = 'SET_NAME';
export const SET_EMAIL = 'SET_EMAIL';
export const SET_PHONE = 'SET_PHONE';
export const SET_HOTEL = 'SET_HOTEL';
export const SET_CUSTOMERS  = 'SET_CUSTOMERS';
export const SET_ORDER_NAME = 'SET_ORDER_NAME';
export const SET_STATUS = 'SET_STATUS';
export const SET_NOTES  = 'SET_NOTES';
export const SET_ITEMS = 'SET_ITEMS';
export const SET_ITEMS_VALIDATION_ERRORS = 'SET_ITEMS_VALIDATION_ERRORS';
export const SET_CONTACT_INFO_VALIDATION_ERRORS = 'SET_CONTACT_INFO_VALIDATION_ERRORS';
export const SET_BOOKING_NAMES_VALIDATION_ERRORS = 'SET_BOOKING_NAMES_VALIDATION_ERRORS';
export const SET_SUBMISSION_ERRORS = 'SET_SUBMISSION_ERRORS';
export const ADD_CUSTOMER = 'ADD_CUSTOMER';
export const ADD_ITEM = 'ADD_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';
export const DELETE_CUSTOMER = 'DELETE_CUSTOMER';
export const SET_LATEST_BOOKINGS = 'SET_LATEST_BOOKINGS';
export const SET_NEXT_BOOKINGS = 'SET_NEXT_BOOKINGS';
export const SET_BOOKING_LOADING = 'SET_BOOKING_LOADING';
export const SET_BOOKING_CREATED_AT = 'SET_BOOKING_CREATED_AT';
export const SET_BOOKING_UPDATED_AT = 'SET_BOOKING_UPDATED_AT';
export const SET_BOOKING = 'SET_BOOKING';
export const SET_BOOKING_PRODUCT_SUMMARY = 'SET_BOOKING_PRODUCT_SUMMARY';
export const SET_EMAIL_ACTIVITY = 'SET_EMAIL_ACTIVITY';

export function onSetIsTrialAccount(isTrialAccount) {
  return {
    type: SET_IS_TRIAL_ACCOUNT,
    isTrialAccount
  };
}

export function onSetReminderTemplates(reminderTemplates) {
  return {
    type: SET_REMINDER_TEMPLATES,
    reminderTemplates
  };
}

export function onSetShopId(shopId) {
  return {
    type: SET_SHOP_ID,
    shopId
  };
}

export function onSetProducts(products) {
  return {
    type: SET_BOOKING_PRODUCTS,
    products
  };
}

export function onSetResources(resources) {
  return {
    type: SET_RESOURCES,
    resources
  };
}

export function onSetLocations(locations) {
  return {
    type: SET_LOCATIONS,
    locations
  };
}

export function onSetVariants(variants) {
  return {
    type: SET_BOOKING_VARIANTS,
    variants
  };
}

export function onSetEditResources(resources) {
  return {
    type: SET_EDIT_RESOURCES,
    resources
  };
}

export function onSetEditLocations(locations) {
  return {
    type: SET_EDIT_LOCATIONS,
    locations
  };
}

export function onSetEditVariants(variants) {
  return {
    type: SET_EDIT_VARIANTS,
    variants
  };
}

export function onSetVariantsResourcesLocations(index, variants, resources, locations) {
  return {
    type: SET_VARIANTS_RESOURCES_LOCATIONS,
    index,
    variants,
    resources,
    locations
  };
}


export function onSetEditingItemIdx(idx) {
  return {
    type: SET_EDITING_ITEM_IDX,
    idx
  };
}

export function onSetEditingItemProduct(index, productId) {
  return {
    type: SET_EDITING_ITEM_PRODUCT,
    index,
    productId
  };
}

export function onSetEditingItemVariant(index, variant) {
  return {
    type: SET_EDITING_ITEM_VARIANT,
    index,
    variant
  };
}

export function onSetEditingItemStart(index, date) {
  return {
    type: SET_EDITING_ITEM_START,
    index,
    date
  };
}

export function onSetEditingItemFinish(index, date) {
  return {
    type: SET_EDITING_ITEM_FINISH,
    index,
    date
  };
}

export function onSetEditingItemQuantity(index, quantity) {
  return {
    type: SET_EDITING_ITEM_QUANTITY,
    index,
    quantity
  }
}

export function onSetEditingItemResource(index, resource) {
  return {
    type: SET_EDITING_ITEM_RESOURCE,
    index,
    resource
  };
}

export function onSetEditingItemLocation(index, location) {
  return {
    type: SET_EDITING_ITEM_LOCATION,
    index,
    location
  };
}

export function onDeleteEditingItemResource() {
  return {
    type: DELETE_EDITING_ITEM_RESOURCE
  }
}

export function onDeleteEditingItemLocation() {
  return {
    type: DELETE_EDITING_ITEM_LOCATION
  }
}

export function onSetId(id) {
  return {
    type: SET_ID,
    id
  };
}

export function onSetName(name) {
  return {
    type: SET_NAME,
    name
  };
}

export function onSetEmail(email) {
  return {
    type: SET_EMAIL,
    email
  };
}

export function onSetPhone(phone) {
  return {
    type: SET_PHONE,
    phone
  };
}

export function onSetHotel(hotel) {
  return {
    type: SET_HOTEL,
    hotel
  };
}

export function onSetCustomers(customers) {
  return {
    type: SET_CUSTOMERS,
    customers
  };
}

export function onSetOrderName(orderName) {
  return {
    type: SET_ORDER_NAME,
    orderName
  };
}

export function onSetStatus(status) {
  return {
    type: SET_STATUS,
    status
  };
}

export function onSetNotes(notes) {
  return {
    type: SET_NOTES,
    notes
  };
}

export function onSetItems(items) {
  return {
    type: SET_ITEMS,
    items
  };
}

export function onSetItemsValidationErrors(errors) {
  return {
    type: SET_ITEMS_VALIDATION_ERRORS,
    errors
  };
}

export function onSetContactInfoErrors(errors) {
  return {
    type: SET_CONTACT_INFO_VALIDATION_ERRORS,
    errors
  };
}

export function onSetBookingNamesValidationErrors(errors) {
  return {
    type: SET_BOOKING_NAMES_VALIDATION_ERRORS,
    errors
  };
}

export function onSetSubmissionErrors(errors) {
  return {
    type: SET_SUBMISSION_ERRORS,
    errors
  };
}

export function onAddCustomer(customer) {
  return {
    type: ADD_CUSTOMER,
    customer
  };
}

export function onAddItem(item) {
  return {
    type: ADD_ITEM,
    item
  };
}

export function onDeleteItem(idx) {
  return {
    type: DELETE_ITEM,
    idx
  };
}

export function onDeleteCustomer(idx) {
  return {
    type: DELETE_CUSTOMER,
    idx
  };
}

export function onLatestBookingsSet(items) {
    return {
        type: SET_LATEST_BOOKINGS,
        items
    };
}

export function onNextBookingsSet(items) {
    return {
        type: SET_NEXT_BOOKINGS,
        items
    };
}

export function onBookingLoadingSet(flag) {
  return {
    type: SET_BOOKING_LOADING,
    flag
  };
}


export function onBookingCreatedDateSet(date) {
  return {
    type: SET_BOOKING_CREATED_AT,
    date
  };
}
export function onBookingUpdatedDateSet(date) {
  return {
    type: SET_BOOKING_UPDATED_AT,
    date
  };
}

export function onBookingProductSummarySet(value) {
  return {
    type: SET_BOOKING_PRODUCT_SUMMARY,
    value
  };
}

export function onBookingSet(booking) {
  return {
    type: SET_BOOKING,
    text
  };
}

export function onBookingSubmit(booking, callback) {

  let url = '/bookings';
  let method = 'POST';
  if (booking.id){
    url += '/' + booking.id;
    method = 'PUT';
  }

  return dispatch => {
    dispatch({type: SET_BOOKING_LOADING, flag: true});
    $.ajax({
      method: method,
      url: url,
      dataType: 'json',
      data: {
        booking: booking
      }
    }).done(function (response) {
      callback();
      dispatch(onBookingSuccessfullyUpdated(response, !booking.id));
    }).fail(function (jqXHR, textStatus) {
      callback();
      dispatch(onBookingFailUpdated(jqXHR));
    });
  }

}

export function onEmailActivityLoad(bookingId) {

  var url = '/bookings/' + bookingId + '/email_activity';

  return dispatch => {
    $.ajax({
      method: 'GET',
      url: url,
      dataType: 'json'
    }).done(function (response) {
      dispatch({type: SET_EMAIL_ACTIVITY, activity: response.email_events});
    }).fail(function (jqXHR, textStatus) { });
  }

}

export function onEmailActivitySet(activity) {
  return {
    type: SET_EMAIL_ACTIVITY,
    activity
  };
}

export function onBookingSuccessfullyUpdated(response, isNew) {
  return dispatch => {
    dispatch({type: SET_BOOKING_LOADING, flag: false});
    toastr.success(response.message);
    if(isNew) {
      window.location = '/admin/bookings/' + response.id + '/edit';
    } else {
      dispatch({type: SET_BOOKING, booking: response.booking});
    }
  }
}

export function onBookingFailUpdated(response) {
  return dispatch => {
    dispatch({type: SET_BOOKING_LOADING, flag: false});
    var responseText = jQuery.parseJSON(response.responseText);
    var errors = responseText.errors;
    toastr.clear();
    toastr.error(responseText.message);
    errors.forEach(function(msg) {
      toastr.error(msg);
    });

  }

}