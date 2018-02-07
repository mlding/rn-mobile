import { isNumber, isFunction, findIndex } from 'lodash'

export function addArrayItem(array, item, isLast = true) {
  if (!isLast) {
    return [item, ...array]
  }
  return [...array, item]
}

export function replaceArrayItem(array, predicate, item) {
  let index = -1
  if (isNumber(predicate)) {
    index = predicate
  } else if (isFunction(predicate)) {
    index = findIndex(array, it => predicate(it))
  }
  if (index < 0) {
    return array
  }
  return [...array.slice(0, index), item, ...array.slice(index + 1)]
}

export function removeArrayItem(array, index) {
  return [...array.slice(0, index), ...array.slice(index + 1)]
}
