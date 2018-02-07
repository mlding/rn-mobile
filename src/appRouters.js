import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DeviceEventEmitter, StatusBar, StyleSheet, View } from 'react-native'
import { Actions, Lightbox, Router, Scene, Tabs } from 'react-native-router-flux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { noop } from 'lodash'
import SplashScreen from 'react-native-splash-screen'
import Login from './auth/login/login'
import Starter from './auth/login/starter'
import Profile from './auth/profile/profile'
import WorkItemListContainer from './work-item/list/list'
import ReportListContainer from './report/list/list'
import CreateButton from './shared/createButton'
import TabIcon from './shared/tabIcon'
import { COLOR, FONT, SHADOW_STYLE } from './constants/styleGuide'
import { TAB_BAR_LABEL, TITLE } from './constants/tab'
import ReportDetailContainer from './report/detail/detail'
import BackButton from './shared/backButton'
import MessageBar from './components/messageBar'
import SelectTitle from './report/create/selectTitle'
import RightButton from './report/create/rightButton'
import CreateReport from './report/create/create'
import ImagePreviewer from './report/components/imagePreviewer'
import EditReportContainer from './report/edit/edit'
import MaterialPickerContainer from './report/material/materialPicker'
import ModalOverlay from './components/modalOverlay'
import { showAlertBeforeBack } from './utilities/actions'
import MapContainer from './work-item/map/mapContainer'
import MapForReport from './report/components/mapForReport'
import MapIcon from './shared/mapIcon'
import { WORK_ITEMS_LIST_TYPE } from './work-item/constants'
import { SORT_PANEL_KEY } from './report/constants'
import ForgotPassword from './auth/login/forgotPassword'
import WorkItemsSearch from './work-item/search/search'
import SortButton from './report/list/sortButton'
import SortPanelContainer from './report/list/sortPanel'
import { EVENTS } from './utilities/events'
import FileViewer from './work-item/detail/fileViewer'
import ExtraWorkOrderListContainer from './extra-work-order/list/list'
import CreateExtraWorkOrder from './extra-work-order/create/create'
import EditExtraWorkOrder from './extra-work-order/edit/edit'
import AddItem from './extra-work-order/components/addItem'
import Unit from './extra-work-order/components/unit'
import MapPicker from './extra-work-order/components/mapPicker'
import DoneButton from './extra-work-order/components/doneButton'
import Description from './extra-work-order/components/description'
import ExtraWorkOrderDetail from './extra-work-order/detail/detail'
import fcmListener from './notification/fcmListener'
import { IS_ANDROID } from './utilities/systemUtil'
import ALERT_TYPE from './constants/showAlertType'
import FCMService from './notification/fcmService'
import CreateTimesheet from './timesheet/create/create'
import AddItemForTimesheet from './timesheet/components/addItem'
import FilterPanel from './work-item/filter/filterPanel'
import TimesheetDetail from './timesheet/detail/detail'
import EditTimesheet from './timesheet/edit/edit'
import SCENE_KEY from './constants/sceneKey'
import Toast from './work-item/filter/toast'
import ManagerTimesheet from './timesheet/list/managerTimesheet'
import LeadworkTimesheet from './timesheet/list/leadworkTimesheet'

const RouterWithRedux = connect()(Router)

export const styles = StyleSheet.create({
  iconLabel: {
    fontSize: FONT.SM,
  },
  navigationBar: {
    backgroundColor: COLOR.HEADER,
  },
  navTitle: {
    color: COLOR.WHITE,
    fontSize: FONT.XL,
    fontWeight: '400',
    alignSelf: 'center',
  },
  tabLabel: {
    marginBottom: 7,
  },
  tabBarStyle: {
    borderTopColor: COLOR.DARK_WHITE,
    ...SHADOW_STYLE,
  },
})

const BASIC_NAVIGATION_CONFIG = {
  backTitle: ' ',
  navigationBarStyle: styles.navigationBar,
}

const NAVIGATION_CONFIG = {
  ...BASIC_NAVIGATION_CONFIG,
  tabBarPosition: 'bottom',
  tabBarStyle: styles.tabBarStyle,
  activeTintColor: COLOR.TAB_SELECTED,
  inactiveTintColor: COLOR.TAB_UNSELECTED,
  activeBackgroundColor: COLOR.WHITE,
  inactiveBackgroundColor: COLOR.WHITE,
  titleStyle: styles.navTitle,
  labelStyle: styles.tabLabel,
  hideNavBar: true,
}

const TABS_CONFIG = {
  swipeEnabled: false,
  animationEnabled: false,
  lazy: true,
}

class AppRouters extends Component {
  componentDidMount() { // eslint-disable-line
    if (IS_ANDROID) {
      SplashScreen.hide()
    }
    fcmListener.subscribeBackgroundNotification(this.props.dispatch)
  }

