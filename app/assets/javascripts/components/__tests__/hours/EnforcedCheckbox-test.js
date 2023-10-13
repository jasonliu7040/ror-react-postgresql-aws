jest.unmock('../../components/hours/enforced_checkbox');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import EnforcedCheckbox from '../../components/hours/enforced_checkbox.js.jsx';

describe('EnforcedCheckboxComponent', function() {

  it('renders correct label for checkbox', function() {
    const enforcedCheckboxComponent = TestUtils.renderIntoDocument(
      <EnforcedCheckbox enforced={true} onSetEnforced={function() {}} />
    );

    const enforcedCheckboxNode = ReactDOM.findDOMNode(enforcedCheckboxComponent);

    expect(enforcedCheckboxNode.textContent).toEqual(
      'Restrict datepickers and timepickers to opening hours?');
  });

  it('renders checkbox as checked when enforced prop is passed as true', function() {
    const enforcedCheckboxComponent = TestUtils.renderIntoDocument(
      <EnforcedCheckbox enforced={true} onSetEnforced={function() {}} />
    );

    const checkboxInput = TestUtils.findRenderedDOMComponentWithTag(
      enforcedCheckboxComponent, 'input');

    expect(checkboxInput.checked).toBe(true);
  });

  it('renders checkbox as unchecked when enforced prop is passed as false', function() {
    const enforcedCheckboxComponent = TestUtils.renderIntoDocument(
      <EnforcedCheckbox enforced={false} onSetEnforced={function() {}} />
    );

    const checkboxInput = TestUtils.findRenderedDOMComponentWithTag(
      enforcedCheckboxComponent, 'input');

    expect(checkboxInput.checked).toBe(false);
  });

  it('calls given callback with changed value', function() {
    const currentValue = false;
    const changedValue = true;

    let callback = jasmine.createSpy('callback');

    const enforcedCheckboxComponent = TestUtils.renderIntoDocument(
      <EnforcedCheckbox enforced={currentValue} onSetEnforced={callback} />
    );

    const checkboxInput = TestUtils.findRenderedDOMComponentWithTag(
      enforcedCheckboxComponent, 'input');

     TestUtils.Simulate.change(checkboxInput, {"target": {"checked": changedValue}});

    expect(callback).toHaveBeenCalledWith(changedValue);
  });
});
