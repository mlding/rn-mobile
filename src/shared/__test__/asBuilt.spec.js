import React from 'react'
import { Text } from 'react-native'
import { shallow } from 'enzyme'
import AsBuilt from '../asBuilt'
import AsBuiltAnnotation from '../asBuiltAnnotation'
import { workItemListCategory1, workItemListCategory1HasAnnotations, workItemListNullNetworkElement } from '../fixture'

describe('<AsBuilt />', () => {
  it('should render AsBuilt component without NetworkElement', () => {
    const wrapper = shallow(
      <AsBuilt
        item={workItemListNullNetworkElement[0]}
        editable
      />)
    expect(wrapper.find(Text).length).toEqual(0)
    expect(wrapper.find(AsBuiltAnnotation).length).toEqual(0)
  })

  it('should render AsBuilt component without AsBuiltAnnotations', () => {
    const wrapper = shallow(
      <AsBuilt
        item={workItemListCategory1[0]}
        editable
      />)
    expect(wrapper.find(Text).length).toEqual(1)
    expect(wrapper.find(AsBuiltAnnotation).length).toEqual(0)
  })

  it('should render AsBuilt component with AsBuiltAnnotations', () => {
    const wrapper = shallow(
      <AsBuilt
        item={workItemListCategory1HasAnnotations[0]}
        editable
      />)
    expect(wrapper.find(Text).length).toEqual(1)
    expect(wrapper.find(AsBuiltAnnotation).length).toEqual(2)
  })
})
