import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { shallow } from 'enzyme'
import { noop, omit, map } from 'lodash'
import { ReportDetail } from '../detail/detail'
import reportDetailData, { reportDetailDataWithoutComments, reportDetailDataWithoutNotes } from '../fixture'
import { leadWorker } from '../../shared/fixture'
import ReportLine from '../detail/reportLine'
import LabelTextView from '../../components/labelTextView'
import StatusRow from '../../shared/reportStatusRow'
import CommentView from '../../shared/commentView'
import ReportLineList from '../components/reportLineList'


describe('<ReportDetail />', () => {
  const mockReportDetail = (report, user) => shallow(
    <ReportDetail
      reportDetailData={report}
      user={user}
      patchReport={noop}
      fetchReports={noop}
      changeShowAlertState={noop}
      setOriginWorkItems={noop}
      setCurrentReportId={noop}
      workItemList={[]}
    />)


  it('should render the report line when the is active is true', () => {
    const component = mockReportDetail(reportDetailData, leadWorker)
    expect(component.length).toEqual(1)
    expect(component.find(KeyboardAwareScrollView).length).toEqual(1)
    expect(component.find(ReportLineList).length).toEqual(1)
  })

  it('should not render the report line when the is active is false', () => {
    const reportData = {
      ...omit(reportDetailData, ['production_lines']),
      production_lines: map(reportDetailData.production_lines, productionLine => ({
        ...omit(productionLine, ['is_active']),
        is_active: false,
      })),
    }
    const component = mockReportDetail(reportData, leadWorker)
    expect(component.length).toEqual(1)
    expect(component.find(KeyboardAwareScrollView).length).toEqual(1)
    expect(component.find(ReportLine).length).toEqual(0)
  })

  it('should render the ReportStatusRow', () => {
    const component = mockReportDetail(reportDetailData, leadWorker)
    expect(component.find(StatusRow).length).toEqual(1)
  })

  it('should not render CommentView when no comments', () => {
    const component = mockReportDetail(reportDetailDataWithoutComments, leadWorker)
    expect(component.find(CommentView).length).toEqual(0)
  })

  it('should render CommentView when had comments', () => {
    const component = mockReportDetail(reportDetailData, leadWorker)
    expect(component.find(CommentView).length).toEqual(1)
  })

  it('should render 3 LabelTextView when no notes', () => {
    const component = mockReportDetail(reportDetailDataWithoutNotes, leadWorker)
    expect(component.find(LabelTextView).length).toEqual(3)
  })

  it('should render 4 LabelTextView when have notes', () => {
    const component = mockReportDetail(reportDetailData, leadWorker)
    expect(component.find(LabelTextView).length).toEqual(4)
  })
})
