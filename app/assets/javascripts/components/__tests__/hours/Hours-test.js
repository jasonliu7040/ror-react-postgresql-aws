jest.unmock('../../components/hours/hours');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Hour from '../../components/hours/hours.js.jsx';

const NavTabs = require('../../components/hours/nav_tabs.js.jsx')
const SeasonNameInput = require('../../components/hours/season_name_input.js.jsx');
const SeasonDateRangeSelectors = require('../../components/hours/season_date_range_selectors.js.jsx');
const TimeSlotsConfiguration = require('../../components/hours/time_slots_configuration.js.jsx');
const Schedule = require('../../components/hours/schedule.js.jsx');
const EnforcedCheckbox = require('../../components/hours/enforced_checkbox.js.jsx');
const SubmitButton = require('../../components/hours/submit_button.js.jsx');

describe('Hours component', function() {
  beforeEach(function() {
    this.actions = require('../../actions/hours.js.jsx');
    this.seasons = [
      {
        name: 'Test Season 1',
        id: 'test-season-1',
        start: '2016-01-01',
        finish: '2016-12-31',
        days: [
          {
            day: 0,
            hours: [
              {
                from: {hour: '9', minute: '0'},
                to: {hour: '17', minute: '0'}
              }
            ]
          },
          {
            day: 1,
            hours: [
              {
                from: {hour: '9', minute: '0'},
                to: {hour: '17', minute: '0'}
              }
            ]
          },
          {
            day: 2,
            hours: [
              {
                from: {hour: '9', minute: '0'},
                to: {hour: '17', minute: '0'}
              }
            ]
          },
          {
            day: 3,
            hours: [
              {
                from: {hour: '9', minute: '0'},
                to: {hour: '17', minute: '0'}
              }
            ]
          },
          {
            day: 4,
            hours: [
              {
                from: {hour: '9', minute: '0'},
                to: {hour: '17', minute: '0'}
              }
            ]
          },
          {
            day: 5,
            hours: [
              {
                from: {hour: '9', minute: '0'},
                to: {hour: '17', minute: '0'}
              }
            ]
          },
          {
            day: 6,
            hours: [
              {
                from: {hour: '9', minute: '0'},
                to: {hour: '17', minute: '0'}
              }
            ]
          },
        ]
      },
      {
        name: 'Test Season 2',
        id: 'test-season-2',
        start: '2016-08-03',
        finish: '2016-09-12',
        days: [
          {
            day: 0,
            hours: [
              {
                from: {hour: '9', minute: '0'},
                to:   {hour: '17', minute: '0'}
              },
              {
                from: {hour: '20', minute: '30'},
                to:   {hour: '23', minute: '0'}
              }
            ]
          },
          { day: 1, hours: [] },
          { day: 2, hours: [] },
          { day: 3, hours: [] },
          { day: 4, hours: [] },
          { day: 5, hours: [] },
          {
            day: 6,
            hours: [
              {
                from: {hour: '9', minute: '0'},
                to:   {hour: '17', minute: '0'}
              },
              {
                from: {hour: '20', minute: '30'},
                to:   {hour: '23', minute: '0'}
              }
            ]
          },
        ]
      }
    ];
    this.hourComponent = TestUtils.renderIntoDocument(
      <Hour
        actions={this.actions}
        activeSeasonIdx={0}
        enabledRemoveHourButtons={{}}
        enforced={true}
        nextSeasonNumber={1}
        seasonRangeWarning={true}
        seasons={this.seasons}
        shopId={1}
        timeConfigErrors={[]} />
    );
  });

  describe('render', function() {
    it('renders NavTabs', function() {
      TestUtils.findRenderedComponentWithType(this.hourComponent, NavTabs);
    });

    it('renders SeasonNameInput', function() {
      TestUtils.findRenderedComponentWithType(this.hourComponent, SeasonNameInput);
    });

    it('renders SeasonDateRangeSelectors', function() {
      TestUtils.findRenderedComponentWithType(this.hourComponent, SeasonDateRangeSelectors);
    });

    it('renders TimeSlotsConfiguration', function() {
      TestUtils.findRenderedComponentWithType(this.hourComponent, TimeSlotsConfiguration);
    });

    it('renders Schedule', function() {
      TestUtils.findRenderedComponentWithType(this.hourComponent, Schedule);
    });

    it('renders EnforcedCheckbox', function() {
      TestUtils.findRenderedComponentWithType(this.hourComponent, EnforcedCheckbox);
    });

    it('renders SubmitButton', function() {
      TestUtils.findRenderedComponentWithType(this.hourComponent, SubmitButton);
    });
  });

  describe('callbacks', function() {
    describe('onSetSeasonRangeWarning', function() {

      it('is called on component mount', function() {
        spyOn(this.actions, 'onSetSeasonRangeWarning');

        const hourComponent = TestUtils.renderIntoDocument(
          <Hour
            actions={this.actions}
            activeSeasonIdx={0}
            enabledRemoveHourButtons={{}}
            enforced={true}
            nextSeasonNumber={1}
            seasonRangeWarning={true}
            seasons={this.seasons}
            shopId={1}
            timeConfigErrors={[]} />
        );
        expect(this.actions.onSetSeasonRangeWarning).toHaveBeenCalled();
      });

      it('is called in _manageSeasonDateRangeWarning', function() {
        spyOn(this.actions, 'onSetSeasonRangeWarning');

        const hourComponent = TestUtils.renderIntoDocument(
          <Hour
            actions={this.actions}
            activeSeasonIdx={0}
            enabledRemoveHourButtons={{}}
            enforced={true}
            nextSeasonNumber={1}
            seasonRangeWarning={true}
            seasons={this.seasons}
            shopId={1}
            timeConfigErrors={[]} />
        );
        this.actions.onSetSeasonRangeWarning.calls.reset();

        expect(this.actions.onSetSeasonRangeWarning).not.toHaveBeenCalled();

        hourComponent._manageSeasonDateRangeWarning();

        expect(this.actions.onSetSeasonRangeWarning).toHaveBeenCalled();
      });

      it('is called with false when enforced is set to false', function() {

        const enforced = false;

        spyOn(this.actions, 'onSetSeasonRangeWarning');

        const hourComponent = TestUtils.renderIntoDocument(
          <Hour
            actions={this.actions}
            activeSeasonIdx={0}
            enabledRemoveHourButtons={{}}
            enforced={enforced}
            nextSeasonNumber={1}
            seasonRangeWarning={true}
            seasons={this.seasons}
            shopId={1}
            timeConfigErrors={[]} />
        );
        this.actions.onSetSeasonRangeWarning.calls.reset();

        expect(this.actions.onSetSeasonRangeWarning).not.toHaveBeenCalled();

        hourComponent._manageSeasonDateRangeWarning();

        expect(this.actions.onSetSeasonRangeWarning).toHaveBeenCalledWith(enforced);
      });

      it('is called with false when enforced is set to true but season covers entire year', function() {
        spyOn(this.actions, 'onSetSeasonRangeWarning');

        const seasonId = 0; //all year season

        const hourComponent = TestUtils.renderIntoDocument(
          <Hour
            actions={this.actions}
            activeSeasonIdx={seasonId}
            enabledRemoveHourButtons={{}}
            enforced={true}
            nextSeasonNumber={1}
            seasonRangeWarning={true}
            seasons={this.seasons}
            shopId={1}
            timeConfigErrors={[]} />
        );
        this.actions.onSetSeasonRangeWarning.calls.reset();

        expect(this.actions.onSetSeasonRangeWarning).not.toHaveBeenCalled();

        hourComponent._manageSeasonDateRangeWarning();

        expect(this.actions.onSetSeasonRangeWarning).toHaveBeenCalledWith(false);
      });

    });

    it("is called with true when enforced is set to true but season doesn't cover entire year", function() {

      spyOn(this.actions, 'onSetSeasonRangeWarning');

      const seasonId = 1; // season that doesn't cover whole year

      const hourComponent = TestUtils.renderIntoDocument(
        <Hour
          actions={this.actions}
          activeSeasonIdx={seasonId}
          enabledRemoveHourButtons={{}}
          enforced={true}
          nextSeasonNumber={1}
          seasonRangeWarning={true}
          seasons={this.seasons}
          shopId={1}
          timeConfigErrors={[]} />
      );
      this.actions.onSetSeasonRangeWarning.calls.reset();

      expect(this.actions.onSetSeasonRangeWarning).not.toHaveBeenCalled();

      hourComponent._manageSeasonDateRangeWarning();

      expect(this.actions.onSetSeasonRangeWarning).toHaveBeenCalledWith(true);
    });

  });

  describe('methods', function() {
    describe('_getWeekday', function() {
      it('starts with sunday', function() {
        expect(this.hourComponent._getWeekday(0)).toEqual('Sunday');
      });

      it('ends with saturday', function() {
        expect(this.hourComponent._getWeekday(6)).toEqual('Saturday');
      });

      it('returns expected value for other days', function() {
        expect(this.hourComponent._getWeekday(2)).toEqual('Tuesday');
        expect(this.hourComponent._getWeekday(5)).toEqual('Friday');
      });

      it('returns undefined for nums < 0 and > 6', function() {
        expect(this.hourComponent._getWeekday(-1)).toEqual(undefined);
        expect(this.hourComponent._getWeekday(7)).toEqual(undefined);
      });
    });

    describe('getActiveSeason', function() {
      it('returns correct season', function() {
        let hourComponent;
        let activeSeasonIdx;

        activeSeasonIdx = 0;

        hourComponent = TestUtils.renderIntoDocument(
          <Hour
            actions={this.actions}
            activeSeasonIdx={activeSeasonIdx}
            enabledRemoveHourButtons={{}}
            enforced={true}
            nextSeasonNumber={1}
            seasonRangeWarning={true}
            seasons={this.seasons}
            shopId={1}
            timeConfigErrors={[]} />
        );

        expect(hourComponent.getActiveSeason()).toEqual(this.seasons[activeSeasonIdx]);

        activeSeasonIdx = 1;

        hourComponent = TestUtils.renderIntoDocument(
          <Hour
            actions={this.actions}
            activeSeasonIdx={activeSeasonIdx}
            enabledRemoveHourButtons={{}}
            enforced={true}
            nextSeasonNumber={1}
            seasonRangeWarning={true}
            seasons={this.seasons}
            shopId={1}
            timeConfigErrors={[]} />
        );

        expect(hourComponent.getActiveSeason()).toEqual(this.seasons[activeSeasonIdx]);
      });
    });

    describe('_stringifyDate', function() {
      it('returns date in correct format', function() {
        expect(
          this.hourComponent._stringifyDate(new Date(2016, 0, 1))
        ).toEqual('2016-01-01');

        expect(
          this.hourComponent._stringifyDate(new Date(2016, 11, 31))
        ).toEqual('2016-12-31');

        expect(
          this.hourComponent._stringifyDate(new Date(2016, 7, 3))
        ).toEqual('2016-08-03');
      });
    });
  });
});
