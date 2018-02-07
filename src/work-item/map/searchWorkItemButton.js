import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View } from 'react-native'
import { isEmpty, noop } from 'lodash'
import { Actions } from 'react-native-router-flux'

import { COLOR, FONT } from '../../constants/styleGuide'
import ClearIcon from '../../shared/clearIcon'
import SearchIcon from '../../shared/searchIcon'
import Button from '../../components/button'
import { StyleShape } from '../../shared/shape'

const styles = StyleSheet.create({
  searchButton: {
    height: 28,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    borderRadius: 2,
  },
  touchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  textHint: {
    fontSize: FONT.MD,
    color: COLOR.MEDIUM_GREY,
  },
  text: {
    fontSize: FONT.MD,
    color: COLOR.MEDIUM_BLACK,
  },
})

const SearchWorkItemButton = ({ text, style, onClear }) => {
  const hasSearchText = !isEmpty(text)

  return (
    <View
      style={[styles.searchButton, style]}
    >
      <Button
        style={[styles.touchWrapper, hasSearchText ? { marginRight: 30 } : null]}
        onPress={() => Actions.workItemsSearch()}
      >
        <SearchIcon />
        <Text style={hasSearchText ? styles.text : styles.textHint}>
          {hasSearchText ? text : 'Search work item'}
        </Text>
      </Button>
      {hasSearchText && <ClearIcon onPress={onClear} />}
    </View>
  )
}

SearchWorkItemButton.propTypes = {
  text: PropTypes.string,
  style: StyleShape,
  onClear: PropTypes.func,
}

SearchWorkItemButton.defaultProps = {
  text: '',
  style: null,
  onClear: noop,
}

export default SearchWorkItemButton
