import React from 'react'
import PropTypes from 'prop-types'
import { Text, View, StyleSheet } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { MapPickerLocationShape } from '../../shared/shape'
import { FONT, OPACITY } from '../../constants/styleGuide'
import { locationEntranceSelector, locationSelector } from '../selector'
import { setBasicInfo, updateExtraLineForm } from '../actions'
import { DEFAULT_LOCATION, DEFAULT_LOCATION_ENTRANCE, LOCATION_ENTRANCE } from '../constants'
import Button from '../../components/button'
import { navButtonStyles } from '../../shared/styles'
import { styles } from '../../appRouters'

const buttonStyles = StyleSheet.create({
  title: {
    fontSize: FONT.LG,
    marginRight: 15,
  },
})

const DoneButton = props => {
  const { location, locationEntrance } = props
  const { coordinate, address, inProgress: shouldButtonDisabled } = location
  const handlePress = () => {
    const fields = {
      location: coordinate,
      address: address,
    }
    if (locationEntrance === LOCATION_ENTRANCE.EXTRA_WORK_ORDER) {
      props.setBasicInfo(fields)
    } else if (locationEntrance === LOCATION_ENTRANCE.EXTRA_LINE) {
      props.updateExtraLineForm(fields)
    }
    Actions.pop()
  }

  if (locationEntrance === LOCATION_ENTRANCE.VIEW_MAP) {
    return <View />
  }

  return (
    <Button
      onPress={handlePress}
      disabled={shouldButtonDisabled}
      style={navButtonStyles.buttonContainer}
    >
      <Text
        style={[
          styles.navTitle, buttonStyles.title,
          { opacity: shouldButtonDisabled ? OPACITY.DISABLED : OPACITY.NORMAL },
        ]}
      >
        Done
      </Text>
    </Button>
  )
}

DoneButton.propTypes = {
  location: MapPickerLocationShape,
  locationEntrance: PropTypes.string,
  updateExtraLineForm: PropTypes.func.isRequired,
  setBasicInfo: PropTypes.func.isRequired,
}

DoneButton.defaultProps = {
  location: DEFAULT_LOCATION,
  locationEntrance: DEFAULT_LOCATION_ENTRANCE,
}

const mapStateToProps = createStructuredSelector({
  location: locationSelector,
  locationEntrance: locationEntranceSelector,
})

const mapDispatchToProps = {
  updateExtraLineForm,
  setBasicInfo,
}

export default connect(mapStateToProps, mapDispatchToProps)(DoneButton)
