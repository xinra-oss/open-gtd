import produce from 'immer'
import { Reducer } from 'react'
import { getType } from 'typesafe-actions'
import { AppAction } from '..'
import { infoAction } from '../actions'
import { InfoState } from '../state/info.state'

const initialState: InfoState = {
  validationErrors: {}
}

export const infoReducer: Reducer<InfoState, AppAction> = (
  state = initialState,
  action
) =>
  produce(state, draft => {
    switch (action.type) {
      case getType(infoAction.setValidationErrors):
        draft.validationErrors = action.payload
        break
      case getType(infoAction.clearValidationErrors):
        draft.validationErrors = {}
        break
    }
    return
  })
