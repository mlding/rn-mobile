import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'
import { Actions } from 'react-native-router-flux'
import { ReportLinesShape } from '../../shared/shape'
import { COLOR, FONT, FONT_WEIGHT } from '../../constants/styleGuide'
import { MATERIAL_PICKER_ACTION } from '../material/materialPicker'
import Button from '../../components/button'

export const QuantityStyle = StyleSheet.create({
  materialItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 10,
  },
  rightFieldContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  materialFont: {
    fontSize: FONT.MD,
    color: COLOR.MEDIUM_BLACK,
  },
  materialLabel: {
    fontWeight: FONT_WEIGHT.LIGHT,
  },
  material: {
    flex: 1,
    flexWrap: 'wrap',
    marginRight: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  est: {
    width: 60,
  },
  act: {
    width: 55,
    marginRight: 4,
    paddingVertical: 0,
  },

  remaining: {
    width: 55,
    paddingVertical: 0,
  },
})

const styles = StyleSheet.create({
  plusIconWrapper: {
    alignItems: 'center',
  },

  plusIcon: {
    fontSize: 24,
    color: COLOR.LINK,
  },
})

export const QuantityListHeader = props => (
  <View style={QuantityStyle.materialItem}>
    <View style={QuantityStyle.rightFieldContainer}>
      <Text style={[QuantityStyle.est,
        QuantityStyle.materialFont,
        QuantityStyle.materialLabel]}
      >
        EST
      </Text>
      <Text style={[QuantityStyle.act,
        QuantityStyle.materialFont,
        QuantityStyle.materialLabel]}
      >
        ACT
      </Text>
      <Text style={[QuantityStyle.remaining,
        QuantityStyle.materialFont,
        QuantityStyle.materialLabel]}
      >
        REM
      </Text>
    </View>
    <View style={QuantityStyle.material}>
      <Text style={[QuantityStyle.materialFont, QuantityStyle.materialLabel]}>
        QTY/MAT
      </Text>
      {props.editable &&
      <Button
        onPress={() => Actions.materialPicker({
          reportLine: props.reportLine,
          pickerAction: MATERIAL_PICKER_ACTION.ADD })}
        style={styles.plusIconWrapper}
      >
        <Icon name="plus" style={styles.plusIcon} />
      </Button>}
    </View>
  </View>

    )


QuantityListHeader.propTypes = {
  editable: PropTypes.bool,
  reportLine: ReportLinesShape.isRequired,
}

QuantityListHeader.defaultProps = {
  editable: false,
}

export default QuantityListHeader
