import React from 'react'
import { shallow } from 'enzyme'
import Status from '../reportStatus'

describe('<ReportStatus />', () => {
  it('should render status when the it is submitted', () => {
    const StatusComponent = shallow(<Status status={'submitted'} />)
    expect(StatusComponent.length).toEqual(1)
    expect(StatusComponent.contains('Submitted')).toEqual(true)
  })
})
