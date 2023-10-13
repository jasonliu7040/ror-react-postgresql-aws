jest.unmock('../../components/hours/schedule_box');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import ScheduleBox from '../../components/hours/schedule_box.js.jsx';

describe('ScheduleBox component', function() {
  beforeEach(function() {
    this.dayObject = {
      day: 3,
      hours: [
        {
          from: {hour: '9',  minute: '0'},
          to:   {hour: '17', minute: '0'}
        },
        {
          from: {hour: '21', minute: '30'},
          to:   {hour: '23', minute: '15'}
        }
      ]
    }

    this.scheduleBox = TestUtils.renderIntoDocument(
      <ScheduleBox
        seasonIdx={1}
        dayObject={this.dayObject}
        enabledRemoveHourButtons={{}}
        getWeekday={function() {}}
        onUpadateEnabledRemoveHoursButtons={function() {}}
        onRemoveTimeSlot={function() {}} />
    );
  });

  describe('render', function() {
    it('renders select', function() {
      const select = TestUtils.scryRenderedDOMComponentsWithClass(
        this.scheduleBox, 'hours-select');
      expect(select.length).toEqual(1);
    });

    it('renders option for each hour', function() {
      const options = TestUtils.scryRenderedDOMComponentsWithClass(
        this.scheduleBox, 'hour-option');
      expect(options.length).toEqual(this.dayObject.hours.length);
    });

    it('renders hours in AM/PM format', function() {
      const options = TestUtils.scryRenderedDOMComponentsWithClass(
        this.scheduleBox, 'hour-option');
      const expectedHours = [
        '09:00 AM-05:00 PM',
        '09:30 PM-11:15 PM'
      ];
      for(let i = 0; i < options.length; i++) {
        expect(options[i].textContent).toEqual(expectedHours[i]);
      }
    });

    it('renders remove hours button', function() {
      const removeBtns = TestUtils.scryRenderedDOMComponentsWithClass(
        this.scheduleBox, 'remove-btn');
      expect(removeBtns.length).toEqual(1);
    });
  });

  describe('callbacks', function() {
    describe('getWeekday', function() {
      it('is called with day value from day object', function() {
        const getWeekday = jasmine.createSpy(getWeekday);

        const scheduleBox = TestUtils.renderIntoDocument(
          <ScheduleBox
            seasonIdx={1}
            dayObject={this.dayObject}
            enabledRemoveHourButtons={{}}
            getWeekday={getWeekday}
            onUpadateEnabledRemoveHoursButtons={function() {}}
            onRemoveTimeSlot={function() {}} />
        );

        expect(getWeekday).toHaveBeenCalledWith(this.dayObject.day);
      });

      it('returns value that is used for day label', function() {
        const getWeekday = jasmine.createSpy(getWeekday).and.returnValue('THURSDAY');

        const scheduleBox = TestUtils.renderIntoDocument(
          <ScheduleBox
            seasonIdx={1}
            dayObject={this.dayObject}
            enabledRemoveHourButtons={{}}
            getWeekday={getWeekday}
            onUpadateEnabledRemoveHoursButtons={function() {}}
            onRemoveTimeSlot={function() {}} />
        );

        const dayLabel = TestUtils.findRenderedDOMComponentWithClass(
          scheduleBox, 'day-label');

        expect(dayLabel.textContent).toEqual('THURSDAY');
      });
    });

    describe('onUpadateEnabledRemoveHoursButtons', function() {
      it ('is called when an hour option is selected', function() {
        const onUpadateEnabledRemoveHoursButtons = jasmine.createSpy(
          'onUpadateEnabledRemoveHoursButtons');

        const scheduleBox = TestUtils.renderIntoDocument(
          <ScheduleBox
            seasonIdx={1}
            dayObject={this.dayObject}
            enabledRemoveHourButtons={{}}
            getWeekday={function() {}}
            onUpadateEnabledRemoveHoursButtons={onUpadateEnabledRemoveHoursButtons}
            onRemoveTimeSlot={function() {}} />
        );

        spyOn(scheduleBox, '_getRemoveButtonId').and.returnValue('BUTTON_ID');

        const options = TestUtils.scryRenderedDOMComponentsWithClass(
          scheduleBox, 'hour-option');

        TestUtils.Simulate.click(options[0]);

        expect(onUpadateEnabledRemoveHoursButtons).toHaveBeenCalledWith('BUTTON_ID');
      });
    });

    describe('onRemoveTimeSlot', function() {
      it('is not called when remove button is disabled', function() {
        const onRemoveTimeSlot = jasmine.createSpy('onRemoveTimeSlot');
        const scheduleBox = TestUtils.renderIntoDocument(
          <ScheduleBox
            seasonIdx={1}
            dayObject={this.dayObject}
            enabledRemoveHourButtons={{}}
            getWeekday={function() {}}
            onUpadateEnabledRemoveHoursButtons={function() {}}
            onRemoveTimeSlot={function() {}} />
        );
        const removeBtn = TestUtils.findRenderedDOMComponentWithClass(
          scheduleBox, 'remove-btn');

        expect(removeBtn.disabled).toBe(true);

        TestUtils.Simulate.click(removeBtn);
        expect(onRemoveTimeSlot).not.toHaveBeenCalled();
      });

      it('is is called when remove button is enabled', function() {
        const onRemoveTimeSlot = jasmine.createSpy('onRemoveTimeSlot');
        const seasonIdx = 2;
        const btnId = seasonIdx + "-" + this.dayObject.day;
        const selectedHour = 0;
        let enabledButtons = {};
        enabledButtons[btnId] = true;

        const scheduleBox = TestUtils.renderIntoDocument(
          <ScheduleBox
            seasonIdx={seasonIdx}
            dayObject={this.dayObject}
            enabledRemoveHourButtons={enabledButtons}
            getWeekday={function() {}}
            onUpadateEnabledRemoveHoursButtons={function() {}}
            onRemoveTimeSlot={onRemoveTimeSlot} />
        );

        const removeBtn = TestUtils.findRenderedDOMComponentWithClass(
          scheduleBox, 'remove-btn');

        expect(removeBtn.disabled).toBe(false);

        const options = TestUtils.scryRenderedDOMComponentsWithClass(
               scheduleBox, 'hour-option');

        TestUtils.Simulate.click(options[selectedHour]);
        TestUtils.Simulate.click(removeBtn);

        expect(onRemoveTimeSlot).toHaveBeenCalledWith(
          seasonIdx.toString(), this.dayObject.day.toString(), selectedHour.toString());
      });
    });
  });

  describe('methods', function() {
    it('isRemoveHourBtnDisabled return correct bool', function() {
      let enabledButtons = {};
      enabledButtons['0-5'] = true;

      const scheduleBox = TestUtils.renderIntoDocument(
        <ScheduleBox
          seasonIdx={0}
          dayObject={this.dayObject}
          enabledRemoveHourButtons={enabledButtons}
          getWeekday={function() {}}
          onUpadateEnabledRemoveHoursButtons={function() {}}
          onRemoveTimeSlot={function() {}} />
      );

      expect(scheduleBox.isRemoveHourBtnDisabled(0, 6)).toBe(true);
      expect(scheduleBox.isRemoveHourBtnDisabled(0, 5)).toBe(false);
    });

    it('stringifyHourObjectAsAmpm returns correct string', function() {
      const hourObject = {
        from: { hour: 9,  minute: 0 },
        to:   { hour: 17, minute: 0}
      }

      expect(this.scheduleBox.stringifyHourObjectAsAmpm(hourObject)).toEqual(
        '09:00 AM-05:00 PM');
    });

    it('_hhmmToAmpm returns correct time format', function() {
      const timeObjects = [
        {hour: 16, minute: 25},
        {hour: 8,  minute: 12},
        {hour: 0,  minute: 0},
        {hour: 24, minute: 0}
      ]

      const expectations = [
        '04:25 PM',
        '08:12 AM',
        '12:00 AM',
        '12:00 AM'
      ];

      for(let i = 0; i < timeObjects.length; i++) {
        expect(
          this.scheduleBox._hhmmToAmpm(timeObjects[i])
        ).toEqual(expectations[i]);
      }
    });

    it('_getRemoveButtonId concats given params with dash in between', function() {
      expect(this.scheduleBox._getRemoveButtonId(0, 5)).toEqual('0-5');
    });
  });
});
