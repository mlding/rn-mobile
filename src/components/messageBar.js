import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View, Text, StatusBar, StyleSheet, Animated } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { verticalScale, scale, WindowHeight } from '../utilities/responsiveDimension'
import { COLOR, FONT_WEIGHT, Z_INDEX } from '../constants/styleGuide'
import TOAST_TYPE from '../constants/messageType'
import { IS_IOS } from '../utilities/systemUtil'
import SCENE_KEY from '../constants/sceneKey'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: Z_INDEX.NORMAL,
    paddingBottom: 2,
    backgroundColor: COLOR.TRANSPARENT,
  },
  bottom: {
    bottom: 0,
  },
  barContainer: {
    flexDirection: 'row',
    paddingVertical: verticalScale(22),
    paddingHorizontal: scale(16),
    backgroundColor: COLOR.WHITE,
    shadowColor: COLOR.BLACK,
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    elevation: 2,
  },
  text: {
    flex: 1,
    marginLeft: 5,
    color: COLOR.DARK_GRAY,
    fontSize: 15,
    fontWeight: FONT_WEIGHT.LIGHT,
  },
})


export default class MessageBar extends PureComponent {
  constructor(props) {
    super(props)
    this.animatedValue = new Animated.Value(0)
  }

  componentDidMount() { // eslint-disable-line
    if (IS_IOS) {
      StatusBar.setHidden(true)
    }
    this.timeout = setTimeout(() => {
      if (IS_IOS) {
        StatusBar.setHidden(false)
      }
      this.playDisappearAnimation()
    }, 2500)
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    if (IS_IOS) {
      StatusBar.setHidden(false)
    }
  }

  popupSelfWhenAnimationEnd = () => {
    if (Actions.currentScene === SCENE_KEY.MESSAGE_BAR) {
      Actions.pop()
    }
  }

  playDisappearAnimation() {
    Animated.timing(this.animatedValue, {
      toValue: -WindowHeight(),
      duration: 1000,
    }).start(this.popupSelfWhenAnimationEnd)
  }

  renderIcon() {
    let iconName = 'check-circle'
    let iconColor = COLOR.APPROVED
    if (this.props.messageType === TOAST_TYPE.ERROR) {
      iconName = 'error'
      iconColor = COLOR.FLAGGED
    }
    return <Icon name={iconName} size={20} color={iconColor} />
  }

  render() {
    const style = this.props.isModal ? styles.bottom : null
    const transform = { transform: [{ translateY: this.animatedValue }] }
    return (
      <Animated.View style={[styles.container, style, transform]}>
        <View style={[styles.barContainer]}>
          {this.renderIcon()}
          <Text style={styles.text} numberOfLines={5}>
            { this.props.message }
          </Text>
        </View>
      </Animated.View>
    )
  }
}

MessageBar.propTypes = {
  message: PropTypes.string.isRequired,
  messageType: PropTypes.string.isRequired,
  isModal: PropTypes.bool,
}

MessageBar.defaultProps = {
  isModal: false,
}
