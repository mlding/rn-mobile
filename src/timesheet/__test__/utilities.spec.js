import { Actions } from 'react-native-router-flux'
import {
  calculateTotalHours,
  generateSubmittedLines,
  openTimesheetDetail,
  getHourWithUnit,
  getContentDescription,
  isApprover,
} from '../utilities'
import { timesheetLines, timesheet } from '../fixture'
import ROLE from '../../constants/role'
import { VIEW_MODE } from '../constants'

jest.mock('react-native-router-flux', () => ({
  Actions: {
    timesheet: jest.fn(),
    editTimesheet: jest.fn(),
    managerTimesheetDetail: jest.fn(),
  },
}))

describe('utilities', () => {
  it('#calculateTotalHours', () => {
    expect(calculateTotalHours(timesheetLines)).toEqual(15)
    expect(calculateTotalHours([
      { hours: 3.12 },
      { hours: 2.88 },
      { hours: 1.28 },
    ])).toEqual(7.28)
    expect(calculateTotalHours([
      { hours: 3.2 },
      { hours: 2.8 },
    ])).toEqual(6)
    expect(calculateTotalHours([
      { hours: 3 },
      { hours: 2.36 },
    ])).toEqual(5.36)
  })

  it('#generateSubmittedLines', () => {
    const submitLines = [
      { date: '', hours: 2, job_code: 'jobCode 1' },
      { date: '', hours: 8, job_code: 'jobCode 2' },
      { date: '', hours: 5, job_code: 'jobCode 3' },
    ]
    expect(generateSubmittedLines(timesheetLines)).toEqual(submitLines)
  })

  describe('#openTimesheetDetail', () => {
    it('should go the the detail if the role is leader worker and timesheet status is resubmitted', () => {
      const reSubmittedTimesheet = { ...timesheet, status: 'resubmitted' }
      openTimesheetDetail(reSubmittedTimesheet, ROLE.LEAD_WORKER)
      expect(Actions.timesheet).toHaveBeenCalledWith({ timesheet: reSubmittedTimesheet })
    })

    it('should go the the edit if the role is leader worker and timesheet status is flagged', () => {
      const flaggedTimesheet = { ...timesheet, status: 'flagged' }
      openTimesheetDetail(flaggedTimesheet, ROLE.LEAD_WORKER)
      expect(Actions.editTimesheet).toHaveBeenCalledWith({ timesheet: flaggedTimesheet })
    })

    it('should go the the detail if the role is  construction manager viewMode is creator and timesheet status is resubmitted', () => {
      const reSubmittedTimesheet = { ...timesheet, status: 'resubmitted' }
      openTimesheetDetail(reSubmittedTimesheet, ROLE.CONSTRUCTION_MANAGER, VIEW_MODE.CREATOR)
      expect(Actions.timesheet).toHaveBeenCalledWith({ timesheet: reSubmittedTimesheet })
    })

    it('should go the the edit if the role is  construction manager viewMode is creator and timesheet status is flagged', () => {
      const flaggedTimesheet = { ...timesheet, status: 'flagged' }
      openTimesheetDetail(flaggedTimesheet, ROLE.CONSTRUCTION_MANAGER, VIEW_MODE.CREATOR)
      expect(Actions.editTimesheet).toHaveBeenCalledWith({ timesheet: flaggedTimesheet })
    })

    it('should go the the manage detail if the role is construction manager', () => {
      openTimesheetDetail(timesheet, ROLE.CONSTRUCTION_MANAGER, VIEW_MODE.APPROVAL)
      expect(Actions.managerTimesheetDetail).toHaveBeenCalledWith({ timesheet: timesheet })
    })
  })

  it('#getHourWithUnit', () => {
    expect(getHourWithUnit(0.21)).toEqual('0.21 Hour')
    expect(getHourWithUnit(1)).toEqual('1 Hour')
    expect(getHourWithUnit(1.2)).toEqual('1.2 Hours')
    expect(getHourWithUnit(12)).toEqual('12 Hours')
  })

  it('#isApprover', () => {
    expect(isApprover(ROLE.LEAD_WORKER, VIEW_MODE.CREATOR)).toEqual(false)
    expect(isApprover(ROLE.LEAD_WORKER, VIEW_MODE.APPROVAL)).toEqual(false)
    expect(isApprover(ROLE.CONSTRUCTION_MANAGER, VIEW_MODE.CREATOR)).toEqual(false)
    expect(isApprover(ROLE.CONSTRUCTION_MANAGER, VIEW_MODE.APPROVAL)).toEqual(true)
  })

  describe('#getContentDescription', () => {
    it('should get approver name when the role is leader worker', () => {
      expect(getContentDescription(timesheet, ROLE.LEAD_WORKER)).toEqual('Review By Bill Quora')
    })

    it('should get approver name when the role is construction manager and viewMode is creator', () => {
      expect(getContentDescription(timesheet, ROLE.CONSTRUCTION_MANAGER, VIEW_MODE.CREATOR))
        .toEqual('Review By Bill Quora')
    })

    it('should get creater name when the role is construction manager and viewMode is approver', () => {
      expect(getContentDescription(timesheet, ROLE.CONSTRUCTION_MANAGER, VIEW_MODE.APPROVAL))
        .toEqual('Submitted by Bernie Quor')
    })
  })
})
