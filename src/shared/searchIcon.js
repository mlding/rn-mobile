import React from 'react'
import { StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { COLOR, FONT } from '../constants/styleGuide'
import { StyleShape } from './shape'

const styles = StyleSheet.create({
  searchIcon: {
    fontSize: FONT.XL,
    color: COLOR.CLEAR_ICON,
    marginLeft: 12,
    marginRight: 8,
  },
})

const SearchIcon = props => (
  <Icon name="search" style={[styles.searchIcon, props.style]} />
)

SearchIcon.propTypes = {
  style: StyleShape,
}

SearchIcon.defaultProps = {
  style: null,
}


export default SearchIcon
