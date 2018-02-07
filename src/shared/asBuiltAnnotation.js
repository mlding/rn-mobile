import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { COLOR, FONT } from '../constants/styleGuide'
import { getShowText } from '../utilities/dataProcessUtils'
import TextField from '../components/textField'
import { updateAsBuilt } from '../report/actions'
import { AsBuiltAnnotationShape, ReportLinesShape, WorkItemShape } from './shape'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: FONT.MD,
    color: COLOR.MEDIUM_BLACK,
  },
  label: {
    fontSize: FONT.MD,
    color: COLOR.MEDIUM_GREY,
    marginTop: 10,
  },
  text: {
    fontSize: FONT.MD,
    color: COLOR.MEDIUM_BLACK,
    marginTop: 12,
    paddingBottom: 6,
  },
})

export class AsBuiltAnnotationComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      asBuiltAnnotation: props.asBuiltAnnotation,
      value: get(props.asBuiltAnnotation, 'value'),
    }
  }

  handleInputChange = text => {
    this.setState({ value: text })
    this.setState({ asBuiltAnnotation: { ...this.state.asBuiltAnnotation, value: text } })
  }

  handleInputEnd = () => {
    this.props.updateAsBuilt(this.props.item, this.state.asBuiltAnnotation)
  }

  render() {
    const { asBuiltAnnotation } = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{getShowText(get(asBuiltAnnotation, 'name'))}</Text>
        {this.props.editable ?
          <TextField
            style={styles.text}
            value={this.state.value}
            onChangeText={text => this.handleInputChange(text)}
            onBlur={this.handleInputEnd}
            focusBorderColor={COLOR.LINK}
          /> :
          <Text style={styles.text}>{getShowText(get(asBuiltAnnotation, 'value'))}</Text>
        }
      </View>
    )
  }
}

AsBuiltAnnotationComponent.propTypes = {
  item: PropTypes.oneOfType([ReportLinesShape, WorkItemShape]),
  asBuiltAnnotation: AsBuiltAnnotationShape,
  editable: PropTypes.bool,
  updateAsBuilt: PropTypes.func.isRequired,
}

AsBuiltAnnotationComponent.defaultProps = {
  item: {},
  asBuiltAnnotation: {},
  editable: false,
}

export default connect(null, { updateAsBuilt })(AsBuiltAnnotationComponent)
