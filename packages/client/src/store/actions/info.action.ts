import { ValidationErrors } from '@open-gtd/api'
import { createStandardAction } from 'typesafe-actions'

export const setValidationErrors = createStandardAction(
  'SET_VALIDATION_ERRORS'
)<ValidationErrors<any>>()

export const clearValidationErrors = createStandardAction(
  'CLEAR_VALIDATION_ERRORS'
)()
