import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, FlatList, Text, View } from 'react-native'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { quantityDescriptionsSelector } from '../../cache/selector'
import { COLOR, FONT } from '../../constants/styleGuide'
import { QuantityDescriptionShape } from '../../shared/shape'
import Button from '../../components/button'
import { getQuantityDescriptionUnit } from '../utilities'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  itemContainer: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 8,
  },

  name: {
    fontSize: FONT.MD,
    color: COLOR.MEDIUM_BLACK,
  },

  separator: {
    height: 1,
    marginRight: 0,
    marginLeft: 15,
    backgroundColor: COLOR.LIGHT_GREY,
  },
})

class Unit extends Component {

  handleSelectItem = quantityDescription => {
    this.props.updateUnit(quantityDescription)
    Actions.pop()
  }

  renderSeparator = () => (
    <View style={styles.separator} />)

  renderItem = quantityDescription => (
    <Button
      onPress={() => this.handleSelectItem(quantityDescription)}
      style={styles.itemContainer}
    >
      <Text style={styles.name}>{getQuantityDescriptionUnit(quantityDescription)}</Text>
    </Button>
  )

  render() {
    const { quantityDescriptions } = this.props
    return (
      <FlatList
        style={styles.container}
        data={quantityDescriptions}
        renderItem={({ item }) => this.renderItem(item)}
        ItemSeparatorComponent={() => this.renderSeparator()}
        keyExtractor={(item, index) => index}
      />
    )
  }
}

Unit.propTypes = {
  quantityDescriptions: PropTypes.arrayOf(QuantityDescriptionShape),
  updateUnit: PropTypes.func.isRequired,
}

Unit.defaultProps = {
  quantityDescriptions: [],
}

const mapStateToProps = createStructuredSelector({
  quantityDescriptions: quantityDescriptionsSelector,
})

export default connect(mapStateToProps)(Unit)
