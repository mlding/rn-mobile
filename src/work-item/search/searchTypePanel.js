import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

import { COLOR, FONT } from '../../constants/styleGuide'
import { SEARCH_TYPES } from '../../constants/searchType'
import ToggleButton from './toggleButton'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingLeft: 27,
    paddingBottom: 5,
    backgroundColor: COLOR.WHITE,
  },
  note: {
    marginTop: 8,
    marginBottom: 10,
    fontSize: FONT.SM,
    color: COLOR.DRAFT,
  },
  searchTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 300,
  },
  searchTypeCell: {
    marginRight: 10,
    marginBottom: 10,
  },
})

const SearchTypePanel = ({ searchField, handleSelect }) => (
  <View style={styles.container}>
    <Text style={styles.note}>Search by</Text>
    <View style={styles.searchTypes}>
      {
        SEARCH_TYPES.map(it =>
          (<ToggleButton
            key={it.text}
            style={styles.searchTypeCell}
            text={it.text}
            value={it.searchField === searchField}
            onSelectedChange={() => handleSelect(it.searchField)}
          />),
        )
      }
    </View>
  </View>
)

SearchTypePanel.propTypes = {
  searchField: PropTypes.string.isRequired,
  handleSelect: PropTypes.func.isRequired,
}

export default SearchTypePanel
