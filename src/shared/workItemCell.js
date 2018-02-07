import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { noop, get } from 'lodash'
import { View, Text, StyleSheet } from 'react-native'
import { OPACITY, COLOR, FONT, FONT_WEIGHT, WORK_ITEM_HEIGHT } from '../constants/styleGuide'
import RoundAvator from './roundAvator'
import { getShowText } from '../utilities/dataProcessUtils'
import FromTo from './fromTo'
import { ReportLinesShape, StyleShape, WorkItemShape } from './shape'
import { getPrimaryQuantityWithUnit } from '../work-item/utilities'
import Button from '../components/button'


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLOR.WHITE,
    minHeight: WORK_ITEM_HEIGHT,
  },
  content: {
    flex: 1,
    marginTop: 13,
  },
  title: {
    marginBottom: 4,
  },
  primaryText: {
    fontSize: FONT.XL,
    lineHeight: 25,
    color: COLOR.MEDIUM_BLACK,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  quantity: {
    paddingBottom: 4,
  },
  quantityContainer: {
    marginTop: 13,
    marginHorizontal: 15,
    alignItems: 'flex-end',
  },
})

export default class WorkItemCell extends Component {

  extraData = () => {
    const { item, isReportLine } = this.props
    if (isReportLine) {
      return { activityCode: item.activity_code,
        itemName: item.work_item_descriptor,
        fromValue: item.reference_from,
        toValue: item.reference_to,
        primaryQuantityWithUnit: getPrimaryQuantityWithUnit(item.quantities) }
    }
    return { activityCode: item.activity_code,
      itemName: item.name,
      fromValue: get(item, 'network_element.go_from'),
      toValue: get(item, 'network_element.go_to'),
      primaryQuantityWithUnit: getPrimaryQuantityWithUnit(item.quantities) }
  }

  render() {
    const {
      editable,
      onPress,
      linesOfName,
      renderRightArea,
      onFromTextChanged,
      onToTextChanged,
      style,
      shouldShowAllFromToText,
    } = this.props
    const { activityCode, itemName, fromValue, toValue, primaryQuantityWithUnit } = this.extraData()
    return (
      <Button
        onPress={onPress}
        style={[styles.container, style]}
        activeOpacity={(onPress === noop) ? OPACITY.NORMAL : OPACITY.ACTIVE}
      >
        <RoundAvator activityCode={activityCode} />
        <View style={styles.content}>
          <Text
            style={[styles.title, styles.primaryText]}
            numberOfLines={linesOfName}
          >
            { getShowText(itemName) }
          </Text>
          <FromTo
            fromValue={fromValue}
            toValue={toValue}
            editable={editable}
            onFromTextChanged={onFromTextChanged}
            onToTextChanged={onToTextChanged}
            shouldShowAllFromToText={shouldShowAllFromToText}
          />
        </View>
        <View style={styles.quantityContainer}>
          <Text style={[styles.primaryText, styles.quantity]}>
            {getShowText(primaryQuantityWithUnit)}
          </Text>
          { renderRightArea() }
        </View>
      </Button>

    )
  }
}

WorkItemCell.propTypes = {
  item: PropTypes.oneOfType([WorkItemShape, ReportLinesShape]).isRequired,
  isReportLine: PropTypes.bool,
  onPress: PropTypes.func,
  linesOfName: PropTypes.number,
  renderRightArea: PropTypes.func,
  editable: PropTypes.bool,
  onFromTextChanged: PropTypes.func,
  onToTextChanged: PropTypes.func,
  style: StyleShape,
  shouldShowAllFromToText: PropTypes.bool,
}

WorkItemCell.defaultProps = {
  isReportLine: false,
  onPress: noop,
  linesOfName: 0,
  renderRightArea: noop,
  editable: false,
  onFromTextChanged: noop,
  onToTextChanged: noop,
  style: null,
  shouldShowAllFromToText: true,
}
