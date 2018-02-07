jest.mock('react-native-router-flux', () => ({
  ActionConst: { RESET: 'reset' },
  Actions: {
    pop: jest.fn(),
  },
}))

jest.mock('react-native-device-info', () => ({
  getUniqueID: jest.fn(),
}))

jest.mock('react-native-fs', () => ({
  readDir: jest.fn(),
  mkdir: jest.fn(),
  unlink: jest.fn(),
  downloadFile: jest.fn(),
  moveFile: jest.fn(),
  DocumentDirectoryPath: '/document/directory',
  isFile: jest.fn(() => true),
}))

jest.mock('react-native-fcm', () => ({
  getInitialNotification: jest.fn(),
}))

jest.mock('../src/utilities/Storage.js', () => ({
  get: jest.fn(() => Promise.resolve({})),
  set: jest.fn(() => Promise.resolve()),
  remove: jest.fn(() => Promise.resolve()),
}))

jest.mock('../src/utilities/keychainStorage.js', () => ({
  set: () => Promise.resolve(),
  reset: jest.fn(() => Promise.resolve()),
  getToken: () => Promise.resolve('localToken'),
}))

jest.mock('../src/utilities/messageBar.js', () => ({
  showError: jest.fn(),
  showInfo: jest.fn(),
}))

jest.mock('../src/utilities/networkInfo.js', () => ({
  isNetworkConnect: jest.fn(() => Promise.resolve(false)),
}))
