import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import { ExtraLineShape } from '../../shared/shape'
import { COLOR, FONT } from '../../constants/styleGuide'
import Icon from '../../components/icon'
import Button from '../../components/button'
import { getQuantityUnit } from '../../work-item/utilities'
import { STATUS, TITLE } from '../constants'
import { deleteExtraLine } from '../actions'
import { formatMoney } from '../utilities'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    backgroundColor: COLOR.WHITE,
    borderColor: COLOR.BORDER_GREY,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  nameView: {
    paddingBottom: 12,
    paddingHorizontal: 15,
  },
  name: {
    fontSize: FONT.M,
  },
  tableView: {
    marginBottom: 10,
    marginHorizontal: 15,
  },
  rowView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cellView: {
    flex: 1 / 3,
    alignItems: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLOR.GREY_BORDER,
  },
  tableLabel: {
    color: COLOR.SILVER,
    fontSize: FONT.MD,
    paddingVertical: 2,
  },
  tableValue: {
    fontSize: FONT.M,
    paddingVertical: 7,
  },
  commentsView: {
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  comments: {
    fontSize: FONT.MD,
    color: COLOR.SILVER,
  },
  separator: {
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: COLOR.GREY_BORDER,
  },
  iconView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  icon: {
    fontSize: FONT.XL,
    color: COLOR.LINK,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
})

const showDescription = description => {
  Actions.description({ description })
}

const showEdit = item => {
  Actions.addItem({ status: STATUS.EDIT, extraLine: item, title: TITLE.EDIT_ITEM })
}

const renderTable = (quantity, unit, rate) => (
  <View style={styles.tableView}>
    <View style={styles.rowView}>
      <View style={[styles.cellView, { borderBottomWidth: 0, borderRightWidth: 0 }]}>
        <Text style={styles.tableLabel}>Quantity</Text>
      </View>
      <View style={[styles.cellView, { borderBottomWidth: 0, borderRightWidth: 0 }]}>
        <Text style={styles.tableLabel}>Unit</Text>
      </View>
      <View style={[styles.cellView, { borderBottomWidth: 0 }]}>
        <Text style={styles.tableLabel}>Rate</Text>
      </View>
    </View>
    <View style={styles.rowView}>
      <View style={[styles.cellView, { borderRightWidth: 0 }]}>
        <Text style={styles.tableValue}>{formatMoney(quantity)}</Text>
      </View>
      <View style={[styles.cellView, { borderRightWidth: 0 }]}>
        <Text style={styles.tableValue}>{unit}</Text>
      </View>
      <View style={[styles.cellView]}>
        <Text style={styles.tableValue}>${formatMoney(rate)}</Text>
      </View>
    </View>
  </View>
)

const renderComments = comments => {
  if (isEmpty(comments)) return null
  return (
    <View style={styles.commentsView}>
      <Text style={styles.comments}>Comment: {comments}</Text>
    </View>
  )
}

const renderEditButton = (item, editable) => {
  if (editable) {
    return (
      <Button onPress={() => showEdit(item)} style={styles.button}>
        <Icon name="edit" style={styles.icon} />
      </Button>
    )
  }
  return null
}

const renderDeleteButton = (item, editable, deleteExtraLineProps) => {
  if (editable) {
    return (
      <Button onPress={() => deleteExtraLineProps(item)} style={styles.button}>
        <Icon name="delete" style={styles.icon} />
      </Button>
    )
  }
  return null
}

const renderIcons = (item, editable, deleteExtraLineProps) => (
  <View>
    <View style={styles.separator} />
    <View style={styles.iconView}>
      <Button onPress={() => showDescription(item.description)} style={styles.button}>
        <Icon name="description" style={styles.icon} />
      </Button>
      <Button
        onPress={() => Actions.mapPicker({
          coordinate: item.location,
          address: item.address,
          readonly: true,
        })}
        style={styles.button}
      >
        <Icon name="map-location" style={styles.icon} />
      </Button>
      {renderEditButton(item, editable)}
      {renderDeleteButton(item, editable, deleteExtraLineProps)}
    </View>
  </View>
  )

const ExtraLine = props => {
  const { item, editable } = props
  const { name, quantity, rate, comments } = item
  const unit = getQuantityUnit(item)
  return (
    <View style={styles.container}>
      <View style={styles.nameView}><Text style={styles.name}>{name}</Text></View>
      {renderTable(quantity, unit, rate)}
      {renderComments(comments)}
      {renderIcons(item, editable, props.deleteExtraLine)}
    </View>
  )
}

ExtraLine.propTypes = {
  item: ExtraLineShape.isRequired,
  editable: PropTypes.bool,
  deleteExtraLine: PropTypes.func.isRequired,
}

ExtraLine.defaultProps = {
  editable: true,
}

const mapDispatchToProps = {
  deleteExtraLine,
}

export default connect(null, mapDispatchToProps)(ExtraLine)
