jest.unmock('../../components/hours/season_name_input');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import SeasonNameInput from '../../components/hours/season_name_input.js.jsx';

describe('SeasonNameInput component', function() {
  beforeEach(function() {
    this.season = {
      name: 'Test Season 1',
      id: 'test-season-1',
      start: '2016-08-03',
      finish: '2016-09-12',
      days: []
    };

    this.seasonNameInput = TestUtils.renderIntoDocument(
      <SeasonNameInput
        season={this.season}
        onUpdateActiveSeasonName={function() {}} />
    );
  });

  describe('render', function() {
    it('renders season name input with season name as default value', function() {
      const input = TestUtils.findRenderedDOMComponentWithClass(
        this.seasonNameInput, 'season-name');
      expect(input.value).toEqual(this.season.name);
    });
  });

  describe('callbacks', function() {
    describe('onUpdateActiveSeasonName', function() {
      it('is called when season name changes', function() {
        const newName = 'new season name';
        const newHandle = 'new-season-name';
        const onUpdateActiveSeasonName = jasmine.createSpy('onUpdateActiveSeasonName');

        const seasonNameInput = TestUtils.renderIntoDocument(
          <SeasonNameInput
            season={this.season}
            onUpdateActiveSeasonName={onUpdateActiveSeasonName} />
        );

        spyOn(seasonNameInput, '_handleize').and.returnValue(newHandle);

        const input = TestUtils.findRenderedDOMComponentWithClass(
          seasonNameInput, 'season-name');

        input.value = newName;
        TestUtils.Simulate.change(input);

        expect(onUpdateActiveSeasonName).toHaveBeenCalledWith(newName, newHandle);
      });
    });

    describe('callbacks', function() {
      describe('_handleize', function() {
        it('returns correct value', function() {
          expect(this.seasonNameInput._handleize('Season Name')).toEqual('season-name');
          expect(this.seasonNameInput._handleize('Season   Name')).toEqual('season---name');
          expect(this.seasonNameInput._handleize('September')).toEqual('september');
          expect(this.seasonNameInput._handleize('september')).toEqual('september');
          expect(this.seasonNameInput._handleize('September!!')).toEqual('september');
          expect(this.seasonNameInput._handleize('September-5')).toEqual('september-5');
          expect(this.seasonNameInput._handleize('')).toEqual('');
        });
      });
    });
  });
});
