import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import jwtDecode from 'jwt-decode'
import { compose } from 'recompose'
import KeychainStorage from '../../utilities/keychainStorage'
import { refreshToken } from '../actions'
import { COLOR } from '../../constants/styleGuide'
import loadingLayer from '../../components/loadingLayer'
import { redirectToLogin } from '../helper'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
})

class Starter extends Component {
  componentWillMount() {
    KeychainStorage.getToken().then(token => {
      try {
        if (!token || (jwtDecode(token).exp * 1000) <= Date.now()) {
          redirectToLogin()
          return
        }
        this.props.refreshToken()
      } catch (error) {
        redirectToLogin()
      }
    })
  }

  render() { // eslint-disable-line
    return <View style={styles.container} />
  }
}

Starter.propTypes = {
  refreshToken: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  showLoading: state.auth.refreshing,
  isPureIndicator: true,
})

export default compose(connect(mapStateToProps, { refreshToken }), loadingLayer)(Starter)
