import { NetInfo } from 'react-native'

export const isNetworkConnect = () => //eslint-disable-line
  NetInfo.isConnected.fetch().catch(() => Promise.resolve(false))
