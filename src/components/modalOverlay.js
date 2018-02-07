import React from 'react'
import { View } from 'react-native'
import { Z_INDEX } from '../constants/styleGuide'

const ModalOverlay = () => (
  <View style={{
    zIndex: Z_INDEX.NORMAL,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.49)',
  }}
  />
)

export default ModalOverlay
