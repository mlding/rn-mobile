import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { offline } from 'redux-offline'
import offlineConfig from 'redux-offline/lib/defaults'
import promiseMiddleware from 'redux-promise-middleware'
import reducer from './reducer'
import IS_DEV_ENV from './constants/apiConfig'
import api from './api/api'

const middlewares = [
  thunk,
  promiseMiddleware(),
]

const onlyRetryOneTime = (action, retries) => (retries === 0 ? 1000 : null)

const customConfig = {
  ...offlineConfig,
  effect: effect => api(effect),
  retry: onlyRetryOneTime,
  persistOptions: {
    whitelist: ['workItems', 'cache', 'download'],
  },
}

if (IS_DEV_ENV) {
  const { createLogger } = require('redux-logger') // eslint-disable-line
  middlewares.push(createLogger({ collapsed: true }))
  GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest
}

const composeEnhancers = (IS_DEV_ENV && GLOBAL.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ? // eslint-disable-line
  GLOBAL.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ shouldCatchErrors: true }) : // eslint-disable-line
  compose

const store = offline(customConfig)(createStore)(
  reducer,
  composeEnhancers(applyMiddleware(...middlewares)),
)

export default store
