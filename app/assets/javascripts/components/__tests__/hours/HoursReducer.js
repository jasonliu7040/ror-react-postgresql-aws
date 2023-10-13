jest.unmock('../../reducers/hours');
jest.unmock('../../actions/hours');
jest.unmock('react-addons-update');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import hoursReducer from '../../reducers/hours.js.jsx';
import * as actions from '../../actions/hours.js.jsx';

describe ('hours reducer', function() {

  beforeEach(function() {
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
  });

  it('returns unmodified state when action does not exist', function() {
    const dummyAction = {type: 'DUMMY_ACTION'};

    expect(hoursReducer({}, dummyAction)).toEqual({});
    expect(hoursReducer({enforced: true}, dummyAction)).toEqual({enforced: true});
  });

  describe('set shopId', function() {
    it('sets new shop id', function() {
      const currentState = {};
      const action = actions.onSetShopId(2);
      const newState = {shopId: 2};
      expect(hoursReducer(currentState, action)).toEqual(newState);
    });

    it('overwrites old shop id if exists', function() {
      const currentState = {shopId: 1, enforced: true, seasons: []};
      const action = actions.onSetShopId(2);
      const newState = {shopId: 2, enforced: true, seasons: []};
      expect(hoursReducer(currentState, action)).toEqual(newState);
    });
  });

  describe('set seasons', function() {
    it('sets new seasons', function() {
      const currentState = {};
      const action = actions.onSetSeasons(this.seasons);
      const newState = {seasons: this.seasons};
      expect(hoursReducer(currentState, action)).toEqual(newState);
    });

    it('overwrites old seasons if exist', function() {
      const currentState = {seasons: ['dummy season'], enforced: false, shopId: 99};
      const action = actions.onSetSeasons(this.seasons);
      const newState = {seasons: this.seasons, enforced: false, shopId: 99};
      expect(hoursReducer(currentState, action)).toEqual(newState);
    });
  });

  describe('set enforced', function() {
    it('sets new enforced', function() {
      const currentState = {};
      const action = actions.onSetEnforced(false);
      const newState = {enforced: false};
      expect(hoursReducer(currentState, action)).toEqual(newState);
    });

    it('overwrites old enforced if exists', function() {
      const currentState = {enforced: false, activeSeasonIdx: 1, nextSeasonNumber: 1};
      const action = actions.onSetEnforced(true);
      const newState = {enforced: true, activeSeasonIdx: 1, nextSeasonNumber: 1};
      expect(hoursReducer(currentState, action)).toEqual(newState);
    });
  });

  describe('set activeSeasonIdx', function() {
    it('sets new idx', function() {
      const currentState = {};
      const action = actions.onSetActiveSeasonIdx(2);
      const newState = {activeSeasonIdx: 2};
      expect(hoursReducer(currentState, action)).toEqual(newState);
    });

    it('overwrites old active season idx if exists', function() {
      const currentState = {enforced: false, activeSeasonIdx: 1, nextSeasonNumber: 1};
      const action = actions.onSetActiveSeasonIdx(4);
      const newState = {enforced: false, activeSeasonIdx: 4, nextSeasonNumber: 1};
      expect(hoursReducer(currentState, action)).toEqual(newState);
    });
  });

  describe('set nextSeasonNumber', function() {
    it('sets new nextSeasonNumber', function() {
      const currentState = {};
      const action = actions.onSetNextSeasonNumber(1);
      const newState = {nextSeasonNumber: 1};
      expect(hoursReducer(currentState, action)).toEqual(newState);
    });

    it('overwrites old nextSeasonNumber if exist', function() {
      const currentState = {seasons: this.seasons, nextSeasonNumber: 1, shopId: 99};
      const action = actions.onSetNextSeasonNumber(2);
      const newState = {seasons: this.seasons, nextSeasonNumber: 2, shopId: 99};
      expect(hoursReducer(currentState, action)).toEqual(newState);
    });
  });

  describe('set timeConfigErrors', function() {
    it('sets new timeConfigErrors array', function() {
      const currentState = {};
      const action = actions.onSetTimeConfigErrors(['error1', 'error2']);
      const newState = {timeConfigErrors: ['error1', 'error2']};
      expect(hoursReducer(currentState, action)).toEqual(newState);
    });

    it('overwrites old active season idx if exists', function() {
      const currentState = {timeConfigErrors: ['error1', 'error2'], activeSeasonIdx: 1, nextSeasonNumber: 1};
      const action = actions.onSetTimeConfigErrors([]);
      const newState = {timeConfigErrors: [], activeSeasonIdx: 1, nextSeasonNumber: 1};
      expect(hoursReducer(currentState, action)).toEqual(newState);
    });
  });

  describe('set seasonRangeWarning', function() {
    it('sets new seasonRangeWarning', function() {
      const currentState = {};
      const action = actions.onSetSeasonRangeWarning(false);
      const newState = {seasonRangeWarning: false};
      expect(hoursReducer(currentState, action)).toEqual(newState);
    });

    it('overwrites old seasonRangeWarning if exists', function() {
      const currentState = {seasons: this.seasonsn, seasonRangeWarning: false};
      const action = actions.onSetSeasonRangeWarning(true);
      const newState = {seasons: this.seasonsn, seasonRangeWarning: true};
      expect(hoursReducer(currentState, action)).toEqual(newState);
    });
  });

  describe('set enabledRemoveHourButtons', function() {
    it('sets enabledRemoveHourButtons', function() {
      const currentState = {};
      const action = actions.onSetEnabledRemoveHoursButtons({button1: true});
      const newState = {enabledRemoveHourButtons: {button1: true}};
      expect(hoursReducer(currentState, action)).toEqual(newState);
    });

    it('overwrites old enabledRemoveHourButtons if exists', function() {
      const currentState = {enforced: false, enabledRemoveHourButtons: {button1: true}, nextSeasonNumber: 1};
      const action = actions.onSetEnabledRemoveHoursButtons({button2: true, button4: true});
      const newState = {
        enforced: false, enabledRemoveHourButtons: {button2: true, button4: true}, nextSeasonNumber: 1};
      expect(hoursReducer(currentState, action)).toEqual(newState);
    });
  });

  describe('add season', function() {
    it('adds given season and updates nextSeasonNumber & activeSeasonIdx', function() {
      const currentState = {
        seasons: [this.seasons[0]],
        nextSeasonNumber: 1,
        activeSeasonIdx: 0,

        shopId: 5,
        seasonRangeWarning: false
      };
      const action = actions.onAddSeason(this.seasons[1]);
      const newState = {
        seasons: this.seasons,
        nextSeasonNumber: 2,
        activeSeasonIdx: 1,

        shopId: 5,
        seasonRangeWarning: false
      }
      expect(hoursReducer(currentState, action)).toEqual(newState);
    });
  });

  describe('delete active season', function() {
    it('deletes active season and resets active season idx to 0 if it was not 0', function() {
      const currentState = {
        seasons: this.seasons,
        activeSeasonIdx: 1,
      }
      const action = actions.onDeleteActiveSeason();
      const newState = {
        seasons: [this.seasons[0]],
        activeSeasonIdx: 0
      }
      expect(hoursReducer(currentState, action)).toEqual(newState);
    });

    it('deletes active season and leaves active season idx to 0 if it was 0', function() {
      const currentState = {
        seasons: this.seasons,
        activeSeasonIdx: 0,
      }
      const action = actions.onDeleteActiveSeason();
      const newState = {
        seasons: [this.seasons[1]],
        activeSeasonIdx: 0
      }
      expect(hoursReducer(currentState, action)).toEqual(newState);
    });
  });

  describe('update active season start', function() {
    it('updates active season start', function() {
      const currentState = {
        seasons: this.seasons,
        activeSeasonIdx: 1
      }
      const action = actions.onUpdateActiveSeasonStart('2016-06-10');
      const result = hoursReducer(currentState, action);
      expect(result.seasons[1].start).toEqual('2016-06-10');
    });
  });

  describe('update active season finish', function() {
    it('updates active season finish', function() {
      const currentState = {
        seasons: this.seasons,
        activeSeasonIdx: 1
      }
      const action = actions.onUpdateActiveSeasonFinish('2016-06-10');
      const result = hoursReducer(currentState, action);
      expect(result.seasons[1].finish).toEqual('2016-06-10');
    });
  });

  describe('update active season name', function() {
    it('updates active season name and handle', function() {
      const currentState = {
        seasons: this.seasons,
        activeSeasonIdx: 0
      }
      const action = actions.onUpdateActiveSeasonName(
        'Testing name update', 'testing-name-update');
      const result = hoursReducer(currentState, action);
      expect(result.seasons[0].name).toEqual('Testing name update');
      expect(result.seasons[0].id).toEqual('testing-name-update');
    });
  });

  describe('update active season timeslots', function() {
    it('updates slots', function() {
      const activeSeasonIdx = 0;
      const currentState = {
        seasons: this.seasons,
        activeSeasonIdx: activeSeasonIdx,
      };
      const slots = [
        {
          day: 0,
          from: {
            hour: '20', minute: '0'
          },
          to: {
            hour: '23', minute: '0'
          }
        },
        {
          day: 3,
          from: {
            hour: '20', minute: '0'
          },
          to: {
            hour: '23', minute: '0'
          }
        },
        {
          day: 5,
          from: {
            hour: '20', minute: '0'
          },
          to: {
            hour: '23', minute: '0'
          }
        },
      ];
      const action = actions.onUpdateActiveSeasonTimeSlots(slots);
      const result = hoursReducer(currentState, action);

      for(let i = 0; i < result.seasons[activeSeasonIdx].days.length; i++) {
        if (i === 0 || i === 3 || i === 5) {
          expect(result.seasons[activeSeasonIdx].days[i].day).toEqual(i);
          expect(result.seasons[activeSeasonIdx].days[i].hours.length).toEqual(2);
          expect(result.seasons[activeSeasonIdx].days[i].hours[0]).toEqual({
            from: {hour: '9',  minute: '0'},
            to:   {hour: '17', minute: '0'}
          });
          expect(result.seasons[activeSeasonIdx].days[i].hours[1]).toEqual({
            from: {hour: '20', minute: '0'},
            to:   {hour: '23', minute: '0'}
          });
        } else {
          expect(result.seasons[activeSeasonIdx].days[i].day).toEqual(i);
          expect(result.seasons[activeSeasonIdx].days[i].hours.length).toEqual(1);
          expect(result.seasons[activeSeasonIdx].days[i].hours[0]).toEqual({
            from: {hour: '9',  minute: '0'},
            to:   {hour: '17', minute: '0'}
          });
        }
      }
    });
  });

  describe('update enabledRemoveHourButtons', function() {
    it('adds give button id to the enabled buttons', function() {
      const currentState = {
        enabledRemoveHourButtons: { button1: true, button5: true }
      };
      const newState = {
        enabledRemoveHourButtons: { button1: true, button3: true, button5: true }
      };
      const action = actions.onUpadateEnabledRemoveHoursButtons('button3');
      const result = hoursReducer(currentState, action);
      expect(result).toEqual(newState);
    });
  });

  describe('remove time slot', function() {
    it('removes correct time slot', function() {
      // Season 2
      //
      // day: 6,
      // hours: [
      //   {
      //     from: {hour: '9', minute: '0'},
      //     to:   {hour: '17', minute: '0'}
      //   },
      //   {
      //     from: {hour: '20', minute: '30'},
      //     to:   {hour: '23', minute: '0'}
      //   }
      // ]

      let result;
      let action;

      const currentState = {
        seasons: this.seasons
      }

      expect(currentState.seasons[1].days[6].hours.length).toEqual(2);

      action = actions.onRemoveTimeSlot(1, 6, 0);
      result = hoursReducer(currentState, action); // delete first elem

      expect(result.seasons[1].days[6].hours.length).toEqual(1);
      expect(result.seasons[1].days[6].hours[0]).toEqual(
        {
          from: {hour: '20', minute: '30'},
          to:   {hour: '23', minute: '0'}
        }
      );

      action = actions.onRemoveTimeSlot(1, 6, 1); // delete second elem
      result = hoursReducer(currentState, action);

      expect(result.seasons[1].days[6].hours.length).toEqual(1);
      expect(result.seasons[1].days[6].hours[0]).toEqual(
        {
          from: {hour: '9',  minute: '0'},
          to:   {hour: '17', minute: '0'}
        }
      );

      action = actions.onRemoveTimeSlot(1, 6, 0); // delete last elem
      result = hoursReducer(result, action); // deleteing from result, not currentState

      expect(result.seasons[1].days[6].hours.length).toEqual(0);
    });

    it("doesn't change state if given time slot doesn't exist", function() {
      const currentState = {
        seasons: this.seasons
      }

      expect(currentState.seasons[1].days[6].hours.length).toEqual(2);

      const action = actions.onRemoveTimeSlot(1, 6, 2);
      const result = hoursReducer(currentState, action);

      expect(result.seasons[1].days[6].hours.length).toEqual(2);
      expect(result.seasons[1].days[6].hours[0]).toEqual(
        {
          from: {hour: '9',  minute: '0'},
          to:   {hour: '17', minute: '0'}
        }
      );
      expect(result.seasons[1].days[6].hours[1]).toEqual(
        {
          from: {hour: '20', minute: '30'},
          to:   {hour: '23', minute: '0'}
        }
      );
    });
  });
});
