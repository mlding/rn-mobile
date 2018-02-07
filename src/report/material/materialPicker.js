import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, FlatList, Text, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { materialsSelector } from '../../cache/selector'
import { COLOR, FONT } from '../../constants/styleGuide'
import { MaterialShape, QuantityShape, ReportLinesShape } from '../../shared/shape'
import { addQuantity, editQuantityName } from '../actions'
import SearchBar from '../../shared/searchBar'
import Button from '../../components/button'
import { getMaterialDescription, getFilterData } from '../utilities'
import NavigationBar from '../../components/navigationBar'

export const styles = StyleSheet.create({
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

  materialName: {
    fontSize: FONT.MD,
    color: COLOR.MEDIUM_BLACK,
  },

  separator: {
    height: 1,
    marginRight: 0,
    marginLeft: 15,
    backgroundColor: COLOR.LIGHT_GREY,
  },

  searchBar: {
    flex: 1,
    marginRight: 16,
  },
})

export const MATERIAL_PICKER_ACTION = {
  ADD: 'add',
  EDIT: 'edit',
}


export class MaterialPicker extends Component {
  state = {
    searchTxt: '',
  }

  handleSelectItem = material => {
    const { pickerAction, reportLine, quantity } = this.props
    if (pickerAction === MATERIAL_PICKER_ACTION.ADD) {
      this.props.addQuantity(reportLine, material)
    } else if (pickerAction === MATERIAL_PICKER_ACTION.EDIT) {
      this.props.editQuantityName(reportLine, quantity, material)
    }
    Actions.pop()
  }

  renderNavigationBar = () => (
    <NavigationBar
      hasBackButton
    >
      <SearchBar
        style={styles.searchBar}
        placeholder="Search material"
        autoSearch
        handleSearch={text => this.setState({ searchTxt: text })}
      />
    </NavigationBar>)


  renderSeparator = () => (
    <View style={styles.separator} />)

  renderItem = material => (
    <Button
      onPress={() => this.handleSelectItem(material)}
      style={styles.itemContainer}
    >
      <Text style={styles.materialName}>{getMaterialDescription(material)}</Text>
    </Button>
  )

  render() {
    const { materials, reportLine, quantity } = this.props
    return (
      <View style={styles.container}>
        {this.renderNavigationBar()}
        <FlatList
          data={getFilterData(materials, reportLine, quantity, this.state.searchTxt)}
          renderItem={({ item }) => this.renderItem(item)}
          ItemSeparatorComponent={() => this.renderSeparator()}
          keyExtractor={(item, index) => index}
        />
      </View>)
  }
}

MaterialPicker.propTypes = {
  materials: PropTypes.arrayOf(MaterialShape),
  reportLine: ReportLinesShape.isRequired,
  quantity: QuantityShape,
  pickerAction: PropTypes.oneOf(Object.values(MATERIAL_PICKER_ACTION)).isRequired,
  addQuantity: PropTypes.func.isRequired,
  editQuantityName: PropTypes.func.isRequired,
}

MaterialPicker.defaultProps = {
  materials: [],
  quantity: null,
}

const mapStateToProps = createStructuredSelector({
  materials: materialsSelector,
})

export default connect(mapStateToProps, { addQuantity, editQuantityName })(MaterialPicker)
