import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { noop, isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import { COLOR, FONT, FONT_WEIGHT } from '../constants/styleGuide'
import { scale } from '../utilities/responsiveDimension'
import Button from '../components/button'
import Status from './reportStatus'

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: 15,
    paddingVertical: 13,
  },
  container: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryContainer: {
    marginBottom: 4,
    alignItems: 'center',
  },
  nameContainer: {
    marginRight: 10,
  },
  statusContainer: {
    width: scale(96),
    flexDirection: 'row',
  },
  titleText: {
    fontSize: FONT.XL,
    fontWeight: FONT_WEIGHT.BOLD,
    lineHeight: 25,
    color: COLOR.MEDIUM_BLACK,
  },
  contentText: {
    fontSize: FONT.MD,
    lineHeight: 20,
    color: COLOR.SILVER,
  },
})

const ReportItemCell = props => {
  const { title, status, content, dateDescription, onPress } = props
  return (
    <Button
      style={styles.mainContainer}
      onPress={() => onPress()}
    >
      <View style={[styles.content, styles.primaryContainer]}>
        <View style={styles.container}>
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={styles.container} />
          <Status status={status} />
        </View>
      </View>
      <View style={styles.content}>
        <View style={[styles.container, styles.nameContainer]} >
          <Text style={styles.contentText} numberOfLines={1}>
            {content}
          </Text>
        </View>
        {!isEmpty(dateDescription) &&
        <Text style={styles.contentText}>
          {dateDescription}
        </Text>
          }
      </View>
    </Button>
  )
}

ReportItemCell.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  dateDescription: PropTypes.string,
  onPress: PropTypes.func,
}

ReportItemCell.defaultProps = {
  onPress: noop,
  dateDescription: null,
}

export default ReportItemCell
