import { ValidationErrors } from '@open-gtd/api'
import { createStandardAction } from 'typesafe-actions'

export const setValidationErrors = createStandardAction(
  'SET_VALIDATION_Errors'
)<ValidationErrors<any>>()

export const clearValidationErrors = createStandardAction(
  'CLEAR_VALIDATION_ERRORS'
)()
