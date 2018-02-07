import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { Actions } from 'react-native-router-flux'
import { createStructuredSelector } from 'reselect'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { isEmpty, isEqual, toString, get, omit, trim, isNil } from 'lodash'
import { ARROW_DIRECTION, COLOR } from '../../constants/styleGuide'
import LabelTextInput from '../../components/labelTextInput'
import { addExtraLine, resetExtraLineForm, updateExtraLine, updateExtraLineForm, changeShowAlertForItem } from '../actions'
import PickerPanel from '../../components/pickerPanel'
import { getQuantityUnit } from '../../work-item/utilities'
import { ExtraLineShape } from '../../shared/shape'
import { LOCATION_ENTRANCE, LOCATION_PLACEHOLDER, STATUS } from '../constants'
import { extraLineFormSelector } from '../selector'
import { isCoordinateNotEmpty } from '../../utilities/mapUtil'
import { uuid, checkInputNumberValid, parseFloatOrNull } from '../../utilities/utils'
import AddItemButton from '../../shared/addItemButton'
import ShowAlertBackHandlerBase from '../../components/showAlertBackHandlerBase'
import ALERT_TYPE from '../../constants/showAlertType'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  scrollContainer: {
    flex: 1,
    paddingLeft: 15,
  },
})

class AddItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isWorkPackageFocused: false,
      isAssociatedWorkOrderFocused: false,
      name: props.extraLine.name,
      quantity: toString(props.extraLine.quantity),
      rate: toString(props.extraLine.rate),
    }
  }

  componentDidMount() {
    this.initExtraLineForm()
  }

  componentWillReceiveProps(nextProps) {
    const { extraLine, extraLineForm } = nextProps
    if (!isEqual(omit(extraLine, 'uuid'), omit(extraLineForm, 'uuid'))) {
      this.props.changeShowAlertForItem(true)
    }
  }

  componentWillUnmount() {
    this.props.changeShowAlertForItem(false)
    this.props.resetExtraLineForm()
  }

  get addItemDisabled() {
    const {
      name, quantity, quantity_description, rate, location, description,
    } = this.props.extraLineForm
    return isEmpty(name)
      || isNil(quantity)
      || !quantity_description  // eslint-disable-line
      || isNil(rate)
      || !isCoordinateNotEmpty(location)
      || isEmpty(description)
  }

  initExtraLineForm() {
    const { status, extraLine } = this.props
    if (isEqual(status, STATUS.EDIT)) {
      this.props.updateExtraLineForm(extraLine)
    } else {
      this.props.resetExtraLineForm()
    }
  }

  handleAddItem = status => {
    const { extraLineForm } = this.props
    const { quantity, rate, uuid: originUuid } = extraLineForm
    let extraLine = {
      ...extraLineForm,
      quantity: quantity,
      rate: rate,
    }
    if (!get(extraLineForm, 'id')) {
      extraLine = { ...extraLine, uuid: isEmpty(originUuid) ? uuid() : originUuid }
    }
    if (isEqual(status, STATUS.EDIT)) {
      this.props.updateExtraLine(extraLine)
    } else {
      this.props.addExtraLine(extraLine)
    }
    Actions.pop()
  }

  openQuantityDescriptionPicker = () => {
    Actions.unit({ updateUnit: this.updateUnit })
  }

  updateUnit = quantityDescription => {
    const unit = {
      quantity_description: quantityDescription.id,
      quantity_description_unit_imperial: quantityDescription.unit_imperial_name,
      quantity_description_unit_metric: quantityDescription.unit_metric_name,
      quantity_description_unit_system: quantityDescription.standard_unit_system,
    }
    this.props.updateExtraLineForm(unit)
  }

  handlerNumberOnChange = (val, fieldName) => {
    if (checkInputNumberValid(val, this.state[fieldName])) {
      this.setState({ [fieldName]: val })
    }
  }

  handleNumberOnBlur = fieldName => {
    const number = parseFloatOrNull(this.state[fieldName])
    const text = isFinite(number) ? toString(number) : ''
    this.setState({ [fieldName]: text })
    this.props.updateExtraLineForm({ [fieldName]: number })
  }

  trimName = () => {
    const trimName = trim(this.state.name)
    this.setState({ name: trimName })
    this.props.updateExtraLineForm({ name: trimName })
  }

  render() {
    const { status, extraLineForm } = this.props
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView style={styles.scrollContainer}>
          <View style={styles.basicInfo}>
            <LabelTextInput
              labelName="Item Name"
              text={this.state.name}
              onChangeText={val => this.setState({ name: val })}
              onBlur={this.trimName}
            />
            <LabelTextInput
              labelName="Quantity"
              maxTextInputLength={6}
              text={this.state.quantity}
              onChangeText={val => this.handlerNumberOnChange(val, 'quantity')}
              onBlur={() => this.handleNumberOnBlur('quantity')}
              keyboardType="numeric"
            />
            <PickerPanel
              labelName="Unit"
              content={getQuantityUnit(extraLineForm)}
              onPress={this.openQuantityDescriptionPicker}
              arrowDirection={ARROW_DIRECTION.RIGHT}
              touchableWithoutFeedback
            />
            <LabelTextInput
              labelName="Rate"
              maxTextInputLength={8}
              preText="$"
              text={this.state.rate}
              onChangeText={val => this.handlerNumberOnChange(val, 'rate')}
              onBlur={() => this.handleNumberOnBlur('rate')}
              keyboardType="numeric"
            />
            <PickerPanel
              labelName="Location"
              content={extraLineForm.address}
              onPress={() => Actions.mapPicker({
                coordinate: extraLineForm.location,
                address: extraLineForm.address,
                locationEntrance: LOCATION_ENTRANCE.EXTRA_LINE,
              })}
              touchableWithoutFeedback
              arrowDirection={ARROW_DIRECTION.RIGHT}
              placeholder={LOCATION_PLACEHOLDER}
            />
            <LabelTextInput
              labelName="Comment"
              text={extraLineForm.comments}
              onChangeText={val => this.props.updateExtraLineForm({ comments: val })}
              placeholder="Optional"
            />
            <LabelTextInput
              labelName="Description"
              text={extraLineForm.description}
              onChangeText={val => this.props.updateExtraLineForm({ description: val })}
            />
            <AddItemButton
              onPress={() => this.handleAddItem(status)}
              disabled={this.addItemDisabled}
              hasBackgroundColor
              status={status}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

AddItem.propTypes = {
  changeShowAlertForItem: PropTypes.func.isRequired,
  addExtraLine: PropTypes.func.isRequired,
  updateExtraLine: PropTypes.func.isRequired,
  extraLine: ExtraLineShape,
  status: PropTypes.string,
  extraLineForm: ExtraLineShape.isRequired,
  updateExtraLineForm: PropTypes.func.isRequired,
  resetExtraLineForm: PropTypes.func.isRequired,
}

AddItem.defaultProps = {
  extraLine: {},
  status: '',
}

const mapStateToProps = createStructuredSelector({
  extraLineForm: extraLineFormSelector,
})

const mapDispatchToProps = {
  changeShowAlertForItem,
  addExtraLine,
  updateExtraLine,
  updateExtraLineForm,
  resetExtraLineForm,
}

export default compose(connect(mapStateToProps, mapDispatchToProps),
ShowAlertBackHandlerBase)(AddItem, ALERT_TYPE.ADD_ITEM_ALERT)
