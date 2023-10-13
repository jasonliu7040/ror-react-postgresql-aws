import {
  SET_IS_TRIAL_ACCOUNT,
  SET_REMINDER_TEMPLATES,
  SET_SHOP_ID,
  SET_BOOKING_PRODUCTS,
  SET_BOOKING_VARIANTS,
  SET_EDIT_VARIANTS,
  SET_EDIT_RESOURCES,
  SET_EDIT_LOCATIONS,
  SET_VARIANTS_RESOURCES_LOCATIONS,
  SET_EDITING_ITEM_IDX,
  SET_EDITING_ITEM_PRODUCT,
  SET_EDITING_ITEM_VARIANT,
  SET_EDITING_ITEM_START,
  SET_EDITING_ITEM_FINISH,
  SET_EDITING_ITEM_QUANTITY,
  SET_EDITING_ITEM_RESOURCE,
  SET_EDITING_ITEM_LOCATION,
  DELETE_EDITING_ITEM_RESOURCE,
  DELETE_EDITING_ITEM_LOCATION,
  SET_ID,
  SET_NAME,
  SET_EMAIL,
  SET_PHONE,
  SET_HOTEL,
  SET_CUSTOMERS,
  SET_ORDER_NAME,
  SET_STATUS,
  SET_NOTES,
  SET_ITEMS,
  SET_ITEMS_VALIDATION_ERRORS,
  SET_BOOKING_NAMES_VALIDATION_ERRORS,
  SET_SUBMISSION_ERRORS,
  ADD_ITEM,
  ADD_CUSTOMER,
  DELETE_ITEM,
  DELETE_CUSTOMER,
  SET_LATEST_BOOKINGS,
  SET_NEXT_BOOKINGS,
  SET_BOOKING_LOADING,
  SET_CONTACT_INFO_VALIDATION_ERRORS,
  SET_BOOKING_CREATED_AT,
  SET_BOOKING_UPDATED_AT,
  SET_BOOKING,
  SET_BOOKING_PRODUCT_SUMMARY,
  SET_EMAIL_ACTIVITY
} from '../actions/bookings.js';

const initialState = {
  isTrialAccount: null,
  reminderTemplates: [],
  shopId: null,
  name: '',
  email: '',
  phone: '',
  products: [],
  editVariants: [],
  editResources: [],
  editLocations: [],
  editingItemIdx: null,
  orderName: '',
  status: '1',
  notes: '',
  customers: [],
  items: [],
  itemsValidationErrors: {},
  contactInfoValidationErrors: {},
  bookingNamesValidationErrors: [],
  submissionErrors: [],
  latestBookings: [],
  nextBookings: [],
  bookingIsLoading: false,
  createdAt: null,
  updatedAt: null,
  productSummary: null,
  emailActivity: [],
  id: null
};

const immutableUpdate = require('react-addons-update');

