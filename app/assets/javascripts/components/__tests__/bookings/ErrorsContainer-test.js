jest.unmock('../../components/bookings/errors_container');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import ErrorsContainer from '../../components/bookings/errors_container.js.jsx';

describe('ErrorsContainer', function() {

  describe('rendering', function() {

    it('renders given messages', function() {
      const errorMsgs = ['msg1', 'msg2'];

      const errorsContainer = TestUtils.renderIntoDocument(
        <ErrorsContainer
        message="Passed errors"
        errors={errorMsgs} />
      );

      expect(errorsContainer.refs.message).not.toBeUndefined();
      expect(errorsContainer.refs.message.textContent).toEqual('Passed errors:');

      expect(errorsContainer.refs.errors).not.toBeUndefined();
      expect(errorsContainer.refs.errors.children.length).toEqual(2);
      expect(errorsContainer.refs.errors.children[0].textContent).toEqual('msg1');
      expect(errorsContainer.refs.errors.children[1].textContent).toEqual('msg2');

      const mainDiv = TestUtils.findRenderedDOMComponentWithClass(
        errorsContainer, 'errors');

        expect(mainDiv.style.display).toEqual('');
    });
      
    it("doesn't show anything when erros array is empty", function() {
      const errorMsgs = [];

      const errorsContainer = TestUtils.renderIntoDocument(
        <ErrorsContainer
        message="Passed errors"
        errors={errorMsgs} />
      );

      const mainDiv = TestUtils.findRenderedDOMComponentWithClass(
        errorsContainer, 'errors');

        expect(mainDiv.style.display).toEqual('none');
    });
  });
});
