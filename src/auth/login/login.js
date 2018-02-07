import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Image, Text, StyleSheet } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { login, clearToken } from '../actions'
import { COLOR, FONT } from '../../constants/styleGuide'
import { verticalScale, WindowWidth } from '../../utilities/responsiveDimension'
import Button from '../../components/button'
import { buttonStyles, getButtonContainerStyles } from '../styles'
import loadingLayer from '../../components/loadingLayer'
import { showError } from '../../utilities/messageBar'
import { makeupWorkSpace } from '../helper'
import { toValidWorkSpace, toValidDomain } from '../utilities'
import { StableBottomView } from '../../components/stableBottomView'
import LabelTextInput from '../../components/labelTextInput'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  content: {
    paddingHorizontal: 30,
    marginTop: 10,
  },
  header: {
    width: WindowWidth(),
    height: verticalScale(180),
  },
  copyright: {
    color: COLOR.SILVER,
    fontSize: FONT.SM,
    textAlign: 'center',
  },
  link: {
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    fontSize: FONT.MD,
    color: COLOR.HEADER,
  },
})

const InputTextProp = {
  focusBorderColor: COLOR.HIGH_LIGHT,
  defaultBorderColor: COLOR.BORDER,
  clearButtonMode: 'while-editing',
}

const headerIcon = require('../../assets/images/login.png') // eslint-disable-line

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      workspace: '',
    }
  }

  componentDidMount() {
    this.props.clearToken()
  }

  get disabled() {
    const { email, password, workspace } = this.state
    return !email || !password || !workspace
  }

  setValidDomain = () => {
    this.setState({ workspace: toValidDomain(this.state.workspace) })
  }

  login = () => {
    const { email, password, workspace } = this.state
    this.props.login({ email, password }, makeupWorkSpace(toValidDomain(workspace)))
      .catch(message => { showError(message, true) })
  }

  trimEmail = () => {
    this.setState({ email: this.state.email.trim() })
  }

  trimPassword = () => {
    this.setState({ password: this.state.password.trim() })
  }

  render() {
    const { email, password, workspace } = this.state
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          <Image source={headerIcon} resizeMode="cover" style={styles.header} />
          <View style={styles.content}>
            <LabelTextInput
              text={email}
              placeholder="Email"
              onChangeText={text => this.setState({ email: text })}
              onBlur={this.trimEmail}
              keyboardType="email-address"
              {...InputTextProp}
            />
            <LabelTextInput
              text={password}
              placeholder="Password"
              secureTextEntry
              onChangeText={text => this.setState({ password: text })}
              onBlur={this.trimPassword}
              {...InputTextProp}
            />
            <LabelTextInput
              text={workspace}
              placeholder="Workspace"
              onChangeText={text => this.setState({ workspace: toValidWorkSpace(text) })}
              onBlur={this.setValidDomain}
              {...InputTextProp}
            />
            <Button
              onPress={this.login}
              disabled={this.disabled}
              style={getButtonContainerStyles(this.disabled)}
            >
              <Text style={buttonStyles.text}>Login</Text>
            </Button>
            <Button
              onPress={() => Actions.forgotPassword({
                email: this.state.email,
                workspace: this.state.workspace })}
              style={styles.link}
            >
              <Text style={styles.linkText}>Forgot Password</Text>
            </Button>
          </View>
        </KeyboardAwareScrollView>
        <StableBottomView
          height={40}
          hasNavBar={false}
        >
          <Text style={styles.copyright}>Powered by FRESNEL</Text>
        </StableBottomView>
      </View>
    )
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  clearToken: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  showLoading: state.auth.loading,
})

export default compose(connect(mapStateToProps, { login, clearToken }), loadingLayer)(Login)
