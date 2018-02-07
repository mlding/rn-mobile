import { getFullName, formatUserRole, getDefaultName, isNumberOrNotEmptyString,
  uuid, checkDecimal, checkInputNumberValid, parseFloatOrNull } from '../utils'
import { leadWorker } from '../../shared/fixture'
import { formatDate } from '../dateUtils'

describe('#getFullName', () => {
  it('should get full name of the user', () => {
    expect(getFullName(leadWorker)).toEqual('BF')
  })
})

describe('#formatUserRole', () => {
  it('should format the role', () => {
    expect(formatUserRole(leadWorker.role)).toEqual('Lead Worker')
  })
})

describe('#getDefaultName', () => {
  let dateString
  beforeEach(() => {
    dateString = formatDate(new Date(), 'YY-MM-DD')
  })
  it('should return empty string when user is empty', () => {
    expect(getDefaultName()).toEqual('')
  })
  it('should return a report name with user firstName is empty', () => {
    expect(getDefaultName({ ...leadWorker, 'first_name': '' })).toEqual(`${dateString}-F`)
  })
  it('should return a report name with user lastName is empty', () => {
    expect(getDefaultName({ ...leadWorker, 'last_name': '' })).toEqual(`${dateString}-B`)
  })
  it('should return a report name with user firstName and lastName both are empty', () => {
    expect(getDefaultName({ ...leadWorker, 'first_name': '', 'last_name': '' })).toEqual(`${dateString}-`)
  })
  it('should return a report name with user name', () => {
    expect(getDefaultName(leadWorker)).toEqual(`${dateString}-BF`)
  })
})

describe('#uuid', () => {
  it('get uuid', () => {
    expect(uuid().length).toEqual(36)
  })
})

describe('#isNumberOrNotEmptyString', () => {
  it('should return true if value is number', () => {
    const value = 123.124124
    expect(isNumberOrNotEmptyString(value)).toEqual(true)
  })
  it('should return true if value is not empty string', () => {
    const value = '123.124124'
    expect(isNumberOrNotEmptyString(value)).toEqual(true)
  })
  it('should return false if value is empty string', () => {
    const value = ''
    expect(isNumberOrNotEmptyString(value)).toEqual(false)
  })
  it('should return false if value is null', () => {
    const value = null
    expect(isNumberOrNotEmptyString(value)).toEqual(false)
  })
  it('should return false if value is undefined', () => {
    const value = undefined
    expect(isNumberOrNotEmptyString(value)).toEqual(false)
  })
  it('should return false if value is a object', () => {
    const value = {}
    expect(isNumberOrNotEmptyString(value)).toEqual(false)
  })
  it('should return true if value is 0', () => {
    const value = 0
    expect(isNumberOrNotEmptyString(value)).toEqual(true)
  })
  it('should return true if value is string 0', () => {
    const value = '0'
    expect(isNumberOrNotEmptyString(value)).toEqual(true)
  })
})


describe('#checkDecimal', () => {
  it('should return false when text is an invalid number', () => {
    expect(checkDecimal('12.3.4')).toEqual(false)
  })

  it('should return false when the data has more than two decimal', () => {
    expect(checkDecimal('12.345', 2)).toEqual(false)
  })

  it('should return true when the data has one decimal', () => {
    expect(checkDecimal('12.3', 2)).toEqual(true)
  })
})

describe('#checkInputNumberValid', () => {
  it('#should return true if the old text lenght is not equal current one', () => {
    expect(checkInputNumberValid('12', '123')).toEqual(true)
  })

  it('#should return false id the current text is not a valid number', () => {
    expect(checkInputNumberValid('--', '12')).toEqual(false)
    expect(checkInputNumberValid('12.3.4', '12')).toEqual(false)
  })

  it('#should return true if  current text is a valid number', () => {
    expect(checkInputNumberValid('13', '12')).toEqual(true)
  })
})

describe('#parseFloatOrNull', () => {
  it('should return null if the value is empty or null', () => {
    expect(parseFloatOrNull('')).toEqual(null)
    expect(parseFloatOrNull(null)).toEqual(null)
  })
  it('should return int if the value is string int', () => {
    expect(parseFloatOrNull('123')).toEqual(123)
  })
  it('should return flat if the value is string float', () => {
    expect(parseFloatOrNull('123.5')).toEqual(123.5)
  })
  it('should return int if the value is int', () => {
    expect(parseFloatOrNull(123)).toEqual(123)
  })
  it('should return float if the value is float', () => {
    expect(parseFloatOrNull(123.5)).toEqual(123.5)
  })
  it('should return null if the value is .', () => {
    expect(parseFloatOrNull('.')).toEqual(null)
  })
})
