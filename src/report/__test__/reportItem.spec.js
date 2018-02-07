import React from 'react'
import { shallow } from 'enzyme'
import { noop } from 'lodash'
import { ReportItem } from '../list/reportItem'
import reportDetailData from '../fixture'
import { leadWorker } from '../../shared/fixture'
import Role from '../../constants/role'
import ItemCell from '../../shared/reportItemCell'

describe('<ReporItem />', () => {
  it('should render the status component', () => {
    const reportItemComponent = shallow(<ReportItem
      item={reportDetailData}
      role={Role.LEAD_WORKER}
      setDraftReport={noop}
      user={leadWorker}
    />)
    expect(reportItemComponent.find(ItemCell).length).toEqual(1)
  })

  it('should render the sumbitted data and approver name if it is construction manager', () => {
    const reportItemComponent = shallow(<ReportItem
      item={reportDetailData}
      role={Role.CONSTRUCTION_MANAGER}
      setDraftReport={noop}
      user={leadWorker}
    />)
    expect(reportItemComponent.find(ItemCell).props().content.includes('Submitted by')).toEqual(true)
    expect(reportItemComponent.find(ItemCell).props().content.includes('Bernie')).toEqual(true)
    expect(reportItemComponent.find(ItemCell).props().title)
      .toEqual(reportDetailData.document_reference)
  })

  it('should render the report data and creator name if it is construction manager', () => {
    const reportItemComponent = shallow(<ReportItem
      item={reportDetailData}
      role={Role.LEAD_WORKER}
      setDraftReport={noop}
      user={leadWorker}
    />)
    expect(reportItemComponent.find(ItemCell).props().content.includes('Review By')).toEqual(true)
    expect(reportItemComponent.find(ItemCell).props().content.includes('Bill')).toEqual(true)
    expect(reportItemComponent.find(ItemCell).props().dateDescription.includes('Submitted')).toEqual(true)
  })
})
