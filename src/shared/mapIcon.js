import React from 'react'
import { StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { isEmpty } from 'lodash'
import Button from '../components/button'
import { navButtonStyles } from './styles'
import { StyleShape, WorkItemShape } from './shape'
import { COLOR, OPACITY } from '../constants/styleGuide'
import Icon from '../components/icon'
import { SHOW_MAP_MODE } from '../report/constants'

const styles = StyleSheet.create({
  icon: {
    fontSize: 20,
    color: COLOR.WHITE,
  },
})

const redirectReportMapForView = () =>
  Actions.mapView({ mode: SHOW_MAP_MODE.VIEW, isReportEntrance: true })

const redirectReportMapForEdit = () =>
  Actions.mapView({ mode: SHOW_MAP_MODE.EDIT, isReportEntrance: true })

const MapIcon = props => {
  const { originWorkItems, style, editable } = props
  const disabled = editable && isEmpty(originWorkItems)
  const disableStyle = disabled ? { opacity: OPACITY.DISABLED } : { opacity: OPACITY.NORMAL }
  return (
    <Button
      onPress={editable ? redirectReportMapForEdit : redirectReportMapForView}
      disabled={disabled}
      style={navButtonStyles.buttonContainer}
    >
      <Icon name="map-DPR" style={[styles.icon, disableStyle, style]} />
    </Button>
  )
}

MapIcon.propTypes = {
  originWorkItems: PropTypes.arrayOf(WorkItemShape).isRequired,
  style: StyleShape,
  editable: PropTypes.bool,
}

MapIcon.defaultProps = {
  style: null,
  editable: false,
}

const mapStateToProps = state => ({
  originWorkItems: state.reportForm.originWorkItems,
})

export default connect(mapStateToProps, null)(MapIcon)
