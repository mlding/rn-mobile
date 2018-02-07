import React from 'react'
import { shallow } from 'enzyme'
import { reportLine } from '../fixture'
import ReportLineContainer from '../detail/reportLine'
import WorkItemCell from '../../shared/workItemCell'
import ReportLineDetailContainer from '../components/reportLineDetail'

describe('<ReportLine />', () => {
  it('should render', () => {
    const reportLineComponent = shallow(
      <ReportLineContainer reportLine={reportLine} />,
    )
    expect(reportLineComponent.length).toEqual(1)
    expect(reportLineComponent.find(WorkItemCell).length).toEqual(1)
    expect(reportLineComponent.find(ReportLineDetailContainer).length).toEqual(1)
  })
})
