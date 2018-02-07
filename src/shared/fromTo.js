import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEqual, noop, size } from 'lodash'
import { View, Text, StyleSheet, Keyboard } from 'react-native'
import Icon from '../components/icon'
import { COLOR, FONT, FONT_WEIGHT } from '../constants/styleGuide'
import TextField from '../components/textField'
import { getShowText } from '../utilities/dataProcessUtils'

const styles = StyleSheet.create({
  text: {
    fontSize: FONT.MD,
    color: COLOR.MEDIUM_BLACK,
    fontWeight: FONT_WEIGHT.LIGHT,
    maxWidth: 138,
  },
  textLimited: {
    maxWidth: 75,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 5,
    marginHorizontal: 5,
    color: COLOR.SILVER,
    transform: [{ rotate: '-90deg' }],
  },
  fromToTextEdit: {
    fontSize: FONT.MD,
    color: COLOR.MEDIUM_BLACK,
    width: 118,
  },
})

const LABEL = {
  FROM: 'from',
  TO: 'to',
}

const MAX_LENGTH_OF_FROM_TO_FIELD = 16

const checkFromToText = (text, old) => {
  if (size(text) < size(old)) {
    return true
  }
  const regx = /^[A-Za-z0-9]*$/
  return regx.test(text)
}

export default class FromTo extends Component {

  constructor(props) {
    super(props)
    this.state = {
      from: this.props.fromValue,
      to: this.props.toValue,
    }
  }

  componentDidMount() {
    if (this.props.editable) {
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.onKeyboardIdiHide)
    }
  }

  onKeyboardIdiHide = () => {
    if (this.fromRef && this.fromRef.isFocused()) {
      this.handleInputEnd(this.props.onFromTextChanged, LABEL.FROM)
    } else if (this.toRef && this.toRef.isFocused()) {
      this.handleInputEnd(this.props.onToTextChanged, LABEL.TO)
    }
  }

  componentWillUnMount() {
    if (this.keyboardDidHideListener) {
      this.keyboardDidHideListener.remove()
    }
  }

  handleInputChange = (text, old, label) => {
    if (checkFromToText(text, old)) {
      if (isEqual(label, LABEL.FROM)) {
        this.setState({ from: text })
      } else if (isEqual(label, LABEL.TO)) {
        this.setState({ to: text })
      }
    }
  }

  handleInputEnd = (onTextChanged, label) => {
    if (isEqual(label, LABEL.FROM)) {
      onTextChanged(this.state.from)
    } else if (isEqual(label, LABEL.TO)) {
      onTextChanged(this.state.to)
    }
  }

  renderText = text => (
    <Text
      style={[styles.text, !this.props.shouldShowAllFromToText && styles.textLimited]}
      numberOfLines={this.props.shouldShowAllFromToText ? 0 : 1}
    >
      { getShowText(text) }
    </Text>
  )

  render() {
    const { fromValue, toValue, editable, onFromTextChanged, onToTextChanged } = this.props
    if (editable) {
      return (
        <View style={styles.container}>
          <TextField
            ref={ref => { this.fromRef = ref }}
            style={styles.fromToTextEdit}
            focusBorderColor={COLOR.LINK}
            value={this.state.from}
            maxLength={MAX_LENGTH_OF_FROM_TO_FIELD}
            onChangeText={text => this.handleInputChange(text, this.state.from, LABEL.FROM)}
            onBlur={() => this.handleInputEnd(onFromTextChanged, LABEL.FROM)}
          />
          <Icon
            name="triangle"
            style={styles.icon}
          />
          <TextField
            ref={ref => { this.toRef = ref }}
            style={styles.fromToTextEdit}
            focusBorderColor={COLOR.LINK}
            value={this.state.to}
            maxLength={MAX_LENGTH_OF_FROM_TO_FIELD}
            onChangeText={text => this.handleInputChange(text, this.state.to, LABEL.TO)}
            onBlur={() => this.handleInputEnd(onToTextChanged, LABEL.TO)}
          />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        {this.renderText(fromValue)}
        <Icon name="triangle" style={styles.icon} />
        {this.renderText(toValue)}
      </View>
    )
  }
}

FromTo.propTypes = {
  fromValue: PropTypes.string,
  toValue: PropTypes.string,
  editable: PropTypes.bool,
  onFromTextChanged: PropTypes.func,
  onToTextChanged: PropTypes.func,
  shouldShowAllFromToText: PropTypes.bool,
}

FromTo.defaultProps = {
  fromValue: '',
  toValue: '',
  editable: false,
  onFromTextChanged: noop,
  onToTextChanged: noop,
  shouldShowAllFromToText: true,
}
