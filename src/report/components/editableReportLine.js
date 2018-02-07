import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/EvilIcons'
import { ReportLinesShape } from '../../shared/shape'
import { COLOR } from '../../constants/styleGuide'
import WorkItemCell from '../../shared/workItemCell'
import ReportLineDetailContainer from './reportLineDetail'
import { deleteWorkItem, modifyReportLineField } from '../actions'
import Button from '../../components/button'

const styles = StyleSheet.create({
  container: {
    borderColor: COLOR.BORDER_GREY,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  deleteIcon: {
    fontSize: 28,
    color: COLOR.FLAGGED,
    marginTop: -2,
  },
})

class EditableReportLine extends Component {
  renderDeleteIcon = () => {
    const { reportLine } = this.props
    return (
      <Button
        onPress={() => this.props.deleteWorkItem(reportLine)}
      >
        <Icon
          name="minus"
          style={styles.deleteIcon}
        />
      </Button>
    )
  }

  render() {
    const { reportLine } = this.props
    return (
      <View style={styles.container}>
        <WorkItemCell
          item={reportLine}
          isReportLine
          linesOfName={1}
          renderRightArea={() => this.renderDeleteIcon(reportLine)}
          editable
          onFromTextChanged={text =>
              this.props.modifyReportLineField(reportLine, { reference_from: text })}
          onToTextChanged={text =>
            this.props.modifyReportLineField(reportLine, { reference_to: text })}
        />
        <ReportLineDetailContainer reportLine={reportLine} editable />
      </View>
    )
  }
}

EditableReportLine.propTypes = {
  reportLine: ReportLinesShape.isRequired,
  deleteWorkItem: PropTypes.func.isRequired,
  modifyReportLineField: PropTypes.func.isRequired,
}

const mapDispatchToProps = {
  deleteWorkItem,
  modifyReportLineField,
}


export default connect(null, mapDispatchToProps)(EditableReportLine)
