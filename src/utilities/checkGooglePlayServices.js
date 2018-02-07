import { NativeModules } from 'react-native'
import { IS_ANDROID } from './systemUtil'

class GoogleAPIAvailabilityBridge {
  constructor() {
    this.isReady = false
    this.bridge = NativeModules.CheckGooglePlayServices
  }

  /**
   * @param {Function} result receive a integer of check result, 0 is success.
   */
  checkGooglePlayServices(result) {
    if (!IS_ANDROID) {
      console.warn('`checkGooglePlayServices` is only available on Android') // eslint-disable-line
      return
    }
    this.bridge.checkGooglePlayServices(result)
  }

  /**
   * @param {number} checkResultCode pass result integer returned by `checkGooglePlayServices`
   * @param {Function} dismiss called when the error dialog dismiss
   */
  showErrorDialog(checkResultCode, dismiss) {
    if (!IS_ANDROID) {
      console.warn('`showErrorDialog` is only available on Android') // eslint-disable-line
      return
    }
    if (checkResultCode === 0) {
      console.warn('`showErrorDialog` checkResultCode can not be 0') // eslint-disable-line
      return
    }
    this.bridge.showErrorDialog(checkResultCode, dismiss)
  }

  isGoogleServiceReady() {
    return this.isReady
  }

  /**
   * If google api service available, `successCallback` will be called.
   * Else will show the error dialog.
   * The `errorDialogDismiss` will be called when error dialog dismiss
   */
  checkAPIAvailable(successCallback, errorDialogDismiss) {
    if (!IS_ANDROID) {
      console.warn('`checkAPIAvailable` is only available on Android') // eslint-disable-line
      return
    }
    this.checkGooglePlayServices(resultCode => {
      if (resultCode === 0) {
        this.isReady = true
        successCallback()
      } else {
        this.isReady = false
        this.showErrorDialog(resultCode, () => errorDialogDismiss())
      }
    })
  }
}

export default new GoogleAPIAvailabilityBridge()
