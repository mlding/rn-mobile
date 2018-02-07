import React from 'react'
import { Text, StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import { noop } from 'lodash'
import { BOTTOM_BUTTON_HEIGHT, COLOR, FONT, FONT_WEIGHT } from '../constants/styleGuide'
import Button from '../components/button'

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.WHITE,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.BORDER,
    height: BOTTOM_BUTTON_HEIGHT,
  },
  buttonText: {
    fontSize: FONT.LG,
    color: COLOR.WHITE,
    fontWeight: FONT_WEIGHT.BOLD,
    textAlign: 'center',
  },
})

const SubmitButton = props => (
  <View style={styles.container}>
    <Button
      onPress={props.isButtonActive ? props.onSubmit : noop}
      style={[styles.button, { backgroundColor: props.isButtonActive ? COLOR.LINK : COLOR.BORDER }]}
    >
      <Text style={styles.buttonText}>Submit</Text>
    </Button>
  </View>
)

SubmitButton.propTypes = {
  onSubmit: PropTypes.func,
  isButtonActive: PropTypes.bool,
}

SubmitButton.defaultProps = {
  onSubmit: noop,
  isButtonActive: false,
}

export default SubmitButton
