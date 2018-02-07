import React, { PureComponent } from 'react'
import { Actions } from 'react-native-router-flux'
import { View } from 'react-native'
import GoogleAPIAvailability from '../utilities/checkGooglePlayServices'
import { IS_ANDROID } from '../utilities/systemUtil'

const checkGoogleApiNotReady = () => IS_ANDROID && !GoogleAPIAvailability.isGoogleServiceReady()

const mapBase = (WrappedComponent, config = { shouldGetMyLocation: true }) => (
  class Map extends PureComponent {
    state = {
      myLocation: {
        latitude: null,
        longitude: null,
      },
      isMyLocationLoaded: false,
    }

    componentWillMount() {
      if (checkGoogleApiNotReady()) {
        GoogleAPIAvailability.checkAPIAvailable(() => this.forceUpdate(), () => Actions.pop())
      }
    }

    componentDidMount() {
      if (!config.shouldGetMyLocation) return
      navigator.geolocation.getCurrentPosition(this.setMyLocation, this.handerError)
      this.watchLocationId = navigator.geolocation.watchPosition(
        this.setMyLocation, this.handerError)
    }

    componentWillUnmount() {
      if (!config.shouldGetMyLocation) return
      navigator.geolocation.clearWatch(this.watchLocationId)
    }

    setMyLocation = position => {
      this.setState({
        myLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        isMyLocationLoaded: true,
      })
    }

    handerError = error => {
      console.log(new Date(), error) // eslint-disable-line
      this.setState({
        isMyLocationLoaded: true,
      })
    }

    render() {
      if (checkGoogleApiNotReady()) {
        return (<View />)
      }
      const props = config.shouldGetMyLocation ? {
        ...this.props,
        myLocation: this.state.myLocation,
        isMyLocationLoaded: this.state.isMyLocationLoaded,
      } : this.props
      return (
        <WrappedComponent
          myLocation={this.state.myLocation}
          {...props}
        />
      )
    }
  }
)

export default mapBase
