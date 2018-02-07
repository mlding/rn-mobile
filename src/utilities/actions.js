import { isFunction, isEqual } from 'lodash'
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'
import { goBack } from './navigator'
import alert from './prompt'
import ALERT_TYPE from '../constants/showAlertType'

export const pend = type => `${type}_${PENDING}`
export const resolve = type => `${type}_${FULFILLED}`
export const reject = type => `${type}_${REJECTED}`

export const GET = 'GET'

export const createOfflineAction = (actionType, effectCreator) =>
  (...args) => {
    const argsObject = [...args]

    return {
      type: actionType,
      payload: argsObject,
      meta: {
        offline: {
          effect: isFunction(effectCreator) ? effectCreator(...args) : effectCreator,
          commit: { type: resolve(actionType), meta: argsObject },
          rollback: { type: reject(actionType), meta: argsObject },
        },
      },
    }
  }

export const showAlertBeforeBack = type => (dispatch, getState) => {
  let shouldShowAlert = getState().reportForm.showAlert
  if (isEqual(type, ALERT_TYPE.ADD_ITEM_ALERT)) {
    shouldShowAlert = getState().extraWorkOrder.showAlertForItem
  }

  if (isEqual(type, ALERT_TYPE.TIMESHEET_ITEM_ALERT)) {
    shouldShowAlert = getState().timesheet.showAlert
  }

  if (shouldShowAlert) {
    alert({
      message: 'Content has been changed, do you want to leave this page',
      leftText: 'Stay',
      rightText: 'Leave',
      rightFunc: () => goBack(),
    })
  } else {
    goBack()
  }
}
