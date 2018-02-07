import React, { Component } from 'react'
import { DeviceEventEmitter, View } from 'react-native'
import { isEmpty, pick } from 'lodash'
import PropTypes from 'prop-types'
import Swipeout from 'react-native-swipeout'
import { EVENTS } from '../utilities/events'
import { COLOR, SWIPE_SENSITIVITY } from '../constants/styleGuide'
import { deleteDraftPrompt, swipeBtns } from './swipeOutUtils'
import { ListSeparator } from '../components/separator'
import { ExtraWorkOrderDraftShape, ReportShape } from '../shared/shape'
import { DELETE_DRAFT } from './constants'

class SwipeDraft extends Component {
  constructor(props) {
    super(props)
    this.state = {
      draftOpen: false,
    }
  }

  componentDidMount() {
    this.swipeViewSubscription = DeviceEventEmitter.addListener(
      EVENTS.CLOSE_SWIPE_VIEW,
      () => {
        this.setState({ draftOpen: false })
      })
  }

  componentWillUnmount() {
    if (this.swipeViewSubscription) {
      this.swipeViewSubscription.remove()
    }
  }

  render() {
    const { draft } = this.props
    if (isEmpty(draft)) {
      return null
    }
    const deleteDraftArgs = pick(this.props, ['draft', 'setDraft', 'user', 'type', 'name'])
    return (
      <View>
        <Swipeout
          right={swipeBtns(DELETE_DRAFT, COLOR.RED, deleteDraftPrompt, deleteDraftArgs)}
          backgroundColor={COLOR.TRANSPARENT}
          close={!this.state.draftOpen}
          sensitivity={SWIPE_SENSITIVITY}
        >
          {this.props.children}
        </Swipeout>
        <ListSeparator />
      </View>
    )
  }
}

SwipeDraft.propTypes = {
  draft: PropTypes.oneOfType([
    ExtraWorkOrderDraftShape,
    ReportShape,
  ]),
  children: PropTypes.node,
}

SwipeDraft.defaultProps = {
  draft: null,
  children: null,
}

export default SwipeDraft
