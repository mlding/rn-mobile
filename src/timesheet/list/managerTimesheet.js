import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import {
  viewModeSelector,
} from '../selector'
import NavigationBar from '../../components/navigationBar'
import CreateButton from '../../shared/createButton'
import SwitchTab from './switchTab'
import { TITLE } from '../../constants/tab'
import { VIEW_MODE } from '../constants'
import { WindowWidth, scale } from '../../utilities/responsiveDimension'
import { SimpleSwitchView } from '../../components/simpleSwitchView'
import LeadWorkerTimesheetList from './leadworkerTimesheetList'
import ManagerTimesheetList from './managerTimesheetList'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholder: {
    width: scale(55),
  },
})

class ManagerTimesheet extends Component {

  getSelectListIndex = () => [VIEW_MODE.APPROVAL, VIEW_MODE.CREATOR].indexOf(this.props.viewMode)

  renderNavBar = () => (
    <NavigationBar style={styles.navigationBar}>
      <View style={styles.placeholder} />
      <SwitchTab />
      <CreateButton type={TITLE.TIME_SHEET} />
    </NavigationBar>
    )

  renderList = () => (
    <SimpleSwitchView
      childWidth={WindowWidth()}
      selectIndex={this.getSelectListIndex()}
    >
      <ManagerTimesheetList />
      <LeadWorkerTimesheetList />
    </SimpleSwitchView>
      )


  render() {
    return (
      <View style={styles.container}>
        {this.renderNavBar()}
        {this.renderList()}
      </View>
    )
  }
}

ManagerTimesheet.propTypes = {
  viewMode: PropTypes.string,
}

ManagerTimesheet.defaultProps = {
  viewMode: '',
}

const mapStateToProps = createStructuredSelector({
  viewMode: viewModeSelector,
})

export default connect(mapStateToProps)(ManagerTimesheet)
