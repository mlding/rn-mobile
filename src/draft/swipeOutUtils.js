import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { isEmpty, get, findIndex } from 'lodash'
import moment from 'moment'
import { COLOR, FONT } from '../constants/styleGuide'
import alert from '../utilities/prompt'
import { showInfo, showError } from '../utilities/messageBar'
import STATUS from '../constants/status'
import { getShowText } from '../utilities/dataProcessUtils'
import { monthNames } from '../utilities/dateUtils'
import { convertWorkItemToReportLine } from '../utilities/reportDataProcess'
import { getDefaultName } from '../utilities/utils'
import Strings from '../constants/strings'
import { REMOVE_FROM_DRAFT_REPORT } from './constants'
import { removeArrayItem } from '../utilities/array'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  text: {
    color: COLOR.WHITE,
    fontSize: FONT.MD,
    textAlign: 'center',
  },
})

export const deleteDraftPrompt = ({ setDraft, user, name, type }, needGoBack = false) => (
  alert({
    message: `The ${type} is not submitted. Are you sure you want to delete the draft ${type}?`,
    leftText: Strings.Cancel,
    rightText: Strings.Delete,
    rightFunc: () => {
      if (needGoBack) {
        Actions.pop()
      }
      setDraft(null, user).then(() => {
        showInfo(`Draft ${name} is deleted`)
      }).catch(() => {
        showError('Failed to delete draft, please try later')
      })
    },
  })
)

export const swipeBtns = (text, bgColor, pressCallback, args, isAddedToDraft = false) => [
  {
    component: (
      <View style={styles.container}>
        <Text style={styles.text}>
          {isAddedToDraft ? REMOVE_FROM_DRAFT_REPORT : text}
        </Text>
      </View>
    ),
    backgroundColor: isAddedToDraft ? COLOR.RED : bgColor,
    onPress: () => pressCallback(args, isAddedToDraft),
  },
]

export const updateWorkItemInDraft = ({ item, draft, setDraftReport, user }, isAddedToDraft) => {
  const reportLine = convertWorkItemToReportLine(item)
  let updatedProductReportLines
  let documentReference = getDefaultName(user)
  let reportedDate
  let notes = null
  let approverName = getShowText()
  const date = moment()

  if (isEmpty(draft)) {
    updatedProductReportLines = [reportLine]
    reportedDate = [date.get('year'), monthNames[date.get('month')], date.get('date')]
  } else {
    documentReference = get(draft, 'documentReference')
    reportedDate = get(draft, 'reportedDate')
    notes = get(draft, 'notes')
    approverName = get(draft, 'approver_name')

    if (isAddedToDraft) {
      updatedProductReportLines = [...draft.productReportLines]
      const index = findIndex(updatedProductReportLines,
          line => line.work_item === reportLine.work_item)
      updatedProductReportLines = removeArrayItem(updatedProductReportLines, index)
    } else {
      updatedProductReportLines = [
        ...draft.productReportLines,
        reportLine,
      ]
    }
  }

  const updatedDraft = {
    documentReference: documentReference,
    reportedDate: reportedDate,
    notes: notes,
    productReportLines: updatedProductReportLines,
    status: STATUS.DRAFT,
    approver_name: approverName,
  }
  setDraftReport(updatedDraft, user)
    .then(() => {
      if (isAddedToDraft) {
        showInfo(`${get(item, 'name')} has been removed from the draft report`)
      } else {
        showInfo(`${get(item, 'name')} has been added to the draft report`)
      }
    })
    .catch(() => {
      showError('Failed to update draft, please try later')
    })
}
