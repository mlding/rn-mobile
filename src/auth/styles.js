import { StyleSheet } from 'react-native'
import { COLOR, FONT } from '../constants/styleGuide'

export const buttonStyles = StyleSheet.create({
  container: {
    height: 45,
    marginTop: 50,
    justifyContent: 'center',
    backgroundColor: COLOR.HEADER,
    borderRadius: 2,
  },
  text: {
    textAlign: 'center',
    fontSize: FONT.LG,
    color: COLOR.WHITE,
  },
  disabled: {
    backgroundColor: COLOR.TRANSPARENT_HEADER,
  },
})

export const getButtonContainerStyles = (disabled = false) => (
    disabled ? [buttonStyles.container, buttonStyles.disabled] : buttonStyles.container
)
