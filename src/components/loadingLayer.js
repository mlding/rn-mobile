import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View, Modal, ActivityIndicator, StyleSheet, BackHandler } from 'react-native'
import { noop } from 'lodash'
import { scale, verticalScale } from '../utilities/responsiveDimension'
import { COLOR } from '../constants/styleGuide'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: scale(75),
    height: verticalScale(60),
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
  },
})

const LoadingModal = props => {
  const { visible, isPureIndicator } = props
  if (!visible) return <View />
  return (
    <Modal transparent onRequestClose={noop}>
      <View style={styles.container}>
        <View style={[
          styles.content,
          { backgroundColor: isPureIndicator ? COLOR.TRANSPARENT : COLOR.DARK_GRAY },
        ]}
        >
          <ActivityIndicator
            animating
            color={isPureIndicator ? COLOR.DARK_GRAY : COLOR.WHITE}
            size="small"
          />
        </View>
      </View>
    </Modal>
  )
}

LoadingModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  isPureIndicator: PropTypes.bool,
}

LoadingModal.defaultProps = {
  isPureIndicator: false,
}

const loadingLayer = WrappedComponent => {
  class LoadingLayer extends PureComponent {
    componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.disableAndroidBackAction)
    }

    componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.disableAndroidBackAction)
    }

    disableAndroidBackAction = () => this.props.showLoading

    render() {
      const {
        showLoading,
        isPureIndicator,
        hideComponentWhenLoading,
        ...otherProps
      } = this.props
      return (
        <View style={styles.loadingContainer}>
          <LoadingModal visible={showLoading} isPureIndicator={isPureIndicator} />
          {(showLoading && hideComponentWhenLoading) ?
            null :
            <WrappedComponent {...otherProps} />
          }
        </View>
      )
    }
  }

  LoadingLayer.propTypes = {
    showLoading: PropTypes.bool.isRequired,
    isPureIndicator: PropTypes.bool,
    hideComponentWhenLoading: PropTypes.bool,
  }

  LoadingLayer.defaultProps = {
    hideComponentWhenLoading: false,
    isPureIndicator: false,
  }

  return LoadingLayer
}

export default loadingLayer

