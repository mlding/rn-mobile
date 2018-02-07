import { createSelector } from 'reselect'
import { map, filter } from 'lodash'
import { userSelector } from '../auth/selector'
import { isLeadWorker } from '../utilities/role'
import { getStatusComparator } from '../utilities/sort'
import { SORT_TYPE_STATUS } from './constants'

const reportSelector = state => state.reports
const reportFormSelector = state => state.reportForm

export const productReportLinesSelector = createSelector(
  reportFormSelector,
  reportForm => reportForm.productReportLines,
)

export const productReportLinesIdsSelector = createSelector(
  productReportLinesSelector,
  productReportLines => map(filter(productReportLines, 'is_active'), 'work_item'),
)

export const loadingSelector = createSelector(
  reportFormSelector,
  reportForm => reportForm.showLoading,
)

export const mapLoadingSelector = createSelector(
  reportFormSelector,
  reportForm => reportForm.mapLoading,
)

export const alertSelector = createSelector(
  reportFormSelector,
  reportForm => reportForm.showAlert,
)

export const originWorkItemsSelector = createSelector(
  reportFormSelector,
  reportForm => reportForm.originWorkItems,
)

export const reportWorkItemsSelector = createSelector(
  reportFormSelector,
  reportForm => reportForm.reportWorkItems,
)

export const currentReportIdSelector = createSelector(
  reportFormSelector,
  reportForm => reportForm.currentReportId,
)

export const reportInfoSelector = createSelector(
  reportFormSelector,
  reportForm => reportForm.reportInfo,
)

export const reportNameSelector = createSelector(
  reportInfoSelector,
  reportInfo => reportInfo.documentReference,
)

export const reportedDateSelector = createSelector(
  reportInfoSelector,
  reportInfo => reportInfo.reportedDate,
)

export const reportNotesSelector = createSelector(
  reportInfoSelector,
  reportInfo => reportInfo.notes,
)

export const reportErrorMsgSelector = createSelector(
  reportSelector,
  report => report.errorMessage,
)

export const reportRefreshingSelecotr = createSelector(
  reportSelector,
  report => report.refreshing,
)

export const reportLoadingSelector = createSelector(
  reportSelector,
  report => report.loading,
)

export const reportNextSelector = createSelector(
  reportSelector,
  report => report.next,
)

export const sortTypeSelecotr = createSelector(
  reportSelector,
  report => report.sortType,
)

export const reportListSelector = createSelector(
  reportSelector, sortTypeSelecotr, userSelector,
  (report, sortType, user) => {
    if (sortType === SORT_TYPE_STATUS) {
      const comparator = getStatusComparator(isLeadWorker(user.role))
      return [...report.list].sort(comparator)
    }
    return report.list
  },
)
