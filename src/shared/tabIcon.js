import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Icon from '../components/icon'
import { COLOR } from '../constants/styleGuide'
import { StyleShape } from './shape'

export default class TabIcon extends PureComponent {
  get iconName() {
    return this.props.focused ? this.props.select : this.props.unSelect
  }

  get iconStyle() {
    return {
      color: this.props.focused ? COLOR.TAB_SELECTED : COLOR.TAB_UNSELECTED,
      fontSize: 17,
      marginTop: 5,
    }
  }

  render() {
    return (
      <Icon
        name={this.iconName}
        style={[this.iconStyle, this.props.style]}
      />
    )
  }
}

TabIcon.propTypes = {
  focused: PropTypes.bool,
  select: PropTypes.string,
  unSelect: PropTypes.string,
  style: StyleShape,
}

TabIcon.defaultProps = {
  focused: false,
  select: '',
  unSelect: '',
  style: null,
}
