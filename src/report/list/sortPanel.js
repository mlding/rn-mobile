import React from 'react'
import { Text, TouchableWithoutFeedback, View, StyleSheet } from 'react-native'
import { Actions } from 'react-native-router-flux'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { map } from 'lodash'
import Icon from 'react-native-vector-icons/Ionicons'
import { COLOR, FONT } from '../../constants/styleGuide'
import { NavBarHeight } from '../../utilities/responsiveDimension'
import { sortReportList } from '../actions'
import { SORT_MAPPING, DEFAULT_SORT_TYPE } from '../constants'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: NavBarHeight,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLOR.TRANSPARENT_BACKGROUND,
  },
  sortContainer: {
    backgroundColor: COLOR.WHITE,
  },
  sortCell: {
    paddingVertical: 13,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: COLOR.BORDER,
  },
  sortText: {
    fontSize: FONT.LG,
  },
  checkIcon: {
    position: 'absolute',
    right: 14,
    fontSize: FONT.XL,
    color: COLOR.LINK,
  },
})
export const SortPanel = props => {
  const { role, selected } = props
  const SORT_TYPES = SORT_MAPPING[role.toUpperCase()]

  return (<TouchableWithoutFeedback onPress={() => Actions.pop()}>
    <View style={styles.container}>
      <View style={styles.sortContainer}>
        {map(SORT_TYPES, (sortType, index) => (
          <TouchableWithoutFeedback
            onPress={() => {
              props.sortReportList(sortType.value)
              Actions.pop()
            }
          }
            key={index}
          >
            <View style={styles.sortCell}>
              <Text style={styles.sortText}>{sortType.label}</Text>
              {selected === sortType.value ? (<Icon name="md-checkmark" style={styles.checkIcon} />) : <View />}
            </View>
          </TouchableWithoutFeedback>
          ),
        )}
      </View>
    </View>
  </TouchableWithoutFeedback>)
}

SortPanel.propTypes = {
  role: PropTypes.string.isRequired,
  selected: PropTypes.string.isRequired,
}

SortPanel.defaultProps = {
  sortTypes: [],
  selected: DEFAULT_SORT_TYPE,
}

const mapStateToProps = state => ({
  selected: state.reports.sortType,
  role: state.auth.user.role,
})

export default connect(mapStateToProps, { sortReportList })(SortPanel)
