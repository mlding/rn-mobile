import React from 'react'
import { Image, TouchableOpacity, Animated } from 'react-native'
import { shallow } from 'enzyme'
import ImagePreviewer from '../components/imagePreviewer'

describe('<ImagePreviewer />', () => {
  it('should render Image when the picture is local image', () => {
    const localPicture = {
      uri: 'file://1.jpeg',
    }
    const ImagePreviewerComponent = shallow(
      <ImagePreviewer
        pictures={[localPicture]}
        index={0}
      />)
    expect(ImagePreviewerComponent.find(Image).length).toEqual(1)
    expect(ImagePreviewerComponent.find(TouchableOpacity).length).toEqual(1)
  })

  it('should render two Image when the picture is remote image', () => {
    const remotePicture = {
      id: 1,
      picture: 'http:1.jpeg',
      thumbnail: 'http:1_thumbnail.jpeg',
    }
    const ImagePreviewerComponent = shallow(
      <ImagePreviewer
        pictures={[remotePicture]}
        index={0}
      />)
    expect(ImagePreviewerComponent.find(Animated.Image).length).toEqual(2)
    expect(ImagePreviewerComponent.find(TouchableOpacity).length).toEqual(1)
  })
})
