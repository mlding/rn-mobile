import ApiHost from '../apiHost'
import { HOST } from '../apiConfig'

describe('ApiHost', () => {
  afterEach(() => {
    delete process.env.NODE_ENV
  })
  it('should return dev env url for development', () => {
    process.env.NODE_ENV = 'development'
    expect(ApiHost()).toEqual(HOST.DEV)
  })
  it('should return test env url for test', () => {
    process.env.NODE_ENV = 'test'
    expect(ApiHost()).toEqual(HOST.TEST)
  })
  it('should return production env url for production', () => {
    process.env.NODE_ENV = 'production'
    expect(ApiHost()).toEqual(HOST.PROD)
  })
  it('should return dev env url for invalid env', () => {
    process.env.NODE_ENV = 'invalid'
    expect(ApiHost()).toEqual(HOST.DEV)
  })
})
