import React, { Component } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { isEmpty, noop } from 'lodash'
import PropTypes from 'prop-types'
import { COLOR, FONT } from '../constants/styleGuide'
import ClearIcon from './clearIcon'
import SearchIcon from './searchIcon'
import { StyleShape } from './shape'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 30,
    borderRadius: 2,
    backgroundColor: COLOR.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  animatedView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputContainer: {
    flex: 1,
    paddingRight: 25,
  },
  textInput: {
    fontSize: FONT.MD,
    textAlignVertical: 'center',
    paddingVertical: 0,
  },
})

const AUTO_SEARCH_DEFAULT_TIME = 500

class SearchBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputText: props.defaultText,
    }
  }

  componentWillUnmount() {
    if (this.autoSearchTimeout) {
      clearTimeout(this.autoSearchTimeout)
    }
  }

  onChange = value => {
    this.setText(value)
    this.props.backFillInput(value)
  }

  setText = value => {
    this.setState({
      inputText: value,
    })

    if (this.props.autoSearch) {
      if (this.autoSearchTimeout) {
        clearTimeout(this.autoSearchTimeout)
      }
      this.autoSearchTimeout = setTimeout(() => {
        this.notifySearch()
      }, AUTO_SEARCH_DEFAULT_TIME)
    }
  }

  clearTextInput = () => {
    this.setText('')
    this.props.handleClear()
  }

  notifySearch = () => {
    this.props.handleSearch(this.state.inputText)
  }

  focus = () => {
    this.textInput.focus()
  }

  render() {
    const { style, placeholder, autoFocus } = this.props
    return (
      <View style={[styles.container, style]}>
        <View style={styles.animatedView}>
          <SearchIcon />
          <View style={styles.textInputContainer}>
            <TextInput
              ref={ref => { this.textInput = ref }}
              value={this.state.inputText}
              style={styles.textInput}
              placeholder={placeholder}
              onChangeText={value => this.onChange(value)}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={autoFocus}
              onSubmitEditing={this.notifySearch}
              underlineColorAndroid="transparent"
            />
          </View>
        </View>
        {
          !isEmpty(this.state.inputText) &&
            <ClearIcon
              onPress={this.clearTextInput}
            />
        }
      </View>
    )
  }
}

SearchBar.propTypes = {
  style: StyleShape,
  defaultText: PropTypes.string,
  placeholder: PropTypes.string,
  handleSearch: PropTypes.func,
  handleClear: PropTypes.func,
  backFillInput: PropTypes.func,
  autoSearch: PropTypes.bool,
  autoFocus: PropTypes.bool,
}

SearchBar.defaultProps = {
  style: {},
  defaultText: '',
  placeholder: '',
  handleSearch: noop,
  handleClear: noop,
  backFillInput: noop,
  autoSearch: false,
  autoFocus: false,
}

export default SearchBar
