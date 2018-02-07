import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { noop, isEmpty } from 'lodash'
import { View, Text, StyleSheet } from 'react-native'
import { COLOR, FONT } from '../constants/styleGuide'
import TextField from './textField'
import { IS_IOS } from '../utilities/systemUtil'
import Button from './button'
import { StyleShape } from '../shared/shape'

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  label: {
    fontSize: FONT.MD,
  },
  text: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: IS_IOS ? 12 : 0,
    marginBottom: IS_IOS ? 6 : -6,
  },
  preText: {
    fontSize: FONT.L,
    color: COLOR.MEDIUM_BLACK,
    marginRight: 6,
  },
  value: {
    flex: 1,
    fontSize: FONT.L,
    color: COLOR.MEDIUM_BLACK,
    marginLeft: IS_IOS ? 0 : -5,
  },
})

class LabelTextInput extends Component {

  state = {
    isTextInputFocused: false,
  }

  updateLabelState = (callback, isTextInputFocused) => {
    callback(this.props.text)
    this.setState({
      isTextInputFocused,
    })
  }

  render() {
    const { labelName, editable, onFocus, onBlur, labelColor, textStyle,
      maxTextInputLength, placeholder, onChangeText, text, multiline,
      keyboardType, preText, secureTextEntry, autoFocus, style, labelStyle } = this.props
    const { isTextInputFocused } = this.state

    return (
      <Button
        style={[styles.container,
          { borderBottomColor: isTextInputFocused ? COLOR.LINK : COLOR.BORDER }, style]}
        onPress={() => this.textFieldInput.focus()}
      >
        {!isEmpty(labelName) &&
          <Text
            style={
              [styles.label, labelStyle, { color: isTextInputFocused ? COLOR.LINK : labelColor }]}
          >
            {labelName}
          </Text>
        }
        <View style={styles.text}>
          {!isEmpty(preText) && <Text style={styles.preText}>{preText}</Text> }
          <TextField
            ref={ref => { this.textFieldInput = ref }}
            style={[styles.value, textStyle]}
            editable={editable}
            focusBorderColor={COLOR.LINK}
            maxLength={maxTextInputLength}
            onFocus={() => {
              this.updateLabelState(onFocus, true)
            }}
            onBlur={() => {
              this.updateLabelState(onBlur, false)
            }}
            value={text}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={COLOR.BORDER}
            clearButtonMode="while-editing"
            multiline={multiline}
            keyboardType={keyboardType}
            showUnderLine={false}
            secureTextEntry={secureTextEntry}
            autoFocus={autoFocus}
          />
        </View>
      </Button>

    )
  }
}

LabelTextInput.propTypes = {
  labelName: PropTypes.string,
  editable: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  maxTextInputLength: PropTypes.number,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  onChangeText: PropTypes.func,
  labelColor: PropTypes.string,
  keyboardType: PropTypes.string,
  multiline: PropTypes.bool,
  textStyle: StyleShape,
  preText: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  autoFocus: PropTypes.bool,
  style: StyleShape,
  labelStyle: StyleShape,
}

LabelTextInput.defaultProps = {
  labelName: '',
  editable: true,
  onFocus: noop,
  onBlur: noop,
  maxTextInputLength: 256,
  text: '',
  placeholder: '',
  onChangeText: noop,
  labelColor: COLOR.SILVER,
  keyboardType: 'default',
  multiline: false,
  textStyle: {},
  preText: '',
  secureTextEntry: false,
  autoFocus: false,
  style: null,
  labelStyle: null,
}

export default LabelTextInput
