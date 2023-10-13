import { combineReducers } from 'redux';
import product from './product.js.jsx';
import hours from './hours.js.jsx';
import bookings from './bookings.js.jsx';
import term from './term.js.jsx';
import products from './products.js.jsx';
import events from './events.js.jsx';
import blackout from './blackout.js.jsx';

const rootReducer = combineReducers({
  product, hours, bookings, term, products, events, blackout
});

export default rootReducer;
