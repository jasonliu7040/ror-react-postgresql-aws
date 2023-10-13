import {
  SET_SHOP_ID,
  SET_SEASONS,
  SET_ENFORCED,
  SET_ACTIVE_SEASON_IDX,
  SET_NEXT_SEASON_NUMBER,
  SET_TIME_CONFIG_ERRORS,
  SET_SEASON_RANGE_WARNING,
  SET_ENABLED_REMOVE_HOURS_BUTTONS,
  ADD_SEASON,
  DELETE_ACTIVE_SEASON,
  UPDATE_ACTIVE_SEASON_START,
  UPDATE_ACTIVE_SEASON_FINISH,
  UPDATE_ACTIVE_SEASON_NAME,
  UPDATE_ACTIVE_SEASON_TIME_SLOTS,
  REPLACE_ACTIVE_SEASON_TIME_SLOTS,
  UPDATE_ENABLED_REMOVE_HOURS_BUTTONS,
  REMOVE_TIME_SLOT} from '../actions/hours.js.jsx';

const initialState = {
  enforced: null,
  seasons: [],
  active_season_idx: null
};

const immutableUpdate = require('react-addons-update');

export default function hours(state = initialState, action) {
  switch (action.type) {
    case SET_SHOP_ID:
      return immutableUpdate(state, {
        shopId: {$set: action.shopId}
      })
    case SET_SEASONS:
      return immutableUpdate(state, {
        seasons: {$set: action.seasons}
      });
    case SET_ENFORCED:
      return immutableUpdate(state, {
        enforced: {$set: action.enforced}
      });
    case SET_ACTIVE_SEASON_IDX:
      return immutableUpdate(state, {
        activeSeasonIdx: {$set: action.activeSeasonIdx}
      });
    case SET_NEXT_SEASON_NUMBER:
      return immutableUpdate(state, {
        nextSeasonNumber: {$set: action.nextSeasonNumber}
      });
    case SET_TIME_CONFIG_ERRORS:
      return immutableUpdate(state, {
        timeConfigErrors: {$set: action.timeConfigErrors}
      });
    case SET_SEASON_RANGE_WARNING:
      return immutableUpdate(state, {
        seasonRangeWarning: {$set: action.seasonRangeWarning}
      });
    case SET_ENABLED_REMOVE_HOURS_BUTTONS:
      return immutableUpdate(state, {
        enabledRemoveHourButtons: {$set: action.enabledRemoveHourButtons}
      });
    case ADD_SEASON:
      return immutableUpdate(state, {
        seasons: {$push: [action.season]},
        activeSeasonIdx: {$set: state.seasons.length},
        nextSeasonNumber: {$set: state.nextSeasonNumber + 1}
      })
    case DELETE_ACTIVE_SEASON:
      return immutableUpdate(state, {
        seasons: {$splice: [ [state.activeSeasonIdx, 1] ]},
        activeSeasonIdx: {$set: 0}
      })
    case UPDATE_ACTIVE_SEASON_START:
      return immutableUpdate(state, {
        seasons: {
          [state.activeSeasonIdx]: {
            start: {$set: action.start}
          }
        }
      });
    case UPDATE_ACTIVE_SEASON_FINISH:
      return immutableUpdate(state, {
        seasons: {
          [state.activeSeasonIdx]: {
            finish: {$set: action.finish}
          }
        }
      });
    case UPDATE_ACTIVE_SEASON_NAME:
      return immutableUpdate(state, {
        seasons: {
          [state.activeSeasonIdx] : {
            name: {$set: action.name},
            id:   {$set: action.handle}
          }
        }
      });
    case UPDATE_ACTIVE_SEASON_TIME_SLOTS:
      let updatedDays = immutableUpdate(state.seasons[state.activeSeasonIdx].days, {});
      for (let i = 0; i < action.slots.length; i++) {
        updatedDays[action.slots[i].day].hours.push({
          from: action.slots[i].from,
          to:   action.slots[i].to
        })
      }
      return immutableUpdate(state, {
        seasons: {
          [state.activeSeasonIdx]: {
            days: {$set: updatedDays}
          }
        }
      });
    case REPLACE_ACTIVE_SEASON_TIME_SLOTS:

      let replacedDays = immutableUpdate(state.seasons[state.activeSeasonIdx].days, {});

      for (let i = 0; i < 7; i++) {
        replacedDays[i].hours = [];
      }
      for (let i = 0; i < action.slots.length; i++) {
        replacedDays[action.slots[i].day].hours = [{
          from: action.slots[i].from,
          to:   action.slots[i].to
        }];
      }
      return immutableUpdate(state, {
        seasons: {
          [state.activeSeasonIdx]: {
            days: {$set: replacedDays}
          }
        }
      });
    case UPDATE_ENABLED_REMOVE_HOURS_BUTTONS:
      return immutableUpdate(state, {
        enabledRemoveHourButtons: {
          [action.buttonId]: {$set: true}
        }
      });
    case REMOVE_TIME_SLOT:
      return immutableUpdate(state, {
        seasons: {
          [action.seasonIdx]: {
            days: {
              [action.dayIdx]: {hours: {$splice: [[action.slotIdx, 1]]}}
            }
          }
        }
      });
    default:
      return state;
  }
}
