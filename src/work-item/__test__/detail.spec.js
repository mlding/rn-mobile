import React from 'react'
import { ScrollView, Text } from 'react-native'
import { shallow } from 'enzyme'
import WorkItemDetail from '../detail/detail'
import workItemDetailObj from '../fixture'
import WorkItemCell from '../../shared/workItemCell'
import MaterialList from '../detail/materialList'

describe('<WorkItemDetail />', () => {
  it('should render ', () => {
    const wrapper = shallow(<WorkItemDetail workItemDetail={workItemDetailObj} />)
    expect(wrapper.find(ScrollView).length).toEqual(1)
    expect(wrapper.find(WorkItemCell).length).toEqual(1)
    expect(wrapper.find(Text).length).toEqual(2)
    expect(wrapper.find(MaterialList).length).toEqual(1)
  })
})
