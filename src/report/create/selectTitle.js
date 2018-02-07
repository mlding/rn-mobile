import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectedCountSelector } from '../../work-item/selector'
import { styles } from '../../appRouters'

const SelectTitle = ({ selectedCount: count }) => {
  const title = count ? `Select (${count})` : 'Select'
  return (
    <Text style={styles.navTitle}>{ title }</Text>
  )
}

SelectTitle.propTypes = {
  selectedCount: PropTypes.number,
}

SelectTitle.defaultProps = {
  selectedCount: 0,
}

const mapStateToProps = createStructuredSelector({
  selectedCount: selectedCountSelector,
})

export default connect(mapStateToProps)(SelectTitle)
