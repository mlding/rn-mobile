import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'
import { COLOR, FONT } from '../../constants/styleGuide'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 13,
    backgroundColor: COLOR.WHITE,
  },
  text: {
    fontSize: FONT.L,
  },
})

const Description = props => (
  <View style={styles.container}>
    <Text style={styles.text} numberOfLines={5} >{props.description}</Text>
  </View>
)

Description.propTypes = {
  description: PropTypes.string,
}

Description.defaultProps = {
  description: '',
}

export default Description
