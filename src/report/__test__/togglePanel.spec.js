import React from 'react'
import { View, Text } from 'react-native'
import { shallow } from 'enzyme'
import TogglePanel from '../detail/togglePanel'

describe('<TogglePanel />', () => {
  it('should render', () => {
    const togglePanelComponent = shallow(
      <TogglePanel >
        <View />
        <Text />
      </TogglePanel>,
    )
    expect(togglePanelComponent.find(View).length).toEqual(2)
  })
})
