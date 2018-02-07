import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { isEmpty } from 'lodash'
import Button from '../../components/button'
import Icon from '../../components/icon'
import { userSelector } from '../../auth/selector'
import { draftReportSelector } from '../../draft/selector'
import { UserShape, WorkItemShape, ReportShape } from '../../shared/shape'
import { updateWorkItemInDraft } from '../../draft/swipeOutUtils'
import { setDraftReport } from '../../draft/actions'
import { isInDraft } from '../utilities'
import { COLOR, FONT, FONT_WEIGHT } from '../../constants/styleGuide'
import { ADD_TO_DRAFT_REPORT, REMOVE_FROM_DRAFT_REPORT } from '../../draft/constants'

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginHorizontal: 15,
    height: 40,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 2,
    backgroundColor: COLOR.WHITE,
  },
  icon: {
    fontSize: 15,
    marginRight: 10,
  },
  text: {
    fontSize: FONT.MD,
    fontWeight: FONT_WEIGHT.BOLD,
  },
})

const DraftButton = ({ item, draft, user, setDraftReport }) => { //eslint-disable-line
  const isAddedToDraft = isEmpty(draft) ? false : isInDraft(draft, item)
  const color = isAddedToDraft ? COLOR.GREEN : COLOR.FADE_BLUE
  return (
    <Button
      onPress={() => updateWorkItemInDraft({ item, draft, setDraftReport, user }, isAddedToDraft)}
      style={styles.container}
    >
      <View style={[styles.buttonContainer, { borderColor: color }]}>
        <Icon
          name={isAddedToDraft ? 'remove-from-draft-report' : 'add-to-draft-report'}
          style={[styles.icon, { color }]}
        />
        <Text style={[styles.text, { color }]}>
          {isAddedToDraft ? REMOVE_FROM_DRAFT_REPORT : ADD_TO_DRAFT_REPORT}
        </Text>
      </View>
    </Button>
  )
}

DraftButton.propTypes = {
  item: WorkItemShape,
  draft: ReportShape,
  user: UserShape,
  setDraftReport: PropTypes.func.isRequired,
}

DraftButton.defaultProps = {
  item: {},
  draft: {},
  user: {},
}

const mapStateToProps = createStructuredSelector({
  user: userSelector,
  draft: draftReportSelector,
})

const mapDispatchToProps = {
  setDraftReport,
}

export default connect(mapStateToProps, mapDispatchToProps)(DraftButton)
