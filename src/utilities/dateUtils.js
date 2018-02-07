import moment from 'moment'
import { isEmpty, indexOf, padStart, toNumber, toString } from 'lodash'

export const formatDate = (date, formatStr = 'YYYY-MM-DD') => (
  moment(date).format(formatStr)
)

export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

export const getFormatedDateText = date => (isEmpty(date) ? '' : `${date[0]}-${padStart(indexOf(monthNames, date[1]) + 1, 2, 0)}-${padStart(date[2], 2, 0)}`)

export const getDataPickerDate = date => {
  if (isEmpty(date)) {
    return []
  }

  const dateArray = formatDate(date, 'YYYY-MMMM-D').split('-')
  return [toString(dateArray[0]), dateArray[1], toNumber(dateArray[2])]
}

let day = []
const generateSuccessiveNumberArr = num => {
  let index = 1
  while (index < num) {
    day.push(index++) //eslint-disable-line
  }
}

export const createDateData = (date = [], startYear = 2010, currentDate = new Date()) => {
  const latestYear = currentDate.getFullYear()
  const latestMonth = currentDate.getMonth() + 1
  const latestDay = currentDate.getDate()
  for (let i = startYear; i <= latestYear; i += 1) {
    const month = []
    for (let j = 1; j < 13; j += 1) {
      if (i === latestYear && j > latestMonth) break

      if (i === latestYear && j === latestMonth) {
        generateSuccessiveNumberArr(latestDay + 1)
      } else if (j === 2) {
        generateSuccessiveNumberArr(29)
        if (i % 4 === 0) {
          day.push(29)
        }
      } else if (j in { 1: 1, 3: 1, 5: 1, 7: 1, 8: 1, 10: 1, 12: 1 }) {
        generateSuccessiveNumberArr(32)
      } else {
        generateSuccessiveNumberArr(31)
      }

      const monthObj = {}
      monthObj[monthNames[j - 1]] = day
      day = []
      month.push(monthObj)
    }
    const dateObj = {}
    dateObj[i] = month
    date.push(dateObj)
  }
}

export const formatUTCZeroDate = (timestamp, format = 'YYYY-MM-DDTHH:mm:ssZ') => (
  moment.utc(timestamp).format(format)
)

