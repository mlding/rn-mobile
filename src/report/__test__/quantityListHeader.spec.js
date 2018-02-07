import React from 'react'
import { shallow } from 'enzyme'
import Icon from 'react-native-vector-icons/EvilIcons'
import { Text } from 'react-native'
import { reportLine } from '../fixture'
import { QuantityListHeader } from '../components/quantityListHeader'

describe('<QuantityListHeader />', () => {
  it('should not render add icon when editable false', () => {
    const component = shallow(
      <QuantityListHeader
        reportLine={reportLine}
        editable={false}
      />,
    )
    expect(component.find(Text).length).toEqual(4)
    expect(component.find(Icon).length).toEqual(0)
  })

  it('should render add icon when editable true', () => {
    const component = shallow(
      <QuantityListHeader
        reportLine={reportLine}
        editable
      />,
    )
    expect(component.find(Icon).length).toEqual(1)
  })
})
