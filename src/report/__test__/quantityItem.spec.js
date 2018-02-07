import React from 'react'
import { shallow } from 'enzyme'
import { noop } from 'lodash'
import { Text } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { reportLine } from '../fixture'
import { QuantityItem } from '../components/quantityItem'
import TextField from '../../components/textField'
import { buildQuantityNameText } from '../utilities'
import { getPrimaryQuantity } from '../../work-item/utilities'

describe('<QuantityItem />', () => {
  const renderQuantityItem = (inputReportLine, quantity, editable) => shallow(
    <QuantityItem
      reportLine={inputReportLine}
      quantity={quantity}
      editable={editable}
      modifyQuantityField={noop}
      deleteQuantity={noop}
    />,
    )

  it('should render when edit state is false', () => {
    const component = renderQuantityItem(reportLine, reportLine.quantities[0], false)
    expect(component.find(Text).length).toEqual(4)
  })

  it('should render when edit state is true', () => {
    const component = renderQuantityItem(reportLine, reportLine.quantities[0], true)
    expect(component.find(Text).length).toEqual(2)
    expect(component.find(TextField).length).toEqual(2)
  })

  it('should render delete icon when isEditable and quantity is not primary', () => {
    const component = renderQuantityItem(reportLine, reportLine.quantities[1], true)
    expect(component.find(Icon).length).toEqual(1)
  })

  it('should render delete icon when isEditable and quantity mateiral name is empty', () => {
    const component = renderQuantityItem(reportLine, reportLine.quantities[2], true)
    expect(component.find(Icon).length).toEqual(1)
  })


  it('should not render delete icon when isEditable and quantity is primary', () => {
    const inputQuantity = getPrimaryQuantity(reportLine.quantities)
    const component = renderQuantityItem(reportLine, inputQuantity, true)
    expect(component.find(Icon).length).toEqual(0)
  })

  it('should cut  when material name is too long', () => {
    const inputQuantity = {
      quantity_description_name: 'cable',
      quantity_description_unit_metric: 'each',
      quantity_description_unit_system: 'metric',
      material_name: 'CGH-4 cable ground kit sealed AFL closures with something',
    }
    const outputName = buildQuantityNameText(inputQuantity)
    expect(outputName).toEqual('CGH-4 cable groun... (each)')
  })

  it('should not cut  when material name is short', () => {
    const inputQuantity = {
      quantity_description_name: 'cable',
      quantity_description_unit_metric: 'each',
      quantity_description_unit_system: 'metric',
      material_name: 'CGH-4',
    }
    const outputName = buildQuantityNameText(inputQuantity)
    expect(outputName).toEqual('CGH-4 (each)')
  })

  it('should use quantity name  when material name empty', () => {
    const inputQuantity = {
      quantity_description_name: 'cable',
      quantity_description_unit_metric: 'each',
      quantity_description_unit_system: 'metric',
      material_name: '',
    }
    const outputName = buildQuantityNameText(inputQuantity)
    expect(outputName).toEqual('cable (each)')
  })

  it('should use unit  when material name empty and quantity description is null', () => {
    const inputQuantity = {
      quantity_description_name: '',
      quantity_description_unit_metric: 'each',
      quantity_description_unit_system: 'metric',
      material_name: '',
    }
    const outputName = buildQuantityNameText(inputQuantity)
    expect(outputName).toEqual('(each)')
  })
})
