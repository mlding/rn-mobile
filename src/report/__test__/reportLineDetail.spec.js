import React from 'react'
import { shallow } from 'enzyme'
import { noop } from 'lodash'
import { reportLine } from '../fixture'
import { ReportLineDetail } from '../components/reportLineDetail'
import TogglePanel from '../detail/togglePanel'
import SelectIcon from '../../shared/selectIcon'
import LabelTextInput from '../../components/labelTextInput'


describe('<ReportLineDetail />', () => {
  it('should render when edit status is false', () => {
    const reportLineDetailComponent = shallow(
      <ReportLineDetail
        reportLine={reportLine}
        editable={false}
        modifyReportLineField={noop}
      />)
    expect(reportLineDetailComponent.find(TogglePanel).length).toEqual(1)
    expect(reportLineDetailComponent.find(SelectIcon).length).toEqual(0)
    expect(reportLineDetailComponent.find(LabelTextInput).length).toEqual(0)
  })

  it('should render when edit status is true', () => {
    const reportLineDetailComponent = shallow(
      <ReportLineDetail
        reportLine={reportLine}
        editable
        modifyReportLineField={noop}
      />)
    expect(reportLineDetailComponent.find(TogglePanel).length).toEqual(1)
    expect(reportLineDetailComponent.find(SelectIcon).length).toEqual(1)
    expect(reportLineDetailComponent.find(LabelTextInput).length).toEqual(1)
  })
})
