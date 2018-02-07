import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import Icon from '../components/icon'
import { COLOR } from '../constants/styleGuide'
import { goBack } from '../utilities/navigator'
import Button from '../components/button'
import { navButtonStyles } from './styles'

const styles = StyleSheet.create({
  icon: {
    fontSize: 20,
    color: COLOR.WHITE,
  },
})

const BackButton = ({ onBack }) => (
  <Button onPress={onBack} style={navButtonStyles.buttonContainer}>
    <Icon name="back" style={styles.icon} />
  </Button>
)

BackButton.propTypes = {
  onBack: PropTypes.func,
}

BackButton.defaultProps = {
  onBack: goBack,
}

export default BackButton
