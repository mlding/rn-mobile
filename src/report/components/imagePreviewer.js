import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Image, StyleSheet, TouchableOpacity, View, Animated, ActivityIndicator } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { ImageShape } from '../../shared/shape'
import { OPACITY, COLOR, Z_INDEX } from '../../constants/styleGuide'

const styles = StyleSheet.create({
  imageContainer: {
    zIndex: Z_INDEX.NORMAL,
    backgroundColor: COLOR.BLACK,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  loadingContainer: {
    zIndex: Z_INDEX.MAX,
  },
})

class ImagePreviewer extends Component {
  state = {
    thumbnailOpacity: new Animated.Value(1),
    loadingOpacity: new Animated.Value(1),
  }

  onLoad = () => (
    Animated.parallel([
      Animated.timing(this.state.thumbnailOpacity, {
        toValue: 0,
        duration: 100,
      }),
      Animated.timing(this.state.loadingOpacity, {
        toValue: 0,
        duration: 100,
      }),
    ]).start()
  )

  renderLocalImage = picture => (
    <Image
      source={{ uri: picture.uri }}
      style={styles.container}
      resizeMode="contain"
    />
  )

  renderLoading = () => (
    <Animated.View style={[styles.container, styles.loadingContainer, { 'opacity': this.state.loadingOpacity }]}>
      <ActivityIndicator
        animating
        color={COLOR.WHITE}
        size="small"
      />
    </Animated.View>
  )

  renderRemoteImage = picture => (
    <View style={styles.container}>
      {this.renderLoading()}
      <Animated.Image
        source={{ uri: picture.picture }}
        style={styles.container}
        resizeMode="contain"
        onLoad={this.onLoad}
      />
      <Animated.Image
        source={{ uri: picture.thumbnail }}
        style={[styles.container, { 'opacity': this.state.thumbnailOpacity }]}
        resizeMode="contain"
      />
    </View>
  )

  renderImage = () => {
    const { pictures, index } = this.props
    const picture = pictures[index]
    if (picture.id) {
      return this.renderRemoteImage(picture)
    }

    return this.renderLocalImage(picture)
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() => Actions.pop()}
        activeOpacity={OPACITY.NORMAL}
        style={[styles.imageContainer, styles.container]}
      >
        { this.renderImage() }
      </TouchableOpacity>
    )
  }
}

ImagePreviewer.propTypes = {
  pictures: PropTypes.arrayOf(ImageShape),
  index: PropTypes.number,
}

ImagePreviewer.defaultProps = {
  pictures: [],
  index: 0,
}

export default ImagePreviewer
