jest.unmock('../../components/bookings/booking_details');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import BookingDetails from '../../components/bookings/booking_details.js.jsx';

describe('BookingDetails', function() {
  beforeEach(function() {
    this.bookingDetails = TestUtils.renderIntoDocument(
      <BookingDetails
        orderName='Testing Order'
        status='1'
        notes='Testing notes'
        onSetOrderName={function() {}}
        onSetStatus={function() {}}
        onSetNotes={function() {}} />
    );
  });

  describe('rendering', function() {
    it('renders 3 form inputs', function() {
      const inputs = TestUtils.scryRenderedDOMComponentsWithClass(
        this.bookingDetails, 'form-control');

      expect(inputs.length).toEqual(3);
    });

    it('renders correct inputs', function() {
      expect(this.bookingDetails.refs.orderInput).not.toBeUndefined();
      expect(this.bookingDetails.refs.orderInput.type).toEqual('text');

      expect(this.bookingDetails.refs.statusInput).not.toBeUndefined();
      expect(this.bookingDetails.refs.statusInput.type).toEqual('select-one');

      expect(this.bookingDetails.refs.notesInput).not.toBeUndefined();
      expect(this.bookingDetails.refs.notesInput.type).toEqual('textarea');
    });

    it('renders select with two options', function() {
      const opts = this.bookingDetails.refs.statusInput.children;

      expect(opts.length).toEqual(2);

      expect(opts[0].value).toEqual('1');
      expect(opts[0].text).toEqual('Reserved');

      expect(opts[1].value).toEqual('2');
      expect(opts[1].text).toEqual('Confirmed');
    });

    it('renders given orderName', function() {
      const orderNames = [ 'order1', 'test order', 'another order' ];

      for(let i = 0; i < orderNames.length; i++) {
        let bookingDetails = TestUtils.renderIntoDocument(
          <BookingDetails
            orderName={orderNames[i]}
            status='1'
            notes='Testing notes'
            onSetOrderName={function() {}}
            onSetStatus={function() {}}
            onSetNotes={function() {}} />
        );
        expect(bookingDetails.refs.orderInput.value).toEqual(orderNames[i]);
      }
    });

    it('renders given notes', function() {
      const notes = [ 'note', 'descriptive note', 'note1' ];

      for(let i = 0; i < notes.length; i++) {
        let bookingDetails = TestUtils.renderIntoDocument(
          <BookingDetails
            orderName='test order'
            status='1'
            notes={notes[i]}
            onSetOrderName={function() {}}
            onSetStatus={function() {}}
            onSetNotes={function() {}} />
        );
        expect(bookingDetails.refs.notesInput.value).toEqual(notes[i]);
      }
    });

    it('selects given option', function() {
      const opts = [ '1', '2' ];
      const text = [ 'Reserved', 'Confirmed' ];

      for(let i = 0; i < opts.length; i++) {
        let bookingDetails = TestUtils.renderIntoDocument(
          <BookingDetails
            orderName='test order'
            status={opts[i].toString()}
            notes='test notes'
            onSetOrderName={function() {}}
            onSetStatus={function() {}}
            onSetNotes={function() {}} />
        );
        expect(bookingDetails.refs.statusInput.value).toEqual(opts[i]);
      }
    });
  });

  describe('callbacks', function() {

    describe('onSetOrderName', function () {
      it('is called with correct param when order name changes', function() {
        const onSetOrderName = jasmine.createSpy('onSetOrderName');
        const bookingDetails = TestUtils.renderIntoDocument(
          <BookingDetails
            orderName=''
            status='1'
            notes=''
            onSetOrderName={onSetOrderName}
            onSetStatus={function() {}}
            onSetNotes={function() {}} />
        );
        expect(onSetOrderName).not.toHaveBeenCalled();

        bookingDetails.refs.orderInput.value = 'new order name';
        TestUtils.Simulate.change(bookingDetails.refs.orderInput);

        expect(onSetOrderName).toHaveBeenCalledWith('new order name');
      });
    });

    describe('onSetStatus', function() {
      it('is called with correct param when status changes', function() {
        const onSetStatus = jasmine.createSpy('onSetStatus');
        const bookingDetails = TestUtils.renderIntoDocument(
          <BookingDetails
          orderName=''
          status='1'
          notes=''
          onSetOrderName={function() {}}
          onSetStatus={onSetStatus}
          onSetNotes={function() {}} />
        );
        expect(onSetStatus).not.toHaveBeenCalled();

        bookingDetails.refs.statusInput.value = '2';
        TestUtils.Simulate.change(bookingDetails.refs.statusInput);

        expect(onSetStatus).toHaveBeenCalledWith('2');
      });
    });

    describe('onSetNotes', function() {
      it('is called with correct param when notes changes', function() {
        const onSetNotes = jasmine.createSpy('onSetNotes');
        const bookingDetails = TestUtils.renderIntoDocument(
          <BookingDetails
          orderName=''
          status='1'
          notes=''
          onSetOrderName={function() {}}
          onSetStatus={function() {}}
          onSetNotes={onSetNotes} />
        );
        expect(onSetNotes).not.toHaveBeenCalled();

        bookingDetails.refs.notesInput.value = 'new note';
        TestUtils.Simulate.change(bookingDetails.refs.notesInput);
        expect(onSetNotes).toHaveBeenCalledWith('new note');
      });
    });
  });
});
