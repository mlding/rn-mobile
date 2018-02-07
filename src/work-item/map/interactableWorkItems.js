import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Animated, Dimensions, SectionList, StyleSheet, Text, View } from 'react-native'
import { isEmpty, noop } from 'lodash'
import Interactable from 'react-native-interactable'
import {
  COLOR, FONT, PANEL_HEADER_HEIGHT, SHADOW_STYLE, INTERACTABLE_MARGIN, TAB_BAR_HEIGHT,
  WORK_ITEM_HEIGHT, Z_INDEX,
} from '../../constants/styleGuide'
import { ListSeparator } from '../../components/separator'
import { WorkItemShape } from '../../shared/shape'
import { getWorkItemSections } from '../utilities'
import SectionHeader from '../list/sectionHeader'
import SwipedWorkItemCell from '../../shared/swipedWorkItemCell'
import Button from '../../components/button'
import Icon from '../../components/icon'
import ListFooter from '../../components/listFooter'
import { MAP_ICONS_MARGIN_BOTTOM } from '../../constants/map'
import WorkItemDetail from '../detail/detail'
import { IS_ANDROID } from '../../utilities/systemUtil'
import { FILTER_BAR_HEIGHT } from '../filter/constants'
import EmptyPage from '../../components/emptyPage'

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height - INTERACTABLE_MARGIN,
}

const IOS_INTERACTABLE_DELTA = 11
const TOP_POSITION = 18

export const SNAP_POSITION_INDEX = {
  TOP: 0,
  MIDDLE: 1,
  BOTTOM: 2,
}

const HEADER_TITLE = {
  DETAIL: 'Work Item Detail',
  LIST: 'Work Item List',
}

const ICONS_TO_TOP_MARGIN = 80

const PANEL_HANDLE_WIDTH = 37
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.DARK_WHITE,
    zIndex: 1,
    ...SHADOW_STYLE,
  },
  emptyContainer: {
    opacity: 0,
    zIndex: -1,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    paddingLeft: 10,
    height: PANEL_HEADER_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.DARK_WHITE,
  },
  panelHandle: {
    position: 'absolute',
    top: 8,
    left: (Screen.width - PANEL_HANDLE_WIDTH) / 2,
    width: PANEL_HANDLE_WIDTH,
    height: 5,
    borderRadius: 4,
    backgroundColor: '#d7dde6',
    zIndex: Z_INDEX.NORMAL,
  },
  title: {
    fontSize: FONT.LG,
    color: COLOR.MEDIUM_BLACK,
    flex: 1,
  },
  closeButton: {
    height: PANEL_HEADER_HEIGHT,
    padding: 22,
    marginRight: -12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: FONT.MD,
    color: COLOR.MEDIUM_GREY,
  },
})

class InteractableWorkItems extends PureComponent {
  constructor(props) {
    super(props)
    this.interactableRef = null
    this.snapPosition = {
      TOP: TOP_POSITION,
      MIDDLE: this.getInteractablePosition(PANEL_HEADER_HEIGHT + (2 * WORK_ITEM_HEIGHT)),
      BOTTOM: this.getInteractablePosition(PANEL_HEADER_HEIGHT),
    }
    this.deltaY = new Animated.Value(this.snapPosition.BOTTOM)
    this.snapPoints = [
      { y: this.snapPosition.TOP },
      { y: this.snapPosition.MIDDLE },
      { y: this.snapPosition.BOTTOM },
    ]
    this.state = {
      scrollEnabled: false,
    }
    this.contentMaxHeightStyle = {
      maxHeight: this.getInteractablePosition(PANEL_HEADER_HEIGHT + TOP_POSITION),
    }
  }

  getInteractablePosition = (margin = 0) => {
    const extraSpace = this.props.isReportEntrance ? 0 : FILTER_BAR_HEIGHT + TAB_BAR_HEIGHT
    const marginSpace = margin + extraSpace
    return IS_ANDROID ? Screen.height - marginSpace :
      (Screen.height - marginSpace) + IOS_INTERACTABLE_DELTA
  }

  get headerTitle() {
    const { listVisibility, workItems, selectedWorkItem } = this.props
    if (selectedWorkItem) return HEADER_TITLE.DETAIL
    if (listVisibility) return HEADER_TITLE.LIST
    return (workItems.length === 1) ? HEADER_TITLE.DETAIL : `${workItems.length} Work Items`
  }

