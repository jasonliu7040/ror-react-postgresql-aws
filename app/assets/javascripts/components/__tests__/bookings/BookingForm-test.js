jest.unmock('../../components/bookings/booking_form');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import BookingForm from '../../components/bookings/booking_form.js.jsx';

describe('BookingForm', function() {

  beforeEach(function() {
    this.items = [
      {
        id: 1,
        shop_id: 1,
        product: {
          id: 12,
          product_title: 'testing product title 1'
        },
        variant: {
          id: 43,
          title: 'testing variant title 1'
        },
        start:  "2016-05-29 16:00:00",
        finish: "2016-05-30 16:00:00",
        quantity: 1,
        location: {
          id: 91,
          name: 'testing location 1'
        },
        _destroy: true,
      },
      {
        id: 2,
        shop_id: 2,
        product: {
          id: 22,
          product_title: 'testing product title 2'
        },
        variant: {
          id: 74,
          title: 'testing variant title 2'
        },
        start:  "2016-05-29 16:00:00",
        finish: "2016-05-30 16:00:00",
        quantity: 1,
        resource: {
          id: 29,
          name: 'testing resource 2'
        }
      }
    ];

    this.customers = [
      {
        id: 1,
        name:  'customer1',
        email: 'customer1@example.com',
        phone: '234-2345'
      },
      {
        id: 2,
        name:  'customer2',
        email: 'customer2@example.com',
        phone: '345-3456'
      },
      {
        id: 3,
        name:  'customer3',
        email: 'customer3@example.com',
        phone: '456-4567'
      },
    ]
  });

  describe('methods', function() {

    describe('_getBookingPayload', function() {

      it('returns correct object', function() {

        const bookingForm = TestUtils.renderIntoDocument(
          <BookingForm
            shopId={1}
            isTrialAccount={true}
            products={[]}
            variants={[]}
            resources={[]}
            locations={[]}
            editVariants={[]}
            editLocations={[]}
            editResources={[]}
            itemsValidationErrors={[]}
            itemsEditValidationErrors={[]}
            bookingNamesValidationErrors={[]}
            submissionErrors={[]}
            id={1}
            name='Test Name'
            email='testemail@example.com'
            phone='123-1234'
            hotel='My Hotel'
            orderName='order name'
            status='1'
            notes='order notes'
            items={this.items}
            customers={this.customers}
            reminderTemplates={[]}
            actions={{}} />
        );

        const result = bookingForm._getBookingPayload();

        expect(result).toEqual({
          booking: {
            id: 1,
            name: 'Test Name',
            email: 'testemail@example.com',
            phone: '123-1234',
            hotel: 'My Hotel',
            order_name: 'order name',
            status: '1',
            notes: 'order notes',
            booking_names_attributes: [
              {
                id: 1,
                name:  'customer1',
                email: 'customer1@example.com',
                phone: '234-2345'
              },
              {
                id: 2,
                name:  'customer2',
                email: 'customer2@example.com',
                phone: '345-3456'
              },
              {
                id: 3,
                name:  'customer3',
                email: 'customer3@example.com',
                phone: '456-4567'
              }
            ],
            booking_items_attributes: [
              {
                id: 1,
                shop_id: 1,
                product_id: 12,
                variant_id: 43,
                start:  "2016-05-29 16:00:00",
                finish: "2016-05-30 16:00:00",
                quantity: 1,
                location_id: 91,
                resource_allocations_attributes: [],
                _destroy: true,
              },
              {
                id: 2,
                shop_id: 2,
                product_id: 22,
                variant_id: 74,
                start:  "2016-05-29 16:00:00",
                finish: "2016-05-30 16:00:00",
                quantity: 1,
                location_id: null,
                resource_allocations_attributes: [
                  {
                    resource_id: 29,
                  }
                ],
                _destroy: false,
              }
            ]
          }
        })
      });
    });
  });
});
