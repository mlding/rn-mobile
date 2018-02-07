import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import { WindowWidth } from '../utilities/responsiveDimension'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
})

export const SimpleSwitchView = props => { //eslint-disable-line
  const selectChildIndex = props.selectIndex
  const width = props.childWidth
  const childWrapperStyle = { width: width,
    transform: [{ translateX: -(width * selectChildIndex) }] }
  return (
    <View style={styles.container} >
      {props.children.map((child, index) => (
        <View
          style={childWrapperStyle}
          key={index}  //eslint-disable-line
        >
          {child}
        </View>
      ))}
    </View>)
}

SimpleSwitchView.propTypes = {
  selectIndex: PropTypes.number,
  childWidth: PropTypes.number,
  children: PropTypes.node,
}

SimpleSwitchView.defaultProps = {
  selectIndex: 0,
  childWidth: WindowWidth(),
  children: [],
}
