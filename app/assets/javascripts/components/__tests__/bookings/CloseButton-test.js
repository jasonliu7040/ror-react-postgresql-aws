jest.unmock('../../components/bookings/close_button');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import CloseButton from '../../components/bookings/close_button.js.jsx';

describe('CloseButton', function() {

  beforeEach(function() {
    this.closeButton = TestUtils.renderIntoDocument(
      <CloseButton />
    );
  });

  describe('rendering', function() {

    it('renders close button', function() {
      expect(this.closeButton.refs.button).not.toBeUndefined();
      expect(this.closeButton.refs.button.type).toEqual('button');
    });
  });
});
