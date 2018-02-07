import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { isNil, noop } from 'lodash'
import { COLOR, FONT } from '../../constants/styleGuide'
import { StyleShape } from '../../shared/shape'


const styles = StyleSheet.create({
  tag: {
    height: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: COLOR.WHITE,
    borderWidth: 1,
    borderColor: COLOR.SILVER,
    borderRadius: 2,
    paddingHorizontal: 16,
  },
  tagText: {
    fontSize: FONT.MD,
    color: COLOR.SILVER,
    backgroundColor: COLOR.WHITE,
    textAlign: 'center',
  },
  selectedTag: {
    borderColor: COLOR.LINK,
  },
  selectedTagText: {
    color: COLOR.LINK,
  },
})

class ToggleButton extends Component {
  state = {
    isSelected: false,
  }

  getCurrentStatus = () => (
    isNil(this.props.value) ? this.state.isSelected : this.props.value
  );

  handleOnPress = () => {
    const nextSelectedStatus = !this.getCurrentStatus()
    this.changeSelectedStatusTo(nextSelectedStatus)
    this.props.onSelectedChange(nextSelectedStatus)
  }

  changeSelectedStatusTo = selectedStatus => {
    this.setState({ isSelected: selectedStatus })
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.handleOnPress}>
        <View style={[styles.tag, this.getCurrentStatus() && styles.selectedTag, this.props.style]}>
          <Text style={[styles.tagText, this.getCurrentStatus() && styles.selectedTagText]}>
            { this.props.text }
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

ToggleButton.defaultProps = {
  text: '',
  onSelectedChange: noop,
  style: {},
  value: null,
}

ToggleButton.propTypes = {
  text: PropTypes.string,
  onSelectedChange: PropTypes.func,
  style: StyleShape,
  value: PropTypes.bool,
}

export default ToggleButton
