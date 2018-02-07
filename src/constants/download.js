import RNFS from 'react-native-fs'

export const FILES_FOLDER_NAME = 'files'
export const TEMP_FOLDER_NAME = 'temp'
export const IMAGE_FOLDER_NAME = 'uploadImages'

export const FILES_FOLDER = `${RNFS.DocumentDirectoryPath}/${FILES_FOLDER_NAME}`
export const TEMP_FOLDER = `${RNFS.DocumentDirectoryPath}/${TEMP_FOLDER_NAME}`
export const IMAGE_FOLDER = `${RNFS.DocumentDirectoryPath}/${IMAGE_FOLDER_NAME}`
