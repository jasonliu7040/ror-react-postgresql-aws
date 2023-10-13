jest.unmock('../../reducers/product');
jest.unmock('../../actions/product');
jest.unmock('react-addons-update');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import productReducer from '../../reducers/product.js.jsx';
import * as actions from '../../actions/product.js.jsx';

describe ('product reducer', function() {

    beforeEach(function() {
        this.product = {
            id: 1,
            capacity: 1,
            background_color: '',
            border_color: '',
            calendar_display: false,
            capacity_option1: 'Color',
            capacity_option2: '',
            capacity_option3: '',
            capacity_type: '1',
            external_id: '111',
            lag_time: 1200,
            lead_time: 0,
            max_duration: 0,
            min_duration: 0,
            mindate: 0,
            option_capacities_attributes: [
                {
                    capacity: 1,
                    option1: 'Black',
                    option2: null,
                    option3: null
                }
            ],
            product_handle: '123dwd',
            product_image_url: 'http://foo',
            product_locations_attributes: [
                {
                    id: 1,
                    location_id: 2
                }
            ],
            product_title: 'title',
            profile: 'product',
            resource_constraints_attributes: [
                {
                    id: 2,
                    resource_id: 1
                }
            ],
            schedule_attributes: {
                id: 1,
                recurring_items_attributes: [{
                    id: 1,
                    schedule_ical: {
                        recurrencePattern: "FREQ=HOURLY;COUNT=3",
                        startDateTime: "2016-06-24T23:00",
                        timeZone: { offset: "+00:00" }
                    }
                }]
            },
            scheduled: false,
            shopify_url: '',
            terms_attributes: [
                {
                    id:1,
                    finish_date: "2016-04-30 00:00",
                    start_date: "2016-04-13 00:00",
                    name: 'term1'
                }
            ],
            text_color: '',
            variants_attributes: [
                {
                    all_day: 0,
                    booking_items_count: 3,
                    compare_at_price: null,
                    duration: 100,
                    duration_units: 1,
                    external_id: 12313,
                    finish_time: "2000-01-01T17:00:00.000Z",
                    id: 1,
                    ignore: false,
                    option1: 'Black',
                    option2: null,
                    option3: null,
                    options_yaml: '',
                    party_size: 1,
                    settings_yaml: '',
                    sky: '',
                    start_time: "2000-01-01T09:00:00.000Z",
                    name: 'black'
                }
            ]
        }

        this.simpleState = {
            product: this.product,
            legacy_variant_times: false,
            duration_enabled: false,
            variant_options: {},
            term_events: []
        }

    });

    it('returns unmodified state when action does not exist', function() {
        const dummyAction = {type: 'DUMMY_ACTION'};

        expect(productReducer({}, dummyAction)).toEqual({});
        expect(productReducer(this.simpleState, dummyAction)).toEqual(this.simpleState);
    });

    it('sets product', function() {
        const initState = {
            product: {}
        };
        const act = actions.onProductSet(this.product);
        expect(productReducer(initState, act)).toEqual({ product: this.product});
    });

    it('changes product', function() {
        let newState = productReducer(this.simpleState, actions.onProductChange('capacity', 11));
        expect(newState.product.capacity).toEqual(11);
        newState = productReducer(this.simpleState, actions.onProductChange('product_title', 'dddd'));
        expect(newState.product.product_title).toEqual('dddd');
        expect(newState.product.id).toEqual(this.simpleState.product.id);
    });

    it('sets schedule', function() {
        const schedule = {
            schedule_ical: {
                foo: 1
            }
        };
        let newState = productReducer(this.simpleState, actions.onProductSchedulesSet(schedule));
        expect(newState.product.schedule_attributes.recurring_items_attributes).toEqual(schedule);
        expect(newState.product.id).toEqual(this.simpleState.product.id);
    });

    it('sets variant options', function() {
        const options = {
            option1: 'a',
            option2: 'b',
            option3: 'c'
        };
        const newState = {
            product: this.product,
            legacy_variant_times: false,
            duration_enabled: false,
            variant_options: options,
            term_events: []
        };

        expect(productReducer(this.simpleState, actions.onVariantOptionsSet(options))).toEqual(newState);
    });

    it('sets term events', function() {
        const events = [
            { color:'11', events: [{end: '111', start: '1222', name: 'ddd'}] }
        ];
        const newState = {
            product: this.product,
            legacy_variant_times: false,
            duration_enabled: false,
            variant_options: {},
            term_events: events
        };

        expect(productReducer(this.simpleState, actions.onTermEventsSet(events))).toEqual(newState);
    });

    it('sets legacy flag', function() {
        const newState = {
            product: this.product,
            legacy_variant_times: true,
            duration_enabled: false,
            variant_options: {},
            term_events: []
        };

        expect(productReducer(this.simpleState, actions.onLegacyVariantTimesFlagSet(true))).toEqual(newState);
    });
});