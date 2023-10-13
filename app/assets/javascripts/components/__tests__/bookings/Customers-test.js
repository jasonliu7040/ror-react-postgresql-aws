jest.unmock('../../components/bookings/customers');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Customers from '../../components/bookings/customers.js.jsx';

describe('Customers', function() {

  beforeEach(function() {
    this.customers = TestUtils.renderIntoDocument(
      <Customers
        customers={[]}
        bookingNamesValidationErrors={[]}
        onSetBookingNamesValidationErrors={function() {}}
        onAddCustomer={function() {}}
        onDeleteCustomer={function() {}} />
    );
  });

  describe('rendering', function() {
    it('renders 4 inputs', function() {
      const inputs = TestUtils.scryRenderedDOMComponentsWithClass(
        this.customers, 'form-control');

      expect(inputs.length).toEqual(4);
    });

    it('renders correct fields', function() {
      expect(this.customers.refs.bookingNamesId).not.toBeUndefined();
      expect(this.customers.refs.bookingNamesName).not.toBeUndefined();
      expect(this.customers.refs.bookingNamesEmail).not.toBeUndefined();
      expect(this.customers.refs.bookingNamesPhone).not.toBeUndefined();
    });

    it('renders button to insert new customer', function() {
      expect(this.customers.refs.addBookingName).not.toBeUndefined();
    });

    it('renders given customers', function() {
      const customerObjects = [
        {id: null, name: 'customer test 1', email: 'test1@example.com', phone: '123-1234'},
        {id: null, name: 'customer test 2', email: 'test2@example.com', phone: '234-2345', _destroy: true},
        {id: null, name: 'customer test 3', email: 'test3@example.com', phone: '345-3456'},
        {id: null, name: 'customer test 4', email: 'test4@example.com', phone: '456-4567', _destroy: true},
        {id: null, name: 'customer test 5', email: 'test5@example.com', phone: '567-5678'},
      ];

      const customers = TestUtils.renderIntoDocument(
        <Customers
          customers={customerObjects}
          bookingNamesValidationErrors={[]}
          onSetBookingNamesValidationErrors={function() {}}
          onAddCustomer={function() {}}
          onDeleteCustomer={function() {}} />);

      const customerTableRows = TestUtils.scryRenderedDOMComponentsWithClass(
        customers, 'customer-row');

      expect(customerTableRows.length).toEqual(3);
    });
  });

  describe('callbacks', function() {

    describe('onAddCustomer', function() {

      describe('name provided', function() {

        it('is called when add button is pressed', function() {
          const onAddCustomer = jasmine.createSpy('onAddCustomer');
          const customer = TestUtils.renderIntoDocument(
            <Customers
            customers={[]}
            bookingNamesValidationErrors={[]}
            onSetBookingNamesValidationErrors={function() {}}
            onAddCustomer={onAddCustomer}
            onDeleteCustomer={function() {}} />
          );

          // Enter name

          customer.refs.bookingNamesName.value = 'John Doe';
          TestUtils.Simulate.change(customer.refs.bookingNamesName);

          const addButton = customer.refs.addBookingName;

          expect(onAddCustomer).not.toHaveBeenCalled();

          TestUtils.Simulate.click(addButton);

          expect(onAddCustomer).toHaveBeenCalled();
        });
      });

      it('is called with correct argument', function() {
        const onAddCustomer = jasmine.createSpy('onAddCustomer');
        const customers = TestUtils.renderIntoDocument(
          <Customers
          customers={[]}
          bookingNamesValidationErrors={[]}
          onSetBookingNamesValidationErrors={function() {}}
          onAddCustomer={onAddCustomer}
          onDeleteCustomer={function() {}} />
        );

        customers.refs.bookingNamesName.value = 'John Doe';
        TestUtils.Simulate.change(customers.refs.bookingNamesName);

        customers.refs.bookingNamesEmail.value = 'johndoe@example.com';
        TestUtils.Simulate.change(customers.refs.bookingNamesEmail);

        customers.refs.bookingNamesPhone.value = '123-1234';
        TestUtils.Simulate.change(customers.refs.bookingNamesPhone);

        const addButton = customers.refs.addBookingName;

        expect(onAddCustomer).not.toHaveBeenCalled();

        TestUtils.Simulate.click(addButton);

        const expectedArg = {
          id: null,
          name:  'John Doe',
          email: 'johndoe@example.com',
          phone: '123-1234'
        };

        expect(onAddCustomer).toHaveBeenCalledWith(expectedArg);
      });

      describe('name not provided', function() {

        it('is not called when add button is pressed', function() {
          const onAddCustomer = jasmine.createSpy('onAddCustomer');
          const customer = TestUtils.renderIntoDocument(
            <Customers
            customers={[]}
            bookingNamesValidationErrors={[]}
            onSetBookingNamesValidationErrors={function() {}}
            onAddCustomer={onAddCustomer}
            onDeleteCustomer={function() {}} />
          );

          const addButton = customer.refs.addBookingName;

          expect(onAddCustomer).not.toHaveBeenCalled();

          TestUtils.Simulate.click(addButton);

          expect(onAddCustomer).not.toHaveBeenCalled();
        });
      });
    });

    describe('onDeleteCustomer', function() {
      it('is called with correct args when delete customer button is pressed', function() {
        const custObjects = [
          {id: null, name: 'customer test 1', email: 'test1@example.com', phone: '123-1234'},
          {id: null, name: 'customer test 2', email: 'test2@example.com', phone: '234-2345'},
          {id: null, name: 'customer test 3', email: 'test3@example.com', phone: '345-3456'}
        ]

        const onDeleteCustomer = jasmine.createSpy('onDeleteCustomer');

        const customers = TestUtils.renderIntoDocument(
          <Customers
            customers={custObjects}
            bookingNamesValidationErrors={[]}
            onSetBookingNamesValidationErrors={function() {}}
            onAddCustomer={function() {}}
            onDeleteCustomer={onDeleteCustomer} />
        );

        expect(onDeleteCustomer).not.toHaveBeenCalled();

        const deleteSecondCustomer = TestUtils.findRenderedDOMComponentWithClass(
          customers, 'delete-btn-customer-row-1');

        TestUtils.Simulate.click(deleteSecondCustomer);

        expect(onDeleteCustomer).toHaveBeenCalledWith(1);
      });
    });

    describe('onSetBookingNamesValidationErrors', function() {

      it('gets called when customer is invalid', function() {
        const onSetBookingNamesValidationErrors =
          jasmine.createSpy('onSetBookingNamesValidationErrors');

        const customer = TestUtils.renderIntoDocument(
          <Customers
          customers={[]}
          bookingNamesValidationErrors={[]}
          onSetBookingNamesValidationErrors={onSetBookingNamesValidationErrors}
          onAddCustomer={function() {}}
          onDeleteCustomer={function() {}} />
        );

        const addButton = customer.refs.addBookingName;

        expect(onSetBookingNamesValidationErrors).not.toHaveBeenCalled();

        TestUtils.Simulate.click(addButton);

        expect(onSetBookingNamesValidationErrors).toHaveBeenCalledWith(["Name can't be blank."]);
      });
    });
  });

  describe('methods', function() {

    describe('_parseBookingName', function() {

      it('creates customer object form input values without id', function() {
        this.customers.refs.bookingNamesName.value = 'John Doe';
        TestUtils.Simulate.change(this.customers.refs.bookingNamesName);

        this.customers.refs.bookingNamesEmail.value = 'johndoe@example.com';
        TestUtils.Simulate.change(this.customers.refs.bookingNamesEmail);

        this.customers.refs.bookingNamesPhone.value = '123-1234';
        TestUtils.Simulate.change(this.customers.refs.bookingNamesPhone);

        const expected = {
          id: null,
          name:  'John Doe',
          email: 'johndoe@example.com',
          phone: '123-1234'
        };

        const result = this.customers._parseBookingName();

        expect(result).toEqual(expected);
      });

      it('creates customer object form input values with id', function() {
        this.customers.refs.bookingNamesId.value = 1;
        TestUtils.Simulate.change(this.customers.refs.bookingNamesId);

        this.customers.refs.bookingNamesName.value = 'John Doe';
        TestUtils.Simulate.change(this.customers.refs.bookingNamesName);

        this.customers.refs.bookingNamesEmail.value = 'johndoe@example.com';
        TestUtils.Simulate.change(this.customers.refs.bookingNamesEmail);

        this.customers.refs.bookingNamesPhone.value = '123-1234';
        TestUtils.Simulate.change(this.customers.refs.bookingNamesPhone);

        const expected = {
          id: '1',
          name:  'John Doe',
          email: 'johndoe@example.com',
          phone: '123-1234'
        };

        const result = this.customers._parseBookingName();

        expect(result).toEqual(expected);
      });
    });

    describe('_clearBookingName', function() {
      it('clears input field', function() {
        this.customers.refs.bookingNamesId.value = 1;
        TestUtils.Simulate.change(this.customers.refs.bookingNamesId);

        this.customers.refs.bookingNamesName.value = 'John Doe';
        TestUtils.Simulate.change(this.customers.refs.bookingNamesName);

        this.customers.refs.bookingNamesEmail.value = 'johndoe@example.com';
        TestUtils.Simulate.change(this.customers.refs.bookingNamesEmail);

        this.customers.refs.bookingNamesPhone.value = '123-1234';
        TestUtils.Simulate.change(this.customers.refs.bookingNamesPhone);

        expect(this.customers.refs.bookingNamesId.value).toEqual('1');
        expect(this.customers.refs.bookingNamesName.value).toEqual('John Doe');
        expect(this.customers.refs.bookingNamesEmail.value).toEqual('johndoe@example.com');
        expect(this.customers.refs.bookingNamesPhone.value).toEqual('123-1234');

        this.customers._clearBookingName();

        expect(this.customers.refs.bookingNamesId.value).toEqual('');
        expect(this.customers.refs.bookingNamesName.value).toEqual('');
        expect(this.customers.refs.bookingNamesEmail.value).toEqual('');
        expect(this.customers.refs.bookingNamesPhone.value).toEqual('');
      });
    });

    describe('nonDeletedCustomers', function() {

      it("doesn't return customers marked for destruction", function() {
        const customerObjects = [
          {id: null, name: 'customer test 1', email: 'test1@example.com', phone: '123-1234'},
          {id: null, name: 'customer test 2', email: 'test2@example.com', phone: '234-2345', _destroy: true},
          {id: null, name: 'customer test 3', email: 'test3@example.com', phone: '345-3456'},
          {id: null, name: 'customer test 4', email: 'test4@example.com', phone: '456-4567', _destroy: true},
          {id: null, name: 'customer test 5', email: 'test5@example.com', phone: '567-5678'},
        ];

        const customers = TestUtils.renderIntoDocument(
          <Customers
          customers={customerObjects}
          bookingNamesValidationErrors={[]}
          onSetBookingNamesValidationErrors={function() {}}
          onAddCustomer={function() {}}
          onDeleteCustomer={function() {}} />);

          expect(customers.props.customers.length).toEqual(5);
          expect(customers.nonDeletedCustomers().length).toEqual(3);
          expect(customers.nonDeletedCustomers()).toEqual([
            {id: null, name: 'customer test 1', email: 'test1@example.com', phone: '123-1234'},
            {id: null, name: 'customer test 3', email: 'test3@example.com', phone: '345-3456'},
            {id: null, name: 'customer test 5', email: 'test5@example.com', phone: '567-5678'},
          ]);
      });
    });

    describe('_validateBookingName', function() {

      it("doesn't add errors when booking name is valid", function() {
        const bookingName= {id: 1, name: 'customer test 1', email: 'test1@example.com', phone: '123-1234'};
        let errors = [];
        this.customers._validateBookingName(bookingName, errors);
        expect(errors).toEqual([]);
      });

      it("adds errors when name is missing", function() {
        const bookingName= {id: 1, name: '', email: 'test1@example.com', phone: '123-1234'};
        let errors = [];
        this.customers._validateBookingName(bookingName, errors);
        expect(errors).toEqual(["Name can't be blank."]);
      });
    });
  });
});
