import React from 'react'
import PropTypes from 'prop-types'
import { Text, StyleSheet } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { isEmpty } from 'lodash'
import { selectedWorkItemsSelector } from '../../work-item/selector'
import { styles } from '../../appRouters'
import { FONT, OPACITY } from '../../constants/styleGuide'
import { addOriginWorkItems, addWorkItems } from '../actions'
import { WorkItemShape } from '../../shared/shape'
import Button from '../../components/button'
import { navButtonStyles } from '../../shared/styles'

const buttonStyles = StyleSheet.create({
  title: {
    fontSize: FONT.LG,
    marginRight: 15,
  },
})

const RightButton = props => (
  <Button
    onPress={() => {
      props.addWorkItems(props.selectedWorkItems)
      props.addOriginWorkItems(props.selectedWorkItems)
      Actions.pop()
    }}
    disabled={isEmpty(props.selectedWorkItems)}
    style={navButtonStyles.buttonContainer}
  >
    <Text
      style={[
        styles.navTitle,
        buttonStyles.title,
        { opacity: isEmpty(props.selectedWorkItems) ? OPACITY.DISABLED : OPACITY.NORMAL },
      ]}
    >
      Add
    </Text>
  </Button>
)

RightButton.propTypes = {
  selectedWorkItems: PropTypes.arrayOf(WorkItemShape),
  addWorkItems: PropTypes.func.isRequired,
  addOriginWorkItems: PropTypes.func.isRequired,
}

RightButton.defaultProps = {
  selectedWorkItems: [],
}

const mapStateToProps = createStructuredSelector({
  selectedWorkItems: selectedWorkItemsSelector,
})

const mapDispatchToProps = {
  addWorkItems,
  addOriginWorkItems,
}

export default connect(mapStateToProps, mapDispatchToProps)(RightButton)
