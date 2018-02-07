import * as Keychain from 'react-native-keychain'

const KeychainStorage = {
  set: (userId, token) => Keychain.setGenericPassword(userId.toString(), token),
  get: () => Keychain.getGenericPassword(),
  reset: () => Keychain.resetGenericPassword(),
  getToken: () => (
    Keychain.getGenericPassword().then(credentials => credentials.password)
  ),
}

export default KeychainStorage
