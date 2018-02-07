import React from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { COLOR } from '../constants/styleGuide'
import LabelTextView from '../components/labelTextView'
import { GreySeparator } from '../components/separator'

const styles = StyleSheet.create({
  labelText: {
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GREY_BORDER,
  },
})

const CommentView = ({ title, content }) => (
  <View>
    <LabelTextView label={title} value={content} containerStyle={styles.labelText} />
    <GreySeparator />
  </View>
)

CommentView.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
}

CommentView.defaultProps = {
  title: '',
  content: '',
}

export default CommentView
