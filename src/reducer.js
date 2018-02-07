import { combineReducers } from 'redux'
import { AUTH } from './auth/actions'
import auth from './auth/reducer'
import workItems from './work-item/reducer'
import reports from './report/reducer'
import reportForm from './report/reportFormReducer'
import cache from './cache/reducer'
import draft from './draft/reducer'
import download from './download/reducer'
import extraWorkOrder from './extra-work-order/reducer'
import timesheet from './timesheet/reducer'
import notification from './notification/reducer'

const appReducer = combineReducers({
  auth,
  workItems,
  reports,
  reportForm,
  cache,
  draft,
  download,
  extraWorkOrder,
  timesheet,
  notification,
})

const rootReducer = (state, action) => {
  if (action.type !== AUTH.CLEAR_TOKEN_SUCCESS) return appReducer(state, action)
  return appReducer(undefined, action)
}

export default rootReducer