export default function hours(state = initialState, action) {
  switch (action.type) {
    case SET_IS_TRIAL_ACCOUNT:
      return immutableUpdate(state, {
        isTrialAccount: {$set: action.isTrialAccount}
      });
    case SET_REMINDER_TEMPLATES:
      return immutableUpdate(state, {
        reminderTemplates: {$set: action.reminderTemplates}
      });
    case SET_SHOP_ID:
      return immutableUpdate(state, {
        shopId: {$set: action.shopId}
      });
    case SET_BOOKING_PRODUCTS:
      return immutableUpdate(state, {
        products: {$set: action.products}
      });
    case SET_VARIANTS_RESOURCES_LOCATIONS:
      return immutableUpdate(state, {
        items: {
          [action.index]: {
            variants:  {$set: action.variants},
            resources: {$set: action.resources},
            locations: {$set: action.locations}
          }
        }
      });
    case SET_EDITING_ITEM_IDX:
      return immutableUpdate(state, {
        editingItemIdx: {$set: action.idx}
      });
    case SET_EDITING_ITEM_PRODUCT:
      var product = state.products.find(function(p){
        return p.id == action.productId;
      });
      var start = state.items[action.index].start;
      var finish = state.items[action.index].finish;
      if (product && product.default_times.start && product.default_times.finish) {
        start = product.default_times.start;
        finish = product.default_times.finish;
      }
      return immutableUpdate(state, {
        items: {
          [action.index]: {
            product_id: {$set: action.productId},
            start: {$set: start},
            finish: {$set: finish}
          }
        }
      });
    case SET_EDITING_ITEM_VARIANT:
      return immutableUpdate(state, {
        items: {
          [action.index]: {
            variant_id: {$set: action.variant}
          }
        }
      });
    case SET_EDITING_ITEM_START:
      return immutableUpdate(state, {
        items: {
          [action.index]: {
            start: {$set: action.date}
          }
        }
      });
    case SET_EDITING_ITEM_FINISH:
      return immutableUpdate(state, {
        items: {
          [action.index]: {
            finish: {$set: action.date}
          }
        }
      });
    case SET_EDITING_ITEM_QUANTITY:
      return immutableUpdate(state, {
        items: {
          [action.index]: {
            quantity: {$set: action.quantity}
          }
        }
      });
    case SET_EDITING_ITEM_RESOURCE:
      return immutableUpdate(state, {
        items: {
          [action.index]: {
            resource_allocations: {
              resource_id: {$set: action.resource}
            }
          }
        }
      });
    case SET_EDITING_ITEM_LOCATION:
      return immutableUpdate(state, {
        items: {
          [action.index]: {
            location_id: {$set: action.location}
          }
        }
      });
    case DELETE_EDITING_ITEM_RESOURCE:
      return immutableUpdate(state, {
        items: {
          [action.index]: {$apply: function(item) {
            delete item['resource'];
            return item;
          }}
        }
      });
    case DELETE_EDITING_ITEM_LOCATION:
      return immutableUpdate(state, {
        items: {
          [state.editingItemIdx]: {$apply: function(item) {
            delete item['location'];
            return item;
          }}
        }
      });
    case SET_ID:
      return immutableUpdate(state, {
        id: {$set: action.id}
      });
    case SET_NAME:
      return immutableUpdate(state, {
        name: {$set: action.name}
      });
    case SET_EMAIL:
      return immutableUpdate(state, {
        email: {$set: action.email}
      });
    case SET_PHONE:
      return immutableUpdate(state, {
        phone: {$set: action.phone}
      });
    case SET_HOTEL:
      return immutableUpdate(state, {
        hotel: {$set: action.hotel}
      });
    case SET_CUSTOMERS:
      return immutableUpdate(state, {
        customers: {$set: action.customers}
      });
    case SET_ORDER_NAME:
      return immutableUpdate(state, {
        orderName: {$set: action.orderName}
      });
    case SET_STATUS:
      return immutableUpdate(state, {
        status: {$set: action.status}
      });
    case SET_NOTES:
      return immutableUpdate(state, {
        notes: {$set: action.notes}
      });
    case SET_ITEMS:
      return immutableUpdate(state, {
        items: {$set: action.items}
      });
    case SET_ITEMS_VALIDATION_ERRORS:
      return immutableUpdate(state, {
        itemsValidationErrors: {$set: action.errors}
      });
    case SET_CONTACT_INFO_VALIDATION_ERRORS:
      return immutableUpdate(state, {
        contactInfoValidationErrors: {$set: action.errors}
      });
    case SET_BOOKING_NAMES_VALIDATION_ERRORS:
      return immutableUpdate(state, {
        bookingNamesValidationErrors: {$set: action.errors}
      });
    case SET_SUBMISSION_ERRORS:
      return immutableUpdate(state, {
        submissionErrors: {$set: action.errors}
      });
    case ADD_CUSTOMER:
      return immutableUpdate(state, {
        customers: {$push: [action.customer]}
      });
    case ADD_ITEM:
      return immutableUpdate(state, {
        items: {$push: [action.item]}
      });
    case DELETE_ITEM:
      // Two cases.
      // Item exists in db - mark it for destruction with _destroy=true
      // Item exists only in react - remove it from items list
      if(state.items[action.idx].id) {
        return immutableUpdate(state, {
          items: {
            [action.idx]: {
              _destroy: {$set: true}
            }
          }
        })
      } else {
        return immutableUpdate(state, {
          items: {$splice: [[action.idx, 1]]}
        });
      }
    case DELETE_CUSTOMER:
      if(state.customers[action.idx].id) {
        return immutableUpdate(state, {
          customers: {
            [action.idx]: {
              _destroy: {$set: true}
            }
          }
        })
      } else {
        return immutableUpdate(state, {
          customers: {$splice: [[action.idx, 1]]}
        });
      }
    case SET_LATEST_BOOKINGS:
      return immutableUpdate(state, {
          latestBookings: {$set: action.items}
      });
    case SET_NEXT_BOOKINGS:
      return immutableUpdate(state, {
          nextBookings: {$set: action.items}
      });
    case SET_BOOKING_LOADING:
      return immutableUpdate(state, {
        bookingIsLoading: {$set: action.flag}
      });
    case SET_BOOKING_CREATED_AT:
      return immutableUpdate(state, {
        createdAt: {$set: action.date}
      });
    case SET_BOOKING_UPDATED_AT:
      return immutableUpdate(state, {
        updatedAt: {$set: action.date}
      });
    case SET_BOOKING_PRODUCT_SUMMARY:
      return immutableUpdate(state, {
        productSummary: {$set: action.value}
      });
    case SET_BOOKING:
      return immutableUpdate(state, {
        id:         {$set: action.booking.id},
        customers:  {$set: action.booking.customers},
        items:      {$set: action.booking.items},
        updatedAt:  {$set: action.booking.updated_at},
        createdAt:  {$set: action.booking.created_at}
      });
    case SET_EMAIL_ACTIVITY:
      return immutableUpdate(state, {
        emailActivity: {$set: action.activity}
      });
    default:
      return state;
  }
}
