import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { FONT, COLOR } from '../../constants/styleGuide'
import Button from '../../components/button'
import { buttonStyles, getButtonContainerStyles } from '../styles'
import { resetPassword } from '../actions'
import loadingLayer from '../../components/loadingLayer'
import { TITLE } from '../../constants/tab'
import { makeupWorkSpace } from '../helper'
import { toValidWorkSpace, toValidDomain } from '../utilities'
import NavigationBar from '../../components/navigationBar'
import LabelTextInput from '../../components/labelTextInput'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  navTitle: {
    paddingRight: 50,
    flex: 1,
    textAlign: 'center',
    color: COLOR.WHITE,
    fontSize: FONT.XL,
    fontWeight: '400',
    alignSelf: 'center',
  },
  content: {
    paddingHorizontal: 30,
    paddingTop: 30,
  },
})

const InputTextProp = {
  focusBorderColor: COLOR.HIGH_LIGHT,
  defaultBorderColor: COLOR.BORDER,
  clearButtonMode: 'while-editing',
}

class ForgotPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: props.email,
      workspace: props.workspace,
    }
  }

  onPress = () => {
    this.props.resetPassword(this.state.email, makeupWorkSpace(toValidDomain(this.state.workspace)))
  }

  get disabled() {
    const { email, workspace } = this.state
    const reg = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/  // eslint-disable-line
    return (!reg.test(email) || !workspace)
  }

  setValidDomain = () => {
    this.setState({ workspace: toValidDomain(this.state.workspace) })
  }

  trimEmail = () => {
    this.setState({ email: this.state.email.trim() })
  }

  render() {
    const disabled = this.disabled
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <NavigationBar hasBackButton>
          <Text style={styles.navTitle}>{TITLE.FORGOT_PASSWORD}</Text>
        </NavigationBar>
        <View style={styles.content}>
          <LabelTextInput
            text={this.state.email}
            placeholder="Email"
            onChangeText={text => this.setState({ email: text })}
            onBlur={this.trimEmail}
            keyboardType="email-address"
            autoFocus
            {...InputTextProp}
          />
          <LabelTextInput
            text={this.state.workspace}
            placeholder="Workspace"
            onChangeText={text => this.setState({ workspace: toValidWorkSpace(text) })}
            onBlur={this.setValidDomain}
            {...InputTextProp}
          />
          <Button
            onPress={this.onPress}
            disabled={disabled}
            style={[getButtonContainerStyles(disabled)]}
          >
            <Text style={buttonStyles.text}>Send Email</Text>
          </Button>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

ForgotPassword.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  email: PropTypes.string,
  workspace: PropTypes.string,
}

ForgotPassword.defaultProps = {
  email: '',
  workspace: '',
}

const mapStateToProps = state => ({
  showLoading: state.auth.loading,
})

const mapDispatchToProps = {
  resetPassword,
}

export default compose(connect(mapStateToProps, mapDispatchToProps), loadingLayer)(ForgotPassword)
