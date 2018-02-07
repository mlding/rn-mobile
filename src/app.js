import React from 'react'
import { Text, AppRegistry } from 'react-native'
import { Provider } from 'react-redux'
import AppRouters from './appRouters'
import store from './store'

Text.defaultProps.allowFontScaling = false

const VitruviMobile = () => (
  <Provider store={store}>
    <AppRouters />
  </Provider>
)

AppRegistry.registerComponent('VitruviMobile', () => VitruviMobile)

export default VitruviMobile
