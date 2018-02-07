import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { createStructuredSelector } from 'reselect'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { isEmpty, toUpper } from 'lodash'
import { COLOR, FONT, FONT_WEIGHT } from '../../constants/styleGuide'
import { workPackageFilesSelector, downloadedWorkPackageListSelector } from '../../cache/selector'
import { downloadedFilesSelector } from '../../download/selector'
import { WorkPackageFileSharp, DownloadedFileShape } from '../../shared/shape'
import { getAttachments } from '../utilities'

const styles = StyleSheet.create({
  files: {
    marginLeft: 15,
    marginBottom: 20,
  },
  fileColumn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLOR.DARK_WHITE,
    width: 144,
    marginRight: 5,
    borderWidth: 1,
    borderColor: COLOR.DIVIDER_GREY,
    borderRadius: 2,
  },
  file: {
    fontSize: FONT.SM,
    color: COLOR.SILVER,
    marginRight: 5,
  },
  fileName: {
    fontSize: FONT.MD,
    color: COLOR.MEDIUM_BLACK,
    fontWeight: FONT_WEIGHT.LIGHT,
    flex: 1,
  },
})

const renderFileItem = (attachment, index) => {
  const { name, extension, upload } = attachment

  return (
    <TouchableOpacity
      key={index}
      onPress={() => Actions.fileViewer({ uri: upload, title: name })}
    >
      <View style={styles.fileColumn}>
        <Text style={styles.file}>{toUpper(extension)}</Text>
        <Text style={styles.fileName} numberOfLines={1}>{name}</Text>
      </View>
    </TouchableOpacity>
  )
}

const FileList = props => {
  const { workPackage, workPackageFiles, downloadedWorkPackageList, downloadedFiles } = props
  const attachments = getAttachments(workPackage, workPackageFiles,
    downloadedWorkPackageList, downloadedFiles)

  return (
    <View>
      { !isEmpty(attachments) &&
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.files}>
        { attachments.map(renderFileItem) }
      </ScrollView> }
    </View>
  )
}

FileList.propTypes = {
  workPackage: PropTypes.number.isRequired,
  workPackageFiles: PropTypes.arrayOf(WorkPackageFileSharp),
  downloadedWorkPackageList: PropTypes.arrayOf(PropTypes.number),
  downloadedFiles: PropTypes.arrayOf(DownloadedFileShape),
}

FileList.defaultProps = {
  workPackageFiles: [],
  downloadedWorkPackageList: [],
  downloadedFiles: [],
}

const mapStateToProps = createStructuredSelector({
  workPackageFiles: workPackageFilesSelector,
  downloadedWorkPackageList: downloadedWorkPackageListSelector,
  downloadedFiles: downloadedFilesSelector,
})

export default connect(mapStateToProps)(FileList)

