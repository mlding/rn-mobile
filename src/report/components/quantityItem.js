import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'
import { isFinite, toString, isNil } from 'lodash'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { QuantityShape, ReportLinesShape } from '../../shared/shape'
import { EMPTY_TEXT, getShowText } from '../../utilities/dataProcessUtils'
import { COLOR, FONT } from '../../constants/styleGuide'
import TextField from '../../components/textField'
import { deleteQuantity, modifyQuantityField } from '../actions'
import { buildQuantityNameText } from '../utilities'
import { checkInputNumberValid } from '../../utilities/utils'
import { formatNumber, getPrimaryQuantity } from '../../work-item/utilities'
import { QuantityStyle } from './quantityListHeader'
import { MATERIAL_PICKER_ACTION } from '../material/materialPicker'
import { IS_ANDROID } from '../../utilities/systemUtil'
import Button from '../../components/button'

const styles = StyleSheet.create({
  deleteIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLOR.BORDER,
    marginLeft: -22,
    marginRight: 4,
  },
  deleteIcon: {
    fontSize: FONT.MD,
    color: COLOR.WHITE,
  },
  nameEdit: {
    borderBottomWidth: 1,
    borderColor: COLOR.BORDER,
    minHeight: IS_ANDROID ? 28 : 0,
  },
})

let quantityFieldWidth = 0

export class QuantityItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      quantity: toString(props.quantity.quantity),
      remaining_quantity: toString(props.quantity.remaining_quantity),
    }
  }

  handlerNumberInputChange = (text, fieldName) => {
    if (checkInputNumberValid(text, this.state[fieldName])) {
      this.setState({ [fieldName]: text })
    }
  }

  handleNumberInputEnd = fieldName => {
    const number = parseFloat(this.state[fieldName])
    const text = isFinite(number) ? toString(number) : ''
    this.setState({ [fieldName]: text })
    this.props.modifyQuantityField(
        this.props.reportLine,
        this.props.quantity,
        { [fieldName]: number })
  }

  renderDeleteIcon = () => {
    const { editable, reportLine, quantity } = this.props
    const showDeleteIcon = editable &&
      (getPrimaryQuantity(reportLine.quantities) !== quantity) &&
      quantity.material_name !== null
    if (showDeleteIcon) {
      return (
        <Button
          onPress={() => {
            this.props.deleteQuantity(this.props.reportLine, this.props.quantity)
          }}
          style={styles.deleteIconWrapper}
        >
          <Icon name="md-close" style={styles.deleteIcon} />
        </Button>
      )
    }
    return null
  }

  renderNameField = () => {
    const isNameEditable = this.props.editable &&
      this.props.quantity.material_name !== null

    const fieldWidth = quantityFieldWidth
    const quantityName = buildQuantityNameText(this.props.quantity, fieldWidth)
    const renderText = () => (
      <Text
        style={[QuantityStyle.materialFont, { paddingBottom: 6 }]}
        numberOfLines={2}
      >
        {quantityName}
      </Text>
    )

    const onLayout = nativeEvent => {
      if (quantityFieldWidth <= 0) {
        quantityFieldWidth = nativeEvent.layout.width
      }
      if (fieldWidth <= 0) {
        this.forceUpdate()
      }
    }

    if (isNameEditable) {
      return (
        <TouchableOpacity
          style={[QuantityStyle.material, styles.nameEdit]}
          onPress={() => Actions.materialPicker({
            reportLine: this.props.reportLine,
            quantity: this.props.quantity,
            pickerAction: MATERIAL_PICKER_ACTION.EDIT })}
          onLayout={({ nativeEvent }) => onLayout(nativeEvent)}
        >
          {renderText()}
        </TouchableOpacity>)
    }
    return (
      <View
        style={QuantityStyle.material}
        onLayout={({ nativeEvent }) => onLayout(nativeEvent)}
      >
        {renderText()}
      </View>
    )
  }

  renderEstField = () => {
    const { quantity } = this.props
    const estDisplay = isNil(quantity.work_item_quantity) ?
      EMPTY_TEXT : getShowText(formatNumber(quantity.estimated_quantity))
    return (
      <Text style={[QuantityStyle.est, QuantityStyle.materialFont, { paddingBottom: 6 }]}>
        {estDisplay}
      </Text>
    )
  }

  renderEditNumberField = (style, fieldName) => {
    if (this.props.editable) {
      return (
        <TextField
          style={[style, QuantityStyle.materialFont]}
          value={this.state[fieldName]}
          onChangeText={text => this.handlerNumberInputChange(text, fieldName)}
          onBlur={() => this.handleNumberInputEnd(fieldName)}
          focusBorderColor={COLOR.LINK}
          keyboardType="numeric"
          maxLength={6}
        />
      )
    }
    return (
      <Text style={[style, QuantityStyle.materialFont]}>
        {getShowText(this.props.quantity[fieldName])}
      </Text>)
  }

  renderActField = () => this.renderEditNumberField(QuantityStyle.act, 'quantity')

  renderRemainingField = () => this.renderEditNumberField(QuantityStyle.remaining, 'remaining_quantity')

  render() {
    const { quantity } = this.props
    return (
      <View style={QuantityStyle.materialItem} key={quantity.id}>
        <View style={QuantityStyle.rightFieldContainer}>
          {this.renderEstField()}
          {this.renderActField()}
          {this.renderRemainingField()}
        </View>
        {this.renderNameField()}
        {this.renderDeleteIcon()}
      </View>
    )
  }
}
QuantityItem.propTypes = {
  reportLine: ReportLinesShape.isRequired,
  quantity: QuantityShape.isRequired,
  editable: PropTypes.bool,
  modifyQuantityField: PropTypes.func.isRequired,
  deleteQuantity: PropTypes.func.isRequired,
}

QuantityItem.defaultProps = {
  editable: false,
}

const mapDispatchToProps = {
  modifyQuantityField,
  deleteQuantity,
}

export default connect(null, mapDispatchToProps)(QuantityItem)

