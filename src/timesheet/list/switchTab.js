import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { OPACITY, COLOR } from '../../constants/styleGuide'
import { VIEW_MODE } from '../constants'
import { changeViewMode } from '../actions'
import { viewModeSelector } from '../selector'
import { scale, verticalScale } from '../../utilities/responsiveDimension'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        borderRadius: 100,
        borderColor: '#d1dbe3',
        borderWidth: 1,
        overflow: 'hidden',
      },
    }),
  },
  button: {
    ...Platform.select({
      android: {
        borderColor: '#d1dbe3',
        borderWidth: 1,
      },
    }),
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(128),
    height: verticalScale(29),
  },
  buttonLeft: {
    ...Platform.select({
      android: {
        borderTopLeftRadius: 100,
        borderBottomLeftRadius: 100,
        borderRightWidth: 0,
      },
    }),
  },
  buttonRight: {
    ...Platform.select({
      android: {
        borderTopRightRadius: 100,
        borderBottomRightRadius: 100,
        borderLeftWidth: 0,
      },
    }),
  },
  activeButton: {
    backgroundColor: COLOR.TAB_ACTIVE,
  },
  text: {
    color: COLOR.TAB_ACTIVE,
    fontSize: 13,
  },
  activeText: {
    color: COLOR.HEADER,
  },
})

const getButtonStyle = (currentTab, selectedTab) => {
  if (currentTab === selectedTab) {
    return [styles.button, styles.activeButton]
  }
  return [styles.button]
}

const getTextStyle = (currentTab, selectedTab) => {
  if (currentTab === selectedTab) {
    return [styles.text, styles.activeText]
  }
  return [styles.text]
}

const SwitchTab = props => (
  <View style={styles.container}>
    <View style={styles.tabs}>
      <TouchableOpacity
        activeOpacity={OPACITY.ACTIVE}
        onPress={() => props.changeViewMode(VIEW_MODE.APPROVAL)}
        style={[styles.buttonLeft, ...getButtonStyle(VIEW_MODE.APPROVAL, props.viewMode)]}
      >
        <Text style={getTextStyle(VIEW_MODE.APPROVAL, props.viewMode)}>
          Approvals
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={OPACITY.ACTIVE}
        onPress={() => props.changeViewMode(VIEW_MODE.CREATOR)}
        style={[styles.buttonRight, ...getButtonStyle(VIEW_MODE.CREATOR, props.viewMode)]}
      >
        <Text style={getTextStyle(VIEW_MODE.CREATOR, props.viewMode)}>
          My Timesheets
        </Text>
      </TouchableOpacity>
    </View>
  </View>
)

SwitchTab.propTypes = {
  changeViewMode: PropTypes.func.isRequired,
  viewMode: PropTypes.string,
}
SwitchTab.defaultProps = {
  viewMode: VIEW_MODE.APPROVAL,
}

const mapStateToProps = createStructuredSelector({
  viewMode: viewModeSelector,
})

const mapDispatchToProps = {
  changeViewMode: changeViewMode,
}

export default connect(mapStateToProps, mapDispatchToProps)(SwitchTab)
