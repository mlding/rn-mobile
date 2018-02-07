import { ENV, HOST } from './apiConfig'

const ApiHost = () => {
  switch (process.env.NODE_ENV) {
  case ENV.DEV:
    return HOST.DEV
  case ENV.TEST:
    return HOST.TEST
  case ENV.PROD:
    return HOST.PROD
  default:
    return HOST.DEV
  }
}

export default ApiHost
