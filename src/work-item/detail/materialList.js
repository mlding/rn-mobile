import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'
import { isEmpty, findIndex, clone } from 'lodash'
import { COLOR, FONT, FONT_WEIGHT } from '../../constants/styleGuide'
import NO_MATERIAL_NEEDED from '../constants'
import { formatNumber, getQuantityUnit } from '../utilities'
import { WorkItemMaterialShape } from '../../shared/shape'
import { getShowText } from '../../utilities/dataProcessUtils'

const styles = StyleSheet.create({
  material: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.DIVIDER_GREY,
  },
  materialHeader: {
    height: 30,
    backgroundColor: COLOR.DARK_WHITE,
    borderTopWidth: 1,
    borderTopColor: COLOR.DIVIDER_GREY,
  },
  materialName: {
    flex: 3,
    marginRight: 15,
  },
  est: {
    flex: 1,
    textAlign: 'center',
  },
  unit: {
    flex: 1,
    textAlign: 'right',
  },
  text: {
    fontSize: FONT.MD,
    color: COLOR.MEDIUM_BLACK,
  },
  materialHeaderField: {
    fontSize: FONT.MD,
    color: COLOR.MEDIUM_GREY,
  },
  noMaterial: {
    fontSize: FONT.MD,
    color: COLOR.SILVER,
    fontWeight: FONT_WEIGHT.BOLD,
    letterSpacing: -0.5,
    paddingLeft: 15,
  },
})

class MaterialList extends Component {

  omitPrimaryWithEmptyName = quantities => {
    const primaryQuaWithEmptyNameIndex = findIndex(quantities,
      { is_primary_quantity: true, material_name: null })
    if (primaryQuaWithEmptyNameIndex !== -1) {
      quantities.splice(primaryQuaWithEmptyNameIndex, 1)
    }
    return quantities
  }

  renderMaterialItem = (material, index) => (
    <View style={styles.material} key={index}>
      <Text style={[styles.materialName, styles.text]} numberOfLines={2} ellipsizeMode="tail">
        {getShowText(
          isEmpty(material.material_name)
            ? material.quantity_description_name
            : material.material_name)}
      </Text>
      <Text style={[styles.est, styles.text]}>{formatNumber(material.estimated_quantity)}</Text>
      <Text style={[styles.unit, styles.text]}>{getQuantityUnit(material)}</Text>
    </View>
    )

  render() {
    const { quantities } = this.props
    const quantitiesOmitPrimaryWithEmptyName = this.omitPrimaryWithEmptyName(clone(quantities))

    return (
      <View>
        <View style={[styles.material, styles.materialHeader]}>
          <Text style={[styles.materialName, styles.materialHeaderField]}>QTY/MAT</Text>
          <Text style={[styles.est, styles.materialHeaderField]}>EST</Text>
          <Text style={[styles.unit, styles.materialHeaderField]}>UNIT</Text>
        </View>
        {
          !isEmpty(quantitiesOmitPrimaryWithEmptyName)
          ? quantitiesOmitPrimaryWithEmptyName.map(this.renderMaterialItem)
          : <Text style={styles.noMaterial}>{NO_MATERIAL_NEEDED}</Text>
        }
      </View>
    )
  }
}

MaterialList.propTypes = {
  quantities: PropTypes.arrayOf(WorkItemMaterialShape).isRequired,
}


export default MaterialList

