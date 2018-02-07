import React from 'react'
import { View, Text } from 'react-native'
import { shallow } from 'enzyme'
import SectionHeader from '../list/sectionHeader'

describe('<SectionHeader />', () => {
  it('should render title and date', () => {
    const wrapper = shallow(<SectionHeader title="hello" date="21.07.2017" />)
    expect(wrapper.find(View).length).toEqual(1)
    expect(wrapper.find(Text).length).toEqual(2)
    expect(wrapper.contains('hello')).toEqual(true)
    expect(wrapper.contains('Due by 21.07.2017')).toEqual(true)
  })

  it('should render title when date is null', () => {
    const wrapper = shallow(<SectionHeader title="hello" />)
    expect(wrapper.find(View).length).toEqual(1)
    expect(wrapper.find(Text).length).toEqual(1)
    expect(wrapper.contains('hello')).toEqual(true)
  })
})
