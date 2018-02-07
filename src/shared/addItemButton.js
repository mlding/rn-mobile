import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'
import { noop, isEqual } from 'lodash'
import { COLOR, FONT, FONT_WEIGHT } from '../constants/styleGuide'
import Button from '../components/button'
import { STATUS } from '../extra-work-order/constants'
import Icon from '../components/icon'

const styles = StyleSheet.create({
  button: {
    marginVertical: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 15,
    borderRadius: 2,
  },
  text: {
    color: COLOR.FADE_BLUE,
    fontSize: FONT.LG,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: {
    fontSize: FONT.SM,
    marginRight: 8,
  },
})

const AddItemButton = props => {
  let buttonStyle = styles.button
  let textStyle = styles.text
  if (props.disabled) {
    buttonStyle = [buttonStyle, { backgroundColor: COLOR.BORDER }]
    textStyle = [textStyle, { color: COLOR.WHITE }]
  } else if (props.hasBackgroundColor) {
    buttonStyle = [buttonStyle, { backgroundColor: COLOR.LINK }]
    textStyle = [textStyle, { color: COLOR.WHITE }]
  } else {
    buttonStyle = [buttonStyle, {
      backgroundColor: COLOR.WHITE,
      borderColor: COLOR.FADE_BLUE,
      borderWidth: 1,
    }]
    textStyle = [textStyle, { color: COLOR.FADE_BLUE }]
  }
  return (
    <Button
      onPress={props.onPress}
      style={buttonStyle}
      disabled={props.disabled}
      status={props.status}
      hasBackgroudColor={props.hasBackgroundColor}
    >
      <View style={styles.textWrapper}>
        {!isEqual(props.status, STATUS.EDIT) && <Icon name="add-to-item" style={[textStyle, styles.plus]} />}
        <Text style={textStyle}>
          {isEqual(props.status, STATUS.EDIT) ? 'Save' : props.addText }
        </Text>
      </View>
    </Button>
  )
}

AddItemButton.propTypes = {
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  status: PropTypes.string,
  hasBackgroundColor: PropTypes.bool,
  addText: PropTypes.string,
}

AddItemButton.defaultProps = {
  onPress: noop,
  disabled: false,
  status: '',
  hasBackgroundColor: false,
  addText: 'Add Item',
}

export default AddItemButton
