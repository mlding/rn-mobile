import React from 'react'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import { capitalize, isEqual } from 'lodash'
import { createStructuredSelector } from 'reselect'
import { COLOR, FONT } from '../../constants/styleGuide'
import { formatDate } from '../../utilities/dateUtils'
import { ReportShape, UserShape } from '../../shared/shape'
import { ROLE_MAPPING, TITLE } from '../constants'
import { DRAFT_TYPE } from '../../draft/constants'
import STATUS from '../../constants/status'
import { isLeadWorker } from '../../utilities/role'
import { openReportDetail } from '../utilities'
import { setDraftReport } from '../../draft/actions'
import { userSelector, roleSelector } from '../../auth/selector'
import ItemCell from '../../shared/reportItemCell'
import MapIcon from '../../shared/mapIcon'
import DeleteIcon from '../../shared/deleteIcon'

const styles = StyleSheet.create({
  deleteText: {
    color: COLOR.WHITE,
    fontSize: FONT.LG,
    marginRight: 14,
  },
  rightButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    padding: 10,
  },
})

const renderRightButton = (setDraftReport, user, name) => ( //eslint-disable-line
  <View style={styles.rightButton}>
    <DeleteIcon
      setDraft={setDraftReport}
      user={user}
      name={name}
      type={DRAFT_TYPE.REPORT}
      style={styles.icon}
    />
    <MapIcon style={styles.icon} editable />
  </View>
)

const handleOnPress = (item, role, setDraftReport, user) => { //eslint-disable-line
  const formatStatus = capitalize(item.status)
  if (isLeadWorker(role) && isEqual(STATUS.DRAFT, formatStatus)) {
    Actions.createReport({ title: TITLE.EDIT_DRAFT,
      status: STATUS.DRAFT,
      right: () => renderRightButton(setDraftReport, user, item.documentReference),
    })
    return
  }
  openReportDetail(item, role)
}

const getSubmittedDate = (item, role) => {
  const { dateLabel, date } = ROLE_MAPPING[role.toUpperCase()]
  if (isEqual(STATUS.DRAFT, capitalize(item.status))) {
    return null
  }
  return `${dateLabel} ${formatDate(item[date])}`
}


export const ReportItem = ({ item, role, setDraftReport, user }) => { //eslint-disable-line
  const { nameLabel, name } = ROLE_MAPPING[role.toUpperCase()]
  return (
    <ItemCell
      onPress={() => handleOnPress(item, role, setDraftReport, user)}
      title={item.documentReference || item.document_reference}
      status={item.status}
      content={`${nameLabel} ${item[name]}`}
      dateDescription={getSubmittedDate(item, role)}
    />
  )
}

ReportItem.propTypes = {
  item: ReportShape.isRequired,
  role: PropTypes.string.isRequired,
  setDraftReport: PropTypes.func.isRequired,
  user: UserShape.isRequired,
}

const mapStateToProps = createStructuredSelector({
  role: roleSelector,
  user: userSelector,
})

const mapDispatchToProps = {
  setDraftReport,
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportItem)