  getAnimatedStyle = () => ({
    opacity: this.deltaY.interpolate({
      inputRange: [this.snapPosition.TOP + ICONS_TO_TOP_MARGIN, this.snapPosition.MIDDLE],
      outputRange: [0, 1],
    }),
    bottom: this.deltaY.interpolate({
      inputRange: [this.snapPosition.TOP, this.snapPosition.MIDDLE, this.snapPosition.BOTTOM],
      outputRange: [
        Screen.height - this.snapPosition.TOP - INTERACTABLE_MARGIN - ICONS_TO_TOP_MARGIN,
        PANEL_HEADER_HEIGHT + (2 * WORK_ITEM_HEIGHT) + MAP_ICONS_MARGIN_BOTTOM,
        MAP_ICONS_MARGIN_BOTTOM + PANEL_HEADER_HEIGHT,
      ],
    }),
  })

  snapToIndex = index => {
    this.interactableRef.snapTo({ index })
  }

  handleSnap = ({ nativeEvent }) => {
    const { index } = nativeEvent
    const isTop = index === 0
    this.setState({
      scrollEnabled: isTop,
    })
  }

  renderHeader() {
    return (
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
        <Text style={styles.title}>{this.headerTitle}</Text>
        <Button
          onPress={this.props.onClose}
          style={styles.closeButton}
          debounceMillisecond={50}
        >
          <Icon name="close" style={styles.icon} />
        </Button>
      </View>
    )
  }

  renderContent() {
    const { workItems, rowId, onChangeRowId, listVisibility, isReportEntrance } = this.props
    const { scrollEnabled } = this.state
    const { selectedWorkItem, onWorkItemCellPress } = this.props
    if ((!listVisibility && workItems.length === 1) || selectedWorkItem) {
      return (
        <WorkItemDetail
          style={this.contentMaxHeightStyle}
          workItemDetail={selectedWorkItem || workItems[0]}
          scrollEnabled={scrollEnabled}
          shouldShowDraftButton={isReportEntrance}
        />
      )
    }

    if (listVisibility && isEmpty(workItems)) {
      return <EmptyPage label="Work Item" style={{ maxHeight: this.snapPosition.BOTTOM - PANEL_HEADER_HEIGHT }} />
    }

    return (
      <SectionList
        bounces={false}
        style={this.contentMaxHeightStyle}
        keyExtractor={workItem => workItem.id}
        sections={getWorkItemSections(workItems)}
        scrollEnabled={scrollEnabled}
        ItemSeparatorComponent={ListSeparator}
        renderItem={({ item }) =>
          (<SwipedWorkItemCell
            item={item}
            onChangeRowId={onChangeRowId}
            rowId={rowId}
            onPress={() => onWorkItemCellPress(item)}
            shouldShowAllFromToText={false}
          />)
        }
        renderSectionHeader={({ section }) =>
          <SectionHeader title={section.title} date={section.dueDate} />
        }
        ListFooterComponent={() => <ListFooter />}
      />
    )
  }

  render() {
    const { workItems, listVisibility } = this.props

    return (
      <Interactable.View
        style={(isEmpty(workItems) && !listVisibility) ? styles.emptyContainer : styles.container}
        verticalOnly
        snapPoints={this.snapPoints}
        boundaries={{ top: TOP_POSITION, bounce: 0.5 }}
        initialPosition={{ y: Screen.height }}
        animatedValueY={this.deltaY}
        onSnap={this.handleSnap}
        ref={ref => { this.interactableRef = ref }}
      >
        <View style={{ height: this.getInteractablePosition(TOP_POSITION) }}>
          {this.renderHeader()}
          {this.renderContent()}
        </View>
      </Interactable.View>
    )
  }
}

InteractableWorkItems.propTypes = {
  workItems: PropTypes.arrayOf(WorkItemShape),
  selectedWorkItem: WorkItemShape,
  rowId: PropTypes.number,
  listVisibility: PropTypes.bool,
  onChangeRowId: PropTypes.func,
  onClose: PropTypes.func,
  onWorkItemCellPress: PropTypes.func,
  isReportEntrance: PropTypes.bool,
}

InteractableWorkItems.defaultProps = {
  workItems: [],
  selectedWorkItem: null,
  rowId: null,
  listVisibility: false,
  onChangeRowId: noop,
  onClose: noop,
  onWorkItemCellPress: noop,
  isReportEntrance: false,
}

export default InteractableWorkItems
