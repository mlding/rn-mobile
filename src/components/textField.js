import React, { PureComponent } from 'react'
import { keys, noop, omit } from 'lodash'
import PropTypes from 'prop-types'
import { StyleSheet, TextInput } from 'react-native'
import { COLOR } from '../constants/styleGuide'
import { StyleShape } from '../shared/shape'

const styles = StyleSheet.create({
  input: {
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.BORDER,
  },
})

export default class TextField extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      borderColor: this.props.defaultBorderColor,
    }
  }

  setFocusStyle = focused => {
    const { focusBorderColor, defaultBorderColor } = this.props
    const focusStyle = focused ? focusBorderColor : defaultBorderColor
    this.setState({ borderColor: focusStyle })
  }

  getStyle = () => {
    const { style, showUnderLine } = this.props
    return [showUnderLine ? styles.input : null,
      style, { borderBottomColor: this.state.borderColor }]
  }

  handleFocus = () => {
    const { onFocus, value } = this.props
    if (onFocus) {
      onFocus(value)
    }
    this.setFocusStyle(true)
  }

  handleBlur = () => {
    this.props.onBlur()
    this.setFocusStyle(false)
  }

  focus = () => {
    this.textInputRef.focus()
  }

  isFocused = () => this.textInputRef.isFocused()

  render() {
    const {
      onChangeText,
      secureTextEntry,
      placeholder,
      value,
      keyboardType,
      returnKeyType,
      onSubmitEditing,
      clearButtonMode,
      maxLength,
      editable,
      placeholderTextColor,
      multiline,
      autoFocus,
    } = this.props

    const others = omit(this.props, keys(TextField.propTypes))
    return (
      <TextInput
        ref={ref => { this.textInputRef = ref }}
        value={value}
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        underlineColorAndroid="transparent"
        clearButtonMode={clearButtonMode}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onChangeText={text => onChangeText(text)}
        style={this.getStyle()}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        maxLength={maxLength}
        editable={editable}
        placeholderTextColor={placeholderTextColor}
        multiline={multiline}
        allowFontScaling={false}
        {...others}
      />
    )
  }
}

TextField.propTypes = {
  focusBorderColor: PropTypes.string,
  defaultBorderColor: PropTypes.string,
  placeholder: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  value: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  style: StyleShape,
  keyboardType: PropTypes.string,
  returnKeyType: PropTypes.string,
  onSubmitEditing: PropTypes.func,
  clearButtonMode: PropTypes.string,
  maxLength: PropTypes.number,
  editable: PropTypes.bool,
  placeholderTextColor: PropTypes.string,
  multiline: PropTypes.bool,
  autoFocus: PropTypes.bool,
  showUnderLine: PropTypes.bool,
  inputRef: PropTypes.func,
}

TextField.defaultProps = {
  focusBorderColor: COLOR.HEADER,
  defaultBorderColor: COLOR.BORDER,
  placeholder: null,
  secureTextEntry: false,
  value: null,
  onChangeText: noop,
  onBlur: noop,
  onFocus: null,
  style: null,
  keyboardType: 'default',
  returnKeyType: 'done',
  onSubmitEditing: noop,
  clearButtonMode: 'never',
  maxLength: 128,
  editable: true,
  placeholderTextColor: null,
  multiline: false,
  autoFocus: false,
  showUnderLine: true,
  inputRef: noop,
}

