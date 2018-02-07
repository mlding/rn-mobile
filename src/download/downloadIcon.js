import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Image, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import * as Progress from 'react-native-progress'
import { Actions } from 'react-native-router-flux'
import { download } from './actions'
import downloadIcon from '../assets/images/download.png' // eslint-disable-line
import downloadWithErrorIcon from '../assets/images/downloadWithError.png' // eslint-disable-line
import Button from '../components/button'
import { COLOR, OPACITY } from '../constants/styleGuide'
import {
  downloadedFilesCountSelector,
  downloadFilesCountSelector,
  hasErrorSelector,
  isDownloadingSelector,
} from './selector'
import { StyleShape } from '../shared/shape'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  progress: {
    position: 'absolute',
    top: 24,
  },
})

class DownloadIcon extends PureComponent {
  handlePress = () => {
    const { downloadFilesCount, downloadedFilesCount } = this.props
    if (downloadFilesCount === downloadedFilesCount) {
      Actions.toast({ message: 'No New Files' })
    }
    this.props.download()
  }

  renderProgressBar = () => {
    const { isDownloading, downloadedFilesCount, downloadFilesCount } = this.props
    if (isDownloading) {
      return (
        <Progress.Bar
          style={styles.progress}
          progress={downloadFilesCount === 0 ? 0 : downloadedFilesCount / downloadFilesCount}
          color={COLOR.APPROVED}
          unfilledColor={COLOR.UNFILLED}
          width={32}
          height={2}
          borderWidth={0}
          borderRadius={2}
        />
      )
    }
    return null
  }

  render() {
    const { isDownloading, hasError, style } = this.props
    const newStyle = isDownloading ? { opacity: OPACITY.DISABLED } : null
    return (
      <Button
        style={style}
        onPress={this.handlePress}
        disabled={isDownloading}
      >
        <View style={styles.container}>
          <Image source={hasError ? downloadWithErrorIcon : downloadIcon} style={newStyle} />
          {this.renderProgressBar()}
        </View>
      </Button>
    )
  }
}

DownloadIcon.propTypes = {
  download: PropTypes.func.isRequired,
  downloadFilesCount: PropTypes.number,
  downloadedFilesCount: PropTypes.number,
  isDownloading: PropTypes.bool,
  hasError: PropTypes.bool,
  style: StyleShape,
}

DownloadIcon.defaultProps = {
  downloadFilesCount: 0,
  downloadedFilesCount: 0,
  isDownloading: false,
  hasError: false,
  style: null,
}

const mapStateToProps = createStructuredSelector({
  downloadFilesCount: downloadFilesCountSelector,
  downloadedFilesCount: downloadedFilesCountSelector,
  isDownloading: isDownloadingSelector,
  hasError: hasErrorSelector,
})

const mapDispatchToProps = {
  download,
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadIcon)
