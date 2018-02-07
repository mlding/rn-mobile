import { LayoutAnimation, UIManager } from 'react-native'
import { IS_ANDROID } from './systemUtil'

if (IS_ANDROID) {
  UIManager.setLayoutAnimationEnabledExperimental && // eslint-disable-line
    UIManager.setLayoutAnimationEnabledExperimental(true)
}

export const EXPAND_ITEM_ANIMA =
    LayoutAnimation.create(200, LayoutAnimation.Types.easeOut, LayoutAnimation.Properties.opacity)

export const DELETE_ITEM_ANIMA =
    LayoutAnimation.create(200, LayoutAnimation.Types.linear, LayoutAnimation.Properties.opacity)

export const SHOW_WORKITEM_DETAIL_ANIMA =
    LayoutAnimation.create(100, LayoutAnimation.Types.linear, LayoutAnimation.Properties.opacity)
