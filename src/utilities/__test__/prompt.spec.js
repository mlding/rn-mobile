import { Alert } from 'react-native'
import alert from '../prompt'

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}))

describe('prompt', () => {
  it('#alert', () => {
    const leftFunc = jest.fn()
    const rightFunc = jest.fn()
    const parameters = {
      message: 'Message',
      leftText: 'No',
      leftFunc: leftFunc,
      rightText: 'Yes',
      rightFunc: rightFunc,
    }
    alert(parameters)
    expect(Alert.alert).toBeCalledWith(
      '',
      'Message',
      [{ onPress: leftFunc, text: 'No' }, { onPress: rightFunc, text: 'Yes' }],
      { 'cancelable': false },
    )
  })
})
