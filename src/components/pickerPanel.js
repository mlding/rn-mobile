import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { noop, isEmpty, isEqual } from 'lodash'
import { View, Text, StyleSheet } from 'react-native'
import { ARROW_DIRECTION, COLOR, FONT } from '../constants/styleGuide'
import Button from './button'
import Icon from './icon'
import { verticalScale } from '../utilities/responsiveDimension'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    height: verticalScale(64),
    marginTop: verticalScale(12),
    borderBottomWidth: 1,
  },
  label: {
    fontSize: FONT.MD,
  },
  content: {
    fontSize: FONT.L,
    color: COLOR.MEDIUM_BLACK,
    paddingBottom: 6,
    paddingRight: 30,
  },
  placeholder: {
    color: COLOR.BORDER,
  },
  icon: {
    position: 'absolute',
    right: 15,
    bottom: 9,
    fontSize: FONT.XS,
    color: COLOR.SILVER,
  },
})

class PickerPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isInputAreaFocused: props.isInputAreaFocused,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isInputAreaFocused !== this.state.isInputAreaFocused) {
      this.setState({ isInputAreaFocused: nextProps.isInputAreaFocused })
    }
  }

  render() {
    const {
      labelName, onPress, content, placeholder, arrowDirection, touchableWithoutFeedback,
    } = this.props
    const { isInputAreaFocused } = this.state

    return (
      <Button
        style={[styles.container,
          { borderColor: isInputAreaFocused ? COLOR.LINK : COLOR.BORDER }]}
        onPress={() => {
          onPress()
          if (!touchableWithoutFeedback) {
            this.setState({ isInputAreaFocused: true })
          }
        }}
      >
        <Text style={[styles.label, { color: isInputAreaFocused ? COLOR.LINK : COLOR.SILVER }]}>
          {labelName}
        </Text>
        <View>
          <Text
            style={isEmpty(content) ? [styles.content, styles.placeholder] : styles.content}
            numberOfLines={1}
          >
            {isEmpty(content) ? placeholder : content}
          </Text>
          {isEqual(arrowDirection, ARROW_DIRECTION.RIGHT) ?
            <Icon name="arrow-right" style={[styles.icon, { fontSize: FONT.LG }]} /> :
            <Icon name="arrow-down" style={styles.icon} />
          }
        </View>
      </Button>
    )
  }
}

PickerPanel.propTypes = {
  labelName: PropTypes.string,
  content: PropTypes.string,
  onPress: PropTypes.func,
  isInputAreaFocused: PropTypes.bool,
  placeholder: PropTypes.string,
  arrowDirection: PropTypes.string,
  touchableWithoutFeedback: PropTypes.bool,
}

PickerPanel.defaultProps = {
  labelName: '',
  content: '',
  onPress: noop,
  isInputAreaFocused: false,
  placeholder: ' ',
  arrowDirection: ARROW_DIRECTION.DOWN,
  touchableWithoutFeedback: false,
}

export default PickerPanel
