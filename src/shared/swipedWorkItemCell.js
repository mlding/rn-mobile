import React, { Component } from 'react'
import Swipeout from 'react-native-swipeout'
import { assign, includes, isEmpty, noop } from 'lodash'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { StyleSheet, Text } from 'react-native'
import { createStructuredSelector } from 'reselect'
import WorkItemCell from './workItemCell'
import { updateWorkItemInDraft, swipeBtns } from '../draft/swipeOutUtils'
import { isInDraft } from '../work-item/utilities'
import { COLOR, FONT, SWIPE_SENSITIVITY } from '../constants/styleGuide'
import { ReportShape, UserShape, WorkItemShape } from './shape'
import { userSelector } from '../auth/selector'
import { draftReportSelector } from '../draft/selector'
import { setDraftReport } from '../draft/actions'
import SelectIcon from './selectIcon'
import Icon from '../components/icon'
import { selectedIdsSelector } from '../work-item/selector'
import { productReportLinesIdsSelector } from '../report/selector'
import { toggleSelectedById } from '../work-item/actions'
import { ADD_TO_DRAFT_REPORT } from '../draft/constants'


const styles = StyleSheet.create({
  addedText: {
    fontSize: FONT.MD,
    color: COLOR.SILVER,
  },
  draftIcon: {
    fontSize: FONT.XL,
    color: COLOR.GREEN,
  },
})

class SwipedWorkItemCell extends Component {
  get isInDraft() {
    const { draft, item } = this.props
    return (!isEmpty(draft) && isInDraft(draft, item))
  }

  handleWorkItemPress = () => {
    const { isSelectList, item } = this.props
    if (!isSelectList) {
      this.props.onPress()
      return
    }
    this.props.toggleSelectedById(item.id)
  }

  isWorkItemAdded = () => includes(this.props.addedIds, this.props.item.id)

  renderWorkItemRightArea = () => {
    const { item, selectedIds } = this.props
    if (this.isWorkItemAdded(item)) {
      return <Text style={styles.addedText}>Added</Text>
    }
    return <SelectIcon selected={includes(selectedIds, item.id)} />
  }

  renderDraftIcon = () => (
    this.isInDraft ? <Icon name="draft" style={styles.draftIcon} /> : null
  )

  renderRightArea = () => (
    this.props.isSelectList ? this.renderWorkItemRightArea() : this.renderDraftIcon()
  )

  render() {
    const { item, isSelectList, draft, user, onChangeRowId, shouldShowAllFromToText } = this.props
    const addWorkItemToDraftArgs = assign(
      { item, user, draft },
      { setDraftReport: this.props.setDraftReport },
    )
    return (
      <Swipeout
        right={swipeBtns(ADD_TO_DRAFT_REPORT, COLOR.LINK, updateWorkItemInDraft,
          addWorkItemToDraftArgs, this.isInDraft)}
        backgroundColor={COLOR.TRANSPARENT}
        disabled={isSelectList}
        autoClose
        rowID={item.id}
        close={!(this.props.rowId === item.id)}
        onOpen={(sectionId, rowId) => onChangeRowId(rowId)}
        scroll={this.props.onScroll}
        sensitivity={SWIPE_SENSITIVITY}
      >
        <WorkItemCell
          item={item}
          linesOfName={1}
          shouldShowAllFromToText={shouldShowAllFromToText}
          renderRightArea={this.renderRightArea}
          onPress={
          (isSelectList && this.isWorkItemAdded()) ?
            noop : () => this.handleWorkItemPress()
        }
        />
      </Swipeout>
    )
  }
}

SwipedWorkItemCell.propTypes = {
  item: WorkItemShape,
  setDraftReport: PropTypes.func.isRequired,
  toggleSelectedById: PropTypes.func.isRequired,
  draft: ReportShape,
  user: UserShape,
  isSelectList: PropTypes.bool,
  selectedIds: PropTypes.arrayOf(PropTypes.number),
  addedIds: PropTypes.arrayOf(PropTypes.number),
  rowId: PropTypes.number,
  onChangeRowId: PropTypes.func,
  onScroll: PropTypes.func,
  onPress: PropTypes.func,
  shouldShowAllFromToText: PropTypes.bool,
}

SwipedWorkItemCell.defaultProps = {
  draft: {},
  user: {},
  item: {},
  selectedIds: [],
  addedIds: [],
  isSelectList: false,
  rowId: null,
  onChangeRowId: noop,
  onScroll: noop,
  onPress: noop,
  shouldShowAllFromToText: true,
}

const mapStateToProps = createStructuredSelector({
  user: userSelector,
  draft: draftReportSelector,
  selectedIds: selectedIdsSelector,
  addedIds: productReportLinesIdsSelector,
})

export default connect(mapStateToProps, { toggleSelectedById, setDraftReport })(SwipedWorkItemCell)
