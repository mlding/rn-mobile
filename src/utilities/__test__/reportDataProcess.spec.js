import { convertWorkItemToReportLine } from '../reportDataProcess'
import { workItem, reportLineFromWorkItem } from '../../shared/fixture'

describe('reports utilities', () => {
  it('#convertWorkItemToReportLine', () => {
    expect(convertWorkItemToReportLine(workItem)).toEqual(reportLineFromWorkItem)
  })
})
