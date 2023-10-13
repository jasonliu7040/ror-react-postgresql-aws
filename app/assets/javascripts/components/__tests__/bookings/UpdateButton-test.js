jest.unmock('../../components/bookings/update_button');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import UpdateButton from '../../components/bookings/update_button.js.jsx';

describe('UpdateButton', function() {

  describe('rendering', function() {

    it('renders update button', function() {
      const btn = TestUtils.renderIntoDocument(
        <UpdateButton
          _getBookingPayload={function() {}}
          onSetSubmissionErrors={function() {}} />
      );

      expect(btn.refs.updateBtn).not.toBeUndefined();
      expect(btn.refs.updateBtn.textContent).toEqual('Update Booking');
    });
  });
});
