jest.unmock('../../components/bookings/create_button');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import CreateButton from '../../components/bookings/create_button.js.jsx';

describe('UpdateButton', function() {

  describe('rendering', function() {

    it('renders update button', function() {
      const btn = TestUtils.renderIntoDocument(
        <CreateButton
          _getBookingPayload={function() {}}
          onSetSubmissionErrors={function() {}} />
      );

      expect(btn.refs.createBtn).not.toBeUndefined();
      expect(btn.refs.createBtn.textContent).toEqual('Create Booking');
    });
  });
});
