jest.unmock('../../components/bookings/trial_warning');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import TrialWarning from '../../components/bookings/trial_warning.js.jsx';

describe('TrialWarning', function() {
  describe('rendering', function() {
    it('shows warning message for trial account', function() {
      const trialWarning = TestUtils.renderIntoDocument(
        <TrialWarning isTrialAccount={true} />
      );
      const alertBox = TestUtils.findRenderedDOMComponentWithClass(
        trialWarning, 'alert');

      const msg = 'You are currently on the trial plan (maximum 10 products/10 bookings). Upgrade your subscription to the paid plan for unlimited products and bookings.';

      expect(alertBox.textContent).toEqual(msg);
      expect(alertBox.style.display).toEqual('block');
    });
  });

  it("doesn't show the warning message for regular accounts", function() {
    const trialWarning = TestUtils.renderIntoDocument(
      <TrialWarning isTrialAccount={false} />
    );
    const alertBox = TestUtils.findRenderedDOMComponentWithClass(
      trialWarning, 'alert');

    expect(alertBox.style.display).toEqual('none');
  });

  it('shows correct link', function() {
    const trialWarning = TestUtils.renderIntoDocument(
      <TrialWarning isTrialAccount={false} />
    );
    const link = TestUtils.findRenderedDOMComponentWithClass(
      trialWarning, 'upgrade-link');

    expect(link.href).toEqual('/charges');
    expect(link.textContent).toEqual('Upgrade your subscription');
  });
});
