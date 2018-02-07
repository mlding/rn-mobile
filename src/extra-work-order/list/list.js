import React, { Component } from 'react'
import { View, LayoutAnimation } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { isEmpty } from 'lodash'
import { errorMsgSelector, listSelector, loadingSelector, nextSelector, refreshingSelector } from '../selector'
import { draftExtraWorkOrderSelector } from '../../draft/selector'
import {
  ExtraWorkOrderShape, ExtraWorkOrderDraftShape, UserShape,
} from '../../shared/shape'
import PullRefreshList from '../../shared/pullRefreshList'
import ExtraWorkOrderItem from './item'
import SwipeDraft from '../../draft/swipeDraft'
import { fetchExtraWorkOrder, refreshExtraWorkOrders, resetErrorMessage } from '../actions'
import { getDraftExtraWorkOrder, setDraftExtraWorkOrder } from '../../draft/actions'
import { userSelector } from '../../auth/selector'
import { DRAFT_TYPE } from '../../draft/constants'
import { DELETE_ITEM_ANIMA } from '../../utilities/animaUtil'
import { NOTIFICATION_KEY } from '../../notification/constants'

class ExtraWorkOrderList extends Component {
  componentDidMount() {
    this.props.getDraftExtraWorkOrder(this.props.user)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.draft !== null && nextProps.draft === null) {
      LayoutAnimation.configureNext(DELETE_ITEM_ANIMA)
    }
  }

  renderDraft = () => {
    const { draft, user } = this.props
    if (isEmpty(draft)) {
      return <View />
    }

    return (
      <SwipeDraft
        draft={draft}
        user={user}
        name={draft.basicInfo.name}
        type={DRAFT_TYPE.EXTRA_WORK_ORDER}
        setDraft={this.props.setDraftExtraWorkOrder}
      >
        <ExtraWorkOrderItem extraWorkOrder={draft.basicInfo} user={user} />
      </SwipeDraft>
    )
  }

  render() {
    const { orders, next, loading, refreshing, errorMessage, user } = this.props
    return (
      <PullRefreshList
        items={orders}
        next={next}
        loading={loading}
        refreshing={refreshing}
        errorMessage={errorMessage}
        renderItem={({ item }) =>
          (<ExtraWorkOrderItem
            extraWorkOrder={item}
            user={user}
          />)}
        emptyLabel="Extra Work Order"
        notificationKey={NOTIFICATION_KEY.EWO}
        fetchItems={this.props.fetchExtraWorkOrder}
        refreshItems={this.props.refreshExtraWorkOrders}
        user={user}
        resetErrorMessage={this.props.resetErrorMessage}
        ListHeaderComponent={this.renderDraft}
      />)
  }

}

ExtraWorkOrderList.propTypes = {
  orders: PropTypes.arrayOf(ExtraWorkOrderShape),
  next: PropTypes.string,
  loading: PropTypes.bool,
  refreshing: PropTypes.bool,
  errorMessage: PropTypes.string,
  user: UserShape,
  draft: ExtraWorkOrderDraftShape,
  fetchExtraWorkOrder: PropTypes.func.isRequired,
  refreshExtraWorkOrders: PropTypes.func.isRequired,
  resetErrorMessage: PropTypes.func.isRequired,
  getDraftExtraWorkOrder: PropTypes.func.isRequired,
  setDraftExtraWorkOrder: PropTypes.func.isRequired,
}

ExtraWorkOrderList.defaultProps = {
  orders: [],
  next: null,
  loading: true,
  refreshing: false,
  errorMessage: '',
  user: {},
  draft: null,
}

const mapStateToProps = createStructuredSelector({
  orders: listSelector,
  next: nextSelector,
  loading: loadingSelector,
  refreshing: refreshingSelector,
  errorMessage: errorMsgSelector,
  user: userSelector,
  draft: draftExtraWorkOrderSelector,
})

const mapDispatchToProps = {
  fetchExtraWorkOrder,
  refreshExtraWorkOrders,
  resetErrorMessage,
  getDraftExtraWorkOrder,
  setDraftExtraWorkOrder,
}

export default connect(mapStateToProps, mapDispatchToProps)(ExtraWorkOrderList)

