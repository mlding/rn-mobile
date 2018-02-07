import { isEmpty, toNumber, forEach, filter, differenceWith } from 'lodash'
import RNFS from 'react-native-fs'
import { FILES_FOLDER, TEMP_FOLDER } from '../constants/download'

export const getFileId = fileNameWithId => {
  if (isEmpty(fileNameWithId)) {
    return ''
  }
  return toNumber(fileNameWithId.substring(0, fileNameWithId.indexOf('_')))
}

export const getOriginalFileName = fileNameWithId => {
  if (isEmpty(fileNameWithId)) {
    return ''
  }
  return fileNameWithId.substring(fileNameWithId.indexOf('_') + 1, fileNameWithId.length)
}

export const filterFiles = (targetFiles, compareFiles) => differenceWith(targetFiles, compareFiles,
  (targetFile, compareFile) => targetFile.id === compareFile.id)

export const clearUselessFiles = (allFiles, downloadedFiles) => {
  const uselessFiles = filterFiles(downloadedFiles, allFiles)
  forEach(uselessFiles, file => {
    RNFS.unlink(file.path).then(() => {
      console.log(`${file.name} has been deleted.`)  // eslint-disable-line
    }).catch(err => {
      console.log(err.message)  // eslint-disable-line
    })
  })
}

export const clearTempFiles = path => (
  new Promise((resolve, reject) => {
    RNFS.unlink(path).then(() => {
      console.log(`${path} has been deleted.`)  // eslint-disable-line
      return resolve()
    }).catch(err => {
      console.log(err.message)  // eslint-disable-line
      return reject('clear downloading files failed.')
    })
  })
)

export const getLocalFiles = () => (
  new Promise((resolve, reject) =>
    RNFS.readDir(FILES_FOLDER).then(files => {
      if (isEmpty(files)) return resolve([])
      const localFiles = files.map(file => {
        if (file.isFile() && file.size > 0) {
          return {
            id: getFileId(file.name),
            name: getOriginalFileName(file.name),
            path: file.path,
          }
        }
        return null
      })
      return resolve(filter(localFiles, item => item !== null))
    }).catch(() => reject('get local files failed.')),
  )
)

export const getFilesFolder = () => (RNFS.mkdir(FILES_FOLDER))
export const getTempFolder = () => (RNFS.mkdir(TEMP_FOLDER))
