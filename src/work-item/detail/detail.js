import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'
import { COLOR, FONT } from '../../constants/styleGuide'
import { StyleShape, WorkItemShape } from '../../shared/shape'
import WorkItemCell from '../../shared/workItemCell'
import FileList from './fileList'
import MaterialList from './materialList'
import AsBuilt from '../../shared/asBuilt'
import DraftButton from './draftButton'

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.WHITE,

  },
  workItemCell: {
    minHeight: 0,
    marginBottom: 20,
  },
  order: {
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: FONT.MD,
    color: COLOR.MEDIUM_BLACK,
  },
  orderHeader: {
    marginBottom: 12,
    color: COLOR.MEDIUM_GREY,
  },
  viewMap: {
    fontSize: FONT.MD,
    color: COLOR.LINK,
  },
  asBuilt: {
    marginTop: -1,
  },
  bottomPlaceholder: {
    height: 15,
  },
})

const WorkItemDetail = ({ workItemDetail, scrollEnabled, style, shouldShowDraftButton }) => (
  <ScrollView style={[styles.container, style]} scrollEnabled={scrollEnabled} bounces={false}>
    <WorkItemCell item={workItemDetail} style={styles.workItemCell} />
    {!shouldShowDraftButton && <DraftButton item={workItemDetail} />}
    <FileList workPackage={workItemDetail.work_package} />
    <Text style={[styles.order, styles.orderHeader]}>Work Order</Text>
    <Text style={styles.order}>{workItemDetail.work_order_name}</Text>
    <MaterialList quantities={workItemDetail.quantities} />
    <AsBuilt item={workItemDetail} style={styles.asBuilt} />
    <View style={styles.bottomPlaceholder} />
  </ScrollView>
)

WorkItemDetail.propTypes = {
  workItemDetail: WorkItemShape,
  scrollEnabled: PropTypes.bool,
  style: StyleShape,
  shouldShowDraftButton: PropTypes.bool,
}

WorkItemDetail.defaultProps = {
  workItemDetail: {},
  scrollEnabled: true,
  style: null,
  shouldShowDraftButton: false,
}

export default WorkItemDetail
