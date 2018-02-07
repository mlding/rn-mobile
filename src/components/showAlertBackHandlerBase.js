import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { BackHandler } from 'react-native'
import { noop } from 'lodash'
import { showAlertBeforeBack } from '../utilities/actions'

const ShowAlertBackHandlerBase = (Wrapper, type = null) => {
  class ShowAlertBackHandler extends Component {
    componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.showAlertAndDisableBackForAndroid)
    }

    componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.showAlertAndDisableBackForAndroid)
    }

    showAlertAndDisableBackForAndroid = () => {
      this.props.showAlertBeforeBack(type)
      return true
    }

    render() {
      return (
        <Wrapper {...this.props} />
      )
    }
  }
  ShowAlertBackHandler.propTypes = {
    showAlertBeforeBack: PropTypes.func,
  }

  ShowAlertBackHandler.defaultProps = {
    showAlertBeforeBack: noop,
  }

  const mapDispatchToProps = {
    showAlertBeforeBack,
  }
  return connect(null, mapDispatchToProps)(ShowAlertBackHandler)
}

export default ShowAlertBackHandlerBase

