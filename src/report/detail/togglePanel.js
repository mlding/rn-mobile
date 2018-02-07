import React, { Component } from 'react'
import { LayoutAnimation, View } from 'react-native'
import PropTypes from 'prop-types'
import { noop } from 'lodash'
import { EXPAND_ITEM_ANIMA } from '../../utilities/animaUtil'
import { StyleShape } from '../../shared/shape'

class TogglePanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
    }
  }

  toggle = () => {
    LayoutAnimation.configureNext(EXPAND_ITEM_ANIMA)
    const next = !this.state.expanded
    this.setState({ expanded: next })
  }

  isExpanded = () => this.state.expanded

  render() {
    return (
      <View style={this.props.style}>
        <View>
          {this.props.getStableView(this)}
        </View>
        {this.state.expanded && this.props.children}
      </View>
    )
  }
}

TogglePanel.propTypes = {
  style: StyleShape,
  children: PropTypes.node,
  getStableView: PropTypes.func,
}

TogglePanel.defaultProps = {
  style: null,
  getStableView: noop,
  children: null,
}

export default TogglePanel
