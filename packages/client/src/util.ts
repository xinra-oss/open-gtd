import { ValidationErrors } from '@open-gtd/api'
import { Dictionary } from 'ts-essentials'

export function arrayToDictionary<T>(
  array: T[],
  mapItemToKey: (item: T) => string
): Dictionary<T> {
  const dict: Dictionary<T> = {}
  for (const item of array) {
    dict[mapItemToKey(item)] = item
  }
  return dict
}

export function getFormItemValidationProps<T>(
  validationErrors: ValidationErrors<T>,
  propertyName: keyof T
): { validateStatus?: 'error'; help?: string } {
  const errors = validationErrors[propertyName]
  if (errors !== undefined) {
    return {
      validateStatus: 'error',
      help: Array.isArray(errors) ? errors.join('\n') : errors.toString()
    }
  }
  return {}
}

export const stopEventPropagation = (e: { stopPropagation(): void }) =>
  e.stopPropagation()
