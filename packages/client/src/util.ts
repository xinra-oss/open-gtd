import { Dictionary } from 'ts-essentials'

export function arrayToDictionary<T>(
  array: T[],
  mapItemToKey: (item: T) => string
): Dictionary<T> {
  return array.reduce((dict, item) => {
    dict[mapItemToKey(item)] = item
    return item
  }, {})
}
