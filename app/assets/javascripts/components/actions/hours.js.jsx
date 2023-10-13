export const SET_SHOP_ID  = 'SET_SHOP_ID'
export const SET_SEASONS  = 'SET_SEASONS';
export const SET_ENFORCED = 'SET_ENFORCED';
export const SET_ACTIVE_SEASON_IDX  = 'SET_ACTIVE_SEASON_IDX';
export const SET_NEXT_SEASON_NUMBER = 'SET_NEXT_SEASON_NUMBER';
export const SET_TIME_CONFIG_ERRORS = 'SET_TIME_CONFIG_ERRORS';
export const SET_SEASON_RANGE_WARNING = 'SET_SEASON_RANGE_WARNING';
export const SET_ENABLED_REMOVE_HOURS_BUTTONS = 'SET_ENABLED_REMOVE_HOURS_BUTTONS';
export const ADD_SEASON = 'ADD_SEASON';
export const DELETE_ACTIVE_SEASON = 'DELETE_ACTIVE_SEASON';
export const UPDATE_ACTIVE_SEASON_START = 'UPDATE_ACTIVE_SEASON_START';
export const UPDATE_ACTIVE_SEASON_FINISH = 'UPDATE_ACTIVE_SEASON_FINISH';
export const UPDATE_ACTIVE_SEASON_NAME = 'UPDATE_ACTIVE_SEASON_NAME';
export const UPDATE_ACTIVE_SEASON_TIME_SLOTS = 'UPDATE_ACTIVE_SEASON_TIME_SLOTS';
export const UPDATE_ENABLED_REMOVE_HOURS_BUTTONS = 'UPDATE_ENABLED_REMOVE_HOURS_BUTTONS';
export const REMOVE_TIME_SLOT = 'REMOVE_TIME_SLOT';
export const REPLACE_ACTIVE_SEASON_TIME_SLOTS = 'REPLACE_ACTIVE_SEASON_TIME_SLOTS';

export function onSetShopId(shopId) {
  return {
    type: SET_SHOP_ID,
    shopId
  }
}

export function onSetSeasons(seasons) {
  return {
    type: SET_SEASONS,
    seasons
  }
}

export function onSetEnforced(enforced) {
  return {
    type: SET_ENFORCED,
    enforced
  }
}

export function onSetActiveSeasonIdx(activeSeasonIdx) {
  return {
    type: SET_ACTIVE_SEASON_IDX,
    activeSeasonIdx
  }
}

export function onSetNextSeasonNumber(nextSeasonNumber) {
  return {
    type: SET_NEXT_SEASON_NUMBER,
    nextSeasonNumber
  }
}

export function onSetTimeConfigErrors(timeConfigErrors) {
  return {
    type: SET_TIME_CONFIG_ERRORS,
    timeConfigErrors
  }
}

export function onSetSeasonRangeWarning(seasonRangeWarning) {
  return {
    type: SET_SEASON_RANGE_WARNING,
    seasonRangeWarning
  }
}

export function onSetEnabledRemoveHoursButtons(enabledRemoveHourButtons) {
  return {
    type: SET_ENABLED_REMOVE_HOURS_BUTTONS,
    enabledRemoveHourButtons
  }
}

export function onAddSeason(season) {
  return {
    type: ADD_SEASON,
    season
  }
}

export function onDeleteActiveSeason() {
  return {
    type: DELETE_ACTIVE_SEASON
  }
}

export function onUpdateActiveSeasonStart(start) {
  return {
    type: UPDATE_ACTIVE_SEASON_START,
    start
  }
}

export function onUpdateActiveSeasonFinish(finish) {
  return {
    type: UPDATE_ACTIVE_SEASON_FINISH,
    finish
  }
}

export function onUpdateActiveSeasonName(name, handle) {
  return {
    type: UPDATE_ACTIVE_SEASON_NAME,
    name,
    handle
  }
}

export function onUpdateActiveSeasonTimeSlots(slots) {
  return {
    type: UPDATE_ACTIVE_SEASON_TIME_SLOTS,
    slots
  }
}

export function onReplaceActiveSeasonTimeSlots(slots) {
  return {
    type: REPLACE_ACTIVE_SEASON_TIME_SLOTS,
    slots
  }
}

export function onUpadateEnabledRemoveHoursButtons(buttonId) {
  return {
    type: UPDATE_ENABLED_REMOVE_HOURS_BUTTONS,
    buttonId
  }
}

export function onRemoveTimeSlot(seasonIdx, dayIdx, slotIdx) {
  return {
    type: REMOVE_TIME_SLOT,
    seasonIdx,
    dayIdx,
    slotIdx
  }
}
