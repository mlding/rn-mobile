import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, Image, StatusBar } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import ImagePicker from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/Ionicons'
import { pick, last } from 'lodash'
import { ReportLinesShape } from '../../shared/shape'
import { COLOR, FONT } from '../../constants/styleGuide'
import { addPicture, deletePicture } from '../actions'
import Button from '../../components/button'
import { IMAGE_FOLDER_NAME } from '../../constants/download'
import { IS_IOS } from '../../utilities/systemUtil'

const styles = StyleSheet.create({
  imagePickerContainer: {
    flexDirection: 'row',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    marginTop: 15,
    marginRight: 10,
    width: 80,
    height: 80,
    borderColor: COLOR.FADE_BLUE,
    borderWidth: 1,
    borderRadius: 2,
  },
  addButtonIcon: {
    fontSize: 40,
    fontWeight: '100',
    height: 40,
    lineHeight: 40,
    color: COLOR.FADE_BLUE,
  },
  imageContainer: {
    marginRight: 10,
    marginTop: 15,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 2,
    backgroundColor: COLOR.DARK_WHITE,
  },
  deleteButton: {
    position: 'absolute',
    right: -14,
    top: -14,
    margin: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLOR.BORDER,
  },
  deleteIcon: {
    fontSize: FONT.MD,
    color: COLOR.WHITE,
  },
})

class ImagePickerContainer extends Component {
  pickImage = () => {
    const options = {
      title: null,
      takePhotoButtonTitle: 'Take a photo',
      chooseFromLibraryButtonTitle: 'Select from photo gallery',
      noData: true,
      quality: 0.95,
      storageOptions: {
        skipBackup: true,
        path: IMAGE_FOLDER_NAME,
        cameraRoll: true,
      },
    }

    if (IS_IOS) {
      StatusBar.setBarStyle('dark-content')
    }
    ImagePicker.showImagePicker(options, response => {
      if (IS_IOS) {
        StatusBar.setBarStyle('light-content')
      }
      if (response.uri) {
        const { reportLine } = this.props
        const picture = pick(response, ['uri', 'type'])
        picture.fileName = last(picture.uri.split('/'))
        this.props.addPicture(reportLine, picture)
      }
    })
  }


  viewPicture = index => {
    const { pictures } = this.props.reportLine
    Actions.imagePreviewer({ pictures, index })
  }

  renderAddButton = () => {
    const { editable } = this.props
    if (!editable) {
      return (<View />)
    }
    return (
      <Button
        onPress={this.pickImage}
        style={[styles.addButton, styles.iconContainer]}
      >
        <Icon
          name="ios-add"
          style={styles.addButtonIcon}
        />

      </Button>
    )
  }

  renderDeleteIcon = index => {
    const { reportLine, editable } = this.props
    if (!editable) {
      return (<View />)
    }
    return (
      <Button
        onPress={() => this.props.deletePicture(reportLine, index)}
        style={[styles.deleteButton, styles.iconContainer]}
      >
        <Icon
          name="md-close"
          style={styles.deleteIcon}
        />
      </Button>
    )
  }

  renderPicture = (picture, index) => (
    <View style={styles.imageContainer} key={index}>
      <Button
        onPress={() => this.viewPicture(index)}
      >
        <Image
          source={{ uri: picture.uri || picture.thumbnail }}
          style={styles.image}
        />
      </Button>
      {this.renderDeleteIcon(index)}
    </View>
  )

  render() {
    const { pictures } = this.props.reportLine
    return (
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imagePickerContainer}
        >
          { this.renderAddButton() }
          { pictures && pictures.map(this.renderPicture) }
        </ScrollView>
      </View>
    )
  }
}

ImagePickerContainer.propTypes = {
  reportLine: ReportLinesShape,
  editable: PropTypes.bool,
  addPicture: PropTypes.func.isRequired,
  deletePicture: PropTypes.func.isRequired,
}

ImagePickerContainer.defaultProps = {
  reportLine: {},
  editable: false,
}

export default connect(null, { addPicture, deletePicture })(ImagePickerContainer)
