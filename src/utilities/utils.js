import { isNumber, isString, isEmpty, upperFirst, size, split, chain, isEqual } from 'lodash'
import { formatDate } from './dateUtils'

const getInitialName = name => (isEmpty(name) ? '' : upperFirst(name)[0])

export const getFullName = user => `${getInitialName(user.first_name)}${getInitialName(user.last_name)}`

export const formatUserRole = role => (
  chain(split(role, '_'))
  .map(ele => upperFirst(ele))
  .join(' ')
  .value()
)

export const getDefaultName = user => {
  if (isEmpty(user)) return ''
  const dataString = formatDate(new Date(), 'YY-MM-DD')
  const fullName = getFullName(user)
  return `${dataString}-${fullName}`.trim()
}

const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
export const uuid = () => `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`

export const isNumberOrNotEmptyString = value =>
  isNumber(value) || (isString(value) && !isEmpty(value) && !isEqual(value, '.'))

export const checkDecimal = (text, decimal) => {
  const parts = text.split('.')
  if (parts.length > 2) {
    return false
  }
  if (parts.length === 2) {
    if (parts[1].length > decimal) {
      return false
    }
  }
  return true
}

export const checkInputNumberValid = (text, old, decimalDigits = 1) => {
  if (size(text) < size(old)) {
    return true
  }
  return !(text.includes('-') || !checkDecimal(text, decimalDigits))
}

export const parseFloatOrNull = value => {
  if (!isNumberOrNotEmptyString(value)) return null
  return parseFloat(value)
}