  componentWillUnmount() { // eslint-disable-line
    fcmListener.unsubscribeBackrdoundNotification()
  }

  onEnterHandler = route => {
    const fcmService = new FCMService()
    fcmService.setHistoryTabs(route.tabBarLabel)
    if (route.title === TITLE.LOGIN
      || route.title === TITLE.STARTER
      || route.title === TITLE.LOGOUT) {
      StatusBar.setBarStyle('dark-content')
      return
    }
    StatusBar.setBarStyle('light-content')
  }

  resetSwipeBtn = () => {
    DeviceEventEmitter.emit(EVENTS.CLOSE_SWIPE_VIEW, {})
  }

  backAndroidHandler = () => {
    const pre = Actions.currentScene
    Actions.pop()
    const cur = Actions.currentScene
    return pre !== cur
  }

  renderPlaceholder = () => <View />

  renderBackButton = () => <BackButton />

  render() {
    return (
      <RouterWithRedux backAndroidHandler={this.backAndroidHandler}>
        <Lightbox>
          <Scene
            key="root"
            {...NAVIGATION_CONFIG}
            renderLeftButton={this.renderPlaceholder}
            renderRightButton={this.renderPlaceholder}
            panHandlers={null}
          >
            <Tabs
              key="leadWorkerTab"
              {...NAVIGATION_CONFIG}
              {...TABS_CONFIG}
            >
              <Scene
                key="leadWorkerTabWorkItems"
                icon={props => (
                  <TabIcon
                    focused={props.focused}
                    select="icon-work-hover"
                    unSelect="icon-work-normal"
                  />)}
                tabBarLabel={TAB_BAR_LABEL.WORK_ITEMS}
              >
                <Scene
                  key={SCENE_KEY.WORK_ITEMS_TAB}
                  component={MapContainer}
                  onEnter={this.onEnterHandler}
                  onExit={this.resetSwipeBtn}
                  hideNavBar
                />
              </Scene>
              <Scene
                key="leadWorkerTabWorkReport"
                tabBarLabel={TAB_BAR_LABEL.REPORT}
                icon={props => (
                  <TabIcon
                    focused={props.focused}
                    select="icon-report-hover"
                    unSelect="icon-report-normal"
                  />)}
              >
                <Scene
                  key="workerReport"
                  title={TITLE.REPORT}
                  component={() => <ReportListContainer />}
                  renderRightButton={() => <CreateButton type={TITLE.REPORT} />}
                  renderLeftButton={() => <SortButton />}
                  onEnter={this.onEnterHandler}
                  onExit={this.resetSwipeBtn}
                />
              </Scene>
              <Scene
                key="leadWorkerTabTimesheet"
                tabBarLabel={TAB_BAR_LABEL.TIME_SHEET}
                icon={props => (
                  <TabIcon
                    focused={props.focused}
                    select="icon-timesheet-highlight"
                    unSelect="icon-timesheet-normal"
                  />)}
              >
                <Scene
                  key="workerTimesheet"
                  title={TITLE.TIME_SHEET}
                  component={() => <LeadworkTimesheet />}
                  renderRightButton={() => <CreateButton type={TITLE.TIME_SHEET} />}
                  onEnter={this.onEnterHandler}
                  onExit={this.resetSwipeBtn}
                />
              </Scene>
              <Scene
                key="leadWorkerTabExtraWorkOrder"
                icon={props => (
                  <TabIcon
                    focused={props.focused}
                    select="icon-ewo-hover"
                    unSelect="icon-ewo-normal"
                  />)}
                tabBarLabel={TAB_BAR_LABEL.EXTRA_WORK}
              >
                <Scene
                  key="extraWorkOrder"
                  title={TITLE.EXTRA_WORK_ORDER}
                  component={() => <ExtraWorkOrderListContainer />}
                  onEnter={this.onEnterHandler}
                  onExit={this.resetSwipeBtn}
                  renderRightButton={() => <CreateButton type={TITLE.EXTRA_WORK_ORDER} />}
                />
              </Scene>
              <Scene
                key="leadWorkerTabWorkProfile"
                tabBarLabel={TAB_BAR_LABEL.ME}
                icon={props => (
                  <TabIcon
                    focused={props.focused}
                    select="icon-me-hover"
                    unSelect="icon-me-normal"
                  />)}
              >
                <Scene
                  key="workerMe"
                  title={TITLE.LOGOUT}
                  component={Profile}
                  onEnter={this.onEnterHandler}
                  hideNavBar
                />
              </Scene>
            </Tabs>
            <Tabs
              key="constructionManagerTab"
              {...NAVIGATION_CONFIG}
              {...TABS_CONFIG}
            >
              <Scene
                key="constructionManagerTabReport"
                tabBarLabel={TAB_BAR_LABEL.REPORT}
                icon={props => (
                  <TabIcon
                    focused={props.focused}
                    select="icon-report-hover"
                    unSelect="icon-report-normal"
                  />)}
                renderLeftButton={() => <SortButton />}
              >
                <Scene
                  key="managerReport"
                  title={TITLE.REPORT}
                  component={ReportListContainer}
                  onEnter={this.onEnterHandler}
                />
              </Scene>
              <Scene
                key="constructionManagerTabTimesheet"
                tabBarLabel={TAB_BAR_LABEL.TIME_SHEET}
                icon={props => (
                  <TabIcon
                    focused={props.focused}
                    select="icon-timesheet-highlight"
                    unSelect="icon-timesheet-normal"
                  />)}
              >
                <Scene
                  key="managerTimesheet"
                  title={TITLE.TIME_SHEET}
                  component={() => <ManagerTimesheet />}
                  onEnter={this.onEnterHandler}
                  onExit={this.resetSwipeBtn}
                  hideNavBar
                />
              </Scene>
              <Scene
                key="constructManagerTabExtraWorkOrder"
                icon={props => (
                  <TabIcon
                    focused={props.focused}
                    select="icon-ewo-hover"
                    unSelect="icon-ewo-normal"
                  />)}
                tabBarLabel={TAB_BAR_LABEL.EXTRA_WORK}
              >
                <Scene
                  key="managerExtraWorkOrder"
                  title={TITLE.EXTRA_WORK_ORDER}
                  component={() => <ExtraWorkOrderListContainer />}
                  onEnter={this.onEnterHandler}
                />
              </Scene>
              <Scene
                key="constructionManagerTabProfile"
                tabBarLabel={TAB_BAR_LABEL.ME}
                icon={props => (
                  <TabIcon
                    focused={props.focused}
                    select="icon-me-hover"
                    unSelect="icon-me-normal"
                  />)}
              >
                <Scene
                  key="managerMe"
                  title={TITLE.LOGOUT}
                  component={Profile}
                  onEnter={this.onEnterHandler}
                  hideNavBar
                />
              </Scene>
            </Tabs>
            <Scene key="managerReportDetail">
              <Scene
                key="managerReportDetail"
                title="Review Report"
                component={ReportDetailContainer}
                hideTabBar
                renderLeftButton={() => <BackButton onBack={this.props.showAlertBeforeBack} />}
                renderRightButton={() => <MapIcon />}
              />
            </Scene>
            <Scene key="reportDetail">
              <Scene
                key="reportDetail"
                title="Review Report"
                component={ReportDetailContainer}
                hideTabBar
                renderLeftButton={this.renderBackButton}
                renderRightButton={() => <MapIcon />}
              />
            </Scene>
            <Scene key="editTimesheet">
              <Scene
                key="editTimesheet"
                title="Edit Timesheet"
                component={EditTimesheet}
                hideTabBar
                renderLeftButton={() => <BackButton onBack={this.props.showAlertBeforeBack} />}
              />
            </Scene>
            <Scene key="managerTimesheetDetail">
              <Scene
                key="managerTimesheetDetail"
                title="Review Timesheet"
                component={TimesheetDetail}
                hideTabBar
                renderLeftButton={() => <BackButton onBack={this.props.showAlertBeforeBack} />}
              />
            </Scene>
            <Scene key="timesheet">
              <Scene
                key="timesheet"
                title="Review Timesheet"
                component={TimesheetDetail}
                hideTabBar
                renderLeftButton={this.renderBackButton}
              />
            </Scene>
            <Scene key="extraWorkOrderDetail">
              <Scene
                key="extraWorkOrderDetail"
                title="Review Extra Work"
                component={ExtraWorkOrderDetail}
                hideTabBar
                renderLeftButton={() => <BackButton onBack={this.props.showAlertBeforeBack} />}
              />
            </Scene>
            <Scene key="createExtraWorkOrder">
              <Scene
                key="createExtraWorkOrder"
                component={CreateExtraWorkOrder}
                renderLeftButton={() => <BackButton onBack={this.props.showAlertBeforeBack} />}
                hideTabBar
              />
            </Scene>
            <Scene key="editExtraWorkOrder">
              <Scene
                key="editExtraWorkOrder"
                component={EditExtraWorkOrder}
                renderLeftButton={() => <BackButton onBack={this.props.showAlertBeforeBack} />}
                title="Edit Extra Work"
                hideTabBar
              />
            </Scene>
            <Scene key="timesheetDetail">
              <Scene
                key="timesheetDetail"
                title="Review Timesheet"
                component={TimesheetDetail}
                hideTabBar
                renderLeftButton={() => <BackButton onBack={this.props.showAlertBeforeBack} />}
              />
            </Scene>
            <Scene key="addItem">
              <Scene
                key="addItem"
                component={AddItem}
                renderLeftButton={() => (<BackButton onBack={() =>
                  this.props.showAlertBeforeBack(ALERT_TYPE.ADD_ITEM_ALERT)}
                />)}
                hideTabBar
              />
            </Scene>
            <Scene key="unit">
              <Scene
                key="unit"
                renderLeftButton={this.renderBackButton}
                component={Unit}
                title="Unit"
                hideTabBar
              />
            </Scene>
            <Scene key="description">
              <Scene
                key="description"
                renderLeftButton={this.renderBackButton}
                component={Description}
                title="Description"
                hideTabBar
              />
            </Scene>
            <Scene key="mapPicker">
              <Scene
                key="mapPicker"
                component={MapPicker}
                renderLeftButton={() => <BackButton />}
                renderRightButton={() => <DoneButton />}
                title="Map View"
                hideTabBar
              />
            </Scene>
            <Scene key="createTimesheet">
              <Scene
                key="createTimesheet"
                component={CreateTimesheet}
                renderLeftButton={() => <BackButton onBack={this.props.showAlertBeforeBack} />}
                hideTabBar
              />
            </Scene>
            <Scene key="addItemForTimesheet">
              <Scene
                key="addItemForTimesheet"
                component={AddItemForTimesheet}
                renderLeftButton={() => (<BackButton onBack={() =>
                  this.props.showAlertBeforeBack(ALERT_TYPE.TIMESHEET_ITEM_ALERT)}
                />)}
                hideTabBar
              />
            </Scene>
            <Scene key="createReport">
              <Scene
                key="createReport"
                component={CreateReport}
                renderLeftButton={() => <BackButton onBack={this.props.showAlertBeforeBack} />}
                renderRightButton={() => <MapIcon editable />}
                hideTabBar
              />
            </Scene>
            <Scene key="editReport">
              <Scene
                key="editReport"
                component={EditReportContainer}
                renderLeftButton={() => <BackButton onBack={this.props.showAlertBeforeBack} />}
                renderRightButton={() => <MapIcon editable />}
                title="Edit Report"
                hideTabBar
              />
            </Scene>
            <Scene key="selectWorkItems">
              <Scene
                key="selectWorkItems"
                title={() => <SelectTitle />}
                renderLeftButton={this.renderBackButton}
                component={() => <WorkItemListContainer type={WORK_ITEMS_LIST_TYPE.SELECT} />}
                renderRightButton={() => <RightButton />}
                hideTabBar
              />
            </Scene>
            <Scene key="mapView">
              <Scene
                key="mapView"
                component={MapForReport}
                title="Map View"
                renderLeftButton={this.renderBackButton}
                hideTabBar
              />
            </Scene>
            <Scene key="fileViewer">
              <Scene
                key="fileViewer"
                component={FileViewer}
                hideTabBar
                renderLeftButton={() => <BackButton />}
              />
            </Scene>
            <Scene
              key="workItemsSearch"
              title="Work Items Search"
              component={WorkItemsSearch}
              hideTabBar
              hideNavBar
            />
            <Scene
              key="starter"
              title={TITLE.STARTER}
              component={Starter}
              {...NAVIGATION_CONFIG}
              onEnter={this.onEnterHandler}
              initial
            />
            <Scene
              key="login"
              component={Login}
              title={TITLE.LOGIN}
              {...NAVIGATION_CONFIG}
              onEnter={this.onEnterHandler}
            />
            <Scene
              key="forgotPassword"
              component={ForgotPassword}
              hideNavBar
              onEnter={this.onEnterHandler}
            />
            <Scene
              key="materialPicker"
              renderLeftButton={this.renderBackButton}
              component={MaterialPickerContainer}
              hideNavBar
            />
          </Scene>
          <Scene
            key={SCENE_KEY.MESSAGE_BAR}
            component={MessageBar}
            {...NAVIGATION_CONFIG}
          />
          <Scene key="modalOverlay" component={ModalOverlay} />
          <Scene key={SCENE_KEY.TOAST} component={Toast} />
          <Scene
            key="imagePreviewer"
            component={ImagePreviewer}
          />
          <Scene
            key={SORT_PANEL_KEY}
            component={SortPanelContainer}
          />
          <Scene
            key="filterPanel"
            component={FilterPanel}
          />
        </Lightbox>
      </RouterWithRedux>
    )
  }
}

AppRouters.propTypes = {
  showAlertBeforeBack: PropTypes.func,
  dispatch: PropTypes.func.isRequired,
}

AppRouters.defaultProps = {
  showAlertBeforeBack: noop,
}

const mapDispatchToProps = dispatch => ({
  showAlertBeforeBack: bindActionCreators(showAlertBeforeBack, dispatch),
  dispatch: dispatch,
})

export default connect(null, mapDispatchToProps)(AppRouters)
