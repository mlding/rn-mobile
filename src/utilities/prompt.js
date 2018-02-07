import { Alert } from 'react-native'

const alert = ({ message, leftText, leftFunc, rightText, rightFunc }) => Alert.alert(
  '',
  message,
  [
    { text: leftText,
      onPress: leftFunc,
    },
    { text: rightText,
      onPress: rightFunc,
    },
  ],
  { cancelable: false },
)

export default alert
