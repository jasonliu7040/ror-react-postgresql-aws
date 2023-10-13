jest.unmock('../../components/hours/schedule');
jest.unmock('../../components/hours/schedule_box');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Schedule from '../../components/hours/schedule.js.jsx';
import ScheduleBox from '../../components/hours/schedule_box.js.jsx';

describe('Schedule', function() {
  beforeEach(function () {
    this.actions = {
      
    }
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
      },
    ]

    this.schedule = TestUtils.renderIntoDocument(
      <Schedule
        seasons={this.seasons}
        activeSeasonIdx={0}
        enabledRemoveHourButtons={{}}
        getWeekday={function() {}}
        onUpadateEnabledRemoveHoursButtons={function() {}}
        onRemoveTimeSlot={function() {}} />
    );
  });

  describe('rendering', function() {
    it('renders 14 ScheduleBoxes. one for each day in season.days for each season', function() {
      const scheduleBoxes = TestUtils.scryRenderedComponentsWithType(
        this.schedule, ScheduleBox);
      expect(scheduleBoxes.length).toEqual(14);
    });

    it('renders 2 season container divs. one for each given season.', function() {
      const seasonContainers = TestUtils.scryRenderedDOMComponentsWithClass(
        this.schedule, 'season-container');
      expect(seasonContainers.length).toEqual(2);
    });

    it('every season container has 7 ScheduleBoxes. one for each day in season.days', function() {
      const seasonContainers = TestUtils.scryRenderedDOMComponentsWithClass(
        this.schedule, 'season-container');

      for(let i = 0; i < seasonContainers.length; i++) {
        expect(seasonContainers[i].children.length).toEqual(7);
      }
    });

    it('shows only active season', function() {
      for(let activeSeasonIdx = 0; activeSeasonIdx < this.seasons.length; activeSeasonIdx++) {

        let schedule = TestUtils.renderIntoDocument(
          <Schedule
            seasons={this.seasons}
            activeSeasonIdx={activeSeasonIdx}
            enabledRemoveHourButtons={{}}
            getWeekday={function() {}}
            onUpadateEnabledRemoveHoursButtons={function() {}}
            onRemoveTimeSlot={function() {}} />
        );

        const seasonContainers = TestUtils.scryRenderedDOMComponentsWithClass(
          schedule, 'season-container');

        for (let i = 0; i < seasonContainers.length; i++) {
          if (i === activeSeasonIdx) {
            expect(seasonContainers[i].style.display).toEqual('block');
          } else {
            expect(seasonContainers[i].style.display).toEqual('none');
          }
        }
      }
    });

    it('renders 11 hours options total (7x1 + 2x2 in season.days)', function() {
      const options = TestUtils.scryRenderedDOMComponentsWithClass(
        this.schedule, 'hour-option');
      expect(options.length).toEqual(11);
    });

    it('renders 7 select boxes with one option for season 1', function() {
      for (let i = 0; i < 7; i++) {
        let selectBox = TestUtils.findRenderedDOMComponentWithClass(
          this.schedule, ('hours-select-season-0-day-' + i)
        );
        expect(selectBox.children.length).toEqual(1);
      }
    });

    it('renders 5 select boxes with no options for season 2', function() {
      for (let i = 1; i < 6; i++) {
        let selectBox = TestUtils.findRenderedDOMComponentWithClass(
          this.schedule, ('hours-select-season-1-day-' + i)
        );
        expect(selectBox.children.length).toEqual(0);
      }
    });

    it('renders 2 select boxes with 2 options each for season 2', function() {
      const selectBox1 = TestUtils.findRenderedDOMComponentWithClass(
        this.schedule, ('hours-select-season-1-day-0')
      );
      expect(selectBox1.children.length).toEqual(2);

      const selectBox2 = TestUtils.findRenderedDOMComponentWithClass(
        this.schedule, ('hours-select-season-1-day-6')
      );
      expect(selectBox2.children.length).toEqual(2);
    });
  });

  describe('methods', function() {
    it('isActiveSeason returns correct bool', function() {
      let schedule;

      schedule = TestUtils.renderIntoDocument(
        <Schedule
          seasons={this.seasons}
          activeSeasonIdx={0}
          enabledRemoveHourButtons={{}}
          getWeekday={function() {}}
          onUpadateEnabledRemoveHoursButtons={function() {}}
          onRemoveTimeSlot={function() {}} />
      );

      expect(schedule.isActiveSeason(0)).toBe(true);
      expect(schedule.isActiveSeason(1)).toBe(false);

      schedule = TestUtils.renderIntoDocument(
        <Schedule
          seasons={this.seasons}
          activeSeasonIdx={1}
          enabledRemoveHourButtons={{}}
          getWeekday={function() {}}
          onUpadateEnabledRemoveHoursButtons={function() {}}
          onRemoveTimeSlot={function() {}} />
      );

      expect(schedule.isActiveSeason(0)).toBe(false);
      expect(schedule.isActiveSeason(1)).toBe(true);
    });
  });
});
