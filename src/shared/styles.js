import { StyleSheet } from 'react-native'
import { verticalScale, scale } from '../utilities/responsiveDimension'

export const navButtonStyles = StyleSheet.create({ //eslint-disable-line
  buttonContainer: {
    minWidth: scale(50),
    minHeight: verticalScale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
})
