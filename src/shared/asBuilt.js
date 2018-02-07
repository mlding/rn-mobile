import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View } from 'react-native'
import { get, isEmpty } from 'lodash'
import { COLOR, FONT } from '../constants/styleGuide'
import AsBuiltAnnotation from './asBuiltAnnotation'
import { ReportLinesShape, StyleShape, WorkItemShape } from './shape'
import { getShowText } from '../utilities/dataProcessUtils'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
    height: 30,
    backgroundColor: COLOR.DARK_WHITE,
    borderTopWidth: 1,
    borderTopColor: COLOR.DIVIDER_GREY,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.DIVIDER_GREY,
  },
  headerText: {
    fontSize: FONT.MD,
    color: COLOR.MEDIUM_GREY,
  },
  detail: {
    paddingHorizontal: 15,
  },
})

const renderDetails = ({ item, editable }) =>
  item.network_element.as_built_annotations.map(asBuiltAnnotation =>
    (<AsBuiltAnnotation
      key={asBuiltAnnotation.id}
      asBuiltAnnotation={asBuiltAnnotation}
      item={item}
      editable={editable}
    />))

const AsBuilt = ({ item, editable, style, headerStyle, headerTextStyle, detailStyle }) => (
  <View style={[styles.container, style]}>
    {
      !isEmpty(get(item, 'network_element.label')) &&
      <View style={[styles.header, headerStyle]}>
        <Text style={[styles.headerText, headerTextStyle]}>{'As Built for '}{getShowText(item.network_element.label)}</Text>
      </View>
    }
    {
      get(item, 'network_element.as_built_annotations') &&
      <View style={[styles.detail, detailStyle]}>{renderDetails({ item, editable })}</View>
    }
  </View>
  )

AsBuilt.propTypes = {
  item: PropTypes.oneOfType([ReportLinesShape, WorkItemShape]),
  editable: PropTypes.bool,
  style: StyleShape,
  headerStyle: StyleShape,
  headerTextStyle: StyleShape,
  detailStyle: StyleShape,
}

AsBuilt.defaultProps = {
  item: [],
  editable: false,
  style: null,
  headerStyle: null,
  headerTextStyle: null,
  detailStyle: null,
}

export default AsBuilt
