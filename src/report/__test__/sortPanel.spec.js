import React from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { shallow } from 'enzyme'
import { SortPanel } from '../list/sortPanel'
import Role from '../../constants/role'
import { DEFAULT_SORT_TYPE } from '../constants'


describe('<SortPanel />', () => {
  it('should render the sort label for construction manager', () => {
    const sortPanel = shallow(<SortPanel
      role={Role.CONSTRUCTION_MANAGER}
      selected={DEFAULT_SORT_TYPE}
    />)
    expect(sortPanel.find(TouchableWithoutFeedback).length).toEqual(3)
    expect(sortPanel.contains('ReportStatus')).toEqual(true)
    expect(sortPanel.contains('Report Date')).toEqual(true)
  })

  it('should render the sort label for leader worker', () => {
    const sortPanel = shallow(<SortPanel
      role={Role.LEAD_WORKER}
      selected={DEFAULT_SORT_TYPE}
    />)
    expect(sortPanel.find(TouchableWithoutFeedback).length).toEqual(3)
    expect(sortPanel.contains('ReportStatus')).toEqual(true)
    expect(sortPanel.contains('Submitted Date')).toEqual(true)
  })
})
