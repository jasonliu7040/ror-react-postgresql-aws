jest.unmock('../../components/hours/season_date_range_selectors');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import SeasonDateRangeSelectors from '../../components/hours/season_date_range_selectors.js.jsx';

let DateTimeField = require('react-bootstrap-datetimepicker-noicon');

describe('SeasonDateRangeSelectors component', function() {
  beforeEach(function() {

    this.season = {
      name: 'Test Season 2',
      id: 'test-season-2',
      start: '2016-08-03',
      finish: '2016-09-12',
      days: []
    };

    this.selectors = TestUtils.renderIntoDocument(
      <SeasonDateRangeSelectors
        season={this.season}
        onUpdateActiveSeasonStart={function() {}}
        onUpdateActiveSeasonFinish={function() {}}
        seasonRangeWarning={true}
        stringifyDate={function() {}} />
    );
  });

  describe('rendering', function() {
    describe('DateTimeFields', function() {
      it('renders two', function() {
        const pickers = TestUtils.scryRenderedComponentsWithType(
          this.selectors, DateTimeField);
        expect(pickers.length).toEqual(2);
      });

      it('renders start date in appropriate format in the first picker', function() {
        const startPicker = TestUtils.scryRenderedComponentsWithType(
          this.selectors, DateTimeField)[0];
        expect(startPicker.state.inputValue).toEqual('Aug 3');
      });

      it('renders finish date in appropriate format in the second picker', function() {
        const startPicker = TestUtils.scryRenderedComponentsWithType(
          this.selectors, DateTimeField)[1];
        expect(startPicker.state.inputValue).toEqual('Sep 12');
      });
    });

    describe('seasonRangeWarning', function() {
      it('renders hidden when seasonRangeWarning is false', function() {
        const selectors = TestUtils.renderIntoDocument(
          <SeasonDateRangeSelectors
            season={this.season}
            onUpdateActiveSeasonStart={function() {}}
            onUpdateActiveSeasonFinish={function() {}}
            seasonRangeWarning={false}
            stringifyDate={function() {}} />
        );

        let warningBox = TestUtils.findRenderedDOMComponentWithClass(
          selectors, 'season-range-warning');

        expect(warningBox.className).toEqual('season-range-warning hidden');
      });

      it("doesn't render hidden when seasonRangeWarning is false", function() {
        const selectors = TestUtils.renderIntoDocument(
          <SeasonDateRangeSelectors
            season={this.season}
            onUpdateActiveSeasonStart={function() {}}
            onUpdateActiveSeasonFinish={function() {}}
            seasonRangeWarning={true}
            stringifyDate={function() {}} />
        );

        const warningBox = TestUtils.findRenderedDOMComponentWithClass(
          selectors, 'season-range-warning');

        expect(warningBox.className).toEqual('season-range-warning');
      });
    });

    describe('callbacks', function() {
      describe('stringifyDate', function() {
        it('is called with changed date', function() {
          const stringifyDate = jasmine.createSpy('stringifyDate');

          const selectors = TestUtils.renderIntoDocument(
            <SeasonDateRangeSelectors
            season={this.season}
            onUpdateActiveSeasonStart={function() {}}
            onUpdateActiveSeasonFinish={function() {}}
            seasonRangeWarning={true}
            stringifyDate={stringifyDate} />
          );

          const picker = TestUtils.scryRenderedComponentsWithType(
            selectors, DateTimeField)[0];

          picker.addHour(); // The only way I found to trigger onChange. TestUtils were useless

          expect(stringifyDate).toHaveBeenCalledWith('2016-08-03');
        });
      });

      describe('onUpdateActiveSeasonStart', function() {
        it('is called with new value when value changes in the start picker', function() {
          const stringifyDate = jasmine.createSpy('stringifyDate').and.returnValue('STRINGIFIED_DATE');
          const onUpdateActiveSeasonStart = jasmine.createSpy('onUpdateActiveSeasonStart');

          const selectors = TestUtils.renderIntoDocument(
            <SeasonDateRangeSelectors
              season={this.season}
              onUpdateActiveSeasonStart={onUpdateActiveSeasonStart}
              onUpdateActiveSeasonFinish={function() {}}
              seasonRangeWarning={true}
              stringifyDate={stringifyDate} />
          );

          const picker = TestUtils.scryRenderedComponentsWithType(
            selectors, DateTimeField)[0];

          picker.addMinute();

          expect(onUpdateActiveSeasonStart).toHaveBeenCalledWith('STRINGIFIED_DATE');
        });
      });

      describe('onUpdateActiveSeasonFinish', function() {
        it('is called with new value when value changes in the finish picker', function() {
          const stringifyDate = jasmine.createSpy('stringifyDate').and.returnValue('STRINGIFIED_DATE');
          const onUpdateActiveSeasonFinish = jasmine.createSpy('onUpdateActiveSeasonFinish');

          const selectors = TestUtils.renderIntoDocument(
            <SeasonDateRangeSelectors
              season={this.season}
              onUpdateActiveSeasonStart={function() {}}
              onUpdateActiveSeasonFinish={onUpdateActiveSeasonFinish}
              seasonRangeWarning={true}
              stringifyDate={stringifyDate} />
          );

          const picker = TestUtils.scryRenderedComponentsWithType(
            selectors, DateTimeField)[1];

          picker.addMinute();

          expect(onUpdateActiveSeasonFinish).toHaveBeenCalledWith('STRINGIFIED_DATE');
        });
      });
    });
  });
});
