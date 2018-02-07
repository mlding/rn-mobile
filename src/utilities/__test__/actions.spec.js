import { isFunction, noop } from 'lodash'
import { Alert } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { FULFILLED, PENDING, REJECTED } from 'redux-promise-middleware'
import { resolve, reject, pend, createOfflineAction, showAlertBeforeBack } from '../actions'
import ALERT_TYPE from '../../constants/showAlertType'

describe('actions helper', () => {
  it('should return resolve action type', () => {
    expect(resolve('action')).toEqual(`action_${FULFILLED}`)
  })

  it('should return resolve action type', () => {
    expect(reject('action')).toEqual(`action_${REJECTED}`)
  })

  it('should return resolve action type', () => {
    expect(pend('action')).toEqual(`action_${PENDING}`)
  })
})

describe('#createOfflineAction', () => {
  it('should return offline action creator', () => {
    expect(isFunction(createOfflineAction('ACTION', {}))).toEqual(true)
  })

  it('should return the right offline action for offlineAction if effectCreator is an object', () => {
    const actionType = 'ACTION'
    const offlineAction = createOfflineAction(actionType, {})()
    expect(offlineAction.type).toEqual(actionType)
    expect(offlineAction.meta).toEqual({
      offline: {
        effect: {},
        commit: { type: resolve(actionType), meta: [] },
        rollback: { type: reject(actionType), meta: [] },
      },
    })
  })

  it('should return the right offline action for offlineAction if effectCreator is a function', () => {
    const actionType = 'ACTION'
    const offlineAction = createOfflineAction(actionType,
      (arg1, arg2) => ({ function: true }))(1, 2) // eslint-disable-line no-unused-vars
    expect(offlineAction.type).toEqual(actionType)
    expect(offlineAction.payload).toEqual([1, 2])
    expect(offlineAction.meta.offline.effect).toEqual({ function: true })
  })
})

describe('#showAlertBeforeBack', () => {
  it('should retun a function', () => {
    expect(isFunction(showAlertBeforeBack(ALERT_TYPE.ADD_ITEM_ALERT))).toEqual(true)
  })

  it('should show alert when report form show alert', () => {
    const getState = () => ({ reportForm: { showAlert: true } })
    const spy = jest.spyOn(Alert, 'alert')
    showAlertBeforeBack()(noop, getState)
    expect(spy).toBeCalled()
  })

  it('should show alert when add item show alert', () => {
    const getState = () => ({
      reportForm: {},
      extraWorkOrder: { showAlertForItem: true },
    })
    const spy = jest.spyOn(Alert, 'alert')
    showAlertBeforeBack(ALERT_TYPE.ADD_ITEM_ALERT)(noop, getState)
    expect(spy).toBeCalled()
  })

  it('should show alert when time sheet show alert', () => {
    const getState = () => ({
      reportForm: {},
      timesheet: { showAlert: true },
    })
    const spy = jest.spyOn(Alert, 'alert')
    showAlertBeforeBack(ALERT_TYPE.TIMESHEET_ITEM_ALERT)(noop, getState)
    expect(spy).toBeCalled()
  })

  it('should call goBack when type is not matched', () => {
    const getState = () => ({ reportForm: {} })
    const spy = jest.spyOn(Actions, 'pop')
    showAlertBeforeBack()(noop, getState)
    expect(spy).toBeCalled()
  })
})
