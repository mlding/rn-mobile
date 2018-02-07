import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import PropTypes from 'prop-types'
import { capitalize, isEqual } from 'lodash'
import { ExtraWorkOrderShape, ExtraWorkOrderDraftShape, UserShape } from '../../shared/shape'
import { ROLE_MAPPING } from '../../report/constants'
import { TITLE } from '../constants'
import STATUS from '../../constants/status'
import { formatDate } from '../../utilities/dateUtils'
import { getShowText } from '../../utilities/dataProcessUtils'
import ItemCell from '../../shared/reportItemCell'
import { isLeadWorker } from '../../utilities/role'
import { openExtraWorkOrderDetail } from '../utilities'
import { setDraftExtraWorkOrder } from '../../draft/actions'
import DeleteIcon from '../../shared/deleteIcon'
import { navButtonStyles } from '../../shared/styles'


class ExtraWorkOrderItem extends Component {

  getContentDescription = (extraWorkOrder, user) => {
    const { nameLabel, name } = ROLE_MAPPING[user.role.toUpperCase()]
    return `${nameLabel} ${getShowText(extraWorkOrder[name])}`
  }

  getDateDescription = (extraWorkOrder, user) => {
    const { date } = ROLE_MAPPING[user.role.toUpperCase()]
    if (isEqual(STATUS.DRAFT, capitalize(extraWorkOrder.status))) {
      return null
    }
    return `Submitted ${formatDate(extraWorkOrder[date])}`
  }

  handlePress = () => {
    const { extraWorkOrder, user } = this.props
    const { role } = user
    const formatStatus = capitalize(extraWorkOrder.status)

    if (isLeadWorker(role) && isEqual(STATUS.DRAFT, formatStatus)) {
      Actions.createExtraWorkOrder({
        title: TITLE.EDIT_DRAFT,
        status: STATUS.DRAFT,
        right: () =>
          (<DeleteIcon
            style={navButtonStyles.buttonContainer}
            setDraft={this.props.setDraftExtraWorkOrder}
            user={user}
            name={extraWorkOrder.name}
          />),
      })
      return
    }
    openExtraWorkOrderDetail(extraWorkOrder, role)
  }

  render() {
    const { extraWorkOrder, user } = this.props
    return (
      <ItemCell
        title={extraWorkOrder.name}
        status={extraWorkOrder.status}
        content={this.getContentDescription(extraWorkOrder, user)}
        dateDescription={this.getDateDescription(extraWorkOrder, user)}
        onPress={this.handlePress}
      />
    )
  }
}

ExtraWorkOrderItem.propTypes = {
  extraWorkOrder: PropTypes.oneOfType([
    ExtraWorkOrderShape,
    ExtraWorkOrderDraftShape,
  ]).isRequired,
  user: UserShape.isRequired,
  setDraftExtraWorkOrder: PropTypes.func.isRequired,
}


export default connect(null, { setDraftExtraWorkOrder })(ExtraWorkOrderItem)
