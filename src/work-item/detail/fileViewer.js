import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import PDFView from 'react-native-pdf-viewer'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { onlineSelector } from '../../shared/selector'
import Empty from './empty'
import { NO_NETWORK, SERVER_ERROR } from '../../constants/toast'
import { IS_ANDROID } from '../../utilities/systemUtil'
import { COLOR, Z_INDEX } from '../../constants/styleGuide'
import { WindowWidth, WindowHeight, NavBarHeightOrigin } from '../../utilities/responsiveDimension'

const styles = StyleSheet.create({
  emptyPage: {
    position: 'absolute',
    backgroundColor: COLOR.TRANSPARENT,
    height: WindowHeight() - NavBarHeightOrigin,
    width: WindowWidth(),
    zIndex: Z_INDEX.NORMAL,
  },
  webView: {
    flex: 1,
  },
})

class FileViewer extends PureComponent {
  state = {
    delay: true,
    showLoading: true,
  }

  componentDidMount() {
    setTimeout(() => this.setState({ delay: false }), 0)
  }

  renderLoadingIndicator = () => {
    if (this.state.showLoading) {
      return (
        <View style={styles.emptyPage}>
          <ActivityIndicator
            animating
            color={COLOR.DARK_GRAY}
            size="small"
            style={styles.webView}
          />
        </View>
      )
    }
    return null
  }

  render() {
    if (this.state.delay) {
      return <View />
    }
    return (
      <View style={styles.webView}>
        {!IS_ANDROID && this.renderLoadingIndicator()}
        <PDFView
          src={this.props.uri}
          style={styles.webView}
          startInLoadingState={IS_ANDROID}
          onLoadEnd={() => this.setState({ showLoading: false })}
          renderError={() => <Empty label={this.props.online ? SERVER_ERROR : NO_NETWORK} />}
        />
      </View>
    )
  }
}

FileViewer.propTypes = {
  uri: PropTypes.string.isRequired,
  online: PropTypes.bool,
}

FileViewer.defaultProps = {
  online: true,
}

const mapStateToProps = createStructuredSelector({
  online: onlineSelector,
})

export default connect(mapStateToProps)(FileViewer)
