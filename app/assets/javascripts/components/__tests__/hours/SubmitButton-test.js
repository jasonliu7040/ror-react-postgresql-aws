jest.unmock('../../components/hours/submit_button');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import SubmitButton from '../../components/hours/submit_button.js.jsx';

describe('SubmitButton component', function() {
  beforeEach(function() {
    this.seasons = [
      {
        name: 'Test Season 1',
        id: 'test-season-1',
        start: '2016-01-01',
        finish: '2016-12-31',
        days: []
      },
      {
        name: 'Test Season 2',
        id: 'test-season-2',
        start: '2016-08-03',
        finish: '2016-09-12',
        days: []
      }
    ];

    this.buttonComponent = TestUtils.renderIntoDocument(
      <SubmitButton
        shopId={1}
        enforced={true}
        seasons={this.seasons} />
    );
  });

  describe('render', function() {
    it('renders submit button', function() {
      const buttons = TestUtils.scryRenderedDOMComponentsWithClass(
        this.buttonComponent, 'btn-save');
      expect(buttons.length).toEqual(1);
    });
  });

  describe('methods', function() {
    describe('_validateSeasons', function() {
      it('returns empty errors for valid seasons', function() {
        let errors = [];
        this.buttonComponent._validateSeasons(errors);
        expect(errors.length).toEqual(0);
      });

      it('returns error when there is a season without name', function() {
        const seasons = [
          {
            name: 'Test Season 1',
            id: 'test-season-1',
            start: '2016-01-01',
            finish: '2016-12-31',
            days: []
          },
          {
            name: '',
            id: 'test-season-2',
            start: '2016-08-03',
            finish: '2016-09-12',
            days: []
          }
        ];

        const buttonComponent = TestUtils.renderIntoDocument(
          <SubmitButton
            shopId={1}
            enforced={true}
            seasons={seasons} />
        );

        let errors = [];
        buttonComponent._validateSeasons(errors);
        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual("Season name can't be blank!");
      });

      it('returns error when two or more season have the same name', function() {
        const seasons = [
          {
            name: 'Test Season 1',
            id: 'test-season-1',
            start: '2016-01-01',
            finish: '2016-12-31',
            days: []
          },
          {
            name: 'Test Season 1',
            id: 'test-season-2',
            start: '2016-08-03',
            finish: '2016-09-12',
            days: []
          }
        ];

        const buttonComponent = TestUtils.renderIntoDocument(
          <SubmitButton
            shopId={1}
            enforced={true}
            seasons={seasons} />
        );

        let errors = [];
        buttonComponent._validateSeasons(errors);
        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual("Season name has to be unique!");
      });
    });
  });
});
