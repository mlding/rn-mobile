import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { isEmpty } from 'lodash'
import { COLOR, FONT, FONT_WEIGHT, OPACITY } from '../../constants/styleGuide'
import TogglePanel from './../detail/togglePanel'
import Icon from '../../components/icon'
import { ReportLinesShape } from '../../shared/shape'
import { COMPLETED, NOT_COMPLETED } from '../constants'
import SelectIcon from '../../shared/selectIcon'
import { modifyReportLineField } from '../actions'
import QuantityItemContainer from './quantityItem'
import QuantityListHeaderContainer from './quantityListHeader'
import AsBuilt from '../../shared/asBuilt'
import LabelTextInput from '../../components/labelTextInput'
import ImagePickerContainer from './imagePickerContainer'
import { materialsSelector } from '../../cache/selector'

const styles = StyleSheet.create({
  viewDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 9,
    paddingRight: 5,
    width: 100,
  },
  viewDetail: {
    color: COLOR.LINK,
    fontSize: FONT.MD,
  },
  arrowRightIcon: {
    color: COLOR.LINK,
    fontSize: FONT.SM,
  },
  arrowRotate: {
    transform: [{ rotate: '90deg' }],
  },

  detailWrapper: {
    paddingLeft: 61,
    backgroundColor: COLOR.WHITE,
  },
  detailWrapperEditStatus: {
    paddingTop: 4,
  },

  containerWrapper: {
    marginRight: 10,
    paddingBottom: 15,
  },
  completeContainer: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 18,
  },
  completeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  completePlaceholder: {
    flex: 1,
  },
  completedState: {
    fontSize: FONT.M,
    color: COLOR.MEDIUM_BLACK,
  },
  completeCheckBox: {
    marginRight: 9,
  },
  line: {
    height: 1,
    marginTop: 15,
    marginBottom: 5,
    alignItems: 'stretch',
    backgroundColor: COLOR.LIGHT_GREY,
  },
  materialListWrapper: {
    marginBottom: 12,
  },
  commentWrapper: {
    marginBottom: 12,
  },
  dataLabel: {
    marginTop: 15,
    fontSize: FONT.MD,
    color: COLOR.MEDIUM_BLACK,
    fontWeight: FONT_WEIGHT.LIGHT,
  },
  comment: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: FONT.MD,
    color: COLOR.MEDIUM_BLACK,
  },
  commentLabel: {
    fontWeight: FONT_WEIGHT.LIGHT,
  },
  photoContainer: {
    marginBottom: 25,
  },
  asBuiltHeader: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: COLOR.TRANSPARENT,
    paddingHorizontal: 0,
    height: 20,
  },
  asBuiltHeaderText: {
    color: COLOR.MEDIUM_BLACK,
    fontWeight: FONT_WEIGHT.LIGHT,
  },
  asBuiltDetail: {
    paddingHorizontal: 0,
  },
})

export class ReportLineDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      comment: props.reportLine.comments,
    }
  }

  renderStableView = togglePanel => (
    <TouchableOpacity
      style={styles.viewDetailContainer}
      onPress={() => togglePanel.toggle()}
      activeOpacity={OPACITY.NORMAL}
    >
      <Text style={styles.viewDetail}>{this.props.editable ? 'Edit Details ' : 'View Details ' }</Text>
      <Icon
        name="arrow-right"
        style={[styles.arrowRightIcon, togglePanel.isExpanded() ? styles.arrowRotate : null]}
      />
    </TouchableOpacity>)

  renderCompleteState = reportLine => {
    const { editable } = this.props
    const isComplete = reportLine.work_item_completed
    if (editable) {
      return (
        <View style={styles.completeContainer}>
          <TouchableOpacity
            style={styles.completeWrapper}
            onPress={() =>
                this.props.modifyReportLineField(reportLine,
                    { work_item_completed: !isComplete })}
            activeOpacity={OPACITY.ACTIVE}
          >
            <SelectIcon
              selected={isComplete}
              style={styles.completeCheckBox}
            />
            <Text style={styles.completedState}>Complete</Text>
          </TouchableOpacity>
          <View style={styles.completePlaceholder} />
        </View>
      )
    }
    return (
      <View style={styles.completeWrapper}>
        <Text style={styles.completedState}>
          {reportLine.work_item_completed ? COMPLETED : NOT_COMPLETED}
        </Text>
      </View>
    )
  }

  renderQuantityItem = (quantity, index) => {
    const { editable, reportLine } = this.props
    return (
      <QuantityItemContainer
        key={index}
        quantity={quantity}
        editable={editable}
        reportLine={reportLine}
      />)
  }

  renderComments = () => {
    const { editable, reportLine } = this.props

    if (editable) {
      return (
        <View style={styles.commentWrapper}>
          <LabelTextInput
            labelName="Comment"
            labelStyle={styles.commentLabel}
            placeholder="Optional"
            labelColor={COLOR.MEDIUM_BLACK}
            text={this.state.comment}
            onChangeText={value => this.setState({ comment: value })}
            onBlur={() =>
              this.props.modifyReportLineField(reportLine, { comments: this.state.comment })}
          />
        </View>
      )
    }

    if (reportLine.comments) {
      return (
        <View>
          <Text style={styles.dataLabel}>Comment</Text>
          <Text style={styles.comment}>{reportLine.comments}</Text>
        </View>
      )
    }

    return <View />
  }

  renderAsBuilt = () => {
    const { reportLine, editable } = this.props
    return (
      <AsBuilt
        item={reportLine}
        editable={editable}
        headerStyle={styles.asBuiltHeader}
        headerTextStyle={styles.asBuiltHeaderText}
        detailStyle={styles.asBuiltDetail}
      />
    )
  }

  renderImageLabel = () => {
    const { reportLine, editable } = this.props
    if (!editable && isEmpty(reportLine.pictures)) {
      return <View />
    }

    if (editable && reportLine.work_item_completed && reportLine.requires_photo) {
      return <Text style={styles.dataLabel}>Photo Required</Text>
    }

    return <Text style={styles.dataLabel}>Photo</Text>
  }

  renderImages = () => {
    const { reportLine, editable } = this.props

    return (
      <View style={styles.photoContainer}>
        { this.renderImageLabel() }
        <ImagePickerContainer reportLine={reportLine} editable={editable} />
      </View>
    )
  }

  render() {
    const { reportLine, editable } = this.props
    return (
      <TogglePanel
        style={[styles.detailWrapper, editable ? styles.detailWrapperEditStatus : null]}
        getStableView={this.renderStableView}
      >
        <View>
          {this.renderCompleteState(reportLine)}
          <View style={styles.containerWrapper}>
            <View style={styles.materialListWrapper}>
              <QuantityListHeaderContainer
                editable={this.props.editable}
                reportLine={reportLine}
              />
              {reportLine.quantities.map(this.renderQuantityItem)}
            </View>
            {this.renderComments()}
            {this.renderImages()}
            {this.renderAsBuilt()}
          </View>
        </View>
      </TogglePanel>
    )
  }
}

ReportLineDetail.propTypes = {
  reportLine: ReportLinesShape.isRequired,
  editable: PropTypes.bool,
  modifyReportLineField: PropTypes.func.isRequired,
}

ReportLineDetail.defaultProps = {
  editable: false,
}

const mapStateToProps = createStructuredSelector({
  materials: materialsSelector,
})

export default connect(mapStateToProps, { modifyReportLineField })(ReportLineDetail)
