import { Actions } from 'react-native-router-flux'
import TOAST_TYPE from '../constants/messageType'
import SCENE_KEY from '../constants/sceneKey'

const hidePreviousMessageBar = () => {
  if (Actions.currentScene === SCENE_KEY.MESSAGE_BAR) {
    Actions.pop()
  }
}

export const showError = (message, isModal = false) => {
  hidePreviousMessageBar()
  Actions.messageBar({ message: message, messageType: TOAST_TYPE.ERROR, isModal: isModal })
}

export const showInfo = (message, isModal = false) => {
  hidePreviousMessageBar()
  Actions.messageBar({ message: message, messageType: TOAST_TYPE.INFO, isModal: isModal })
}
