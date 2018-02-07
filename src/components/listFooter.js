import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, ActivityIndicator } from 'react-native'

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 82,
    height: 1,
    backgroundColor: '#ddd',
  },
  roundPoint: {
    width: 4,
    height: 4,
    marginHorizontal: 20,
    borderRadius: 4,
    backgroundColor: '#ddd',
  },
})

const ListFooter = ({ loading }) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <View style={styles.roundPoint} />
      <View style={styles.line} />
    </View>
  )
}

ListFooter.propTypes = {
  loading: PropTypes.bool,
}

ListFooter.defaultProps = {
  loading: false,
}

export default ListFooter
