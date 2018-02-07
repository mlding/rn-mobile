import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, Animated, StyleSheet, BackHandler } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { FONT, COLOR } from '../../constants/styleGuide'
import SCENE_KEY from '../../constants/sceneKey'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.TRANSPARENT,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.TRANSPARENT,
  },
  content: {
    width: 140,
    height: 46,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  text: {
    fontSize: FONT.L,
    color: COLOR.WHITE,
  },
})

export default class Toast extends Component {
  state = {
    fadeAnim: new Animated.Value(0),
  }

  componentDidMount() {
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: 300,
    }).start()
    BackHandler.addEventListener('hardwareBackPress', this.disableAndroidBackAction)
    this.timeout = setTimeout(() => {
      if (Actions.currentScene === SCENE_KEY.TOAST) {
        Actions.pop()
      }
    }, 1000)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.disableAndroidBackAction)
  }

  disableAndroidBackAction = () => true

  render() {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.content, { opacity: this.state.fadeAnim }]}>
          <Text style={styles.text}>{this.props.message}</Text>
        </Animated.View>
      </View>
    )
  }
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
}

