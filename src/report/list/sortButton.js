import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import Icon from '../../components/icon'
import { COLOR, FONT } from '../../constants/styleGuide'
import Button from '../../components/button'
import { navButtonStyles } from '../../shared/styles'
import { toggleSortPanel } from '../actions'

const styles = StyleSheet.create({
  sortIcon: {
    fontSize: FONT.LG,
    color: COLOR.WHITE,
  },
})
const SortButton = props => (
  <Button
    onPress={props.toggleSortPanel}
    style={navButtonStyles.buttonContainer}
  >
    <Icon name="sort" style={styles.sortIcon} />
  </Button>
)

SortButton.propTypes = {
  toggleSortPanel: PropTypes.func.isRequired,
}

export default connect(null, { toggleSortPanel })(SortButton)
