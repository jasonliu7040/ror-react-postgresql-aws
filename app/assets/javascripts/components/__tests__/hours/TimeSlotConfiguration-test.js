jest.unmock('../../components/hours/time_slots_configuration');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import TimeSlotsConfiguration from '../../components/hours/time_slots_configuration.js.jsx';

let moment = require('moment');

describe('TimeSlotsConfiguration', function() {
  beforeEach(function() {

    // Fixing jQuery issue
    window["$"] = function() {
      return {modal: function() {}
    }};

    this.season = {
      name: 'Test Season 2',
      id: 'test-season-2',
      start: '2016-08-03',
      finish: '2016-09-12',
      days: [
        {
          day: 0,
          hours: [
            {
              from: {hour: '9',  minute: '0'},
              to:   {hour: '14', minute: '0'}
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
              from: {hour: '20', minute: '30'},
              to:   {hour: '23', minute: '0'}
            }
          ]
        },
      ]
    };

    this.timeSlotsConfiguration = TestUtils.renderIntoDocument(
      <TimeSlotsConfiguration
        season={this.season}
        timeConfigErrors={[]}
        getWeekday={function() {return 'WEEKDAY'}}
        onSetTimeConfigErrors={function() {}}
        onUpdateActiveSeasonTimeSlots={function() {}} />
    );
  });

  describe('render', function() {
    it('renders config button', function() {
      const configBtns = TestUtils.scryRenderedDOMComponentsWithClass(
        this.timeSlotsConfiguration, 'btn-add-slots');
      expect(configBtns.length).toEqual(1);
    });

    it('renders hidden times configure modal', function() {
      const modals = TestUtils.scryRenderedDOMComponentsWithClass(
        this.timeSlotsConfiguration, 'times-configure-modal');

      expect(modals.length).toEqual(1);
      expect(modals[0].className).toEqual('modal times-configure-modal fade');
    });

    it('renders 7 day of the week input checkoboxes', function() {
      const dows = TestUtils.findRenderedDOMComponentWithClass(
        this.timeSlotsConfiguration, 'dow-list');
      expect(dows.children.length).toEqual(7);
    });

    it('renders open time config with correct values', function() {
      const openConfig = TestUtils.findRenderedDOMComponentWithClass(
        this.timeSlotsConfiguration, 'open-time-config');

      expect(openConfig.children[0].textContent).toEqual('Open');
      expect(openConfig.children[1].value).toEqual('9');
      expect(openConfig.children[2].value).toEqual('0');
      expect(openConfig.children[3].value).toEqual('AM');
    });

    it('renders open time config with correct values', function() {
      const openConfig = TestUtils.findRenderedDOMComponentWithClass(
        this.timeSlotsConfiguration, 'close-time-config');

      expect(openConfig.children[0].textContent).toEqual('Close');
      expect(openConfig.children[1].value).toEqual('5');
      expect(openConfig.children[2].value).toEqual('0');
      expect(openConfig.children[3].value).toEqual('PM');
    });

    describe('time config errors', function() {
      it("doesn't show errors when timeConfigErrors is empty", function() {
        const errorBox = TestUtils.findRenderedDOMComponentWithClass(
          this.timeSlotsConfiguration, 'errors');
        expect(errorBox.style.display).toEqual('none');
        expect(errorBox.textContent).toEqual('Could not create times:');
      });

      it('shows errors when timeConfigErros not empty', function() {
        const timeSlotsConfiguration = TestUtils.renderIntoDocument(
          <TimeSlotsConfiguration
            season={this.season}
            timeConfigErrors={['error1', 'error2']}
            getWeekday={function() {}}
            onSetTimeConfigErrors={function() {}}
            onUpdateActiveSeasonTimeSlots={function() {}} />
        );
        const errorBox = TestUtils.findRenderedDOMComponentWithClass(
          timeSlotsConfiguration, 'errors');
        expect(errorBox.style.display).toEqual('');
        expect(errorBox.textContent).toEqual('Could not create times:error1error2');
      });
    });
  });

  describe('callbacks', function() {
    describe('onUpdateActiveSeasonTimeSlots', function() {
      it('is triggered on successful time slot creation', function() {
        const onUpdateActiveSeasonTimeSlots = jasmine.createSpy('onUpdateActiveSeasonTimeSlots');
        const newSlots = 'newSlots';
        const timeSlotsConfiguration = TestUtils.renderIntoDocument(
          <TimeSlotsConfiguration
            season={this.season}
            timeConfigErrors={[]}
            getWeekday={function() {}}
            onSetTimeConfigErrors={function() {}}
            onUpdateActiveSeasonTimeSlots={onUpdateActiveSeasonTimeSlots} />
        );

        const createButton = TestUtils.findRenderedDOMComponentWithClass(
          timeSlotsConfiguration, 'btn-create-slots');

        spyOn(timeSlotsConfiguration, '_getNewTimeSlotsForSelectedDays').and.returnValue(newSlots);
        spyOn(timeSlotsConfiguration, '_validateTimeSlots').and.returnValue([]);

        TestUtils.Simulate.click(createButton);

        expect(onUpdateActiveSeasonTimeSlots).toHaveBeenCalledWith(newSlots);
      });

      it('is not triggered on unsuccessfully time slots validation', function() {
        const onUpdateActiveSeasonTimeSlots = jasmine.createSpy('onUpdateActiveSeasonTimeSlots');
        const timeSlotsConfiguration = TestUtils.renderIntoDocument(
          <TimeSlotsConfiguration
            season={this.season}
            timeConfigErrors={[]}
            getWeekday={function() {}}
            onSetTimeConfigErrors={function() {}}
            onUpdateActiveSeasonTimeSlots={onUpdateActiveSeasonTimeSlots} />
        );

        const createButton = TestUtils.findRenderedDOMComponentWithClass(
          timeSlotsConfiguration, 'btn-create-slots');

        spyOn(timeSlotsConfiguration, '_validateTimeSlots').and.returnValue(['error']);

        TestUtils.Simulate.click(createButton);

        expect(onUpdateActiveSeasonTimeSlots).not.toHaveBeenCalled();
      });
    });

    describe('onSetTimeConfigErrors', function() {
      it('is called in handleTimeSlotsCreation with [] when there are no errors', function() {
        const onSetTimeConfigErrors = jasmine.createSpy('onSetTimeConfigErrors');
        const errors = [];
        const timeSlotsConfiguration = TestUtils.renderIntoDocument(
          <TimeSlotsConfiguration
            season={this.season}
            timeConfigErrors={[]}
            getWeekday={function() {}}
            onSetTimeConfigErrors={onSetTimeConfigErrors}
            onUpdateActiveSeasonTimeSlots={function() {}} />
        );

        spyOn(timeSlotsConfiguration, '_validateTimeSlots').and.returnValue(errors);

        timeSlotsConfiguration.handleTimeSlotsCreation();

        expect(onSetTimeConfigErrors).toHaveBeenCalledWith(errors);
      });
    });

    it('is called in handleTimeSlotsCreation whith errors when validation fails', function() {
      const onSetTimeConfigErrors = jasmine.createSpy('onSetTimeConfigErrors');
      const errors = ['error'];
      const timeSlotsConfiguration = TestUtils.renderIntoDocument(
        <TimeSlotsConfiguration
          season={this.season}
          timeConfigErrors={[]}
          getWeekday={function() {}}
          onSetTimeConfigErrors={onSetTimeConfigErrors}
          onUpdateActiveSeasonTimeSlots={function() {}} />
      );

      spyOn(timeSlotsConfiguration, '_validateTimeSlots').and.returnValue(errors);

      timeSlotsConfiguration.handleTimeSlotsCreation();

      expect(onSetTimeConfigErrors).toHaveBeenCalledWith(errors);
    });
  });

  describe('methods', function() {

    describe('getOptionsRange', function() {
      it('returns correct number of options starting from 0 when one arg is passed', function() {
        const output = this.timeSlotsConfiguration.getOptionsRange(2);
        expect(output.length).toEqual(3);
        for(let i = 0; i < output.lenght; i++) {
          expect(output[i].type).toEqual('option');
          expect(output[i].props.value).toEqual(i);
          expect(output[i].props.children).toEqual('0' + i);
        }
      });

      it('returns correct number of options starting from "from" when two args are passed', function() {
        const from = 2;
        const to = 6;
        const output = this.timeSlotsConfiguration.getOptionsRange(from, to);
        expect(output.length).toEqual(5);
        for(let i = 0; i < output.length; i++) {
          let val = from + i;
          expect(output[i].type).toEqual('option');
          expect(output[i].props.value).toEqual(val);
          expect(output[i].props.children).toEqual('0' + val);
        }
      });
    });

    describe('pad', function() {
      it("returns correct value for one digit nums", function() {
        expect(this.timeSlotsConfiguration.pad(0)).toEqual('00');
        expect(this.timeSlotsConfiguration.pad(5)).toEqual('05');
        expect(this.timeSlotsConfiguration.pad(9)).toEqual('09');
      });

      it("returns correct value for two digit nums", function() {
        expect(this.timeSlotsConfiguration.pad(10)).toEqual('10');
        expect(this.timeSlotsConfiguration.pad(24)).toEqual('24');
        expect(this.timeSlotsConfiguration.pad(99)).toEqual('99');
      });
    });

    describe('_getNewTimeSlotsForSelectedDays', function() {
      it('is called on time slot creation with proper params', function() {
        spyOn(this.timeSlotsConfiguration, '_getNewTimeSlotsForSelectedDays');
        spyOn(this.timeSlotsConfiguration, '_validateTimeSlots').and.returnValue([])

        const createButton = TestUtils.findRenderedDOMComponentWithClass(
          this.timeSlotsConfiguration, 'btn-create-slots');

        TestUtils.Simulate.click(createButton);

        expect(this.timeSlotsConfiguration._getNewTimeSlotsForSelectedDays).toHaveBeenCalled();
      });

      it('returns correct timeslots only for checked day boxes', function() {
        const openingTime = moment('9 00 PM', 'hh mm a');
        const closingTime = moment('11 30 PM', 'hh mm a');
        let output;
        let cbox;

        // Initially there are working days selected
        output = this.timeSlotsConfiguration._getNewTimeSlotsForSelectedDays(openingTime, closingTime);
        expect(output.length).toEqual(5);

        // Reset all boxes
        for (let i = 0; i < 7; i++) {
          cbox = this.timeSlotsConfiguration.refs["times-config-dow-" + i];
          cbox.checked = false;
          TestUtils.Simulate.change(cbox);
        }

        output = this.timeSlotsConfiguration._getNewTimeSlotsForSelectedDays(openingTime, closingTime);
        expect(output.length).toEqual(0);

        // Select just monday and thuersday
        cbox = this.timeSlotsConfiguration.refs["times-config-dow-1"];
        cbox.checked = true;
        TestUtils.Simulate.change(cbox);

        cbox = this.timeSlotsConfiguration.refs["times-config-dow-4"];
        cbox.checked = true;
        TestUtils.Simulate.change(cbox);

        output = this.timeSlotsConfiguration._getNewTimeSlotsForSelectedDays(openingTime, closingTime);
        expect(output.length).toEqual(2);

        expect(output[0].day).toEqual(1);
        expect(output[0].from.hour).toEqual(openingTime.hour().toString());
        expect(output[0].from.minute).toEqual(openingTime.minute().toString());
        expect(output[0].to.hour).toEqual(closingTime.hour().toString());
        expect(output[0].to.minute).toEqual(closingTime.minute().toString());

        expect(output[1].day).toEqual(4);
        expect(output[1].from.hour).toEqual(openingTime.hour().toString());
        expect(output[1].from.minute).toEqual(openingTime.minute().toString());
        expect(output[1].to.hour).toEqual(closingTime.hour().toString());
        expect(output[1].to.minute).toEqual(closingTime.minute().toString());
      });
    });

    describe('_validateTimeSlot', function() {

      // taken in this.season for day 0: 9-14 & 20:30-23:00

      it('no errors added when there is no overlap with existing slots', function() {
        let errors = [];
        let timeSlot = {
          day: 0,
          from: { hour: '15', minute: '00' },
          to:   { hour: '20', minute: '00' }
        }
        this.timeSlotsConfiguration._validateTimeSlot(timeSlot, errors);

        expect(errors.length).toEqual(0);
      });

      it('adds error msg when there is an overlap with any of existing slots', function() {
        let errors;
        let timeSlot;

        errors = []
        timeSlot = {
          day: 0,
          from: { hour: '15', minute: '00' },
          to:   { hour: '21', minute: '00' }
        }
        this.timeSlotsConfiguration._validateTimeSlot(timeSlot, errors);

        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual('New time conflicts with existing timeslot WEEKDAY 08:30 PM - 11:00 PM');

        errors = []
        timeSlot = {
          day: 0,
          from: { hour: '10', minute: '00' },
          to:   { hour: '15', minute: '00' }
        }
        this.timeSlotsConfiguration._validateTimeSlot(timeSlot, errors);

        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual('New time conflicts with existing timeslot WEEKDAY 09:00 AM - 02:00 PM');
      });

      it("adds multiple messages when there are multiple overlaps", function() {
        let errors = [];
        let timeSlot = {
          day: 0,
          from: { hour: '14', minute: '00' },
          to:   { hour: '20', minute: '30' }
        }
        this.timeSlotsConfiguration._validateTimeSlot(timeSlot, errors);

        expect(errors.length).toEqual(2);
        expect(errors[0]).toEqual('New time conflicts with existing timeslot WEEKDAY 09:00 AM - 02:00 PM');
        expect(errors[1]).toEqual('New time conflicts with existing timeslot WEEKDAY 08:30 PM - 11:00 PM');
      });
    });

    describe('_validateSelectedTimes', function() {
      it("doesn't add error message when times are valid", function() {
        const openingTime = moment('9 00 AM', 'hh mm a');
        const closingTime = moment('5 00 PM', 'hh mm a');
        let errors = [];

        this.timeSlotsConfiguration._validateSelectedTimes(openingTime, closingTime, errors);
        expect(errors.length).toEqual(0);
      });

      it('adds error when closingTime is before openingTime', function() {
        const openingTime = moment('9 00 PM', 'hh mm a');
        const closingTime = moment('8 00 PM', 'hh mm a');
        let errors = [];

        this.timeSlotsConfiguration._validateSelectedTimes(openingTime, closingTime, errors);
        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual('Closing time is before opening time');
      });

      it('adds error when closing and opening time are same', function() {
        let openingTime;
        let closingTime;
        let errors;

        openingTime = moment('2 00 PM', 'hh mm a');
        closingTime = moment('2 00 PM', 'hh mm a');
        errors = [];

        this.timeSlotsConfiguration._validateSelectedTimes(openingTime, closingTime, errors);
        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual(
          'Time stands still for nobody. Your opening and closing times need to be different.');
      });
    });
  });
});
