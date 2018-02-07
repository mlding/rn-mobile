import { Actions, ActionConst } from 'react-native-router-flux'

export const goBack = () => {
  Actions.pop()
}

export const RESET_CONFIG = {
  type: ActionConst.RESET,
}
