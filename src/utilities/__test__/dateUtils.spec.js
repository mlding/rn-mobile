import { createDateData, formatUTCZeroDate, getFormatedDateText, formatDate, getDataPickerDate } from '../dateUtils'

describe('createDateData utils ', () => {
  it('should return date array', () => {
    const dateSource = []
    const result = [{ '2017': [{ 'January': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] }, { 'February': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28] }, { 'March': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] }, { 'April': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] }, { 'May': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] }, { 'June': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] }, { 'July': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] }, { 'August': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] }, { 'September': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26] }] }]
    createDateData(dateSource, 2017, new Date('2017.9.26'))
    expect(dateSource).toEqual(result)
  })

  it('should include 2016 February 29th  when start year is 2016', () => {
    const dateSource = []
    const result = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29] //eslint-disable-line
    createDateData(dateSource, 2016, new Date('2017.9.26'))
    expect(dateSource[0]['2016'][1].February).toEqual(result)
  })

  it('#formatUTCZeroDate', () => {
    expect(formatUTCZeroDate(1507722612000)).toEqual('2017-10-11T11:50:12+00:00')
  })

  it('#getFormatedDateText', () => {
    expect(getFormatedDateText(['2017', 'November', 23])).toEqual('2017-11-23')
  })

  it('#should return empty when input is empty', () => {
    expect(getFormatedDateText(null)).toEqual('')
  })

  it('#formatDate', () => {
    expect(formatDate('2017-11-23', 'YYYY-MMMM-D')).toEqual('2017-November-23')
    expect(formatDate('2017-11-03', 'YYYY-MMMM-D')).toEqual('2017-November-3')
  })

  it('#getDataPickerDate', () => {
    expect(getDataPickerDate('2017-11-23')).toEqual(['2017', 'November', 23])
    expect(getDataPickerDate('2017-11-03')).toEqual(['2017', 'November', 3])
    expect(getDataPickerDate(null)).toEqual([])
  })

  it('#getDataPickerDate', () => {
    expect(getDataPickerDate('2017-11-23')).toEqual(['2017', 'November', 23])
    expect(getDataPickerDate(null)).toEqual([])
  })
})
