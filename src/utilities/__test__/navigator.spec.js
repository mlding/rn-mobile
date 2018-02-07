import { Actions } from 'react-native-router-flux'
import { goBack } from '../navigator'

describe('navigator', () => {
  it('#goBack', () => {
    goBack()
    expect(Actions.pop).toBeCalled()
  })
})
