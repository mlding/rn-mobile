import {
  guidelineBaseWidth,
  guidelineBaseHeight,
} from '../responsiveDimension'

const mockRN = (mockModules = {}, platform = 'ios') => {
  jest.resetModules()
  jest.doMock('react-native', () => ({
    StatusBar: { currentHeight: 0 },
    Platform: platform,
    ...mockModules,
  }))
}

const mockDeviceWidth = deviceWidth => {
  const Dimensions = {
    get: () => ({ width: deviceWidth }),
  }
  mockRN({ Dimensions })
}

const mockDeviceHeight = (deviceHeight, platform) => {
  const Dimensions = {
    get: () => ({ height: deviceHeight }),
  }
  mockRN({ Dimensions }, platform)
}

describe('scale', () => {
  it('should scale by ratio of device width to guidelineBaseWidth', () => {
    const size = 100
    const sizeAfterScale = 300
    const deviceWidth = guidelineBaseWidth * 3

    mockDeviceWidth(deviceWidth)
    const { scale } = require('../responsiveDimension') // eslint-disable-line

    expect(scale(size)).toEqual(sizeAfterScale)
  })

  it('should return 0', () => {
    const size = 0
    const sizeAfterScale = 0
    const deviceWidth = guidelineBaseWidth

    mockDeviceWidth(deviceWidth)
    const { scale } = require('../responsiveDimension') // eslint-disable-line

    expect(scale(size)).toEqual(sizeAfterScale)
  })

  it('should be able to scale negative', () => {
    const size = -1
    const sizeAfterScale = -1
    const deviceWidth = guidelineBaseWidth

    mockDeviceWidth(deviceWidth)
    const { scale } = require('../responsiveDimension') // eslint-disable-line

    expect(scale(size)).toEqual(sizeAfterScale)
  })
})

describe('verticalScale', () => {
  it('should scale by ratio of device height to guidelineBaseHeight', () => {
    const size = 100
    const sizeAfterScale = 300
    const deviceHeight = guidelineBaseHeight * 3

    mockDeviceHeight(deviceHeight)
    const { verticalScale } = require('../responsiveDimension') // eslint-disable-line

    expect(verticalScale(size)).toEqual(sizeAfterScale)
  })

  it('should substract statusBarHeight from deviceHeight in android', () => {
    const size = 100
    const sizeAfterScale = 97
    const deviceHeight = guidelineBaseHeight
    const statusBar = { currentHeight: 20 }

    mockRN({
      StatusBar: statusBar,
      Dimensions: {
        get: () => ({ height: deviceHeight }),
      },
    }, 'android')
    const { verticalScale } = require('../responsiveDimension') // eslint-disable-line

    expect(verticalScale(size)).toEqual(sizeAfterScale)
  })
})
