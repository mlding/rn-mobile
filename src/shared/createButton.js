import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { noop } from 'lodash'
import Icon from 'react-native-vector-icons/EvilIcons'
import { createReport } from '../report/actions'
import { COLOR } from '../constants/styleGuide'
import Button from '../components/button'
import { navButtonStyles } from './styles'
import { TITLE } from '../constants/tab'
import { createExtraWorkOrder } from '../extra-work-order/actions'
import { createTimesheet } from '../timesheet/actions'

const styles = StyleSheet.create({
  plusIcon: {
    fontSize: 32,
    color: COLOR.WHITE,
    marginTop: 1,
  },
})
const CreateButton = props => {
  let onPress
  switch (props.type) {
  case TITLE.REPORT: {
    onPress = props.createReport
    break
  }
  case TITLE.EXTRA_WORK_ORDER: {
    onPress = props.createExtraWorkOrder
    break
  }
  case TITLE.TIME_SHEET: {
    onPress = props.createTimesheet
    break
  }
  default: {
    onPress = noop
    break
  }
  }
  return (
    <Button
      onPress={onPress}
      style={navButtonStyles.buttonContainer}
    >
      <Icon name="plus" style={styles.plusIcon} />
    </Button>
  )
}

CreateButton.propTypes = {
  createReport: PropTypes.func.isRequired,
  createExtraWorkOrder: PropTypes.func.isRequired,
  createTimesheet: PropTypes.func.isRequired,
  type: PropTypes.string,
}

CreateButton.defaultProps = {
  type: '',
}

const mapDispatchToProps = {
  createReport,
  createExtraWorkOrder,
  createTimesheet,
}

export default connect(null, mapDispatchToProps)(CreateButton)
