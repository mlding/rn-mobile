import { Dimensions, StatusBar } from 'react-native'
import { IS_IOS } from './systemUtil'

const { width, height } = Dimensions.get('window')

export const guidelineBaseWidth = 375
export const guidelineBaseHeight = 667

export const statusBarHeight = IS_IOS ? 20 : StatusBar.currentHeight

export const scale = size =>
  Math.round((width / guidelineBaseWidth) * size)

export const verticalScale = size =>
  Math.round(((height - statusBarHeight) / guidelineBaseHeight) * size)

export const WindowWidth = () => width

export const WindowHeight = () => height

export const NavBarHeightOrigin = IS_IOS ? 64 : 54

export const NavBarHeight = verticalScale(NavBarHeightOrigin)
