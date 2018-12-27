import { Session } from '@open-gtd/api'
import { Reducer } from 'react'
import { getType } from 'typesafe-actions'
import { AppAction } from '..'
import { sessionActions } from '../actions'

const initialState: Session = {
  csrfToken: 'not set yet'
}

export const sessionReducer: Reducer<Session, AppAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case getType(sessionActions.createSession.success):
    case getType(sessionActions.deleteSession.success):
    case getType(sessionActions.getSession.success):
      return action.payload
  }
  return state
}
