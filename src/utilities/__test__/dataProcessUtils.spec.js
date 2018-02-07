import { getShowText } from '../dataProcessUtils'

describe('dataprocess utils ', () => {
  it('should return input when input is not null', () => {
    const input = 'activity'
    expect(getShowText(input)).toEqual(input)
  })

  it('should return -- when input is null', () => {
    const input = null
    expect(getShowText(input)).toEqual('--')
  })

  it('should return -- when input is empty', () => {
    const input = ''
    expect(getShowText(input)).toEqual('--')
  })

  it('should return 0 when input is 0', () => {
    const input = 0
    expect(getShowText(input)).toEqual(0)
  })
})
