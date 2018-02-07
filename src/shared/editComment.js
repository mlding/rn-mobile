import React from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import { noop } from 'lodash'
import { COLOR } from '../constants/styleGuide'
import LabelTextInput from '../components/labelTextInput'
import { StyleShape } from './shape'

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: 15,
  },
  endSeparator: {
    height: 5,
    backgroundColor: COLOR.DARK_WHITE,
  },
  commentContainer: {
    borderBottomWidth: 0,
  },
})

const EditComment = props => (
  <View style={props.style}>
    <View style={styles.container}>
      <LabelTextInput
        labelName="My Comment"
        text={props.flagText}
        placeholder="Optional (Required when flag)"
        onChangeText={props.onChangeText}
        style={styles.commentContainer}
      />
    </View>
    <View style={styles.endSeparator} />
  </View>
)

EditComment.propTypes = {
  flagText: PropTypes.string,
  style: StyleShape,
  onChangeText: PropTypes.func,
}

EditComment.defaultProps = {
  flagText: '',
  style: null,
  onChangeText: noop,
}

export default EditComment
