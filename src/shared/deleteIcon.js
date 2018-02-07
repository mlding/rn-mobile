import React from 'react'
import { StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { noop } from 'lodash'
import Button from '../components/button'
import { StyleShape, UserShape } from './shape'
import { COLOR } from '../constants/styleGuide'
import Icon from '../components/icon'
import { deleteDraftPrompt } from '../draft/swipeOutUtils'

const styles = StyleSheet.create({
  icon: {
    fontSize: 20,
    color: COLOR.WHITE,
  },
})

const DeleteIcon = props => (
  <Button
    style={props.style}
    onPress={() => deleteDraftPrompt(
      {
        setDraft: props.setDraft,
        user: props.user,
        name: props.name,
        type: props.type,
      }, true)
    }
  >
    <Icon name="delete-draft" style={styles.icon} />
  </Button>
  )

DeleteIcon.propTypes = {
  setDraft: PropTypes.func,
  user: UserShape,
  name: PropTypes.string,
  type: PropTypes.string,
  style: StyleShape,
}

DeleteIcon.defaultProps = {
  setDraft: noop,
  user: {},
  name: '',
  type: '',
  style: null,
}

export default DeleteIcon
