import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { noop } from 'lodash'
import { BOTTOM_BUTTON_HEIGHT, COLOR, FONT, FONT_WEIGHT } from '../constants/styleGuide'
import Button from '../components/button'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLOR.BORDER_GREY,
    backgroundColor: COLOR.WHITE,
  },
  draftView: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    height: BOTTOM_BUTTON_HEIGHT,
    backgroundColor: COLOR.WHITE,
  },
  draft: {
    fontSize: FONT.LG,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  submitView: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    height: BOTTOM_BUTTON_HEIGHT,
  },
  submit: {
    fontSize: FONT.LG,
    color: COLOR.WHITE,
    fontWeight: FONT_WEIGHT.BOLD,
  },
})

const SubmitButtonGroup = props => (
  <View style={styles.container}>
    <Button
      onPress={props.isDraftButtonActive ? props.onSaveDraft : noop}
      style={styles.draftView}
    >
      <Text style={[styles.draft,
        { color: props.isDraftButtonActive ? COLOR.FADE_BLUE : COLOR.BORDER }]}
      >Save as Draft</Text>
    </Button>
    <Button
      onPress={props.isSubmittedButtonActive ? props.onSubmit : noop}
      style={[styles.submitView,
        { backgroundColor: props.isSubmittedButtonActive ? COLOR.LINK : COLOR.BORDER }]}
    >
      <Text style={styles.submit}>Submit</Text>
    </Button>
  </View>
)

SubmitButtonGroup.propTypes = {
  onSaveDraft: PropTypes.func,
  onSubmit: PropTypes.func,
  isSubmittedButtonActive: PropTypes.bool,
  isDraftButtonActive: PropTypes.bool,
}

SubmitButtonGroup.defaultProps = {
  onSaveDraft: noop,
  onSubmit: noop,
  isSubmittedButtonActive: false,
  isDraftButtonActive: true,
}

export default SubmitButtonGroup
