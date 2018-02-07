import Picker from 'react-native-picker'
import { Actions } from 'react-native-router-flux'
import { isEmpty, without } from 'lodash'
import { goBack } from './navigator'
import Strings from '../constants/strings'

const PickerOptions = {
  pickerConfirmBtnText: Strings.Done,
  pickerCancelBtnText: Strings.Cancel,
  pickerBg: [255, 255, 255, 1],
  pickerToolBarBg: [255, 255, 255, 1],
  pickerConfirmBtnColor: [55, 55, 55, 1],
  pickerCancelBtnColor: [55, 55, 55, 1],
  wheelFlex: [1, 2, 1],
  pickerFontSize: 14,
}

const PickerUtil = {
  build: ({ title, dataSource, value, onConfirm, onCancel, defaultValue }) => {
    let selectedValue = defaultValue
    if (isEmpty(defaultValue)) {
      selectedValue = isEmpty(without(value, '')) ? [dataSource[0]] : value
    } else if (!isEmpty(without(value, '', undefined))) {
      selectedValue = value
    }

    Picker.init({
      ...PickerOptions,
      selectedValue: selectedValue,
      pickerData: dataSource,
      pickerTitleText: title,
      onPickerConfirm: val => {
        goBack()
        onConfirm(val)
      },
      onPickerCancel: () => {
        goBack()
        if (onCancel) {
          onCancel()
        }
      },
    })
    Picker.show()
    Actions.modalOverlay()
  },

  hide: () => {
    Picker.hide()
  },
}

export default PickerUtil
